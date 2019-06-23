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
import BasicParts


type Model
    = Normal
        { sAddressOrStudentId : AnalysisStudentIdOrSAddressResult
        , image : Image
        , university : CompUniversity.Model
        , nickName : String
        , sendEmailToken : String
        }
    | Sending { emailAddress : Data.EmailAddress.EmailAddress }
    | Sent { emailAddress : Data.EmailAddress.EmailAddress }


type Image
    = ServiceImage String
    | CustomizeImage String


{-| ここから発生するイベント
-}
type Emit
    = EmitAddEventListenerForUserImage { labelId : String, inputId : String }
    | EmitSignUp Api.SignUpRequest
    | EmitByUniversityComp CompUniversity.Emit
    | EmitReplaceText { id : String, text : String }
    | EmitAddLogMessage String


type Msg
    = InputStudentIdOrEmailAddress String
    | ReceiveUserImage String
    | InputSAddress AnalysisStudentIdOrSAddressResult
    | InputUniversity CompUniversity.Model
    | InputDisplayName String
    | SignUp Api.SignUpRequest
    | SignUpResponse (Result String ())


{-| すべて空白の新規登録画面を表示するためのModel
-}
initModel : { name : String, imageUrl : String, sendEmailToken : String } -> ( Model, List Emit )
initModel { name, imageUrl, sendEmailToken } =
    ( Normal
        { sAddressOrStudentId = analysisStudentIdOrSAddress ""
        , university = CompUniversity.initSelect
        , nickName = name
        , image = ServiceImage imageUrl
        , sendEmailToken = sendEmailToken
        }
    , [ EmitAddEventListenerForUserImage { labelId = imageLabelId, inputId = imageInputId }
      , EmitReplaceText
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
                    Normal { rec | sAddressOrStudentId = analysisStudentIdOrSAddress string }

                _ ->
                    model
            , []
            )

        ReceiveUserImage dataUrl ->
            ( case ( model, dataUrl ) of
                ( Normal rec, imageDataUrl ) ->
                    Normal { rec | image = CustomizeImage imageDataUrl }

                _ ->
                    model
            , []
            )

        InputSAddress sAddressOrStudentId ->
            ( case model of
                Normal rec ->
                    Normal { rec | sAddressOrStudentId = sAddressOrStudentId }

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
            , CompUniversity.emit universitySelect |> List.map EmitByUniversityComp
            )

        InputDisplayName string ->
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
            ( Sending
                { emailAddress = signUpRequest.emailAddress }
            , [ EmitSignUp signUpRequest ]
            )

        SignUpResponse result ->
            case ( model, result ) of
                ( Sending { emailAddress }, Ok () ) ->
                    ( Sent
                        { emailAddress = emailAddress }
                    , []
                    )

                ( _, Err string ) ->
                    ( model
                    , [ EmitAddLogMessage string ]
                    )

                ( _, _ ) ->
                    ( model
                    , []
                    )



{- =====================================================
                       View 表示
   =====================================================
-}


{-| 新規登録画面の表示
-}
view : Model -> { title : Maybe String, tab : BasicParts.Tab Msg, html : List (Html.Html Msg) }
view userSignUpPage =
    let
        ( tabText, mainView ) =
            case userSignUpPage of
                Normal { sAddressOrStudentId, university, nickName, image, sendEmailToken } ->
                    ( "新規登録", normalView sAddressOrStudentId university nickName image sendEmailToken )

                Sending { emailAddress } ->
                    ( "新規登録データを送信中", sendingSignUpDataView emailAddress )

                Sent { emailAddress } ->
                    ( "認証メールの送信をしました", sentSingUpDataView emailAddress )
    in
    { title = Just "新規登録"
    , tab = BasicParts.tabSingle tabText
    , html =
        [ Html.div
            [ Html.Attributes.class "container" ]
            [ mainView ]
        ]
    }


normalView : AnalysisStudentIdOrSAddressResult -> CompUniversity.Model -> String -> Image -> String -> Html.Html Msg
normalView studentIdOrTsukubaEmailAddress university nickName image sendEmailToken =
    Html.Keyed.node "div"
        [ Html.Attributes.class "form" ]
        (studentHasSAddressFormList studentIdOrTsukubaEmailAddress
            ++ imageForm image
            ++ displayNameForm nickName
            ++ (CompUniversity.view university
                    |> List.map (Tuple.mapSecond (Html.map InputUniversity))
               )
            ++ [ ( "submit"
                 , signUpSubmitButton
                    (getSendEmailRequest studentIdOrTsukubaEmailAddress university nickName image sendEmailToken)
                 )
               ]
        )


studentHasSAddressFormList : AnalysisStudentIdOrSAddressResult -> List ( String, Html.Html Msg )
studentHasSAddressFormList analysisStudentIdOrEmailAddressResult =
    [ ( "sAddressFrom"
      , Html.div
            []
            ([ Html.label
                [ Html.Attributes.class "form-label"
                , Html.Attributes.for "signUpStudentIdOrTsukubaEmail"
                ]
                [ Html.text "学籍番号" ]
             , Html.input
                [ Html.Attributes.class "form-input"
                , Html.Attributes.id "signUpStudentIdOrTsukubaEmail"
                , Html.Attributes.attribute "autocomplete" "username"
                , Html.Events.onInput InputStudentIdOrEmailAddress
                ]
                []
             ]
                ++ (case analysisStudentIdOrEmailAddressResult of
                        ANone ->
                            [ Html.div
                                []
                                [ Html.text "学籍番号は20から始まる9桁の数字、筑波大学のメールアドレスはs1234567@s.tsukuba.ac.jpのような形のメールアドレス" ]
                            ]

                        AStudentId studentId ->
                            [ Html.div
                                []
                                [ Html.text ("学籍番号 " ++ Data.StudentId.toStringWith20 studentId) ]
                            , Html.div
                                []
                                [ Html.text
                                    ((studentId
                                        |> Data.SAddress.fromStudentId
                                        |> Data.EmailAddress.fromSAddress
                                        |> Data.EmailAddress.toString
                                     )
                                        ++ "にメールを送信します"
                                    )
                                ]
                            ]

                        APartStudentId partStudentId ->
                            [ Html.div
                                []
                                [ Html.text
                                    ("学籍番号 "
                                        ++ Data.StudentId.partStudentIdToStringWith20 partStudentId
                                    )
                                ]
                            ]

                        ASAddress sAddress ->
                            [ Html.div
                                []
                                [ Html.text ("筑波大学のメールアドレス " ++ Data.SAddress.toEmailAddressString sAddress) ]
                            ]

                        AEmailButIsNotTsukuba _ ->
                            [ Html.div
                                []
                                [ Html.text "筑波大学のメールアドレスではありません" ]
                            ]
                   )
            )
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
                                Just emailAddress ->
                                    AEmailButIsNotTsukuba emailAddress

                                Nothing ->
                                    ANone


type AnalysisStudentIdOrSAddressResult
    = ANone
    | AStudentId Data.StudentId.StudentId
    | ASAddress Data.SAddress.SAddress
    | APartStudentId Data.StudentId.PartStudentId
    | AEmailButIsNotTsukuba Data.EmailAddress.EmailAddress


{-| アカウント画像フォーム
-}
imageForm : Image -> List ( String, Html.Html Msg )
imageForm image =
    [ ( "imageForm"
      , Html.div
            []
            [ Html.label
                [ Html.Attributes.class "exhibition-photo-add"
                , Html.Attributes.id imageLabelId
                , Html.Attributes.for imageInputId
                ]
                [ Html.img
                    [ Html.Attributes.style "width" "50%"
                    , Html.Attributes.style "border-radius" "50%"
                    , Html.Attributes.src
                        (case image of
                            ServiceImage url ->
                                url

                            CustomizeImage dataUrl ->
                                dataUrl
                        )
                    ]
                    []
                ]
            , Html.input
                [ Html.Attributes.style "display" "none"
                , Html.Attributes.id imageInputId
                , Html.Attributes.type_ "file"
                , Html.Attributes.multiple True
                , Html.Attributes.accept "image/*"
                ]
                []
            ]
      )
    ]


imageInputId : String
imageInputId =
    "image-input"


imageLabelId : String
imageLabelId =
    "image-label"


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
                , Html.Events.onInput InputDisplayName
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
        ((case signUpRequestMaybe of
            Just signUpRequest ->
                [ Html.text
                    (Data.EmailAddress.toString signUpRequest.emailAddress
                        ++ "に認証メールを送信します"
                    )
                ]

            Nothing ->
                []
         )
            ++ [ Html.button
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
        )


{-| 画面の情報から新規登録できる情報を入力しているかと、新規登録に必要なデータを取りだす
-}
getSendEmailRequest : AnalysisStudentIdOrSAddressResult -> CompUniversity.Model -> String -> Image -> String -> Maybe Api.SignUpRequest
getSendEmailRequest studentIdOrSAddress university nickName image sendEmailToken =
    case ( analysisStudentIdOrSAddressResultToEmailAddress studentIdOrSAddress, CompUniversity.getUniversity university ) of
        ( Just emailAddress, Just universityData ) ->
            if 1 <= String.length nickName && String.length nickName <= 50 then
                Just
                    { sendEmailToken = sendEmailToken
                    , emailAddress = emailAddress
                    , image =
                        case image of
                            ServiceImage _ ->
                                Nothing

                            CustomizeImage dataUrl ->
                                Just dataUrl
                    , university = universityData
                    , displayName = nickName
                    }

            else
                Nothing

        ( _, _ ) ->
            Nothing


analysisStudentIdOrSAddressResultToEmailAddress : AnalysisStudentIdOrSAddressResult -> Maybe Data.EmailAddress.EmailAddress
analysisStudentIdOrSAddressResultToEmailAddress sAddressOrStudentId =
    case sAddressOrStudentId of
        AStudentId studentId ->
            Just (Data.EmailAddress.fromSAddress (Data.SAddress.fromStudentId studentId))

        ASAddress sAddress ->
            Just (Data.EmailAddress.fromSAddress sAddress)

        ANone ->
            Nothing

        APartStudentId _ ->
            Nothing

        AEmailButIsNotTsukuba emailAddress ->
            Just emailAddress


{-| 新規登録のボタンを押した後の画面
-}
sendingSignUpDataView : Data.EmailAddress.EmailAddress -> Html.Html Msg
sendingSignUpDataView emailAddress =
    Html.div
        []
        [ Html.text
            (Data.EmailAddress.toString emailAddress ++ "に認証メールの送信をしました")
        ]


{-| 認証メールを送れたときの画面
-}
sentSingUpDataView : Data.EmailAddress.EmailAddress -> Html.Html Msg
sentSingUpDataView emailAddress =
    Html.div
        []
        [ Html.text
            (Data.EmailAddress.toString emailAddress ++ "に認証メールの送信をしました")
        ]
