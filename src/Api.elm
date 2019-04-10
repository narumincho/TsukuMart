module Api exposing
    ( ConfirmToken
    , LogInRequest
    , LogInResponseError
    , LogInResponseOk(..)
    , SellGoodsRequest(..)
    , SellGoodsResponseError
    , SignUpConfirmRequest
    , SignUpConfirmResponseError(..)
    , SignUpRequest
    , SignUpResponseError(..)
    , SignUpResponseOk(..)
    , Token
    , getExhibitionGoodList
    , getFreeGoods
    , getGood
    , getLikeGoodList
    , getMyProfile
    , getPurchaseGoodList
    , getRecentGoods
    , getRecommendGoods
    , getUserProfile
    , likeGoods
    , logIn
    , logInResponseErrorToString
    , sellGoods
    , signUp
    , signUpConfirm
    , tokenFromString
    , tokenRefresh
    , tokenToString
    , unlikeGoods
    , updateProfile
    )

import Data.EmailAddress as EmailAddress
import Data.Good as Good
import Data.Password as Password
import Data.University as University
import Data.User as User
import File
import Http
import Json.Decode
import Json.Decode.Pipeline
import Json.Encode
import Task
import Url.Builder


apiOrigin : String
apiOrigin =
    "https://api.tsukumart.com"


urlBuilder : List String -> String
urlBuilder pathList =
    Url.Builder.crossOrigin apiOrigin (pathList ++ [ "" ]) []



--    Url.Builder.absolute ([ "api" ] ++ pathList ++ [ "" ]) []
{- =================================================
                 新規登録 /auth/signup/
   =================================================
-}


{-| 新規登録に必要な情報。この内容をサーバーに送信する
-}
type alias SignUpRequest =
    { emailAddress : EmailAddress.EmailAddress
    , pass : Password.Password
    , image : Maybe String
    , university : University.University
    , nickName : String
    }


type SignUpResponseError
    = SignUpErrorAlreadySignUp
    | SignUpErrorBadUrl
    | SignUpErrorTimeout
    | SignUpErrorNetworkError
    | SignUpInvalidData
    | SignUpError


type SignUpResponseOk
    = SignUpResponseOk ConfirmToken


type ConfirmToken
    = ConfirmToken String


confirmTokenToHeader : ConfirmToken -> Http.Header
confirmTokenToHeader (ConfirmToken token) =
    Http.header "Authorization" ("Bearer " ++ token)


tokenToHeader : Token -> Http.Header
tokenToHeader (Token token) =
    Http.header "Authorization" ("Bearer " ++ token)


{-| 新規登録のリクエスト(Cmd) /auth/signup/
-}
signUp : SignUpRequest -> (Result SignUpResponseError SignUpResponseOk -> msg) -> Cmd msg
signUp signUpData msg =
    Http.post
        { url = urlBuilder [ "auth", "signup" ]
        , body = Http.jsonBody (signUpJson signUpData)
        , expect = Http.expectStringResponse msg signUpResponseToResult
        }


{-| 新規登録のJSONを生成
-}
signUpJson : SignUpRequest -> Json.Encode.Value
signUpJson { emailAddress, pass, image, university, nickName } =
    let
        { graduate, department } =
            universityToSimpleRecord university
    in
    Json.Encode.object
        ([ ( "email", Json.Encode.string (EmailAddress.toString emailAddress) )
         , ( "password", Json.Encode.string (Password.toString pass) )
         , ( "nick", Json.Encode.string nickName )
         ]
            ++ (case image of
                    Just imageDataUrl ->
                        [ ( "image", Json.Encode.string imageDataUrl ) ]

                    Nothing ->
                        []
               )
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


{-| 新規登録のサーバーからの回答(Response)を解析
-}
signUpResponseToResult : Http.Response String -> Result SignUpResponseError SignUpResponseOk
signUpResponseToResult response =
    case response of
        Http.BadUrl_ _ ->
            Err SignUpErrorBadUrl

        Http.Timeout_ ->
            Err SignUpErrorTimeout

        Http.NetworkError_ ->
            Err SignUpErrorNetworkError

        Http.BadStatus_ _ body ->
            Json.Decode.decodeString signUpResponseBodyDecoder body
                |> Result.withDefault (Err SignUpError)

        Http.GoodStatus_ _ body ->
            Json.Decode.decodeString signUpResponseBodyDecoder body
                |> Result.withDefault (Err SignUpError)


signUpResponseBodyDecoder : Json.Decode.Decoder (Result SignUpResponseError SignUpResponseOk)
signUpResponseBodyDecoder =
    Json.Decode.oneOf
        [ Json.Decode.field "confirm_token" Json.Decode.string
            |> Json.Decode.map
                (\token ->
                    Ok (SignUpResponseOk (ConfirmToken token))
                )
        , Json.Decode.field "error" Json.Decode.string
            |> Json.Decode.map
                (\reason ->
                    case reason of
                        "email exists" ->
                            Err SignUpErrorAlreadySignUp

                        "invalid data" ->
                            Err SignUpInvalidData

                        _ ->
                            Err SignUpError
                )
        ]



{- ========================================================================
     新規登録の認証トークン送信(リリース前の一時的な処置) /auth/signup/confirm/
   ========================================================================
-}


type alias SignUpConfirmRequest =
    { confirmToken : ConfirmToken }


type SignUpConfirmResponseError
    = SignUpConfirmResponseErrorAlreadyConfirmed -- すでに認証トークンを送っている
    | SignUpConfirmResponseError -- エラーの理由がわからないエラー


signUpConfirm : SignUpConfirmRequest -> (Result SignUpConfirmResponseError () -> msg) -> Cmd msg
signUpConfirm { confirmToken } msg =
    Http.request
        { method = "POST"
        , headers = [ confirmTokenToHeader confirmToken ]
        , url = urlBuilder [ "auth", "signup", "confirm" ]
        , body = Http.emptyBody
        , expect = Http.expectStringResponse msg signUpConfirmResponseToResult
        , timeout = Nothing
        , tracker = Nothing
        }


signUpConfirmResponseToResult : Http.Response String -> Result SignUpConfirmResponseError ()
signUpConfirmResponseToResult response =
    case response of
        Http.BadUrl_ _ ->
            Err SignUpConfirmResponseError

        Http.Timeout_ ->
            Err SignUpConfirmResponseError

        Http.NetworkError_ ->
            Err SignUpConfirmResponseError

        Http.BadStatus_ _ body ->
            Json.Decode.decodeString signUpConfirmResponseDecoder body
                |> Result.withDefault (Err SignUpConfirmResponseError)

        Http.GoodStatus_ _ _ ->
            Ok ()


{-| 新規登録の認証トークン送信のサーバーからの回答(Response)を解析
-}
signUpConfirmResponseDecoder : Json.Decode.Decoder (Result SignUpConfirmResponseError ())
signUpConfirmResponseDecoder =
    Json.Decode.oneOf
        [ Json.Decode.field "ok" Json.Decode.string
            |> Json.Decode.map
                (\ok ->
                    case ok of
                        "confirmed" ->
                            Err SignUpConfirmResponseErrorAlreadyConfirmed

                        _ ->
                            Err SignUpConfirmResponseError
                )
        ]



{- =================================================
                 ログイン /auth/token/
   =================================================
-}


type alias LogInRequest =
    { emailAddress : EmailAddress.EmailAddress, pass : Password.Password }


type LogInResponseOk
    = LogInResponseOk
        { access : Token
        , refresh : Token
        }


type LogInResponseError
    = LogInErrorNoConfirmOrMistakePasswordOrEmail -- 認証をしていないユーザー? ログインできる?
    | LogInError -- エラーの理由がわからないエラー


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


{-| ログイン /auth/token/
メールアドレスとパスワードから様々な情報をやり取りする上で必要なTokenを受け取る。それだけじゃなく、
-}
logIn : LogInRequest -> (Result LogInResponseError LogInResponseOk -> msg) -> Cmd msg
logIn logInData msg =
    Http.post
        { url = urlBuilder [ "auth", "token" ]
        , body = Http.jsonBody (logInRequestToJson logInData)
        , expect = Http.expectStringResponse msg logInResponseToResult
        }


{-| logInのJSONを作成
-}
logInRequestToJson : LogInRequest -> Json.Encode.Value
logInRequestToJson { emailAddress, pass } =
    Json.Encode.object
        [ ( "email", Json.Encode.string (EmailAddress.toString emailAddress) )
        , ( "password", Json.Encode.string (Password.toString pass) )
        ]


logInResponseToResult : Http.Response String -> Result LogInResponseError LogInResponseOk
logInResponseToResult response =
    case response of
        Http.BadStatus_ _ body ->
            Json.Decode.decodeString logInResponseBodyDecoder body
                |> Result.withDefault (Err LogInError)

        Http.GoodStatus_ _ body ->
            Json.Decode.decodeString logInResponseBodyDecoder body
                |> Result.withDefault (Err LogInError)

        _ ->
            Err LogInError


logInResponseBodyDecoder : Json.Decode.Decoder (Result LogInResponseError LogInResponseOk)
logInResponseBodyDecoder =
    Json.Decode.oneOf
        [ Json.Decode.map2
            (\access refresh ->
                Ok
                    (LogInResponseOk
                        { access = Token access
                        , refresh = Token refresh
                        }
                    )
            )
            (Json.Decode.field "access" Json.Decode.string)
            (Json.Decode.field "refresh" Json.Decode.string)
        , Json.Decode.field "non_field_errors" Json.Decode.string
            |> Json.Decode.map
                (\e ->
                    if e == "No active confirmed account found with the given credentials" then
                        Err LogInErrorNoConfirmOrMistakePasswordOrEmail

                    else
                        Err LogInError
                )
        ]


logInResponseErrorToString : LogInResponseError -> String
logInResponseErrorToString logInResponseError =
    case logInResponseError of
        LogInErrorNoConfirmOrMistakePasswordOrEmail ->
            "認証をしていないか、メールアドレスかパスワードが間違っています"

        LogInError ->
            "予期せぬエラーでログインすることができませんでした"



{- =================================================
           Tokenの更新 /auth/token/refresh/
   =================================================
-}


type alias TokenRefreshRequest =
    { refresh : Token }


tokenRefresh : TokenRefreshRequest -> (Result LogInResponseError LogInResponseOk -> msg) -> Cmd msg
tokenRefresh tokenRefreshRequest msg =
    Http.post
        { url = urlBuilder [ "auth", "token", "refresh" ]
        , body = Http.jsonBody (tokenRefreshBody tokenRefreshRequest)
        , expect = Http.expectStringResponse msg logInResponseToResult
        }


tokenRefreshBody : TokenRefreshRequest -> Json.Encode.Value
tokenRefreshBody { refresh } =
    Json.Encode.object
        [ ( "refresh"
          , Json.Encode.string (tokenToString refresh)
          )
        ]



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


type SellGoodsResponseError
    = SellGoodsResponseErrorNameBlank -- 商品名の指定がない
    | SellGoodsResponseError -- 不明なエラー


sellGoods : Token -> SellGoodsRequest -> (Result SellGoodsResponseError () -> msg) -> Cmd msg
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


createGoodsResponseToResult : Http.Response String -> Result SellGoodsResponseError ()
createGoodsResponseToResult response =
    case response of
        Http.BadUrl_ _ ->
            Err SellGoodsResponseError

        Http.Timeout_ ->
            Err SellGoodsResponseError

        Http.NetworkError_ ->
            Err SellGoodsResponseError

        Http.BadStatus_ _ body ->
            Json.Decode.decodeString createGoodsResponseBodyDecoder body
                |> Result.withDefault (Err SellGoodsResponseError)

        Http.GoodStatus_ _ body ->
            Ok ()


createGoodsResponseBodyDecoder : Json.Decode.Decoder (Result SellGoodsResponseError ())
createGoodsResponseBodyDecoder =
    Json.Decode.oneOf
        [ Json.Decode.field "name"
            (Json.Decode.list Json.Decode.string)
            |> Json.Decode.map
                (\list ->
                    if list == [ "This field may not be blank." ] then
                        Err SellGoodsResponseErrorNameBlank

                    else
                        Err SellGoodsResponseError
                )
        ]



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
        , expect = Http.expectStringResponse msg getUserProfileResponseToResult
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
        , expect = Http.expectStringResponse msg (getUserProfileResponseToResult >> Result.map User.getProfile)
        , timeout = Nothing
        , tracker = Nothing
        }


updateProfileRequestToJsonBody : User.Profile -> Json.Decode.Value
updateProfileRequestToJsonBody profile =
    let
        { department, graduate } =
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
          User Profile /{version}/profile/{user}/
   ============================================================
-}


getUserProfile : User.UserId -> (Result () User.User -> msg) -> Cmd msg
getUserProfile userId msg =
    Http.get
        { url = urlBuilder [ "v1", "profile", userId |> User.userIdToInt |> String.fromInt ]
        , expect = Http.expectStringResponse msg getUserProfileResponseToResult
        }


getUserProfileResponseToResult : Http.Response String -> Result () User.User
getUserProfileResponseToResult response =
    case response of
        Http.BadStatus_ _ body ->
            Json.Decode.decodeString getUserProfileResponseBodyDecoder body
                |> Result.withDefault (Err ())

        Http.GoodStatus_ _ body ->
            Json.Decode.decodeString getUserProfileResponseBodyDecoder body
                |> Result.withDefault (Err ())

        _ ->
            Err ()


getUserProfileResponseBodyDecoder : Json.Decode.Decoder (Result () User.User)
getUserProfileResponseBodyDecoder =
    Json.Decode.oneOf
        [ Json.Decode.map5
            getUserProfileResponseValueListToResult
            (Json.Decode.field "user" Json.Decode.int)
            (Json.Decode.field "nick" Json.Decode.string)
            (Json.Decode.field "introduction" Json.Decode.string)
            (Json.Decode.maybe (Json.Decode.field "department" Json.Decode.string))
            (Json.Decode.maybe (Json.Decode.field "graduate" Json.Decode.string))
        ]


getUserProfileResponseValueListToResult : Int -> String -> String -> Maybe String -> Maybe String -> Result () User.User
getUserProfileResponseValueListToResult id nickName introduction departmentMaybe graduateMaybe =
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
    Json.Decode.list goodsDecoder
        |> Json.Decode.map Ok



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
        Http.BadStatus_ _ body ->
            Json.Decode.decodeString (goodsDecoder |> Json.Decode.map Ok) body
                |> Result.withDefault (Err ())

        Http.GoodStatus_ _ body ->
            Json.Decode.decodeString (goodsDecoder |> Json.Decode.map Ok) body
                |> Result.withDefault (Err ())

        _ ->
            Err ()


goodsDecoder : Json.Decode.Decoder Good.Good
goodsDecoder =
    Json.Decode.succeed
        (\id name description price condition status image0Url image1Url image2Url image3Url likedByUserList seller ->
            Good.make
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
