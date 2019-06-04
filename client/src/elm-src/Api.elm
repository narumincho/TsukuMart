module Api exposing
    ( LogInResponseOk(..)
    , SellGoodsRequest(..)
    , SignUpRequest
    , SignUpResponseError(..)
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
import File
import Http
import Json.Decode
import Json.Decode.Pipeline
import Json.Encode
import Task
import Url
import Url.Builder


apiOrigin : String
apiOrigin =
    "https://api.tsukumart.com"


urlBuilder : List String -> String
urlBuilder pathList =
    Url.Builder.crossOrigin apiOrigin (pathList ++ [ "" ]) []



{- =================================================
                 新規登録 /auth/signup/
   =================================================
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


type SignUpResponseError
    = SignUpErrorAlreadySignUp
    | SignUpErrorBadUrl
    | SignUpErrorTimeout
    | SignUpErrorNetworkError
    | SignUpInvalidData
    | SignUpError


tokenToHeader : Token -> Http.Header
tokenToHeader (Token token) =
    Http.header "Authorization" ("Bearer " ++ token)



{- ========================================================================
                  ユーザー情報を登録して認証メールを送信
   ========================================================================
-}


sendConfirmEmail : SignUpRequest -> (Result String () -> msg) -> Cmd msg
sendConfirmEmail { sendEmailToken, displayName, university, emailAddress } callBack =
    graphQlApiRequest
        ("mutation {"
            ++ "sendConformEmail("
            ++ ("sendEmailToken:\"" ++ sendEmailToken ++ "\" ")
            ++ (", name: \"" ++ displayName ++ "\" ")
            ++ (", university: " ++ universityToQuery university)
            ++ (", email: \"" ++ EmailAddress.toString emailAddress ++ "\"")
            ++ ")"
            ++ "}"
        )
        sendConfirmEmailRequestBody
        callBack


universityToQuery : University.University -> String
universityToQuery university =
    "{"
        ++ (case university of
                University.GraduateTsukuba graduate schoolAndDepartment ->
                    "graduate:"
                        ++ University.graduateToIdString graduate
                        ++ ", schoolAndDepartment:"
                        ++ University.departmentToIdString schoolAndDepartment

                University.GraduateNotTsukuba graduate ->
                    "graduate:" ++ University.graduateToIdString graduate

                University.NotGraduate schoolAndDepartment ->
                    "schoolAndDepartment:" ++ University.departmentToIdString schoolAndDepartment
           )
        ++ "}"


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



{- =================================================
                 ログイン /auth/token/
   =================================================
-}


type LogInResponseOk
    = LogInResponseOk
        { access : Token
        , refresh : Token
        }


type Token
    = Token String


{-| 文字列からトークンを生成する。(Local Storageから読むとき用)
-}
tokenFromString : String -> Token
tokenFromString =
    Token


{-| トークンから文字列に変換する。(Local Storageに書くとき用)
-}
tokenToString : Token -> String
tokenToString (Token string) =
    string



{- =================================================
           Tokenの更新 /auth/token/refresh/
   =================================================
-}


type alias TokenRefreshRequest =
    { refresh : Token }


tokenRefresh : TokenRefreshRequest -> (Result () () -> msg) -> Cmd msg
tokenRefresh tokenRefreshRequest msg =
    Http.post
        { url = urlBuilder [ "auth", "token", "refresh" ]
        , body = Http.jsonBody (tokenRefreshBody tokenRefreshRequest)
        , expect = Http.expectStringResponse msg (refreshTokenResponseToResult tokenRefreshRequest.refresh)
        }


tokenRefreshBody : TokenRefreshRequest -> Json.Encode.Value
tokenRefreshBody { refresh } =
    Json.Encode.object
        [ ( "refresh", Json.Encode.string (tokenToString refresh) ) ]


refreshTokenResponseToResult : Token -> Http.Response String -> Result () ()
refreshTokenResponseToResult refresh response =
    case response of
        Http.GoodStatus_ _ body ->
            Json.Decode.decodeString (refreshTokenResponseDecoder refresh) body
                |> Result.withDefault (Err ())

        _ ->
            Err ()


refreshTokenResponseDecoder : Token -> Json.Decode.Decoder (Result () ())
refreshTokenResponseDecoder refresh =
    Json.Decode.field "access" Json.Decode.string
        |> Json.Decode.map
            (\access ->
                Ok ()
             --                    (LogInResponseOk
             --                        { access = tokenFromString access
             --                        , refresh = refresh
             --                        }
             --                    )
            )



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
        , image0 : File.File
        , image1 : Maybe File.File
        , image2 : Maybe File.File
        , image3 : Maybe File.File
        }


sellGoods : Token -> SellGoodsRequest -> (Result () () -> msg) -> Cmd msg
sellGoods token createGoodsRequest msg =
    Http.request
        { method = "POST"
        , headers = [ tokenToHeader token ]
        , url = urlBuilder [ "v1", "currentuser", "goods" ]
        , body = Http.multipartBody (createGoodsRequestJsonBody createGoodsRequest)
        , expect = Http.expectStringResponse msg createGoodsResponseToResult
        , timeout = Nothing
        , tracker = Nothing
        }


createGoodsRequestJsonBody : SellGoodsRequest -> List Http.Part
createGoodsRequestJsonBody (SellGoodsRequest { name, description, price, condition, image0, image1, image2, image3 }) =
    [ Http.stringPart "name" name
    , Http.stringPart "description" description
    , Http.stringPart "price" (String.fromInt price)
    , Http.stringPart "condition" (Good.conditionToIdString condition)
    , Http.stringPart "status" "selling"
    , Http.filePart "image1" image0
    ]
        ++ (case image1 of
                Just i ->
                    [ Http.filePart "image2" i ]

                Nothing ->
                    []
           )
        ++ (case image2 of
                Just i ->
                    [ Http.filePart "image3" i ]

                Nothing ->
                    []
           )
        ++ (case image3 of
                Just i ->
                    [ Http.filePart "image4" i ]

                Nothing ->
                    []
           )


createGoodsResponseToResult : Http.Response String -> Result () ()
createGoodsResponseToResult response =
    case response of
        Http.BadUrl_ _ ->
            Err ()

        Http.Timeout_ ->
            Err ()

        Http.NetworkError_ ->
            Err ()

        Http.BadStatus_ _ _ ->
            Err ()

        Http.GoodStatus_ _ _ ->
            Ok ()



{- ==============================================================================
      商品の情報を編集する   /{version}/currentuser/goods/{id}/
   ==============================================================================
-}


updateGood : Token -> Good.GoodId -> SellGoodsRequest -> (Result () () -> msg) -> Cmd msg
updateGood token goodId createGoodsRequest msg =
    Http.request
        { method = "PUT"
        , headers = [ tokenToHeader token ]
        , url = urlBuilder [ "v1", "currentuser", "goods", Good.goodIdToString goodId ]
        , body = Http.multipartBody (createGoodsRequestJsonBody createGoodsRequest)
        , expect = Http.expectStringResponse msg createGoodsResponseToResult
        , timeout = Nothing
        , tracker = Nothing
        }



{- ============================================================
       自分のプロフィールを取得する /{version}/currentuser/profile/
   ============================================================
-}


getMyProfile : Token -> (Result () User.User -> msg) -> Cmd msg
getMyProfile token msg =
    Http.request
        { method = "GET"
        , headers = [ tokenToHeader token ]
        , url = urlBuilder [ "v1", "currentuser", "profile" ]
        , body = Http.emptyBody
        , expect = Http.expectStringResponse msg getUserResponseToResult
        , timeout = Nothing
        , tracker = Nothing
        }



{- ============================================================
       自分のプロフィールを更新する /{version}/currentuser/profile/
   ============================================================
-}


updateProfile : Token -> User.Profile -> (Result () User.Profile -> msg) -> Cmd msg
updateProfile token profile msg =
    Http.request
        { method = "PATCH"
        , headers = [ tokenToHeader token ]
        , url = urlBuilder [ "v1", "currentuser", "profile" ]
        , body = Http.jsonBody (updateProfileRequestToJsonBody profile)
        , expect = Http.expectStringResponse msg (getUserResponseToResult >> Result.map User.getProfile)
        , timeout = Nothing
        , tracker = Nothing
        }


updateProfileRequestToJsonBody : User.Profile -> Json.Decode.Value
updateProfileRequestToJsonBody profile =
    let
        { graduate, department } =
            universityToSimpleRecord (User.profileGetUniversity profile)
    in
    Json.Encode.object
        ([ ( "nick", Json.Encode.string (User.profileGetNickName profile) )
         , ( "introduction", Json.Encode.string (User.profileGetIntroduction profile) )
         ]
            ++ (case graduate of
                    Just g ->
                        [ ( "graduate", Json.Encode.string (University.graduateToIdString g) ) ]

                    Nothing ->
                        []
               )
            ++ (case department of
                    Just d ->
                        [ ( "department", Json.Encode.string (University.departmentToIdString d) ) ]

                    Nothing ->
                        []
               )
        )



{- ============================================================
       自分がいいねした商品を取得する /{version}/currentuser/profile/
   ============================================================
-}


getLikeGoodList : Token -> (Result () (List Good.Good) -> msg) -> Cmd msg
getLikeGoodList token msg =
    Http.request
        { method = "GET"
        , url = urlBuilder [ "v1", "currentuser", "likes" ]
        , headers = [ tokenToHeader token ]
        , body = Http.emptyBody
        , expect = Http.expectStringResponse msg getGoodListResponseToResult
        , timeout = Nothing
        , tracker = Nothing
        }



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
    Http.request
        { method = "GET"
        , url = urlBuilder [ "v1", "currentuser", "goods" ]
        , headers = [ tokenToHeader token ]
        , body = Http.emptyBody
        , expect = Http.expectStringResponse msg getGoodListResponseToResult
        , timeout = Nothing
        , tracker = Nothing
        }



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


getUserProfile : User.UserId -> (Result () User.Profile -> msg) -> Cmd msg
getUserProfile userId msg =
    Http.get
        { url = urlBuilder [ "v1", "profile", userId |> User.userIdToInt |> String.fromInt ]
        , expect = Http.expectStringResponse msg (getUserResponseToResult >> Result.map User.getProfile)
        }


getUserResponseToResult : Http.Response String -> Result () User.User
getUserResponseToResult response =
    case response of
        Http.BadStatus_ _ body ->
            Json.Decode.decodeString getUserResponseBodyDecoder body
                |> Result.withDefault (Err ())

        Http.GoodStatus_ _ body ->
            Json.Decode.decodeString getUserResponseBodyDecoder body
                |> Result.withDefault (Err ())

        _ ->
            Err ()


getUserResponseBodyDecoder : Json.Decode.Decoder (Result () User.User)
getUserResponseBodyDecoder =
    Json.Decode.oneOf
        [ Json.Decode.map5
            getUserResponseValueListToResult
            (Json.Decode.field "user" Json.Decode.int)
            (Json.Decode.field "nick" Json.Decode.string)
            (Json.Decode.field "introduction" Json.Decode.string)
            (Json.Decode.maybe (Json.Decode.field "department" Json.Decode.string))
            (Json.Decode.maybe (Json.Decode.field "graduate" Json.Decode.string))
        ]


getUserResponseValueListToResult : Int -> String -> String -> Maybe String -> Maybe String -> Result () User.User
getUserResponseValueListToResult id nickName introduction departmentMaybe graduateMaybe =
    case University.universityFromIdString { departmentMaybe = departmentMaybe, graduateMaybe = graduateMaybe } of
        Just university ->
            Ok
                (User.makeFromApi
                    { id = User.userIdFromInt id
                    , nickName = nickName
                    , introduction = introduction
                    , university = university
                    }
                )

        Nothing ->
            Err ()



{- ==============================================================
       新着の商品を取得    TODO /{version}/goods/で取得したものを逆順
   ==============================================================
-}


getRecentGoods : (Result () (List Good.Good) -> msg) -> Cmd msg
getRecentGoods msg =
    Http.get
        { url = urlBuilder [ "v1", "goods" ]
        , expect =
            Http.expectStringResponse msg
                (getGoodListResponseToResult
                    >> Result.map List.reverse
                )
        }



{- ==============================================================
      おすすめの商品を取得    /{version}/goods/
   ==============================================================
-}


getRecommendGoods : (Result () (List Good.Good) -> msg) -> Cmd msg
getRecommendGoods msg =
    Http.get
        { url = urlBuilder [ "v1", "goods" ]
        , expect = Http.expectStringResponse msg getGoodListResponseToResult
        }


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
        (\id name description price condition status image0Url image1Url image2Url image3Url likedByUserList seller ->
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
                , likedByUserList = likedByUserList |> List.map User.userIdFromInt
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
        |> Json.Decode.Pipeline.required "liked_by_prof" (Json.Decode.list Json.Decode.int)
        |> Json.Decode.Pipeline.required "seller" Json.Decode.int



{- =================================================================================
       0円の商品を取得    TODO /{version}/goods/で取得したものからクライアント側で選んでいる
   =================================================================================
-}


getFreeGoods : (Result () (List Good.Good) -> msg) -> Cmd msg
getFreeGoods msg =
    Http.get
        { url = urlBuilder [ "v1", "goods" ]
        , expect =
            Http.expectStringResponse msg
                (getGoodListResponseToResult
                    >> Result.map (List.filter (\g -> Good.getPrice g == 0))
                )
        }



{- ==============================================================================
      商品の情報を取得    /{version}/goods/{id}/
   ==============================================================================
-}


getGood : Good.GoodId -> (Result () Good.Good -> msg) -> Cmd msg
getGood id msg =
    Http.get
        { url = urlBuilder [ "v1", "goods", Good.goodIdToString id ]
        , expect = Http.expectStringResponse msg getGoodsResponseToResult
        }


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
        (\id name description price condition status image0Url image1Url image2Url image3Url likedByUserList seller sellerName ->
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
                , likedByUserList = likedByUserList |> List.map User.userIdFromInt
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
        |> Json.Decode.Pipeline.required "liked_by_prof" (Json.Decode.list Json.Decode.int)
        |> Json.Decode.Pipeline.required "seller" (Json.Decode.field "user" Json.Decode.int)
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
    toggleLikeTask token goodsId
        |> Task.andThen
            (\result ->
                case result of
                    Like ->
                        Task.succeed ()

                    Unlike ->
                        toggleLikeTask token goodsId
                            |> Task.andThen
                                (\r ->
                                    case r of
                                        Like ->
                                            Task.succeed ()

                                        Unlike ->
                                            Task.fail ()
                                )
            )
        |> Task.attempt msg


toggleLikeTask : Token -> Good.GoodId -> Task.Task () LikeOrUnlike
toggleLikeTask token goodId =
    Http.task
        { method = "POST"
        , headers = [ tokenToHeader token ]
        , url = urlBuilder [ "v1", "goods", Good.goodIdToString goodId, "toggle-like" ]
        , body = Http.emptyBody
        , resolver = Http.stringResolver toggleLikeGoodsResponseToResult
        , timeout = Nothing
        }


toggleLikeGoodsResponseToResult : Http.Response String -> Result () LikeOrUnlike
toggleLikeGoodsResponseToResult response =
    case response of
        Http.GoodStatus_ _ body ->
            Json.Decode.decodeString toggleLikeGoodsResponseBodyDecoder body
                |> Result.mapError (always ())

        _ ->
            Err ()


type LikeOrUnlike
    = Like
    | Unlike


toggleLikeGoodsResponseBodyDecoder : Json.Decode.Decoder LikeOrUnlike
toggleLikeGoodsResponseBodyDecoder =
    Json.Decode.field "message" Json.Decode.string
        |> Json.Decode.andThen
            (\result ->
                case result of
                    "Successfully liked" ->
                        Json.Decode.succeed Like

                    "Successfully unliked" ->
                        Json.Decode.succeed Unlike

                    _ ->
                        Json.Decode.fail
                            ("I can't understand toggle like result=\""
                                ++ result
                                ++ "\""
                                ++ "except \"Successfully liked\" or \"Successfully unliked\""
                            )
            )



{- ==============================================================================
      商品のいいねをはずす    /{version}/goods/{goods_id}/toggle-like/
   ==============================================================================
-}


unlikeGoods : Token -> Good.GoodId -> (Result () () -> msg) -> Cmd msg
unlikeGoods token goodsId msg =
    toggleLikeTask token goodsId
        |> Task.andThen
            (\result ->
                case result of
                    Like ->
                        toggleLikeTask token goodsId
                            |> Task.andThen
                                (\r ->
                                    case r of
                                        Like ->
                                            Task.fail ()

                                        Unlike ->
                                            Task.succeed ()
                                )

                    Unlike ->
                        Task.succeed ()
            )
        |> Task.attempt msg



{- ==============================================================================
      商品のコメントを取得する    /{version}/goods/{goods_id}/comment/
   ==============================================================================
-}


getGoodsComment : Good.GoodId -> (Result () (List Good.Comment) -> msg) -> Cmd msg
getGoodsComment goodId msg =
    Http.get
        { url = urlBuilder [ "v1", "goods", Good.goodIdToString goodId, "comment" ]
        , expect = Http.expectStringResponse msg commentResponseToResult
        }


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
            , userId = User.userIdFromInt userId
            }
        )
        (Json.Decode.field "text" Json.Decode.string)
        (Json.Decode.field "created_at" Json.Decode.string)
        (Json.Decode.field "prof" (Json.Decode.field "nick" Json.Decode.string))
        (Json.Decode.field "prof" (Json.Decode.field "user" Json.Decode.int))



{- ==============================================================================
      商品にコメントをする    /{version}/goods/{goods_id}/comment/
   ==============================================================================
-}


postGoodsComment : User.User -> Token -> Good.GoodId -> String -> (Result () Good.Comment -> msg) -> Cmd msg
postGoodsComment user token goodId comment msg =
    Http.request
        { method = "POST"
        , url = urlBuilder [ "v1", "goods", Good.goodIdToString goodId, "comment" ]
        , headers = [ tokenToHeader token ]
        , body = Http.jsonBody (Json.Encode.object [ ( "text", Json.Encode.string comment ) ])
        , expect = Http.expectStringResponse msg (postGoodsCommentResponseToResult user)
        , timeout = Nothing
        , tracker = Nothing
        }


postGoodsCommentResponseToResult : User.User -> Http.Response String -> Result () Good.Comment
postGoodsCommentResponseToResult user response =
    case response of
        Http.GoodStatus_ _ body ->
            Json.Decode.decodeString
                (commentNormalDecoder
                    (user |> User.getProfile |> User.profileGetNickName)
                    (User.getUserId user)
                    |> Json.Decode.map Ok
                )
                body
                |> Result.withDefault (Err ())

        _ ->
            Err ()


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
    Http.request
        { method = "POST"
        , url = urlBuilder [ "v1", "goods", Good.goodIdToString goodId, "trade-start" ]
        , headers = [ tokenToHeader token ]
        , body = Http.emptyBody
        , expect = Http.expectStringResponse msg tradeStartResponseToResult
        , timeout = Nothing
        , tracker = Nothing
        }


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
    Http.request
        { method = "GET"
        , url = urlBuilder [ "v1", "trade", Good.goodIdToString goodId, "comment" ]
        , headers = [ tokenToHeader token ]
        , body = Http.emptyBody
        , expect = Http.expectStringResponse msg commentResponseToResult
        , timeout = Nothing
        , tracker = Nothing
        }



{- ==============================================================================
                         ソーシャルログインでログイン/新規登録
   ==============================================================================
-}


logInOrSignUpUrlRequest : Data.SocialLoginService.SocialLoginService -> (Result String Url.Url -> msg) -> Cmd msg
logInOrSignUpUrlRequest service callBack =
    graphQlApiRequest
        ("mutation { getLogInUrl(service: "
            ++ (case service of
                    Data.SocialLoginService.Google ->
                        "google"

                    Data.SocialLoginService.GitHub ->
                        "gitHub"

                    Data.SocialLoginService.Twitter ->
                        "twitter"

                    Data.SocialLoginService.Line ->
                        "line"
               )
            ++ ") }"
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


graphQlApiRequest : String -> Json.Decode.Decoder a -> (Result String a -> msg) -> Cmd msg
graphQlApiRequest queryOrMutation responseDecoder callBack =
    Http.post
        { url = "https://tsukumart-demo.firebaseapp.com/api"
        , body = graphQlRequestBody queryOrMutation
        , expect = Http.expectStringResponse callBack (graphQlResponseDecoder responseDecoder)
        }


graphQlRequestBody : String -> Http.Body
graphQlRequestBody queryOrMutation =
    Http.jsonBody
        (Json.Encode.object
            [ ( "query"
              , Json.Encode.string queryOrMutation
              )
            , ( "variables", Json.Encode.null )
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
                                (\message line column ->
                                    "message" ++ message ++ " at " ++ line ++ ":" ++ column
                                )
                                |> Json.Decode.Pipeline.required "message" Json.Decode.string
                                |> Json.Decode.Pipeline.requiredAt [ "locations", "line" ] Json.Decode.string
                                |> Json.Decode.Pipeline.requiredAt [ "locations", "column" ] Json.Decode.string
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
