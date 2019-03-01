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
    , logIn
    , signUp
    , signUpConfirm
    )

import EmailAddress
import Http
import Json.Decode
import Json.Encode
import Password



{- =================================================
                 新規登録 /auth/signup/
   =================================================
-}


type alias SignUpRequest =
    { emailAddress : EmailAddress.EmailAddress, pass : Password.Password, image : Maybe String }


type SignUpResponseError
    = SignUpErrorAlreadySignUp
    | SignUpErrorBadUrl
    | SignUpErrorTimeout
    | SignUpErrorNetworkError
    | SignUpError


type SignUpResponseOk
    = SignUpResponseOk ConfirmToken


type ConfirmToken
    = ConfirmToken String


confirmTokenToHeader : ConfirmToken -> Http.Header
confirmTokenToHeader (ConfirmToken token) =
    Http.header "Authorization" ("Bearer " ++ token)


{-| 新規登録 /auth/signup/
-}
signUp : SignUpRequest -> (Result SignUpResponseError SignUpResponseOk -> msg) -> Cmd msg
signUp signUpData msg =
    Http.post
        { url = "http://tsukumart.com/auth/signup/"
        , body = Http.jsonBody (signUpJson signUpData)
        , expect = Http.expectStringResponse msg signUpResponseToResult
        }


{-| 新規登録のJSONを生成
-}
signUpJson : SignUpRequest -> Json.Encode.Value
signUpJson { emailAddress, pass, image } =
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
        )


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
        , Json.Decode.field "reason" Json.Decode.string
            |> Json.Decode.map
                (\reason ->
                    case reason of
                        "Email already exists" ->
                            Err SignUpErrorAlreadySignUp

                        _ ->
                            Err SignUpError
                )
        ]



{- =================================================
             認証Token送信 /auth/signup/confirm/
   =================================================
-}


type alias SignUpConfirmRequest =
    { confirmToken : ConfirmToken }


type SignUpConfirmResponseError
    = SignUpConfirmResponseError


type SignUpConfirmResponseOk
    = SignUpConfirmResponseOk


signUpConfirm : SignUpConfirmRequest -> (Result SignUpConfirmResponseError SignUpConfirmResponseOk -> msg) -> Cmd msg
signUpConfirm { confirmToken } msg =
    Http.request
        { method = "POST"
        , headers = [ confirmTokenToHeader confirmToken ]
        , url = "http://tsukumart.com/auth/signup/confirm/"
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

        Http.BadStatus_ _ _ ->
            Err SignUpConfirmResponseError

        Http.GoodStatus_ _ _ ->
            Ok SignUpConfirmResponseOk



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
        { url = "http://tsukumart.com/auth/token/"
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
