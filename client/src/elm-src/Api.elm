module Api exposing
    ( ProfileUpdateData
    , SellProductRequest(..)
    , SignUpRequest
    , Token
    , UpdateProductRequest(..)
    , deleteProduct
    , editProduct
    , getBoughtProductList
    , getCommentedProductList
    , getFreeProductList
    , getHistoryViewProducts
    , getLikedProducts
    , getMyNameAndLikedProductsId
    , getProduct
    , getProductComments
    , getRecentProductList
    , getRecommendProductList
    , getSoldProductList
    , getTradeComment
    , getTradedProductList
    , getTradingProductList
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
    , userWithNameDecoder
    )

import Data.Category as Category
import Data.EmailAddress as EmailAddress
import Data.ImageId as ImageId
import Data.Product as Product
import Data.SocialLoginService
import Data.University as University
import Data.User as User
import Http
import Json.Decode
import Json.Decode.Pipeline
import Json.Encode
import Set
import Time
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

            University.GraduateNoTsukuba graduate ->
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
                   Tokenの更新
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


getMyNameAndLikedProductsId : Token -> (Result String ( User.WithName, List Product.Id ) -> msg) -> Cmd msg
getMyNameAndLikedProductsId token callBack =
    graphQlApiRequest
        (Query
            [ Field
                { name = "userPrivate"
                , args = [ ( "accessToken", GraphQLString (tokenToString token) ) ]
                , return =
                    [ Field { name = "id", args = [], return = [] }
                    , Field { name = "displayName", args = [], return = [] }
                    , Field { name = "imageId", args = [], return = [] }
                    , Field
                        { name = "likedProductAll"
                        , args = []
                        , return =
                            [ Field { name = "id", args = [], return = [] } ]
                        }
                    ]
                }
            ]
        )
        (Json.Decode.field "userPrivate"
            profileAndLikedProductsIdDecoder
        )
        callBack


profileAndLikedProductsIdDecoder : Json.Decode.Decoder ( User.WithName, List Product.Id )
profileAndLikedProductsIdDecoder =
    Json.Decode.succeed
        (\id displayName imageId likedProductIds ->
            ( User.withNameFromApi
                { id = id
                , displayName = displayName
                , imageId = imageId
                }
            , likedProductIds |> List.map Product.idFromString
            )
        )
        |> Json.Decode.Pipeline.required "id" Json.Decode.string
        |> Json.Decode.Pipeline.required "displayName" Json.Decode.string
        |> Json.Decode.Pipeline.required "imageId" imageIdDecoder
        |> Json.Decode.Pipeline.required "likedProductAll"
            (Json.Decode.list
                (Json.Decode.field "id" Json.Decode.string)
            )


userWithNameDecoder : Json.Decode.Decoder User.WithName
userWithNameDecoder =
    Json.Decode.succeed
        (\id displayName imageId ->
            User.withNameFromApi
                { id = id
                , displayName = displayName
                , imageId = imageId
                }
        )
        |> Json.Decode.Pipeline.required "id" Json.Decode.string
        |> Json.Decode.Pipeline.required "displayName" Json.Decode.string
        |> Json.Decode.Pipeline.required "imageId" imageIdDecoder


userWithProfileDecoder : Json.Decode.Decoder User.WithProfile
userWithProfileDecoder =
    Json.Decode.succeed
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
        |> Json.Decode.Pipeline.required "imageId" imageIdDecoder
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


imageIdDecoder : Json.Decode.Decoder ImageId.ImageId
imageIdDecoder =
    Json.Decode.string
        |> Json.Decode.map (\string -> ImageId.fromString string)



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
        , category : Category.Category
        , images : List String
        }


sellProduct : Token -> SellProductRequest -> (Result String Product.ProductDetail -> msg) -> Cmd msg
sellProduct token (SellProductRequest request) callBack =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "sellProduct"
                , args =
                    [ ( "accessToken", GraphQLString (tokenToString token) )
                    , ( "name", GraphQLString request.name )
                    , ( "price", GraphQLInt request.price )
                    , ( "description", GraphQLString request.description )
                    , ( "images", GraphQLList (request.images |> List.map GraphQLString) )
                    , ( "condition", GraphQLEnum (Product.conditionToIdString request.condition) )
                    , ( "category", GraphQLEnum (Category.toIdString request.category) )
                    ]
                , return =
                    []
                }
            ]
        )
        productDecoder
        callBack


productDecoder : Json.Decode.Decoder Product.ProductDetail
productDecoder =
    Json.Decode.succeed
        (\id name description price condition category status imageIds likedCount seller ->
            Product.detailFromApi
                { id = id
                , name = name
                , description = description
                , price = price
                , condition = condition
                , category = category
                , status = status
                , imageIds = imageIds
                , likedCount = likedCount
                , seller = seller
                }
        )
        |> Json.Decode.Pipeline.required "id" Json.Decode.string
        |> Json.Decode.Pipeline.required "name" Json.Decode.string
        |> Json.Decode.Pipeline.required "description" Json.Decode.string
        |> Json.Decode.Pipeline.required "price" Json.Decode.int
        |> Json.Decode.Pipeline.required "condition" conditionDecoder
        |> Json.Decode.Pipeline.required "category" categoryDecoder
        |> Json.Decode.Pipeline.required "status" statusDecoder
        |> Json.Decode.Pipeline.required "imageIds" imageIdsDecoder
        |> Json.Decode.Pipeline.required "likedCount" Json.Decode.int
        |> Json.Decode.Pipeline.required "seller" userWithNameDecoder


conditionDecoder : Json.Decode.Decoder Product.Condition
conditionDecoder =
    Json.Decode.string
        |> Json.Decode.andThen
            (\idString ->
                case Product.conditionFromIdString idString of
                    Just condition ->
                        Json.Decode.succeed condition

                    Nothing ->
                        Json.Decode.fail
                            (enumErrorMsg
                                idString
                                "condition"
                                Product.conditionAll
                                Product.conditionToIdString
                            )
            )


categoryDecoder : Json.Decode.Decoder Category.Category
categoryDecoder =
    Json.Decode.string
        |> Json.Decode.andThen
            (\idString ->
                case Category.fromIdString idString of
                    Just category ->
                        Json.Decode.succeed category

                    Nothing ->
                        Json.Decode.fail
                            (enumErrorMsg
                                idString
                                "category"
                                Category.all
                                Category.toIdString
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
                            (enumErrorMsg
                                idString
                                "status"
                                Product.statusAll
                                Product.statusToIdString
                            )
            )


imageIdsDecoder : Json.Decode.Decoder ( ImageId.ImageId, List ImageId.ImageId )
imageIdsDecoder =
    Json.Decode.list Json.Decode.string
        |> Json.Decode.andThen
            (\list ->
                case list of
                    [] ->
                        Json.Decode.fail "imageIds length is 0"

                    x :: xs ->
                        Json.Decode.succeed ( ImageId.fromString x, xs |> List.map ImageId.fromString )
            )


enumErrorMsg : String -> String -> List a -> (a -> String) -> String
enumErrorMsg idString idName all toString =
    "I can't understand \""
        ++ idString
        ++ "\" in "
        ++ idName
        ++ "."
        ++ "expect \""
        ++ (all |> List.map toString |> String.join "\" or \"")
        ++ "\"."



{- ==============================================================================
                          商品の情報を編集する
   ==============================================================================
-}


type UpdateProductRequest
    = UpdateProductRequest
        { name : String
        , description : String
        , price : Int
        , condition : Product.Condition
        , addImageList : List String
        , deleteImageIndex : Set.Set Int
        }


editProduct : Token -> Product.Id -> UpdateProductRequest -> (Result String () -> msg) -> Cmd msg
editProduct accessToken productId editProductRequest callBack =
    Cmd.none



{- ============================================================
                   自分のプロフィールを更新する
   ============================================================
-}


type alias ProfileUpdateData =
    { displayName : String
    , introduction : String
    , image : Maybe String
    , university : University.University
    }


updateProfile : Token -> ProfileUpdateData -> (Result String User.WithProfile -> msg) -> Cmd msg
updateProfile accessToken { displayName, introduction, image, university } callBack =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "updateProfile"
                , args =
                    [ ( "accessToken", GraphQLString (tokenToString accessToken) )
                    , ( "displayName", GraphQLString displayName )
                    , ( "image", nullableGraphQLValue GraphQLString image )
                    , ( "introduction", GraphQLString introduction )
                    , ( "university", universityToGraphQLValue university )
                    ]
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
        (Json.Decode.field "updateProfile"
            userWithProfileDecoder
        )
        callBack



{- ============================================================
                   自分がいいねした商品を取得する
   ============================================================
-}


getLikedProducts : Token -> (Result String (List Product.Product) -> msg) -> Cmd msg
getLikedProducts token msg =
    Cmd.none



{- ============================================================
                    自分が閲覧した商品を取得
   ============================================================
-}


getHistoryViewProducts : Token -> (Result String (List Product.Product) -> msg) -> Cmd msg
getHistoryViewProducts token msg =
    Cmd.none



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


getBoughtProductList : Token -> (Result String (List Product.Product) -> msg) -> Cmd msg
getBoughtProductList token msg =
    Cmd.none



{- ============================================================
               自分の取引中の商品を取得する
   ============================================================
-}


getTradingProductList : Token -> (Result String (List Product.Product) -> msg) -> Cmd msg
getTradingProductList token msg =
    Cmd.none



{- ============================================================
               自分が取引したの商品を取得する
   ============================================================
-}


getTradedProductList : Token -> (Result String (List Product.Product) -> msg) -> Cmd msg
getTradedProductList token msg =
    Cmd.none



{- ============================================================
               自分がコメントした商品を取得する
   ============================================================
-}


getCommentedProductList : Token -> (Result String (List Product.Product) -> msg) -> Cmd msg
getCommentedProductList token msg =
    Cmd.none



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
            userWithProfileDecoder
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


getProduct : Product.Id -> (Result String Product.ProductDetail -> msg) -> Cmd msg
getProduct id msg =
    Cmd.none



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


likeProduct : Token -> Product.Id -> (Result String Int -> msg) -> Cmd msg
likeProduct token productId msg =
    Cmd.none



{- ==============================================================================
                              商品のいいねをはずす
   ==============================================================================
-}


unlikeProduct : Token -> Product.Id -> (Result String Int -> msg) -> Cmd msg
unlikeProduct token productId msg =
    Cmd.none



{- ==============================================================================
                          商品のコメントを取得する
   ==============================================================================
-}


getProductComments : Product.Id -> (Result String (List Product.Comment) -> msg) -> Cmd msg
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
    Json.Decode.succeed (Ok [])



{- ==============================================================================
                              商品にコメントをする
   ==============================================================================
-}


postProductComment : Token -> Product.Id -> String -> (Result String Product.Comment -> msg) -> Cmd msg
postProductComment accessToken productId comment msg =
    Cmd.none


commentDecoder : String -> User.Id -> Json.Decode.Decoder Product.Comment
commentDecoder userName userId =
    Json.Decode.succeed
        (\body createdAt speaker ->
            Product.commentFromApi
                { body = body
                , createdAt = createdAt
                , speaker = speaker
                }
        )
        |> Json.Decode.Pipeline.required "body" Json.Decode.string
        |> Json.Decode.Pipeline.required "createdAt" dateTimeDecoder
        |> Json.Decode.Pipeline.required "speaker" userWithNameDecoder


dateTimeDecoder : Json.Decode.Decoder Time.Posix
dateTimeDecoder =
    Json.Decode.float
        |> Json.Decode.map (floor >> Time.millisToPosix)



{- ==============================================================================
                              商品の取引を開始する
   ==============================================================================
-}


tradeStart : Token -> Product.Id -> (Result String () -> msg) -> Cmd msg
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
    | GraphQLList (List GraphQLValue)
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

        GraphQLList list ->
            "["
                ++ (list |> List.map graphQLValueToString |> String.join ", ")
                ++ "]"

        GraphQLNull ->
            "null"


nullableGraphQLValue : (a -> GraphQLValue) -> Maybe a -> GraphQLValue
nullableGraphQLValue func maybe =
    case maybe of
        Just a ->
            func a

        Nothing ->
            GraphQLNull


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
