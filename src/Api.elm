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
import Data.Profile as Profile
import Data.University as University
import Http
import Json.Decode
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
           Token Refresh /auth/token/refresh/
   =================================================
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
        , image0 : String
        , image1 : Maybe String
        , image2 : Maybe String
        , image3 : Maybe String
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
        , body = Http.jsonBody (createGoodsRequestJsonBody createGoodsRequest)
        , expect = Http.expectStringResponse msg createGoodsResponseToResult
        , timeout = Nothing
        , tracker = Nothing
        }


createGoodsRequestJsonBody : SellGoodsRequest -> Json.Encode.Value
createGoodsRequestJsonBody (SellGoodsRequest { name, description, price, condition, image0, image1, image2, image3 }) =
    Json.Encode.object
        ([ ( "name", Json.Encode.string name )
         , ( "description", Json.Encode.string description )
         , ( "price", Json.Encode.int price )
         , ( "condition", Json.Encode.string (Goods.conditionToIdString condition) )
         , ( "location", Json.Encode.string "場所の指定はなし" )
         , ( "status", Json.Encode.string "selling" )
         , ( "image1", Json.Encode.string image0 )
         ]
            ++ (case image1 of
                    Just i ->
                        [ ( "image2", Json.Encode.string i ) ]

                    Nothing ->
                        []
               )
            ++ (case image2 of
                    Just i ->
                        [ ( "image3", Json.Encode.string i ) ]

                    Nothing ->
                        []
               )
            ++ (case image3 of
                    Just i ->
                        [ ( "image4", Json.Encode.string i ) ]

                    Nothing ->
                        []
               )
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


getUserProfile : Token -> (Result () Profile.Profile -> msg) -> Cmd msg
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


getUserProfileResponseToResult : Http.Response String -> Result () Profile.Profile
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


getUserProfileResponseBodyDecoder : Json.Decode.Decoder (Result () Profile.Profile)
getUserProfileResponseBodyDecoder =
    Json.Decode.oneOf
        [ Json.Decode.map4
            getUserProfileResponseValueListToResult
            (Json.Decode.field "nick" Json.Decode.string)
            (Json.Decode.field "introduction" Json.Decode.string)
            (Json.Decode.maybe (Json.Decode.field "department" Json.Decode.string))
            (Json.Decode.maybe (Json.Decode.field "graduate" Json.Decode.string))
        ]


getUserProfileResponseValueListToResult : String -> String -> Maybe String -> Maybe String -> Result () Profile.Profile
getUserProfileResponseValueListToResult nickName introduction departmentMaybe graduateMaybe =
    case University.universityFromIdString { departmentMaybe = departmentMaybe, graduateMaybe = graduateMaybe } of
        Just university ->
            Ok
                (Profile.make
                    { nickName = nickName
                    , introduction = introduction
                    , university = university
                    }
                )

        Nothing ->
            Err ()



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
