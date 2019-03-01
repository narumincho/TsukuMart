module Api exposing
    ( ConfirmToken(..)
    , SignUpResponseError(..)
    , SignUpResponseOk(..)
    , signUp
    )

import EmailAddress
import Http
import Json.Decode
import Json.Encode
import Password


{-| 新規登録 /auth/signup/
-}
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


{-| 新規登録 /auth/signup/
-}
signUp : { emailAddress : EmailAddress.EmailAddress, pass : Password.Password, image : Maybe String } -> (Result SignUpResponseError SignUpResponseOk -> msg) -> Cmd msg
signUp signUpData msg =
    Http.post
        { url = "http://tsukumart.com/auth/signup/"
        , body = Http.jsonBody (signUpJson signUpData)
        , expect = Http.expectStringResponse msg signUpResponseToResult
        }


{-| 新規登録のJSONを生成
-}
signUpJson : { emailAddress : EmailAddress.EmailAddress, pass : Password.Password, image : Maybe String } -> Json.Encode.Value
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
