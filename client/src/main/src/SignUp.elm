port module SignUp exposing (main)

import Api
import BasicParts
import Browser
import Css
import Data.EmailAddress
import Data.ImageId
import Data.SAddress
import Data.StudentId
import Html
import Html.Attributes
import Html.Styled
import Html.Styled.Attributes
import Html.Styled.Events
import Html.Styled.Keyed
import Icon
import Page.Component.University as University
import Page.Style


port load :
    { imageInputElementId : String
    , imageUrl : String
    , nameElementId : String
    , name : String
    }
    -> Cmd msg


port imageInput : (String -> msg) -> Sub msg


port sendConfirmEmail : String -> Cmd msg


port sentConfirmEmail : (() -> msg) -> Sub msg


port alert : String -> Cmd msg


type Model
    = Normal
        { sAddressOrStudentId : AnalysisStudentIdOrSAddressResult
        , image : Image
        , university : University.Model
        , sendEmailToken : String
        , name : String
        }
    | SendingUserData Data.EmailAddress.EmailAddress
    | SendingConfirmEmail
        { emailAddress : Data.EmailAddress.EmailAddress
        , token : String
        }
    | Sent
        { emailAddress : Data.EmailAddress.EmailAddress
        , token : String
        }


type AnalysisStudentIdOrSAddressResult
    = ANone
    | AStudentId Data.StudentId.StudentId
    | ASAddress Data.SAddress.SAddress
    | APartStudentId Data.StudentId.PartStudentId
    | AEmailButIsNotTsukuba Data.EmailAddress.EmailAddress


type Image
    = ServiceImage Data.ImageId.ImageId
    | CustomizeImage String


type Msg
    = InputStudentId String
    | InputImage String
    | InputName String
    | MsgByUniversity University.Msg
    | Submit Api.SignUpRequest
    | Resend
    | SendingUserDataResponse (Result String String)
    | SendingConfirmEmailResponse


main : Program { sendEmailToken : String, imageId : String, name : String } Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = always subscription
        }


init : { sendEmailToken : String, imageId : String, name : String } -> ( Model, Cmd Msg )
init { sendEmailToken, imageId, name } =
    let
        ( universityModel, universityEmission ) =
            University.initModelNone
    in
    ( Normal
        { sAddressOrStudentId = ANone
        , image = ServiceImage (Data.ImageId.fromString imageId)
        , name = name
        , sendEmailToken = sendEmailToken
        , university = universityModel
        }
    , load
        { imageInputElementId = imageInputId
        , imageUrl = Data.ImageId.toUrlString (Data.ImageId.fromString imageId)
        , nameElementId = nameInputId
        , name = name
        }
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model ) of
        ( InputStudentId studentId, Normal rec ) ->
            ( Normal
                { rec
                    | sAddressOrStudentId = analysisStudentIdOrSAddress studentId
                }
            , Cmd.none
            )

        ( InputImage imageDataUrl, Normal rec ) ->
            ( Normal
                { rec | image = CustomizeImage imageDataUrl }
            , Cmd.none
            )

        ( InputName name, Normal rec ) ->
            ( Normal
                { rec | name = name }
            , Cmd.none
            )

        ( MsgByUniversity universityMsg, Normal rec ) ->
            ( Normal
                { rec | university = rec.university |> University.update universityMsg |> Tuple.first }
            , Cmd.none
            )

        ( Submit requestData, Normal rec ) ->
            ( SendingUserData requestData.emailAddress
            , Api.registerSignUpData
                rec.sendEmailToken
                requestData
                SendingUserDataResponse
            )

        ( SendingUserDataResponse result, SendingUserData emailAddress ) ->
            case result of
                Ok customToken ->
                    ( SendingConfirmEmail
                        { emailAddress = emailAddress
                        , token = customToken
                        }
                    , sendConfirmEmail customToken
                    )

                Err errorMessage ->
                    ( model
                    , alert errorMessage
                    )

        ( SendingConfirmEmailResponse, SendingConfirmEmail rec ) ->
            ( Sent rec
            , Cmd.none
            )

        ( Resend, SendingConfirmEmail { token } ) ->
            ( model
            , sendConfirmEmail token
            )

        ( Resend, Sent { token } ) ->
            ( model
            , sendConfirmEmail token
            )

        _ ->
            ( model
            , Cmd.none
            )


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


getSendEmailRequest :
    { a
        | sAddressOrStudentId : AnalysisStudentIdOrSAddressResult
        , image : Image
        , university : University.Model
        , name : String
    }
    -> Maybe Api.SignUpRequest
getSendEmailRequest { sAddressOrStudentId, image, university, name } =
    case ( analysisStudentIdOrSAddressResultToEmailAddress sAddressOrStudentId, University.getUniversity university ) of
        ( Just emailAddress, Just universityData ) ->
            if 1 <= String.length name && String.length name <= 50 then
                Just
                    { emailAddress = emailAddress
                    , image =
                        case image of
                            ServiceImage _ ->
                                Nothing

                            CustomizeImage dataUrl ->
                                Just dataUrl
                    , university = universityData
                    , displayName = name
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


view : Model -> Html.Html Msg
view model =
    Html.div
        [ Html.Attributes.id "app" ]
        [ BasicParts.headerWithoutBackArrow
        , (case model of
            Normal rec ->
                normalView rec

            SendingUserData emailAddress ->
                sendingUserDataView emailAddress

            SendingConfirmEmail { emailAddress } ->
                sendingConfirmEmailView emailAddress

            Sent { emailAddress } ->
                sentView emailAddress
          )
            |> Html.Styled.toUnstyled
        ]


normalView :
    { a
        | sAddressOrStudentId : AnalysisStudentIdOrSAddressResult
        , image : Image
        , university : University.Model
        , name : String
    }
    -> Html.Styled.Html Msg
normalView data =
    let
        requestDataMaybe =
            getSendEmailRequest
                data
    in
    Html.Styled.Keyed.node "form"
        [ Html.Styled.Attributes.css
            [ Css.padding4 (Css.px 64) (Css.px 8) (Css.px 8) (Css.px 8)
            , Css.width (Css.pct 100)
            , Css.maxWidth (Css.px 512)
            , Page.Style.displayGridAndGap 16
            ]
        ]
        ([ ( "title"
           , Html.Styled.h1
                []
                [ Html.Styled.text "新規登録!" ]
           )
         , ( "studentIdView", studentIdView data.sAddressOrStudentId )
         , ( "imageView", imageView data.image )
         , ( "nameView", nameView data.name )
         ]
            ++ (University.view data.university
                    |> List.map (Tuple.mapSecond (Html.Styled.map MsgByUniversity))
               )
            ++ [ ( "submitLabel"
                 , submitEmailLabel requestDataMaybe
                 )
               , ( "submitButton"
                 , submitButtonView requestDataMaybe
                 )
               ]
        )


studentIdView : AnalysisStudentIdOrSAddressResult -> Html.Styled.Html Msg
studentIdView analysisStudentIdOrEmailAddressResult =
    Page.Style.formItem "学籍番号"
        studentInputId
        [ Page.Style.inputText
            { id = studentInputId
            , type_ = "text"
            , required = True
            , autoComplete = "studentId"
            }
        , Html.Styled.div
            []
            [ Html.Styled.text
                (case analysisStudentIdOrEmailAddressResult of
                    ANone ->
                        "学籍番号は20から始まる9桁の数字、筑波大学のメールアドレスはs1234567@s.tsukuba.ac.jpのような形のメールアドレス"

                    AStudentId studentId ->
                        "学籍番号 " ++ Data.StudentId.toStringWith20 studentId

                    APartStudentId partStudentId ->
                        "学籍番号 "
                            ++ Data.StudentId.partStudentIdToStringWith20 partStudentId

                    ASAddress sAddress ->
                        "筑波大学のメールアドレス " ++ Data.SAddress.toEmailAddressString sAddress

                    AEmailButIsNotTsukuba _ ->
                        "筑波大学のメールアドレスではありません"
                )
            ]
        ]
        |> Html.Styled.map InputStudentId


studentInputId : String
studentInputId =
    "studentInput"


imageView : Image -> Html.Styled.Html Msg
imageView image =
    Html.Styled.div
        []
        [ Html.Styled.label
            [ Html.Styled.Attributes.for imageInputId ]
            [ Html.Styled.img
                [ Html.Styled.Attributes.src
                    (case image of
                        ServiceImage imageId ->
                            Data.ImageId.toUrlString imageId

                        CustomizeImage dataUrl ->
                            dataUrl
                    )
                , Html.Styled.Attributes.css
                    [ Css.maxWidth (Css.px 128)
                    , Css.maxHeight (Css.px 128)
                    , Css.borderRadius (Css.pct 50)
                    ]
                ]
                []
            ]
        , Html.Styled.input
            [ Html.Styled.Attributes.id imageInputId
            , Html.Styled.Attributes.type_ "file"
            , Html.Styled.Attributes.accept "image/*"
            ]
            []
        ]


nameView : String -> Html.Styled.Html Msg
nameView name =
    Page.Style.formItem "名前"
        studentInputId
        ([ Page.Style.inputText
            { id = nameInputId
            , type_ = "text"
            , autoComplete = "nickname"
            , required = True
            }
         ]
            ++ (if String.length name < 1 then
                    [ Html.Styled.text "表示名は 1文字以上である必要があります" ]

                else if 50 < String.length name then
                    [ Html.Styled.text "表示名は 50文字以内である必要があります" ]

                else
                    []
               )
        )
        |> Html.Styled.map InputName


nameInputId : String
nameInputId =
    "nameInput"


submitEmailLabel : Maybe Api.SignUpRequest -> Html.Styled.Html msg
submitEmailLabel signUpRequestMaybe =
    Html.Styled.div
        []
        [ Html.Styled.text
            (case signUpRequestMaybe of
                Just signUpRequest ->
                    Data.EmailAddress.toString signUpRequest.emailAddress
                        ++ "に認証メールを送信する"

                Nothing ->
                    "まだ、入力していないものがある"
            )
        ]


submitButtonView : Maybe Api.SignUpRequest -> Html.Styled.Html Msg
submitButtonView signUpRequestMaybe =
    Page.Style.mainButton
        [ Html.Styled.text "新規登録する" ]
        (signUpRequestMaybe |> Maybe.map Submit)


subscription : Sub Msg
subscription =
    Sub.batch
        [ imageInput InputImage
        , sentConfirmEmail (always SendingConfirmEmailResponse)
        ]


imageInputId : String
imageInputId =
    "imageId"


sendingUserDataView : Data.EmailAddress.EmailAddress -> Html.Styled.Html msg
sendingUserDataView emailAddress =
    Html.Styled.div
        [ Html.Styled.Attributes.css [ loadingStyle ] ]
        [ Html.Styled.text "新規登録データを送信中"
        , Icon.loading { size = 64, color = Css.rgb 0 0 0 }
        ]


sendingConfirmEmailView : Data.EmailAddress.EmailAddress -> Html.Styled.Html Msg
sendingConfirmEmailView emailAddress =
    Html.Styled.div
        [ Html.Styled.Attributes.css [ loadingStyle ] ]
        [ Html.Styled.text (Data.EmailAddress.toString emailAddress ++ "に認証メールを送信中…")
        , resendButton
        , Icon.loading { size = 64, color = Css.rgb 0 0 0 }
        ]


sentView : Data.EmailAddress.EmailAddress -> Html.Styled.Html Msg
sentView emailAddress =
    Html.Styled.div
        [ Html.Styled.Attributes.css [ loadingStyle ] ]
        [ Html.Styled.text (Data.EmailAddress.toString emailAddress ++ "に認証メールを送信しました")
        , resendButton
        ]


resendButton : Html.Styled.Html Msg
resendButton =
    Html.Styled.button
        [ Html.Styled.Events.onClick Resend ]
        [ Html.Styled.text "再送" ]


loadingStyle : Css.Style
loadingStyle =
    [ Css.padding4 (Css.px 128) (Css.px 8) (Css.px 8) (Css.px 8)
    , Css.width (Css.pct 100)
    , Css.maxWidth (Css.px 512)
    , Page.Style.displayGridAndGap 16
    , Css.fontSize (Css.rem 1.5)
    ]
        |> Css.batch
