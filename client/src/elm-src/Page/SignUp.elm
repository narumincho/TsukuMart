module Page.SignUp exposing
    ( Emit(..)
    , Model
    , Msg(..)
    , initModel
    , update
    , view
    )

{-| Sign Up 新規登録画面
-}

import Api
import Data.EmailAddress
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
        { sAddressAndPassword : AnalysisStudentIdOrSAddressResult
        , imageUrl : String
        , university : CompUniversity.Model
        , nickName : String
        }
    | SentSingUpData


{-| ここから発生するイベント
-}
type Emit
    = EmitAccountImage String
    | EmitSignUp Api.SignUpRequest
    | EmitUniversity CompUniversity.Emit
    | EmitReplaceText { id : String, text : String }


type Msg
    = InputStudentIdOrEmailAddress String
    | CatchStudentImage String
    | ReceiveImageDataUrl String
    | InputSAddress AnalysisStudentIdOrSAddressResult
    | InputUniversity CompUniversity.Model
    | InputNickName String
    | SignUp Api.SignUpRequest


{-| すべて空白の新規登録画面を表示するためのModel
-}
initModel : String -> String -> ( Model, List Emit )
initModel name imageUrl =
    ( Normal
        { sAddressAndPassword = analysisStudentIdOrSAddress ""
        , university = CompUniversity.initSelect
        , nickName = name
        , imageUrl = imageUrl
        }
    , [ EmitReplaceText
            { id = displayNameFormId
            , text = name
            }
      ]
    )


update : Msg -> Model -> ( Model, List Emit )
update msg model =
    case msg of
        InputStudentIdOrEmailAddress string ->
            ( case model of
                Normal rec ->
                    Normal { rec | sAddressAndPassword = analysisStudentIdOrSAddress string }

                _ ->
                    model
            , []
            )

        CatchStudentImage idString ->
            ( model
            , [ EmitAccountImage idString ]
            )

        ReceiveImageDataUrl dataUrl ->
            ( case model of
                Normal rec ->
                    Normal { rec | imageUrl = dataUrl }

                _ ->
                    model
            , []
            )

        InputSAddress sAddressAndPassword ->
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
            ( SentSingUpData
            , [ EmitSignUp signUpRequest ]
            )



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

                SentSingUpData ->
                    ( "認証メールの送信をしました", sentSingUpDataView )
    in
    ( "新規登録"
    , Tab.single tabText
    , [ Html.div
            [ Html.Attributes.class "container" ]
            [ mainView ]
      ]
    )


normalView : AnalysisStudentIdOrSAddressResult -> CompUniversity.Model -> String -> String -> Html.Html Msg
normalView studentIdOrTsukubaEmailAddress university nickName imageUrl =
    Html.Keyed.node "form"
        [ Html.Attributes.class "form" ]
        (studentHasSAddressFormList studentIdOrTsukubaEmailAddress
            ++ imageForm imageUrl
            ++ displayNameForm nickName
            ++ (CompUniversity.view university
                    |> List.map (Tuple.mapSecond (Html.map InputUniversity))
               )
            ++ [ ( "submit", signUpSubmitButton (getSendEmailRequest studentIdOrTsukubaEmailAddress university nickName imageUrl) ) ]
        )


studentHasSAddressFormList : AnalysisStudentIdOrSAddressResult -> List ( String, Html.Html Msg )
studentHasSAddressFormList analysisStudentIdOrEmailAddressResult =
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
displayNameForm : String -> List ( String, Html.Html Msg )
displayNameForm nickName =
    [ ( "nickNameForm"
      , Html.div
            []
            ([ Html.label
                [ Html.Attributes.class "form-label"
                , Html.Attributes.for displayNameFormId
                ]
                [ Html.text "表示名" ]
             , Html.input
                [ Html.Attributes.class "form-input"
                , Html.Attributes.id displayNameFormId
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


displayNameFormId : String
displayNameFormId =
    "displayNameForm"


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
getSendEmailRequest : AnalysisStudentIdOrSAddressResult -> CompUniversity.Model -> String -> String -> Maybe Api.SignUpRequest
getSendEmailRequest studentIdOrSAddress university nickName imageUrl =
    case ( analysisStudentIdOrSAddressResultToEmailAddress studentIdOrSAddress, CompUniversity.getUniversity university ) of
        ( Just emailAddress, Just universityData ) ->
            if 1 <= String.length nickName && String.length nickName <= 50 then
                Just
                    { emailAddress = emailAddress
                    , image =
                        if isDataUrl imageUrl then
                            Just imageUrl

                        else
                            Nothing
                    , university = universityData
                    , nickName = nickName
                    }

            else
                Nothing

        ( _, _ ) ->
            Nothing


analysisStudentIdOrSAddressResultToEmailAddress : AnalysisStudentIdOrSAddressResult -> Maybe Data.EmailAddress.EmailAddress
analysisStudentIdOrSAddressResultToEmailAddress sAddressAndPassword =
    case sAddressAndPassword of
        AStudentId studentId ->
            Just (Data.EmailAddress.fromSAddress (Data.SAddress.fromStudentId studentId))

        ASAddress sAddress ->
            Just (Data.EmailAddress.fromSAddress sAddress)

        ANone ->
            Nothing

        APartStudentId _ ->
            Nothing

        AEmailButIsNotTsukuba ->
            Nothing


isDataUrl : String -> Bool
isDataUrl =
    String.startsWith "data:"


{-| 新規登録のボタンを押した後の画面
-}
sentSingUpDataView : Html.Html Msg
sentSingUpDataView =
    Html.div [] [ Html.text "認証メールの送信をしました" ]
