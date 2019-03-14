module Api exposing
    ( ConfirmToken(..)
    , LogInRequest
    , LogInResponseError
    , LogInResponseOk
    , SignUpConfirmRequest
    , SignUpConfirmResponseError
    , SignUpConfirmResponseOk
    , SignUpRequest
    , SignUpResponseError(..)
    , SignUpResponseOk(..)
    , UniversityData(..)
    , logIn
    , signUp
    , signUpConfirm
    )

import EmailAddress
import Http
import Json.Decode
import Json.Encode
import Password
import School



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
    , university : UniversityData
    }


type UniversityData
    = UniversitySchool School.SchoolAndDepartment
    | UniversityGraduateFromTsukuba School.Graduate School.SchoolAndDepartment
    | UniversityGraduateFromNotTsukuba School.Graduate


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


{-| 新規登録のリクエスト(Cmd) /auth/signup/
-}
signUp : SignUpRequest -> (Result SignUpResponseError SignUpResponseOk -> msg) -> Cmd msg
signUp signUpData msg =
    Http.post
        { url = "http://api.tsukumart.com/auth/signup/"
        , body = Http.jsonBody (signUpJson signUpData)
        , expect = Http.expectStringResponse msg signUpResponseToResult
        }


{-| 新規登録のJSONを生成
-}
signUpJson : SignUpRequest -> Json.Encode.Value
signUpJson { emailAddress, pass, image, university } =
    let
        { graduate, department } =
            universityToSimpleRecord university
    in
    Json.Encode.object
        ([ ( "email", Json.Encode.string (EmailAddress.toString emailAddress) )
         , ( "password", Json.Encode.string (Password.toString pass) )
         ]
            ++ (case image of
                    Just imageDataUrl ->
                        [ ( "image", Json.Encode.string imageDataUrl ) ]

                    Nothing ->
                        []
               )
            ++ (case graduate of
                    Just g ->
                        [ ( "graduate", Json.Encode.string (School.graduateToIdString g) ) ]

                    Nothing ->
                        []
               )
            ++ (case department of
                    Just d ->
                        [ ( "department", Json.Encode.string (School.departmentToIdString d) ) ]

                    Nothing ->
                        []
               )
        )


universityToSimpleRecord : UniversityData -> { graduate : Maybe School.Graduate, department : Maybe School.SchoolAndDepartment }
universityToSimpleRecord universityData =
    case universityData of
        UniversitySchool schoolAndDepartment ->
            { graduate = Nothing
            , department = Just schoolAndDepartment
            }

        UniversityGraduateFromTsukuba graduate schoolAndDepartment ->
            { graduate = Just graduate
            , department = Just schoolAndDepartment
            }

        UniversityGraduateFromNotTsukuba graduate ->
            { graduate = Just graduate
            , department = Nothing
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
            |> Json.Decode.map (\token -> Ok (SignUpResponseOk (ConfirmToken token)))
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
    = SignUpConfirmResponseErrorAlreadyConfirmed
    | SignUpConfirmResponseError


type SignUpConfirmResponseOk
    = SignUpConfirmResponseOk


signUpConfirm : SignUpConfirmRequest -> (Result SignUpConfirmResponseError SignUpConfirmResponseOk -> msg) -> Cmd msg
signUpConfirm { confirmToken } msg =
    Http.request
        { method = "POST"
        , headers = [ confirmTokenToHeader confirmToken ]
        , url = "http://api.tsukumart.com/auth/signup/confirm/"
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
    = LogInOk
        { access : Token
        , refresh : Token
        }


type LogInResponseError
    = LogInErrorMistakePasswordOrEmail
    | LogInErrorNoConfirm -- 認証をしていないユーザー? ログインできる?
    | LogInErrorBadUrl
    | LogInErrorTimeout
    | LogInErrorNetworkError
    | LogInError


type Token
    = Token String


{-| ログイン /auth/token/
メールアドレスとパスワードから様々な情報をやり取りする上で必要なTokenを受け取る。それだけじゃなく、
-}
logIn : LogInRequest -> (Result LogInResponseError LogInResponseOk -> msg) -> Cmd msg
logIn logInData msg =
    Http.post
        { url = "http://api.tsukumart.com/auth/token/"
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
        Http.BadUrl_ _ ->
            Err LogInErrorBadUrl

        Http.Timeout_ ->
            Err LogInErrorTimeout

        Http.NetworkError_ ->
            Err LogInErrorNetworkError

        Http.BadStatus_ _ body ->
            Json.Decode.decodeString logInResponseBodyDecoder body
                |> Result.withDefault (Err LogInError)

        Http.GoodStatus_ _ body ->
            Json.Decode.decodeString logInResponseBodyDecoder body
                |> Result.withDefault (Err LogInError)


logInResponseBodyDecoder : Json.Decode.Decoder (Result LogInResponseError LogInResponseOk)
logInResponseBodyDecoder =
    Json.Decode.map2
        (\access refresh ->
            Ok
                (LogInOk
                    { access = Token access
                    , refresh = Token refresh
                    }
                )
        )
        (Json.Decode.field "access" Json.Decode.string)
        (Json.Decode.field "refresh" Json.Decode.string)



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
        { url = "http://api.tsukumart.com/auth/token/refresh/"
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
                Ok (TokenRefreshResponseOk { access = Token access })
            )
