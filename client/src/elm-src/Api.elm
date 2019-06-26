module Api exposing
    ( EditProductRequest(..)
    , ProfileUpdateData
    , SellProductRequest(..)
    , SignUpRequest
    , Token
    , deleteProduct
    , editProduct
    , getBoughtProductList
    , getFreeProductList
    , getLikedProducts
    , getMyProfile
    , getProduct
    , getProductComments
    , getRecentProductList
    , getRecommendProductList
    , getSoldProductList
    , getTradeComment
    , getUserProfile
    , likeProduct
    , logInOrSignUpUrlRequest
    , postProductComment
    , sellProduct
    , sendConfirmEmail
    , tokenFromString
    , tokenRefresh
    , tokenToString
    , tradeStart
    , unlikeProduct
    , updateProfile
    )

import Data.EmailAddress as EmailAddress
import Data.Product as Product
import Data.SocialLoginService
import Data.University as University
import Data.User as User
import Http
import Json.Decode
import Json.Decode.Pipeline
import Json.Encode
import Task
import Url



{- ========================================================================
                  ユーザー情報を登録して認証メールを送信
   ========================================================================
-}


{-| 新規登録に必要な情報。この内容をサーバーに送信する
-}
type alias SignUpRequest =
    { sendEmailToken : String
    , emailAddress : EmailAddress.EmailAddress
    , image : Maybe String
    , university : University.University
    , displayName : String
    }


sendConfirmEmail : SignUpRequest -> (Result String () -> msg) -> Cmd msg
sendConfirmEmail { sendEmailToken, displayName, image, university, emailAddress } callBack =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "sendConformEmail"
                , args =
                    [ ( "sendEmailToken", GraphQLString sendEmailToken )
                    , ( "displayName", GraphQLString displayName )
                    , ( "image"
                      , case image of
                            Just dataUrl ->
                                GraphQLString dataUrl

                            Nothing ->
                                GraphQLNull
                      )
                    , ( "university", universityToGraphQLValue university )
                    , ( "email", GraphQLString (EmailAddress.toString emailAddress) )
                    ]
                , return = []
                }
            ]
        )
        sendConfirmEmailRequestBody
        callBack


universityToGraphQLValue : University.University -> GraphQLValue
universityToGraphQLValue university =
    GraphQLObject
        (case university of
            University.GraduateTsukuba graduate schoolAndDepartment ->
                [ ( "graduate", GraphQLEnum (University.graduateToIdString graduate) )
                , ( "schoolAndDepartment", GraphQLEnum (University.departmentToIdString schoolAndDepartment) )
                ]

            University.GraduateNotTsukuba graduate ->
                [ ( "graduate", GraphQLEnum (University.graduateToIdString graduate) ) ]

            University.NotGraduate schoolAndDepartment ->
                [ ( "schoolAndDepartment", GraphQLEnum (University.departmentToIdString schoolAndDepartment) ) ]
        )


{-| 新規登録のJSONを生成
-}
sendConfirmEmailRequestBody : Json.Decode.Decoder ()
sendConfirmEmailRequestBody =
    Json.Decode.field "sendConformEmail"
        Json.Decode.string
        |> Json.Decode.andThen
            (\result ->
                if result == "ok" then
                    Json.Decode.succeed ()

                else
                    Json.Decode.fail "okでなかった"
            )


universityToSimpleRecord : University.University -> { graduate : Maybe University.Graduate, department : Maybe University.SchoolAndDepartment }
universityToSimpleRecord universityData =
    case universityData of
        University.GraduateTsukuba graduate schoolAndDepartment ->
            { graduate = Just graduate
            , department = Just schoolAndDepartment
            }

        University.GraduateNotTsukuba graduate ->
            { graduate = Just graduate
            , department = Nothing
            }

        University.NotGraduate schoolAndDepartment ->
            { graduate = Nothing
            , department = Just schoolAndDepartment
            }


{-| アクセストークンやリフレッシュトークン
-}
type Token
    = Token String


tokenFromString : String -> Token
tokenFromString =
    Token


tokenToString : Token -> String
tokenToString (Token string) =
    string



{- =================================================
           Tokenの更新 /auth/token/refresh/
   =================================================
-}


tokenRefresh : { refresh : Token } -> (Result String { accessToken : Token, refreshToken : Token } -> msg) -> Cmd msg
tokenRefresh { refresh } callBack =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "getAccessTokenAndUpdateRefreshToken"
                , args = [ ( "refreshToken", GraphQLString (tokenToString refresh) ) ]
                , return =
                    [ Field { name = "refreshToken", args = [], return = [] }
                    , Field { name = "accessToken", args = [], return = [] }
                    ]
                }
            ]
        )
        (Json.Decode.field "getAccessTokenAndUpdateRefreshToken"
            (Json.Decode.succeed
                (\refreshToken accessToken ->
                    { accessToken = tokenFromString accessToken
                    , refreshToken = tokenFromString refreshToken
                    }
                )
                |> Json.Decode.Pipeline.required "refreshToken" Json.Decode.string
                |> Json.Decode.Pipeline.required "accessToken" Json.Decode.string
            )
        )
        callBack



{- ============================================================
               自分のプロフィールを取得する
   ============================================================
-}


getMyProfile : Token -> (Result String User.WithProfile -> msg) -> Cmd msg
getMyProfile accessToken callBack =
    graphQlApiRequest
        (Query
            [ Field
                { name = "userPrivate"
                , args = [ ( "accessToken", GraphQLString (tokenToString accessToken) ) ]
                , return =
                    [ Field { name = "id", args = [], return = [] }
                    , Field { name = "displayName", args = [], return = [] }
                    , Field { name = "imageId", args = [], return = [] }
                    , Field { name = "introduction", args = [], return = [] }
                    , Field
                        { name = "university"
                        , args = []
                        , return =
                            [ Field { name = "schoolAndDepartment", args = [], return = [] }
                            , Field { name = "graduate", args = [], return = [] }
                            ]
                        }
                    ]
                }
            ]
        )
        (Json.Decode.field "userPrivate"
            (Json.Decode.succeed
                (\id displayName imageId introduction schoolAndDepartment graduate ->
                    User.withProfileFromApi
                        { id = id
                        , displayName = displayName
                        , imageId = imageId
                        , introduction = introduction
                        , university =
                            University.universityFromIdString
                                { graduateMaybe = graduate, departmentMaybe = schoolAndDepartment }
                        }
                )
                |> Json.Decode.Pipeline.required "id" Json.Decode.string
                |> Json.Decode.Pipeline.required "displayName" Json.Decode.string
                |> Json.Decode.Pipeline.required "imageId" Json.Decode.string
                |> Json.Decode.Pipeline.required "introduction" Json.Decode.string
                |> Json.Decode.Pipeline.requiredAt
                    [ "university", "schoolAndDepartment" ]
                    (Json.Decode.nullable Json.Decode.string)
                |> Json.Decode.Pipeline.requiredAt
                    [ "university", "graduate" ]
                    (Json.Decode.nullable Json.Decode.string)
                |> Json.Decode.andThen
                    (\userMaybe ->
                        case userMaybe of
                            Just user ->
                                Json.Decode.succeed user

                            Nothing ->
                                Json.Decode.fail "invalid university"
                    )
            )
        )
        callBack



{- ==================================================================
                                出品
   ==================================================================
-}


type SellProductRequest
    = SellProductRequest
        { name : String
        , description : String
        , price : Int
        , condition : Product.Condition
        , imageList : List String
        }


sellProduct : Token -> SellProductRequest -> (Result () () -> msg) -> Cmd msg
sellProduct token sellProductRequest msg =
    Cmd.none



{- ==============================================================================
                          商品の情報を編集する
   ==============================================================================
-}


type EditProductRequest
    = EditProductRequest
        { name : String
        , description : String
        , price : Int
        , condition : Product.Condition
        , addImageList : List String
        , deleteImageIndex : List Int
        }


editProduct : Token -> Product.Id -> EditProductRequest -> (Result () () -> msg) -> Cmd msg
editProduct token productId editProductRequest msg =
    Cmd.none



{- ============================================================
                   自分のプロフィールを更新する
   ============================================================
-}


type alias ProfileUpdateData =
    { displayName : String
    , introduction : String
    , image : String
    , university : University.University
    }


updateProfile : Token -> ProfileUpdateData -> (Result () User.WithProfile -> msg) -> Cmd msg
updateProfile token profile msg =
    Cmd.none



{- ============================================================
       自分がいいねした商品を取得する /{version}/currentuser/profile/
   ============================================================
-}


getLikedProducts : Token -> (Result () (List Product.Product) -> msg) -> Cmd msg
getLikedProducts token msg =
    Cmd.none



{- =================================================================================
       自分が閲覧した商品を取得    TODO APIが対応していない とりあえず常に Ok []
   =================================================================================
-}


getHistoryViewProducts : Token -> (Result () (List Product.Product) -> msg) -> Cmd msg
getHistoryViewProducts token msg =
    Task.succeed ()
        |> Task.perform (always (msg (Ok [])))



--    Http.request
--        { method = "GET"
--        , url = urlBuilder [ "v1", "currentuser", "history" ]
--        , headers = [ tokenToHeader token ]
--        , body = Http.emptyBody
--        , expect = Http.expectStringResponse msg getGoodListResponseToResult
--        , timeout = Nothing
--        , tracker = Nothing
--        }
{- ============================================================
               自分が出品した商品を取得する
   ============================================================
-}


getSoldProductList : Token -> (Result () (List Product.Product) -> msg) -> Cmd msg
getSoldProductList token msg =
    Cmd.none



{- ============================================================
               自分が購入した商品を取得する
   ============================================================
-}


getBoughtProductList : Token -> (Result () (List Product.Product) -> msg) -> Cmd msg
getBoughtProductList token msg =
    Task.succeed ()
        |> Task.perform (always (msg (Ok [])))



{- ============================================================
                ユーザーのプロフィールを取得する
   ============================================================
-}


getUserProfile : User.Id -> (Result String User.WithProfile -> msg) -> Cmd msg
getUserProfile userId callBack =
    graphQlApiRequest
        (Query
            [ Field
                { name = "user"
                , args = [ ( "id", GraphQLString (User.idToString userId) ) ]
                , return =
                    [ Field { name = "id", args = [], return = [] }
                    , Field { name = "displayName", args = [], return = [] }
                    , Field { name = "imageId", args = [], return = [] }
                    , Field { name = "introduction", args = [], return = [] }
                    , Field
                        { name = "university"
                        , args = []
                        , return =
                            [ Field { name = "schoolAndDepartment", args = [], return = [] }
                            , Field { name = "graduate", args = [], return = [] }
                            ]
                        }
                    ]
                }
            ]
        )
        (Json.Decode.field "user"
            (Json.Decode.succeed
                (\id displayName imageId introduction schoolAndDepartment graduate ->
                    User.withProfileFromApi
                        { id = id
                        , displayName = displayName
                        , imageId = imageId
                        , introduction = introduction
                        , university =
                            University.universityFromIdString
                                { graduateMaybe = graduate, departmentMaybe = schoolAndDepartment }
                        }
                )
                |> Json.Decode.Pipeline.required "id" Json.Decode.string
                |> Json.Decode.Pipeline.required "displayName" Json.Decode.string
                |> Json.Decode.Pipeline.required "imageId" Json.Decode.string
                |> Json.Decode.Pipeline.required "introduction" Json.Decode.string
                |> Json.Decode.Pipeline.requiredAt
                    [ "university", "schoolAndDepartment" ]
                    (Json.Decode.nullable Json.Decode.string)
                |> Json.Decode.Pipeline.requiredAt
                    [ "university", "graduate" ]
                    (Json.Decode.nullable Json.Decode.string)
                |> Json.Decode.andThen
                    (\userMaybe ->
                        case userMaybe of
                            Just user ->
                                Json.Decode.succeed user

                            Nothing ->
                                Json.Decode.fail "invalid university"
                    )
            )
        )
        callBack



{- ==============================================================
                           新着の商品を取得
   ==============================================================
-}


getRecentProductList : (Result () (List Product.Product) -> msg) -> Cmd msg
getRecentProductList msg =
    Cmd.none



{- ==============================================================
                      おすすめの商品を取得
   ==============================================================
-}


getRecommendProductList : (Result () (List Product.Product) -> msg) -> Cmd msg
getRecommendProductList msg =
    Cmd.none


productNormalResponseDecoder : Json.Decode.Decoder Product.Product
productNormalResponseDecoder =
    Json.Decode.succeed
        (\id name description price condition status image0Url image1Url image2Url image3Url likeCount seller ->
            Product.makeNormalFromApi
                { id = id
                , name = name
                , description = description
                , price = price
                , condition = condition
                , status = status
                , image0Url = image0Url
                , image1Url = image1Url
                , image2Url = image2Url
                , image3Url = image3Url
                , likeCount = likeCount
                , seller = seller
                }
        )
        |> Json.Decode.Pipeline.required "id" Json.Decode.int
        |> Json.Decode.Pipeline.required "name" Json.Decode.string
        |> Json.Decode.Pipeline.required "description" Json.Decode.string
        |> Json.Decode.Pipeline.required "price" Json.Decode.int
        |> Json.Decode.Pipeline.required "condition" conditionDecoder
        |> Json.Decode.Pipeline.required "status" statusDecoder
        |> Json.Decode.Pipeline.required "image1" Json.Decode.string
        |> Json.Decode.Pipeline.required "image2" (Json.Decode.nullable Json.Decode.string)
        |> Json.Decode.Pipeline.required "image3" (Json.Decode.nullable Json.Decode.string)
        |> Json.Decode.Pipeline.required "image4" (Json.Decode.nullable Json.Decode.string)
        |> Json.Decode.Pipeline.required "likeCount" Json.Decode.int
        |> Json.Decode.Pipeline.required "seller" Json.Decode.string



{- =================================================================================
       0円の商品を取得
   =================================================================================
-}


getFreeProductList : (Result () (List Product.Product) -> msg) -> Cmd msg
getFreeProductList msg =
    Cmd.none



{- ==============================================================================
                              商品の情報を取得
   ==============================================================================
-}


getProduct : Product.Id -> (Result () Product.Product -> msg) -> Cmd msg
getProduct id msg =
    Cmd.none


productDetailResponseDecoder : Json.Decode.Decoder Product.Product
productDetailResponseDecoder =
    Json.Decode.succeed
        (\id name description price condition status image0Url image1Url image2Url image3Url likeCount seller sellerName ->
            Product.makeDetailFromApi
                { id = id
                , name = name
                , description = description
                , price = price
                , condition = condition
                , status = status
                , image0Url = image0Url
                , image1Url = image1Url
                , image2Url = image2Url
                , image3Url = image3Url
                , likeCount = likeCount
                , seller = seller
                , sellerName = sellerName
                }
        )
        |> Json.Decode.Pipeline.required "id" Json.Decode.int
        |> Json.Decode.Pipeline.required "name" Json.Decode.string
        |> Json.Decode.Pipeline.required "description" Json.Decode.string
        |> Json.Decode.Pipeline.required "price" Json.Decode.int
        |> Json.Decode.Pipeline.required "condition" conditionDecoder
        |> Json.Decode.Pipeline.required "status" statusDecoder
        |> Json.Decode.Pipeline.required "image1" Json.Decode.string
        |> Json.Decode.Pipeline.required "image2" (Json.Decode.nullable Json.Decode.string)
        |> Json.Decode.Pipeline.required "image3" (Json.Decode.nullable Json.Decode.string)
        |> Json.Decode.Pipeline.required "image4" (Json.Decode.nullable Json.Decode.string)
        |> Json.Decode.Pipeline.required "likeCount" Json.Decode.int
        |> Json.Decode.Pipeline.required "seller" (Json.Decode.field "user" Json.Decode.string)
        |> Json.Decode.Pipeline.required "seller" (Json.Decode.field "nick" Json.Decode.string)


conditionDecoder : Json.Decode.Decoder Product.Condition
conditionDecoder =
    Json.Decode.string
        |> Json.Decode.andThen
            (\idString ->
                case Product.conditionFromString idString of
                    Just condition ->
                        Json.Decode.succeed condition

                    Nothing ->
                        Json.Decode.fail
                            ("I can't understand conditionId=\""
                                ++ idString
                                ++ "\" except \""
                                ++ String.join "\" or \"" (Product.conditionAll |> List.map Product.conditionToIdString)
                                ++ "\""
                            )
            )


statusDecoder : Json.Decode.Decoder Product.Status
statusDecoder =
    Json.Decode.string
        |> Json.Decode.andThen
            (\idString ->
                case Product.statusFromIdString idString of
                    Just status ->
                        Json.Decode.succeed status

                    Nothing ->
                        Json.Decode.fail
                            ("I can't understand statusId=\""
                                ++ idString
                                ++ "\" except \""
                                ++ String.join "\" or \"" (Product.statusAll |> List.map Product.statusToIdString)
                                ++ "\""
                            )
            )



{- ==============================================================================
                              商品を削除する
   ==============================================================================
-}


deleteProduct : Token -> Product.Id -> Cmd msg
deleteProduct token productId =
    Cmd.none



{- ==============================================================================
                              商品にいいねをする
   ==============================================================================
-}


likeProduct : Token -> Product.Id -> (Result () () -> msg) -> Cmd msg
likeProduct token productId msg =
    Cmd.none



{- ==============================================================================
                              商品のいいねをはずす
   ==============================================================================
-}


unlikeProduct : Token -> Product.Id -> (Result () () -> msg) -> Cmd msg
unlikeProduct token productId msg =
    Cmd.none



{- ==============================================================================
                          商品のコメントを取得する
   ==============================================================================
-}


getProductComments : Product.Id -> (Result () (List Product.Comment) -> msg) -> Cmd msg
getProductComments productId msg =
    Cmd.none


commentResponseToResult : Http.Response String -> Result () (List Product.Comment)
commentResponseToResult response =
    case response of
        Http.GoodStatus_ _ body ->
            Json.Decode.decodeString commentListDecoder body
                |> Result.withDefault (Err ())

        _ ->
            Err ()


commentListDecoder : Json.Decode.Decoder (Result () (List Product.Comment))
commentListDecoder =
    Json.Decode.list commentDecoder
        |> Json.Decode.map Ok


commentDecoder : Json.Decode.Decoder Product.Comment
commentDecoder =
    Json.Decode.map4
        (\text createdAt userName userId ->
            { text = text
            , createdAt = Product.CreatedTimeString createdAt
            , userName = userName
            , userId = User.idFromString userId
            }
        )
        (Json.Decode.field "text" Json.Decode.string)
        (Json.Decode.field "created_at" Json.Decode.string)
        (Json.Decode.field "prof" (Json.Decode.field "nick" Json.Decode.string))
        (Json.Decode.field "prof" (Json.Decode.field "user" Json.Decode.string))



{- ==============================================================================
                              商品にコメントをする
   ==============================================================================
-}


postProductComment : Token -> Product.Id -> String -> (Result () Product.Comment -> msg) -> Cmd msg
postProductComment accessToken productId comment msg =
    Cmd.none


commentNormalDecoder : String -> User.Id -> Json.Decode.Decoder Product.Comment
commentNormalDecoder userName userId =
    Json.Decode.map2
        (\text createdAt ->
            { text = text
            , createdAt = Product.CreatedTimeString createdAt
            , userName = userName
            , userId = userId
            }
        )
        (Json.Decode.field "text" Json.Decode.string)
        (Json.Decode.field "created_at" Json.Decode.string)



{- ==============================================================================
                              商品の取引を開始する
   ==============================================================================
-}


tradeStart : Token -> Product.Id -> (Result () () -> msg) -> Cmd msg
tradeStart token productId msg =
    Cmd.none


tradeStartResponseToResult : Http.Response String -> Result () ()
tradeStartResponseToResult response =
    case response of
        Http.GoodStatus_ _ _ ->
            Ok ()

        _ ->
            Err ()



{- ==============================================================================
                      商品の取引のコメントを取得する
   ==============================================================================
-}


getTradeComment : Token -> Product.Id -> (Result () (List Product.Comment) -> msg) -> Cmd msg
getTradeComment token productId msg =
    Cmd.none



{- ==============================================================================
                         ソーシャルログインでログイン/新規登録
   ==============================================================================
-}


logInOrSignUpUrlRequest : Data.SocialLoginService.SocialLoginService -> (Result String Url.Url -> msg) -> Cmd msg
logInOrSignUpUrlRequest service callBack =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "getLogInUrl"
                , args =
                    [ ( "service"
                      , GraphQLEnum
                            (case service of
                                Data.SocialLoginService.Google ->
                                    "google"

                                Data.SocialLoginService.GitHub ->
                                    "gitHub"

                                Data.SocialLoginService.Twitter ->
                                    "twitter"

                                Data.SocialLoginService.Line ->
                                    "line"
                            )
                      )
                    ]
                , return = []
                }
            ]
        )
        logInOrSignUpUrlResponseToResult
        callBack


logInOrSignUpUrlResponseToResult : Json.Decode.Decoder Url.Url
logInOrSignUpUrlResponseToResult =
    Json.Decode.field "getLogInUrl" Json.Decode.string
        |> Json.Decode.andThen
            (\urlString ->
                case Url.fromString urlString of
                    Just url ->
                        Json.Decode.succeed url

                    Nothing ->
                        Json.Decode.fail "url"
            )



{- ==============================================================================
                              Graph QL Api Request
   ==============================================================================
-}


type Query
    = Mutation (List Field)
    | Query (List Field)


type Field
    = Field
        { name : String
        , args : List ( String, GraphQLValue )
        , return : List Field
        }


type GraphQLValue
    = GraphQLString String
    | GraphQLEnum String
    | GraphQLInt Int
    | GraphQLFloat Float
    | GraphQLObject (List ( String, GraphQLValue ))
    | GraphQLNull


graphQlApiRequest : Query -> Json.Decode.Decoder a -> (Result String a -> msg) -> Cmd msg
graphQlApiRequest query responseDecoder callBack =
    Http.post
        { url = "https://asia-northeast1-tsukumart-f0971.cloudfunctions.net/api"
        , body = graphQlRequestBody (queryToString query)
        , expect = Http.expectStringResponse callBack (graphQlResponseDecoder responseDecoder)
        }


queryToString : Query -> String
queryToString query =
    case query of
        Mutation fieldList ->
            "mutation {\n" ++ (fieldList |> List.map fieldToString |> String.join "\n") ++ "}"

        Query fieldList ->
            "{\n" ++ (fieldList |> List.map fieldToString |> String.join "\n") ++ "}"


fieldToString : Field -> String
fieldToString (Field { name, args, return }) =
    name
        ++ (if args == [] then
                ""

            else
                "("
                    ++ (args
                            |> List.map (\( argsName, argsValue ) -> argsName ++ ": " ++ graphQLValueToString argsValue)
                            |> String.join ", "
                       )
                    ++ ")"
           )
        ++ (if return == [] then
                ""

            else
                " {\n" ++ (return |> List.map fieldToString |> String.join "\n") ++ "\n}"
           )


graphQLValueToString : GraphQLValue -> String
graphQLValueToString graphQLValue =
    case graphQLValue of
        GraphQLString string ->
            string |> Json.Encode.string |> Json.Encode.encode 0

        GraphQLEnum string ->
            string

        GraphQLInt int ->
            String.fromInt int

        GraphQLFloat float ->
            String.fromFloat float

        GraphQLObject object ->
            "{"
                ++ (object
                        |> List.map (\( argsName, argsValue ) -> argsName ++ ": " ++ graphQLValueToString argsValue)
                        |> String.join ", "
                   )
                ++ "}"

        GraphQLNull ->
            "null"


graphQlRequestBody : String -> Http.Body
graphQlRequestBody queryOrMutation =
    Http.jsonBody
        (Json.Encode.object
            [ ( "query"
              , Json.Encode.string queryOrMutation
              )
            ]
        )


graphQlResponseDecoder : Json.Decode.Decoder a -> Http.Response String -> Result String a
graphQlResponseDecoder decoder response =
    case response of
        Http.BadUrl_ _ ->
            Err "BadURL"

        Http.Timeout_ ->
            Err "Timeout"

        Http.NetworkError_ ->
            Err "NetworkError"

        Http.BadStatus_ _ body ->
            body
                |> Json.Decode.decodeString graphQLErrorResponseDecoder
                |> (\result ->
                        case result of
                            Ok errMsg ->
                                Err errMsg

                            Err decodeError ->
                                Err
                                    [ "ElmのJSONデコーダーのエラー「"
                                        ++ Json.Decode.errorToString decodeError
                                        ++ "」"
                                    ]
                   )
                |> Result.mapError (String.join ",\n")

        Http.GoodStatus_ _ body ->
            body
                |> Json.Decode.decodeString
                    (Json.Decode.field "data"
                        decoder
                    )
                |> Result.mapError Json.Decode.errorToString


graphQLErrorResponseDecoder : Json.Decode.Decoder (List String)
graphQLErrorResponseDecoder =
    Json.Decode.field "errors"
        (Json.Decode.list
            (Json.Decode.succeed
                (\message lineAndColumnList ->
                    "message"
                        ++ message
                        ++ " at "
                        ++ (lineAndColumnList
                                |> List.map
                                    (\( line, column ) ->
                                        String.fromInt line ++ ":" ++ String.fromInt column
                                    )
                                |> String.join ","
                           )
                )
                |> Json.Decode.Pipeline.required "message" Json.Decode.string
                |> Json.Decode.Pipeline.required "locations"
                    (Json.Decode.list
                        (Json.Decode.succeed Tuple.pair
                            |> Json.Decode.Pipeline.required "line" Json.Decode.int
                            |> Json.Decode.Pipeline.required "column" Json.Decode.int
                        )
                    )
            )
        )
