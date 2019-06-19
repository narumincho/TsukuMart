module Api exposing
    ( ProfileUpdateData
    , SellGoodsRequest(..)
    , SignUpRequest
    , Token
    , deleteGoods
    , getExhibitionGoodList
    , getFreeGoods
    , getGood
    , getGoodsComment
    , getLikeGoodList
    , getMyProfile
    , getPurchaseGoodList
    , getRecentGoods
    , getRecommendGoods
    , getTradeComment
    , getUserProfile
    , likeGoods
    , logInOrSignUpUrlRequest
    , postGoodsComment
    , sellGoods
    , sendConfirmEmail
    , tokenFromString
    , tokenRefresh
    , tokenToString
    , tradeStart
    , unlikeGoods
    , updateGood
    , updateProfile
    )

import Data.EmailAddress as EmailAddress
import Data.Good as Good
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
sendConfirmEmail { sendEmailToken, displayName, university, emailAddress } callBack =
    graphQlApiRequest
        (Mutation
            [ Field
                { name = "sendConformEmail"
                , args =
                    [ ( "sendEmailToken", GraphQLString sendEmailToken )
                    , ( "displayName", GraphQLString displayName )
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
                if result == "" then
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
tokenRefresh { refresh } msg =
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
        msg



{- ============================================================
               自分のプロフィールを取得する
   ============================================================
-}


getMyProfile : Token -> (Result String User.WithProfile -> msg) -> Cmd msg
getMyProfile accessToken msg =
    graphQlApiRequest
        (Query
            [ Field
                { name = "userPrivate"
                , args = [ ( "accessToken", GraphQLString (tokenToString accessToken) ) ]
                , return =
                    [ Field { name = "id", args = [], return = [] }
                    , Field { name = "displayName", args = [], return = [] }
                    , Field { name = "imageUrl", args = [], return = [] }
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
                (\id displayName imageUrl introduction schoolAndDepartment graduate ->
                    User.withProfileFromApi
                        { id = id
                        , displayName = displayName
                        , imageUrl = imageUrl
                        , introduction = introduction
                        , university =
                            University.universityFromIdString
                                { graduateMaybe = graduate, departmentMaybe = schoolAndDepartment }
                        }
                )
                |> Json.Decode.Pipeline.required "id" Json.Decode.string
                |> Json.Decode.Pipeline.required "displayName" Json.Decode.string
                |> Json.Decode.Pipeline.required "imageUrl" Json.Decode.string
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
        msg



{- ==================================================================
        出品     POST /{version}/currentuser/goods/
   ==================================================================
-}


type SellGoodsRequest
    = SellGoodsRequest
        { name : String
        , description : String
        , price : Int
        , condition : Good.Condition
        , imageList : List String
        }


sellGoods : Token -> SellGoodsRequest -> (Result () () -> msg) -> Cmd msg
sellGoods token createGoodsRequest msg =
    Cmd.none



{- ==============================================================================
      商品の情報を編集する   /{version}/currentuser/goods/{id}/
   ==============================================================================
-}


type EditGoodsRequest
    = EditGoodsRequest
        { name : String
        , description : String
        , price : Int
        , condition : Good.Condition
        , addImageList : List String
        , deleteImageIndex : List Int
        }


updateGood : Token -> Good.GoodId -> SellGoodsRequest -> (Result () () -> msg) -> Cmd msg
updateGood token goodId createGoodsRequest msg =
    Cmd.none



{- ============================================================
       自分のプロフィールを更新する /{version}/currentuser/profile/
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


getLikeGoodList : Token -> (Result () (List Good.Good) -> msg) -> Cmd msg
getLikeGoodList token msg =
    Cmd.none



{- =================================================================================
       自分が閲覧した商品を取得    TODO APIが対応していない とりあえず常に Ok []
   =================================================================================
-}


getHistoryGoodList : Token -> (Result () (List Good.Good) -> msg) -> Cmd msg
getHistoryGoodList token msg =
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
       自分が出品した商品を取得する /{version}/currentuser/goods/
   ============================================================
-}


getExhibitionGoodList : Token -> (Result () (List Good.Good) -> msg) -> Cmd msg
getExhibitionGoodList token msg =
    Cmd.none



{- ============================================================
       自分が購入した商品を取得する TODO APIが対応していない とりあえず常に Ok []
   ============================================================
-}


getPurchaseGoodList : Token -> (Result () (List Good.Good) -> msg) -> Cmd msg
getPurchaseGoodList token msg =
    Task.succeed ()
        |> Task.perform (always (msg (Ok [])))



{- ============================================================
        ユーザーのプロフィールを取得する /{version}/profile/{user}/
   ============================================================
-}


getUserProfile : User.UserId -> (Result () User.WithProfile -> msg) -> Cmd msg
getUserProfile userId msg =
    Cmd.none



{- ==============================================================
       新着の商品を取得    TODO /{version}/goods/で取得したものを逆順
   ==============================================================
-}


getRecentGoods : (Result () (List Good.Good) -> msg) -> Cmd msg
getRecentGoods msg =
    Cmd.none



{- ==============================================================
      おすすめの商品を取得    /{version}/goods/
   ==============================================================
-}


getRecommendGoods : (Result () (List Good.Good) -> msg) -> Cmd msg
getRecommendGoods msg =
    Cmd.none


getGoodListResponseToResult : Http.Response String -> Result () (List Good.Good)
getGoodListResponseToResult response =
    case response of
        Http.BadStatus_ _ body ->
            Json.Decode.decodeString getGoodListResponseBodyJsonDecoder body
                |> Result.withDefault (Err ())

        Http.GoodStatus_ _ body ->
            Json.Decode.decodeString getGoodListResponseBodyJsonDecoder body
                |> Result.withDefault (Err ())

        _ ->
            Err ()


getGoodListResponseBodyJsonDecoder : Json.Decode.Decoder (Result () (List Good.Good))
getGoodListResponseBodyJsonDecoder =
    Json.Decode.list goodsNormalResponseDecoder
        |> Json.Decode.map Ok


goodsNormalResponseDecoder : Json.Decode.Decoder Good.Good
goodsNormalResponseDecoder =
    Json.Decode.succeed
        (\id name description price condition status image0Url image1Url image2Url image3Url likeCount seller ->
            Good.makeNormalFromApi
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


getFreeGoods : (Result () (List Good.Good) -> msg) -> Cmd msg
getFreeGoods msg =
    Cmd.none



{- ==============================================================================
      商品の情報を取得    /{version}/goods/{id}/
   ==============================================================================
-}


getGood : Good.GoodId -> (Result () Good.Good -> msg) -> Cmd msg
getGood id msg =
    Cmd.none


getGoodsResponseToResult : Http.Response String -> Result () Good.Good
getGoodsResponseToResult response =
    case response of
        Http.GoodStatus_ _ body ->
            Json.Decode.decodeString (goodsDetailResponseDecoder |> Json.Decode.map Ok) body
                |> Result.withDefault (Err ())

        _ ->
            Err ()


goodsDetailResponseDecoder : Json.Decode.Decoder Good.Good
goodsDetailResponseDecoder =
    Json.Decode.succeed
        (\id name description price condition status image0Url image1Url image2Url image3Url likeCount seller sellerName ->
            Good.makeDetailFromApi
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


conditionDecoder : Json.Decode.Decoder Good.Condition
conditionDecoder =
    Json.Decode.string
        |> Json.Decode.andThen
            (\idString ->
                case Good.conditionFromString idString of
                    Just condition ->
                        Json.Decode.succeed condition

                    Nothing ->
                        Json.Decode.fail
                            ("I can't understand conditionId=\""
                                ++ idString
                                ++ "\" except \""
                                ++ String.join "\" or \"" (Good.conditionAll |> List.map Good.conditionToIdString)
                                ++ "\""
                            )
            )


statusDecoder : Json.Decode.Decoder Good.Status
statusDecoder =
    Json.Decode.string
        |> Json.Decode.andThen
            (\idString ->
                case Good.statusFromIdString idString of
                    Just status ->
                        Json.Decode.succeed status

                    Nothing ->
                        Json.Decode.fail
                            ("I can't understand statusId=\""
                                ++ idString
                                ++ "\" except \""
                                ++ String.join "\" or \"" (Good.statusAll |> List.map Good.statusToIdString)
                                ++ "\""
                            )
            )



{- ==============================================================================
      商品を削除する   /{version}/goods/{id}/ TODO 商品を削除する
   ==============================================================================
-}


deleteGoods : Token -> Good.GoodId -> Cmd msg
deleteGoods token goodId =
    Cmd.none



{- ==============================================================================
      商品にいいねをする    /{version}/goods/{goods_id}/toggle-like/
   ==============================================================================
-}


likeGoods : Token -> Good.GoodId -> (Result () () -> msg) -> Cmd msg
likeGoods token goodsId msg =
    Cmd.none



{- ==============================================================================
      商品のいいねをはずす    /{version}/goods/{goods_id}/toggle-like/
   ==============================================================================
-}


unlikeGoods : Token -> Good.GoodId -> (Result () () -> msg) -> Cmd msg
unlikeGoods token goodsId msg =
    Cmd.none



{- ==============================================================================
      商品のコメントを取得する    /{version}/goods/{goods_id}/comment/
   ==============================================================================
-}


getGoodsComment : Good.GoodId -> (Result () (List Good.Comment) -> msg) -> Cmd msg
getGoodsComment goodId msg =
    Cmd.none


commentResponseToResult : Http.Response String -> Result () (List Good.Comment)
commentResponseToResult response =
    case response of
        Http.GoodStatus_ _ body ->
            Json.Decode.decodeString commentListDecoder body
                |> Result.withDefault (Err ())

        _ ->
            Err ()


commentListDecoder : Json.Decode.Decoder (Result () (List Good.Comment))
commentListDecoder =
    Json.Decode.list commentDecoder
        |> Json.Decode.map Ok


commentDecoder : Json.Decode.Decoder Good.Comment
commentDecoder =
    Json.Decode.map4
        (\text createdAt userName userId ->
            { text = text
            , createdAt = Good.CreatedTimeString createdAt
            , userName = userName
            , userId = User.idFromString userId
            }
        )
        (Json.Decode.field "text" Json.Decode.string)
        (Json.Decode.field "created_at" Json.Decode.string)
        (Json.Decode.field "prof" (Json.Decode.field "nick" Json.Decode.string))
        (Json.Decode.field "prof" (Json.Decode.field "user" Json.Decode.string))



{- ==============================================================================
      商品にコメントをする    /{version}/goods/{goods_id}/comment/
   ==============================================================================
-}


postGoodsComment : Token -> Good.GoodId -> String -> (Result () Good.Comment -> msg) -> Cmd msg
postGoodsComment accessToken goodId comment msg =
    Cmd.none


commentNormalDecoder : String -> User.UserId -> Json.Decode.Decoder Good.Comment
commentNormalDecoder userName userId =
    Json.Decode.map2
        (\text createdAt ->
            { text = text
            , createdAt = Good.CreatedTimeString createdAt
            , userName = userName
            , userId = userId
            }
        )
        (Json.Decode.field "text" Json.Decode.string)
        (Json.Decode.field "created_at" Json.Decode.string)



{- ==============================================================================
      商品の取引を開始する    /{version}/goods/{goods_id}/trade-start/
   ==============================================================================
-}


tradeStart : Token -> Good.GoodId -> (Result () () -> msg) -> Cmd msg
tradeStart token goodId msg =
    Cmd.none


tradeStartResponseToResult : Http.Response String -> Result () ()
tradeStartResponseToResult response =
    case response of
        Http.GoodStatus_ _ _ ->
            Ok ()

        _ ->
            Err ()



{- ==============================================================================
      商品の取引のコメントを取得する    /{version}/trade/{trade_id}/comment/
      trade_idってないよなgood_idでいいのかな
   ==============================================================================
-}


getTradeComment : Token -> Good.GoodId -> (Result () (List Good.Comment) -> msg) -> Cmd msg
getTradeComment token goodId msg =
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
                |> Json.Decode.decodeString
                    (Json.Decode.field "errors"
                        (Json.Decode.list
                            (Json.Decode.succeed
                                (\message lineAndColumnList ->
                                    "message"
                                        ++ message
                                        ++ " at "
                                        ++ (lineAndColumnList
                                                |> List.map (\( line, column ) -> line ++ ":" ++ column)
                                                |> String.join ","
                                           )
                                )
                                |> Json.Decode.Pipeline.required "message" Json.Decode.string
                                |> Json.Decode.Pipeline.required "locations"
                                    (Json.Decode.list
                                        (Json.Decode.succeed Tuple.pair
                                            |> Json.Decode.Pipeline.required "line" Json.Decode.string
                                            |> Json.Decode.Pipeline.required "column" Json.Decode.string
                                        )
                                    )
                            )
                        )
                    )
                |> (\result ->
                        case result of
                            Ok errMsg ->
                                Err errMsg

                            Err decodeError ->
                                Err [ "err message decoder error" ++ Json.Decode.errorToString decodeError ]
                   )
                |> Result.mapError (String.join ", ")

        Http.GoodStatus_ _ body ->
            body
                |> Json.Decode.decodeString
                    (Json.Decode.field "data"
                        decoder
                    )
                |> Result.mapError Json.Decode.errorToString
