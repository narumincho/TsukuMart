module Api exposing
    ( ConfirmToken
    , LogInRequest
    , LogInResponseError
    , LogInResponseOk(..)
    , SellGoodsRequest(..)
    , SellGoodsResponseError
    , SignUpConfirmRequest
    , SignUpConfirmResponseError(..)
    , SignUpConfirmResponseOk
    , SignUpRequest
    , SignUpResponseError(..)
    , SignUpResponseOk(..)
    , Token
    , debugDeleteAllUser
    , getAllGoods
    , getUserProfile
    , logIn
    , logInResponseErrorToString
    , sellGoods
    , signUp
    , signUpConfirm
    )

import Data.EmailAddress as EmailAddress
import Data.Goods as Goods
import Data.Password as Password
import Data.University as University
import Data.User as User
import File
import Http
import Json.Decode
import Json.Decode.Pipeline
import Json.Encode



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


type alias ConfirmToken =
    String


confirmTokenToHeader : ConfirmToken -> Http.Header
confirmTokenToHeader token =
    Http.header "Authorization" ("Bearer " ++ token)


tokenToHeader : Token -> Http.Header
tokenToHeader token =
    Http.header "Authorization" ("Bearer " ++ token)


{-| 新規登録のリクエスト(Cmd) /auth/signup/
-}
signUp : SignUpRequest -> (Result SignUpResponseError SignUpResponseOk -> msg) -> Cmd msg
signUp signUpData msg =
    Http.post
        { url = "https://api.tsukumart.com/auth/signup/"
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
            |> Json.Decode.map (\token -> Ok (SignUpResponseOk token))
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


type SignUpConfirmResponseOk
    = SignUpConfirmResponseOk


signUpConfirm : SignUpConfirmRequest -> (Result SignUpConfirmResponseError SignUpConfirmResponseOk -> msg) -> Cmd msg
signUpConfirm { confirmToken } msg =
    Http.request
        { method = "POST"
        , headers = [ confirmTokenToHeader confirmToken ]
        , url = "https://api.tsukumart.com/auth/signup/confirm/"
        , body = Http.emptyBody
        , expect = Http.expectStringResponse msg signUpConfirmResponseToResult
        , timeout = Nothing
        , tracker = Nothing
        }


signUpConfirmResponseToResult : Http.Response String -> Result SignUpConfirmResponseError SignUpConfirmResponseOk
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
            Ok SignUpConfirmResponseOk


{-| 新規登録の認証トークン送信のサーバーからの回答(Response)を解析
-}
signUpConfirmResponseDecoder : Json.Decode.Decoder (Result SignUpConfirmResponseError SignUpConfirmResponseOk)
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


type alias Token =
    String


{-| ログイン /auth/token/
メールアドレスとパスワードから様々な情報をやり取りする上で必要なTokenを受け取る。それだけじゃなく、
-}
logIn : LogInRequest -> (Result LogInResponseError LogInResponseOk -> msg) -> Cmd msg
logIn logInData msg =
    Http.post
        { url = "https://api.tsukumart.com/auth/token/"
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
                        { access = access
                        , refresh = refresh
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
{-
   HTTPレスポンスコード:401 Unauthorized
   body:
      {
          "detail": "Given token not valid for any token type",
          "code": "token_not_valid",
          "messages": [
              {
                  "token_class": "AccessToken",
                  "token_type": "access",
                  "message": "Token is invalid or expired"
              }
          ]
      }
      期限切れか無効かを判断することはなさそう。認証が必要なリクエストでこれが帰ってきたら、Tokenの更新の必要がありそうだ。
-}


type alias TokenRefreshRequest =
    { refresh : Token }


type TokenRefreshResponseOk
    = TokenRefreshResponseOk { access : Token }


type TokenRefreshResponseError
    = TokenRefreshResponseError


tokenRefresh : TokenRefreshRequest -> (Result TokenRefreshResponseError TokenRefreshResponseOk -> msg) -> Cmd msg
tokenRefresh { refresh } msg =
    Http.post
        { url = "https://api.tsukumart.com/auth/token/refresh/"
        , body = Http.emptyBody
        , expect = Http.expectStringResponse msg tokenRefreshResponseToResult
        }


tokenRefreshResponseToResult : Http.Response String -> Result TokenRefreshResponseError TokenRefreshResponseOk
tokenRefreshResponseToResult response =
    case response of
        Http.BadUrl_ _ ->
            Err TokenRefreshResponseError

        Http.Timeout_ ->
            Err TokenRefreshResponseError

        Http.NetworkError_ ->
            Err TokenRefreshResponseError

        Http.BadStatus_ _ body ->
            Json.Decode.decodeString tokenRefreshBodyStringDecoder body
                |> Result.withDefault (Err TokenRefreshResponseError)

        Http.GoodStatus_ _ body ->
            Json.Decode.decodeString tokenRefreshBodyStringDecoder body
                |> Result.withDefault (Err TokenRefreshResponseError)


tokenRefreshBodyStringDecoder : Json.Decode.Decoder (Result TokenRefreshResponseError TokenRefreshResponseOk)
tokenRefreshBodyStringDecoder =
    Json.Decode.field "access" Json.Decode.string
        |> Json.Decode.map
            (\access ->
                Ok (TokenRefreshResponseOk { access = access })
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
        , condition : Goods.Condition
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
        , url = "https://api.tsukumart.com/v1/currentuser/goods/"
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
    , Http.stringPart "condition" (Goods.conditionToIdString condition)
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
       Current User Profile /{version}/currentuser/profile/
   ============================================================
-}


getUserProfile : Token -> (Result () User.User -> msg) -> Cmd msg
getUserProfile token msg =
    Http.request
        { method = "GET"
        , headers = [ tokenToHeader token ]
        , url = "https://api.tsukumart.com/v1/currentuser/profile/"
        , body = Http.emptyBody
        , expect = Http.expectStringResponse msg getUserProfileResponseToResult
        , timeout = Nothing
        , tracker = Nothing
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
                (User.make
                    { id = User.userIdFromInt id
                    , nickName = nickName
                    , introduction = introduction
                    , university = university
                    }
                )

        Nothing ->
            Err ()



{- ==============================================================
      すべての商品を取得    /{version}/goods/
   ==============================================================
-}


getAllGoods : (Result () (List Goods.Goods) -> msg) -> Cmd msg
getAllGoods msg =
    Http.get
        { url = "https://api.tsukumart.com/v1/goods/"
        , expect = Http.expectStringResponse msg getAllGoodsResponseToResult
        }


getAllGoodsResponseToResult : Http.Response String -> Result () (List Goods.Goods)
getAllGoodsResponseToResult response =
    case response of
        Http.BadStatus_ _ body ->
            Json.Decode.decodeString getAllGoodsResponseBodyJsonDecoder body
                |> Result.withDefault (Err ())

        Http.GoodStatus_ _ body ->
            Json.Decode.decodeString getAllGoodsResponseBodyJsonDecoder body
                |> Result.withDefault (Err ())

        _ ->
            Err ()


getAllGoodsResponseBodyJsonDecoder : Json.Decode.Decoder (Result () (List Goods.Goods))
getAllGoodsResponseBodyJsonDecoder =
    Json.Decode.list goodsDecoder
        |> Json.Decode.map Ok


goodsDecoder : Json.Decode.Decoder Goods.Goods
goodsDecoder =
    Json.Decode.succeed
        (\id name description price condition status image0Url image1Url image2Url image3Url likedByUserList ->
            Goods.Goods
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


conditionDecoder : Json.Decode.Decoder Goods.Condition
conditionDecoder =
    Json.Decode.string
        |> Json.Decode.andThen
            (\idString ->
                case Goods.conditionFromString idString of
                    Just condition ->
                        Json.Decode.succeed condition

                    Nothing ->
                        Json.Decode.fail
                            ("I can't understand conditionId=\""
                                ++ idString
                                ++ "\" except \""
                                ++ String.join "\" or \"" (Goods.conditionAll |> List.map Goods.conditionToIdString)
                                ++ "\""
                            )
            )


statusDecoder : Json.Decode.Decoder Goods.Status
statusDecoder =
    Json.Decode.string
        |> Json.Decode.andThen
            (\idString ->
                case Goods.statusFromIdString idString of
                    Just status ->
                        Json.Decode.succeed status

                    Nothing ->
                        Json.Decode.fail
                            ("I can't understand statusId=\""
                                ++ idString
                                ++ "\" except \""
                                ++ String.join "\" or \"" (Goods.statusAll |> List.map Goods.statusToIdString)
                                ++ "\""
                            )
            )



{- ==============================================================
      デバック用 すべてのユーザーを削除 /{version}/debug/user/delete/
   ==============================================================
-}


debugDeleteAllUser : (Result () () -> msg) -> Cmd msg
debugDeleteAllUser msg =
    Http.get
        { url = "https://api.tsukumart.com/v1/debug/user/delete/?all=true"
        , expect = Http.expectStringResponse msg debugDeleteAllUserResponseToResult
        }


debugDeleteAllUserResponseToResult : Http.Response String -> Result () ()
debugDeleteAllUserResponseToResult response =
    case response of
        Http.BadUrl_ _ ->
            Err ()

        Http.Timeout_ ->
            Err ()

        Http.NetworkError_ ->
            Err ()

        Http.BadStatus_ _ _ ->
            Ok ()

        Http.GoodStatus_ _ _ ->
            Ok ()
