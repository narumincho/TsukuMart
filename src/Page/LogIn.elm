module Page.LogIn exposing (Emit(..), Model, Msg(..), initModel, update, view)

import EmailAddress
import Html
import Html.Attributes
import Html.Events
import Json.Decode
import Password
import SAddress
import SiteMap
import StudentId


type Model
    = LogInPage
        { studentIdOrEmailAddress : AnalysisStudentIdOrEmailAddressResult
        , password : Maybe Password.Password
        , sending : Bool -- ログイン処理で送信か
        }
    | ForgotPassword


type Emit
    = EmitChangePage Model
    | EmitInputStudentIdOrEmailAddress String
    | EmitInputPassword String
    | EmitLogIn { emailAddress : EmailAddress.EmailAddress, pass : Password.Password }


type Msg
    = InputPassword String
    | InputStudentIdOrEmailAddress String
    | SendLogIn
    | StopSendLogIn


type AnalysisStudentIdOrEmailAddressResult
    = AENone
    | AEStudentId StudentId.StudentId
    | AEEmailAddress EmailAddress.EmailAddress


initModel : Model
initModel =
    LogInPage
        { studentIdOrEmailAddress = analysisStudentIdOrEmailAddress ""
        , password = Nothing
        , sending = False
        }


update : Msg -> Model -> Model
update msg model =
    case msg of
        InputPassword string ->
            case model of
                LogInPage r ->
                    LogInPage
                        { r
                            | password = Password.passwordFromString string |> Result.toMaybe
                        }

                ForgotPassword ->
                    ForgotPassword

        InputStudentIdOrEmailAddress string ->
            case model of
                LogInPage r ->
                    LogInPage
                        { r | studentIdOrEmailAddress = analysisStudentIdOrEmailAddress string }

                ForgotPassword ->
                    ForgotPassword

        SendLogIn ->
            case model of
                LogInPage r ->
                    LogInPage
                        { r | sending = True }

                ForgotPassword ->
                    ForgotPassword

        StopSendLogIn ->
            case model of
                LogInPage r ->
                    LogInPage { r | sending = False }

                ForgotPassword ->
                    ForgotPassword


{-| ログイン画面
-}
view : Model -> List (Html.Html Emit)
view logInPage =
    [ Html.div
        [ Html.Attributes.class "logIn-Container" ]
        (case logInPage of
            LogInPage { studentIdOrEmailAddress, password, sending } ->
                logInView studentIdOrEmailAddress password sending

            ForgotPassword ->
                forgotPasswordView
        )
    ]


logInView : AnalysisStudentIdOrEmailAddressResult -> Maybe Password.Password -> Bool -> List (Html.Html Emit)
logInView analysisStudentIdOrEmailAddressResult password sending =
    [ Html.div
        [ Html.Attributes.class "logIn" ]
        [ Html.form
            [ Html.Attributes.class "logIn-group" ]
            ([ logInIdView analysisStudentIdOrEmailAddressResult
             , logInPasswordView
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
    ]


logInIdView : AnalysisStudentIdOrEmailAddressResult -> Html.Html Emit
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
            , Html.Events.onInput EmitInputStudentIdOrEmailAddress
            ]
            []
        , Html.div
            []
            [ Html.text
                (case analysisStudentIdOrEmailAddressResult of
                    AENone ->
                        ""

                    AEStudentId studentId ->
                        "学籍番号" ++ StudentId.toStringWith20 studentId

                    AEEmailAddress emailAddress ->
                        "メールアドレス" ++ EmailAddress.toString emailAddress
                )
            ]
        ]


logInPasswordView : Html.Html Emit
logInPasswordView =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.class "logIn-subTitle"
            , Html.Attributes.for "logInPassword"
            ]
            [ Html.text "パスワード"
            , Html.span
                [ Html.Attributes.class "logIn-subTitle-forgotPassword"
                , Html.Events.onClick (EmitChangePage ForgotPassword)
                ]
                [ Html.text "パスワードを忘れた" ]
            ]
        , Html.input
            [ Html.Attributes.type_ "password"
            , Html.Attributes.class "logIn-input"
            , Html.Attributes.id "logInPassword"
            , Html.Attributes.minlength 9
            , Html.Attributes.maxlength 50
            , Html.Attributes.attribute "autocomplete" "current-password"
            , Html.Events.onInput EmitInputPassword
            ]
            []
        ]


logInButton : Bool -> Maybe { emailAddress : EmailAddress.EmailAddress, pass : Password.Password } -> Html.Html Emit
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
                                        ( EmitLogIn logInData
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


{-| パスワードを忘れた画面
-}
forgotPasswordView : List (Html.Html msg)
forgotPasswordView =
    [ Html.text "パスワードを忘れたら。パスワード再発行機能はまだできあがっていません。" ]


orLabel : Html.Html msg
orLabel =
    Html.div [ Html.Attributes.class "logIn-orLabel" ]
        [ Html.text "or" ]


signUpButton : Html.Html msg
signUpButton =
    Html.a
        [ Html.Attributes.class "logIn-signInButton"
        , Html.Attributes.href SiteMap.signUpUrl
        ]
        [ Html.text "新規登録" ]


{-| ログイン画面で使う入力の解析
-}
analysisStudentIdOrEmailAddress : String -> AnalysisStudentIdOrEmailAddressResult
analysisStudentIdOrEmailAddress string =
    let
        charList =
            String.toList (String.trim string)
    in
    case StudentId.fromCharList charList of
        Just studentId ->
            AEStudentId studentId

        Nothing ->
            case EmailAddress.fromCharList charList of
                Just emailAddress ->
                    AEEmailAddress emailAddress

                Nothing ->
                    AENone


getLogInData : AnalysisStudentIdOrEmailAddressResult -> Maybe Password.Password -> Maybe { emailAddress : EmailAddress.EmailAddress, pass : Password.Password }
getLogInData studentIdOrEmailAddress passwordMaybe =
    case ( studentIdOrEmailAddress, passwordMaybe ) of
        ( AEStudentId studentId, Just password ) ->
            Just
                { emailAddress = EmailAddress.fromSAddress (SAddress.fromStundetId studentId)
                , pass = password
                }

        ( AEEmailAddress emailAddress, Just password ) ->
            Just
                { emailAddress = emailAddress
                , pass = password
                }

        ( _, _ ) ->
            Nothing
