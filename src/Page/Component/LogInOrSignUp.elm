module Page.Component.LogInOrSignUp exposing
    ( Emit(..)
    , Model
    , Msg(..)
    , initModel
    , update
    , view
    )

import Api
import Data.EmailAddress
import Data.Password
import Data.SAddress
import Data.StudentId
import Html
import Html.Attributes
import Html.Events
import Json.Decode
import SiteMap


type Model
    = Model
        { analysisStudentIdOrEmailAddressResult : AnalysisStudentIdOrEmailAddressResult
        , password : Maybe Data.Password.Password
        , saveRefreshToken : Bool
        , sending : Bool -- ログイン処理で送信中か
        }


type Emit
    = EmitLogIn Api.LogInRequest Bool


type Msg
    = InputStudentIdOrEmailAddress String
    | InputPassword String
    | CheckSaveRefreshToken Bool
    | LogIn Api.LogInRequest
    | LogInSuccess
    | LogInFailure


{-| 学籍番号かメールアドレスの解析結果
-}
type AnalysisStudentIdOrEmailAddressResult
    = AENone
    | AEStudentId Data.StudentId.StudentId
    | AEEmailAddress Data.EmailAddress.EmailAddress


initModel : Model
initModel =
    Model
        { analysisStudentIdOrEmailAddressResult = analysisStudentIdOrEmailAddress ""
        , password = Nothing
        , saveRefreshToken = True
        , sending = False
        }


update : Msg -> Model -> ( Model, List Emit )
update msg (Model r) =
    case msg of
        InputPassword string ->
            ( Model
                { r
                    | password = Data.Password.fromString string |> Result.toMaybe
                }
            , []
            )

        InputStudentIdOrEmailAddress string ->
            ( Model
                { r | analysisStudentIdOrEmailAddressResult = analysisStudentIdOrEmailAddress string }
            , []
            )

        CheckSaveRefreshToken check ->
            ( Model
                { r | saveRefreshToken = check }
            , []
            )

        LogIn request ->
            ( Model { r | sending = True }
            , [ EmitLogIn request r.saveRefreshToken ]
            )

        LogInSuccess ->
            ( Model { r | sending = False }
            , []
            )

        LogInFailure ->
            ( Model { r | sending = False }
            , []
            )


{-| ログイン画面で使う入力の解析
-}
analysisStudentIdOrEmailAddress : String -> AnalysisStudentIdOrEmailAddressResult
analysisStudentIdOrEmailAddress string =
    let
        charList =
            String.toList (String.trim string)
    in
    case Data.StudentId.fromCharList charList of
        Just studentId ->
            AEStudentId studentId

        Nothing ->
            case Data.EmailAddress.fromCharList charList of
                Just emailAddress ->
                    AEEmailAddress emailAddress

                Nothing ->
                    AENone


getLogInData : AnalysisStudentIdOrEmailAddressResult -> Maybe Data.Password.Password -> Maybe { emailAddress : Data.EmailAddress.EmailAddress, pass : Data.Password.Password }
getLogInData studentIdOrEmailAddress passwordMaybe =
    case ( studentIdOrEmailAddress, passwordMaybe ) of
        ( AEStudentId studentId, Just password ) ->
            Just
                { emailAddress = Data.EmailAddress.fromSAddress (Data.SAddress.fromStudentId studentId)
                , pass = password
                }

        ( AEEmailAddress emailAddress, Just password ) ->
            Just
                { emailAddress = emailAddress
                , pass = password
                }

        ( _, _ ) ->
            Nothing



{- =================================
               View
   =================================
-}


view : Model -> Html.Html Msg
view (Model { analysisStudentIdOrEmailAddressResult, password, saveRefreshToken, sending }) =
    Html.div
        [ Html.Attributes.class "logIn" ]
        [ Html.form
            [ Html.Attributes.class "logIn-group" ]
            ([ logInIdView analysisStudentIdOrEmailAddressResult
             , logInPasswordView
             , logInSaveRefreshTokenCheck saveRefreshToken
             , logInButton sending (getLogInData analysisStudentIdOrEmailAddressResult password)
             ]
                ++ (if sending then
                        [ Html.text "送信中" ]

                    else
                        []
                   )
            )
        , orLabel
        , Html.div
            [ Html.Attributes.class "logIn-group" ]
            [ signUpButton ]
        ]


logInIdView : AnalysisStudentIdOrEmailAddressResult -> Html.Html Msg
logInIdView analysisStudentIdOrEmailAddressResult =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.class "logIn-subTitle", Html.Attributes.for "logInId" ]
            [ Html.text "学籍番号かメールアドレス" ]
        , Html.input
            [ Html.Attributes.class "logIn-input"
            , Html.Attributes.id "logInId"
            , Html.Attributes.attribute "autocomplete" "email"
            , Html.Events.onInput InputStudentIdOrEmailAddress
            ]
            []
        , Html.div
            []
            [ Html.text
                (case analysisStudentIdOrEmailAddressResult of
                    AENone ->
                        ""

                    AEStudentId studentId ->
                        "学籍番号" ++ Data.StudentId.toStringWith20 studentId

                    AEEmailAddress emailAddress ->
                        "メールアドレス" ++ Data.EmailAddress.toString emailAddress
                )
            ]
        ]


logInPasswordView : Html.Html Msg
logInPasswordView =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.class "logIn-subTitle"
            , Html.Attributes.for "logInPassword"
            ]
            [ Html.text "パスワード" ]
        , Html.input
            [ Html.Attributes.type_ "password"
            , Html.Attributes.class "logIn-input"
            , Html.Attributes.id "logInPassword"
            , Html.Attributes.minlength 9
            , Html.Attributes.maxlength 50
            , Html.Attributes.attribute "autocomplete" "current-password"
            , Html.Events.onInput InputPassword
            ]
            []
        ]


logInSaveRefreshTokenCheck : Bool -> Html.Html Msg
logInSaveRefreshTokenCheck saveRefreshToken =
    Html.div
        []
        [ Html.input
            [ Html.Attributes.type_ "checkbox"
            , Html.Attributes.id "saveRefreshToken"
            , Html.Events.onCheck CheckSaveRefreshToken
            , Html.Attributes.checked saveRefreshToken
            ]
            []
        , Html.label
            [ Html.Attributes.for "saveRefreshToken" ]
            [ Html.text "ログイン情報を保存する" ]
        ]


logInButton : Bool -> Maybe Api.LogInRequest -> Html.Html Msg
logInButton sending logInDataMaybe =
    Html.div
        []
        [ Html.button
            ([ Html.Attributes.class "logIn-logInButton"
             ]
                ++ (case logInDataMaybe of
                        Just logInData ->
                            if sending then
                                [ Html.Attributes.disabled True ]

                            else
                                [ Html.Events.preventDefaultOn "click"
                                    (Json.Decode.succeed
                                        ( LogIn logInData
                                        , True
                                        )
                                    )
                                , Html.Attributes.disabled False
                                ]

                        Nothing ->
                            [ Html.Attributes.disabled True ]
                   )
            )
            [ Html.text "ログイン" ]
        ]


orLabel : Html.Html msg
orLabel =
    Html.div [ Html.Attributes.class "logIn-orLabel" ]
        [ Html.text "or" ]


signUpButton : Html.Html msg
signUpButton =
    Html.a
        [ Html.Attributes.class "subButton"
        , Html.Attributes.href SiteMap.signUpUrl
        ]
        [ Html.text "新規登録" ]
