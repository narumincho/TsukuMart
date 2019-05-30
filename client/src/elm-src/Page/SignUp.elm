module Page.SignUp exposing
    ( Emit(..)
    , Model
    , Msg(..)
    , initModel
    , sentConfirmTokenModel
    , update
    , view
    )

{-| Sign Up 新規登録画面
-}

import Api
import Data.EmailAddress
import Data.Password
import Data.SAddress
import Data.StudentId
import Html
import Html.Attributes
import Html.Events
import Html.Keyed
import Json.Decode
import Page.Component.University as CompUniversity
import Tab


type Model
    = Normal
        -- 新規登録入力フォーム
        { sAddressAndPassword : SAddressAndPassword
        , imageUrl : String
        , university : CompUniversity.Model
        , nickName : String
        }
    | SentSingUpData Api.LogInRequest (Maybe (Result Api.SignUpResponseError Api.SignUpResponseOk))
    | SentConfirmTokenError (Maybe Api.SignUpConfirmResponseError)


type SAddressAndPassword
    = StudentHasSAddress
        { studentIdOrTsukubaEmailAddress : AnalysisStudentIdOrSAddressResult
        , password : Result Data.Password.Error Data.Password.Password
        }
    | NewStudent
        { emailAddress : Maybe Data.EmailAddress.EmailAddress
        , imageDataUrl : Maybe String
        , password : Result Data.Password.Error Data.Password.Password
        }


{-| ここから発生するイベント
-}
type Emit
    = EmitCatchStudentImage String
    | EmitSignUp Api.SignUpRequest
    | EmitSendConfirmToken Api.LogInRequest Api.ConfirmToken
    | EmitUniversity CompUniversity.Emit


type Msg
    = InputStudentIdOrEmailAddress String
    | CatchStudentImage String
    | ReceiveImageDataUrl String
    | InputSAddressAndPassword SAddressAndPassword
    | InputUniversity CompUniversity.Model
    | InputPassword String
    | InputNickName String
    | SignUp Api.SignUpRequest
    | SignUpResponse (Result Api.SignUpResponseError Api.SignUpResponseOk)
    | SendConfirmToken Api.LogInRequest Api.ConfirmToken


{-| すべて空白の新規登録画面を表示するためのModel
-}
initModel : String -> String -> Model
initModel name imageUrl =
    Normal
        { sAddressAndPassword =
            StudentHasSAddress
                { studentIdOrTsukubaEmailAddress = analysisStudentIdOrSAddress ""
                , password = Data.Password.fromString ""
                }
        , university = CompUniversity.initSelect
        , nickName = name
        , imageUrl = imageUrl
        }


sentConfirmTokenModel : Api.SignUpConfirmResponseError -> Model
sentConfirmTokenModel signUpResponseError =
    SentConfirmTokenError (Just signUpResponseError)


update : Msg -> Model -> ( Model, List Emit )
update msg model =
    case msg of
        InputStudentIdOrEmailAddress string ->
            ( case model of
                Normal rec ->
                    Normal { rec | sAddressAndPassword = inputStudentIdOrEmailAddress string rec.sAddressAndPassword }

                _ ->
                    model
            , []
            )

        CatchStudentImage idString ->
            ( model
            , [ EmitCatchStudentImage idString ]
            )

        ReceiveImageDataUrl dataUrl ->
            ( case model of
                Normal rec ->
                    Normal { rec | sAddressAndPassword = receiveImageDataUrl dataUrl rec.sAddressAndPassword }

                _ ->
                    model
            , []
            )

        InputSAddressAndPassword sAddressAndPassword ->
            ( case model of
                Normal rec ->
                    Normal { rec | sAddressAndPassword = sAddressAndPassword }

                _ ->
                    model
            , []
            )

        InputUniversity universitySelect ->
            ( case model of
                Normal rec ->
                    Normal { rec | university = universitySelect }

                _ ->
                    model
            , CompUniversity.emit universitySelect |> List.map EmitUniversity
            )

        InputPassword string ->
            ( case model of
                Normal rec ->
                    Normal
                        { rec
                            | sAddressAndPassword =
                                case rec.sAddressAndPassword of
                                    NewStudent r ->
                                        NewStudent
                                            { r | password = Data.Password.fromString string }

                                    StudentHasSAddress r ->
                                        StudentHasSAddress
                                            { r | password = Data.Password.fromString string }
                        }

                _ ->
                    model
            , []
            )

        InputNickName string ->
            ( case model of
                Normal rec ->
                    Normal
                        { rec
                            | nickName = String.trim string
                        }

                _ ->
                    model
            , []
            )

        SignUp signUpRequest ->
            ( SentSingUpData { emailAddress = signUpRequest.emailAddress, pass = signUpRequest.pass } Nothing
            , [ EmitSignUp signUpRequest ]
            )

        SignUpResponse result ->
            ( case model of
                SentSingUpData emailAddress _ ->
                    SentSingUpData emailAddress (Just result)

                _ ->
                    model
            , []
            )

        SendConfirmToken logInRequest token ->
            ( SentConfirmTokenError Nothing
            , [ EmitSendConfirmToken logInRequest token ]
            )


inputStudentIdOrEmailAddress : String -> SAddressAndPassword -> SAddressAndPassword
inputStudentIdOrEmailAddress string sAddressAndPassword =
    case sAddressAndPassword of
        StudentHasSAddress r ->
            StudentHasSAddress
                { r
                    | studentIdOrTsukubaEmailAddress =
                        analysisStudentIdOrSAddress string
                }

        NewStudent r ->
            NewStudent
                { r
                    | emailAddress = analysisEmailAddress string
                }


receiveImageDataUrl : String -> SAddressAndPassword -> SAddressAndPassword
receiveImageDataUrl string sAddressAndPassword =
    case sAddressAndPassword of
        StudentHasSAddress _ ->
            sAddressAndPassword

        NewStudent rec ->
            NewStudent
                { rec | imageDataUrl = Just string }



{- =====================================================
                       View 表示
   =====================================================
-}


{-| 新規登録画面の表示
-}
view : Model -> ( String, Tab.Tab Msg, List (Html.Html Msg) )
view userSignUpPage =
    let
        ( tabText, mainView ) =
            case userSignUpPage of
                Normal { sAddressAndPassword, university, nickName, imageUrl } ->
                    ( "新規登録", normalView sAddressAndPassword university nickName imageUrl )

                SentSingUpData emailAddress maybe ->
                    ( "新規登録情報の送信", sentSingUpDataView emailAddress maybe )

                SentConfirmTokenError signUpConfirmResponseErrorMaybe ->
                    ( "認証トークンの送信", sentConfirmTokenView signUpConfirmResponseErrorMaybe )
    in
    ( "新規登録"
    , Tab.single tabText
    , [ Html.div
            [ Html.Attributes.class "container" ]
            [ mainView ]
      ]
    )


normalView : SAddressAndPassword -> CompUniversity.Model -> String -> String -> Html.Html Msg
normalView sAddressAndPassword university nickName imageUrl =
    Html.Keyed.node "form"
        [ Html.Attributes.class "form" ]
        ([ ( "s_or_nos"
           , sAddressView sAddressAndPassword
                |> Html.map InputSAddressAndPassword
           )
         ]
            ++ (case sAddressAndPassword of
                    StudentHasSAddress { studentIdOrTsukubaEmailAddress, password } ->
                        studentHasSAddressFormList studentIdOrTsukubaEmailAddress password

                    NewStudent { emailAddress, imageDataUrl, password } ->
                        newStudentForm emailAddress imageDataUrl password
               )
            ++ imageForm imageUrl
            ++ nickNameForm nickName
            ++ (CompUniversity.view university
                    |> List.map (Tuple.mapSecond (Html.map InputUniversity))
               )
            ++ [ ( "submit", signUpSubmitButton (getSignUpRequest sAddressAndPassword university nickName) ) ]
        )


{-| sアドを持っているか持っていないかを選択するフォーム
-}
sAddressView : SAddressAndPassword -> Html.Html SAddressAndPassword
sAddressView userSignUpSAddressAndPassword =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.class "form-label" ]
            [ Html.text "sアドを" ]
        , sAddressSelectView userSignUpSAddressAndPassword
        ]


sAddressSelectView : SAddressAndPassword -> Html.Html SAddressAndPassword
sAddressSelectView userSignUpSAddressAndPassword =
    let
        leftSelect =
            case userSignUpSAddressAndPassword of
                StudentHasSAddress _ ->
                    True

                NewStudent _ ->
                    False
    in
    Html.div
        [ Html.Attributes.class "form-select" ]
        [ Html.div
            ([ Html.Attributes.classList
                [ ( "form-select-item", not leftSelect )
                , ( "form-select-itemSelect", leftSelect )
                ]
             , Html.Attributes.style "border-radius" ".4rem 0 0 .4rem"
             ]
                ++ (case userSignUpSAddressAndPassword of
                        StudentHasSAddress _ ->
                            []

                        NewStudent { password } ->
                            [ Html.Events.onClick
                                (StudentHasSAddress
                                    { studentIdOrTsukubaEmailAddress = analysisStudentIdOrSAddress ""
                                    , password = password
                                    }
                                )
                            ]
                   )
            )
            [ Html.text "持っている" ]
        , Html.div
            ([ Html.Attributes.classList
                [ ( "form-select-item", leftSelect )
                , ( "form-select-itemSelect", not leftSelect )
                ]
             , Html.Attributes.style "border-radius" "0 .4rem .4rem 0"
             ]
                ++ (case userSignUpSAddressAndPassword of
                        StudentHasSAddress { password } ->
                            [ Html.Events.onClick
                                (NewStudent
                                    { emailAddress = [] |> Data.EmailAddress.fromCharList
                                    , imageDataUrl = Nothing
                                    , password = password
                                    }
                                )
                            ]

                        NewStudent _ ->
                            []
                   )
            )
            [ Html.text "持っていない" ]
        ]


studentHasSAddressFormList : AnalysisStudentIdOrSAddressResult -> Result Data.Password.Error Data.Password.Password -> List ( String, Html.Html Msg )
studentHasSAddressFormList analysisStudentIdOrEmailAddressResult password =
    [ ( "sAddressFrom"
      , Html.div
            []
            [ Html.label
                [ Html.Attributes.class "form-label"
                , Html.Attributes.for "signUpStudentIdOrTsukubaEmail"
                ]
                [ Html.text "学籍番号か ～@～.tsukuba.ac.jpのメールアドレス" ]
            , Html.input
                [ Html.Attributes.class "form-input"
                , Html.Attributes.id "signUpStudentIdOrTsukubaEmail"
                , Html.Attributes.attribute "autocomplete" "username"
                , Html.Events.onInput InputStudentIdOrEmailAddress
                ]
                []
            , Html.div
                [ Html.Attributes.class "form-description" ]
                [ Html.text
                    (case analysisStudentIdOrEmailAddressResult of
                        ANone ->
                            "学籍番号は20から始まる9桁の数字、筑波大学のメールアドレスはs1234567@s.tsukuba.ac.jpのような形のメールアドレス"

                        AStudentId studentId ->
                            "学籍番号 "
                                ++ Data.StudentId.toStringWith20 studentId
                                ++ " "
                                ++ (studentId
                                        |> Data.SAddress.fromStudentId
                                        |> Data.EmailAddress.fromSAddress
                                        |> Data.EmailAddress.toString
                                   )
                                ++ "にメールを送信します"

                        APartStudentId partStudentId ->
                            "学籍番号 "
                                ++ Data.StudentId.partStudentIdToStringWith20 partStudentId

                        ASAddress sAddress ->
                            "筑波大学のメールアドレス " ++ Data.SAddress.toEmailAddressString sAddress

                        AEmailButIsNotTsukuba ->
                            "筑波大学のメールアドレスではありません"
                    )
                ]
            ]
      )
    , ( "sAddressPassword", passwordForm password )
    ]


{-| 新規登録画面のsアドを持っているひとの入力の解析
-}
analysisStudentIdOrSAddress : String -> AnalysisStudentIdOrSAddressResult
analysisStudentIdOrSAddress string =
    let
        charList =
            String.toList (String.trim string)
    in
    case Data.StudentId.fromCharList charList of
        Just studentId ->
            AStudentId studentId

        Nothing ->
            case Data.StudentId.partStudentIdFromCharList charList of
                Just partStudentId ->
                    APartStudentId partStudentId

                Nothing ->
                    case Data.SAddress.fromCharList charList of
                        Just sAddress ->
                            ASAddress sAddress

                        Nothing ->
                            case Data.EmailAddress.fromCharList charList of
                                Just _ ->
                                    AEmailButIsNotTsukuba

                                Nothing ->
                                    ANone


type AnalysisStudentIdOrSAddressResult
    = ANone
    | AStudentId Data.StudentId.StudentId
    | ASAddress Data.SAddress.SAddress
    | APartStudentId Data.StudentId.PartStudentId
    | AEmailButIsNotTsukuba


analysisEmailAddress : String -> Maybe Data.EmailAddress.EmailAddress
analysisEmailAddress string =
    string
        |> String.trim
        |> String.toList
        |> Data.EmailAddress.fromCharList


newStudentForm : Maybe Data.EmailAddress.EmailAddress -> Maybe String -> Result Data.Password.Error Data.Password.Password -> List ( String, Html.Html Msg )
newStudentForm emailAddress imageUrlMaybe password =
    [ ( "addressForm"
      , Html.div
            []
            [ Html.label
                [ Html.Attributes.class "form-label"
                , Html.Attributes.for "signUpEmail"
                ]
                [ Html.text "登録用メールアドレス" ]
            , Html.input
                [ Html.Attributes.class "form-input"
                , Html.Attributes.type_ "email"
                , Html.Attributes.id "signUpEmail"
                , Html.Attributes.attribute "autocomplete" "email"
                , Html.Events.onInput InputStudentIdOrEmailAddress
                ]
                []
            , Html.div
                [ Html.Attributes.class "form-description" ]
                [ Html.text
                    (case emailAddress of
                        Just address ->
                            Data.EmailAddress.toString address
                                ++ "に登録メールを送信します"

                        Nothing ->
                            "メールアドレスを入力してください"
                    )
                ]
            ]
      )
    , ( "passwordEmail", passwordForm password )
    , ( "cardImage"
      , Html.div
            []
            [ Html.label
                [ Html.Attributes.class "form-label"
                , Html.Attributes.for "signUpImage"
                ]
                [ Html.text "学生証の写真" ]
            , Html.input
                [ Html.Attributes.type_ "file"
                , Html.Attributes.accept "image/png, image/jpeg"
                , Html.Attributes.class "form-input"
                , Html.Attributes.id "signUpImage"
                , Html.Attributes.attribute "autocomplete" "student-id-image"
                , Html.Events.on "change" (Json.Decode.succeed (CatchStudentImage "signUpImage"))
                ]
                []
            , Html.img
                ([ Html.Attributes.class "form-image"
                 ]
                    ++ (case imageUrlMaybe of
                            Just imageUrl ->
                                [ Html.Attributes.src imageUrl ]

                            Nothing ->
                                []
                       )
                )
                []
            ]
      )
    ]


{-| 新規登録のパスワード入力フォーム
-}
passwordForm : Result Data.Password.Error Data.Password.Password -> Html.Html Msg
passwordForm passwordResult =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.class "form-label"
            , Html.Attributes.for "password"
            ]
            [ Html.text "パスワード" ]
        , Html.input
            [ Html.Attributes.class "form-input"
            , Html.Attributes.id "password"
            , Html.Attributes.type_ "password"
            , Html.Attributes.minlength 9
            , Html.Attributes.maxlength 50
            , Html.Attributes.attribute "autocomplete" "new-password"
            , Html.Events.onInput InputPassword
            ]
            []
        , Html.div
            [ Html.Attributes.class "form-description" ]
            [ Html.text
                (case passwordResult of
                    Ok password ->
                        Data.Password.toString password

                    Err error ->
                        Data.Password.errorMessage error
                )
            ]
        ]


{-| アカウント画像フォーム
-}
imageForm : String -> List ( String, Html.Html Msg )
imageForm imageUrl =
    [ ( "imageForm"
      , Html.div
            []
            [ Html.img [ Html.Attributes.src imageUrl ] [] ]
      )
    ]


{-| 表示名フォーム
-}
nickNameForm : String -> List ( String, Html.Html Msg )
nickNameForm nickName =
    [ ( "nickNameForm"
      , Html.div
            []
            ([ Html.label
                [ Html.Attributes.class "form-label"
                , Html.Attributes.for "nickNameForm"
                ]
                [ Html.text "表示名" ]
             , Html.input
                [ Html.Attributes.class "form-input"
                , Html.Attributes.id "nickNameForm"
                , Html.Attributes.attribute "autocomplete" "nickname"
                , Html.Events.onInput InputNickName
                ]
                []
             ]
                ++ (if String.length nickName < 1 then
                        [ Html.text "表示名は 1文字以上である必要があります" ]

                    else if 50 < String.length nickName then
                        [ Html.text "表示名は 50文字以内である必要があります" ]

                    else
                        []
                   )
            )
      )
    ]


signUpSubmitButton : Maybe Api.SignUpRequest -> Html.Html Msg
signUpSubmitButton signUpRequestMaybe =
    Html.div
        []
        [ Html.button
            ([ Html.Attributes.classList [ ( "mainButton", True ), ( "mainButton-disabled", signUpRequestMaybe == Nothing ) ]
             , Html.Attributes.disabled (signUpRequestMaybe == Nothing)
             ]
                ++ (case signUpRequestMaybe of
                        Just signUpRequest ->
                            [ Html.Events.stopPropagationOn "click"
                                (Json.Decode.succeed ( SignUp signUpRequest, True ))
                            ]

                        Nothing ->
                            []
                   )
            )
            [ Html.text "新規登録" ]
        ]


{-| 画面の情報から新規登録できる情報を入力しているかと、新規登録に必要なデータを取りだす
-}
getSignUpRequest : SAddressAndPassword -> CompUniversity.Model -> String -> Maybe Api.SignUpRequest
getSignUpRequest sAddressAndPassword university nickName =
    case ( getSignUpRequestEmailAddressAndPasswordAndImage sAddressAndPassword, CompUniversity.getUniversity university ) of
        ( Just { emailAddress, password, image }, Just universityData ) ->
            if 1 <= String.length nickName && String.length nickName <= 50 then
                Just
                    { emailAddress = emailAddress
                    , pass = password
                    , image = image
                    , university = universityData
                    , nickName = nickName
                    }

            else
                Nothing

        ( _, _ ) ->
            Nothing


getSignUpRequestEmailAddressAndPasswordAndImage : SAddressAndPassword -> Maybe { emailAddress : Data.EmailAddress.EmailAddress, password : Data.Password.Password, image : Maybe String }
getSignUpRequestEmailAddressAndPasswordAndImage sAddressAndPassword =
    case sAddressAndPassword of
        StudentHasSAddress { studentIdOrTsukubaEmailAddress, password } ->
            case ( studentIdOrTsukubaEmailAddress, password ) of
                ( AStudentId studentId, Ok pass ) ->
                    Just
                        { emailAddress = Data.EmailAddress.fromSAddress (Data.SAddress.fromStudentId studentId)
                        , password = pass
                        , image = Nothing
                        }

                ( ASAddress sAddress, Ok pass ) ->
                    Just
                        { emailAddress = Data.EmailAddress.fromSAddress sAddress
                        , password = pass
                        , image = Nothing
                        }

                _ ->
                    Nothing

        NewStudent { emailAddress, password, imageDataUrl } ->
            case ( emailAddress, password, imageDataUrl ) of
                ( Just address, Ok pass, Just image ) ->
                    Just
                        { emailAddress = address
                        , password = pass
                        , image = Just image
                        }

                ( _, _, _ ) ->
                    Nothing


{-| 新規登録のボタンを押した後の画面
-}
sentSingUpDataView : Api.LogInRequest -> Maybe (Result Api.SignUpResponseError Api.SignUpResponseOk) -> Html.Html Msg
sentSingUpDataView logInRequest signUpResultMaybe =
    case signUpResultMaybe of
        Just signUpResult ->
            signUpResultToString logInRequest signUpResult

        Nothing ->
            Html.div [] [ Html.text "新規登録の情報を送信中" ]


signUpResultToString : Api.LogInRequest -> Result Api.SignUpResponseError Api.SignUpResponseOk -> Html.Html Msg
signUpResultToString logInRequest signUpResult =
    case signUpResult of
        Ok (Api.SignUpResponseOk token) ->
            Html.div [ Html.Attributes.class "form" ]
                [ Html.text
                    ("送信完了。"
                        ++ Data.EmailAddress.toString logInRequest.emailAddress
                        ++ "にメールを送信しました。届いたメールのリンクをクリックして認証をしてください(いまはまだ、メールを送信していない。下のボタンで認証)"
                    )
                , Html.div
                    [ Html.Events.onClick (SendConfirmToken logInRequest token)
                    , Html.Attributes.style "border" "solid 2px black"
                    , Html.Attributes.style "padding" "4px"
                    ]
                    [ Html.text "confirm_tokenを送信" ]
                ]

        Err Api.SignUpErrorAlreadySignUp ->
            Html.div [] [ Html.text "すでにあなたは登録されています" ]

        Err Api.SignUpErrorBadUrl ->
            Html.div [] [ Html.text "正しいURLが指定されなかった" ]

        Err Api.SignUpErrorTimeout ->
            Html.div [] [ Html.text "タイムアウトエラー。回線が混雑しています" ]

        Err Api.SignUpErrorNetworkError ->
            Html.div [] [ Html.text "ネットワークエラー。接続が切れている可能性があります" ]

        Err Api.SignUpInvalidData ->
            Html.div [] [ Html.text "不正なリクエストをした疑いがあります" ]

        Err Api.SignUpError ->
            Html.div [] [ Html.text "サーバーの回答を理解することができませんでした" ]


sentConfirmTokenView : Maybe Api.SignUpConfirmResponseError -> Html.Html Msg
sentConfirmTokenView signUpResponseErrorMaybe =
    Html.text
        (case signUpResponseErrorMaybe of
            Just Api.SignUpConfirmResponseErrorAlreadyConfirmed ->
                "すでにこの認証トークンは送られています"

            Just Api.SignUpConfirmResponseError ->
                "認証トークン送信に予期せぬエラーが発生しました"

            Nothing ->
                "認証トークン送信中……"
        )
