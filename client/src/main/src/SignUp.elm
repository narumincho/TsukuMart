port module SignUp exposing (main)

import BasicParts
import Browser
import Css
import Data.ImageId
import Html
import Html.Attributes
import Html.Events
import Html.Keyed
import Html.Styled
import Html.Styled.Attributes
import Html.Styled.Keyed
import Json.Decode
import Page.Component.University as University
import Page.Style


port load : String -> Cmd msg


port setTextAreaValue : { id : String, text : String } -> Cmd msg


port imageInput : (String -> msg) -> Sub msg


type Model
    = Model
        { image : Image
        , university : University.Model
        , sendEmailToken : String
        , name : String
        }


type Image
    = ServiceImage Data.ImageId.ImageId
    | CustomizeImage String


type Msg
    = InputImage String
    | InputName String
    | MsgByUniversity University.Msg
    | Submit


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
    ( Model
        { image = ServiceImage (Data.ImageId.fromString imageId)
        , name = name
        , sendEmailToken = sendEmailToken
        , university = universityModel
        }
    , Cmd.batch [ load imageInputId, setTextAreaValue { id = nameInputId, text = name } ]
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg (Model rec) =
    case msg of
        InputImage imageDataUrl ->
            ( Model
                { rec | image = CustomizeImage imageDataUrl }
            , Cmd.none
            )

        InputName name ->
            ( Model
                { rec | name = name }
            , Cmd.none
            )

        MsgByUniversity universityMsg ->
            ( Model
                { rec | university = rec.university |> University.update universityMsg |> Tuple.first }
            , Cmd.none
            )

        Submit ->
            ( Model rec
            , Cmd.none
            )


view : Model -> Html.Html Msg
view (Model { image, university }) =
    Html.div
        [ Html.Attributes.id "app" ]
        [ BasicParts.headerWithoutBackArrow
        , Html.Styled.Keyed.node "form"
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
             , ( "studentIdView", studentIdView )
             , ( "imageView", imageView image )
             , ( "nameView", nameView )
             ]
                ++ (University.view university
                        |> List.map (Tuple.mapSecond (Html.Styled.map MsgByUniversity))
                   )
                ++ [ ( "submitButton", submitButtonView ) ]
            )
            |> Html.Styled.toUnstyled
        ]


studentIdView : Html.Styled.Html Msg
studentIdView =
    Page.Style.formItem "学籍番号"
        studentInputId
        (inputTextHtml
            [ Html.Attributes.id studentInputId
            , Html.Attributes.type_ "text"
            , Html.Attributes.required True
            ]
        )


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


nameView : Html.Styled.Html Msg
nameView =
    Page.Style.formItem "名前"
        studentInputId
        (inputTextHtml
            [ Html.Attributes.id nameInputId
            , Html.Attributes.type_ "text"
            , Html.Attributes.required True
            , Html.Events.onInput InputName
            ]
        )


nameInputId : String
nameInputId =
    "nameInput"


submitButtonView : Html.Styled.Html Msg
submitButtonView =
    Html.button
        [ Html.Events.custom
            "click"
            (Json.Decode.succeed
                { message = Submit
                , stopPropagation = True
                , preventDefault = True
                }
            )
        ]
        [ Html.text "新規登録する" ]
        |> Html.Styled.fromUnstyled


inputTextHtml : List (Html.Attribute Msg) -> Html.Html Msg
inputTextHtml attributes =
    Html.input
        ([ Html.Attributes.style "font-size" "1.2rem"
         , Html.Attributes.style "padding" ".4rem"
         , Html.Attributes.style "width" "100%"
         , Html.Attributes.style "border" "solid 1px #ccc"
         , Html.Attributes.style "box-sizing" "border-box"
         , Html.Attributes.style "border-radius" ".4rem"
         , Html.Attributes.style "box-shadow" "inset 0 1px 1px rgba(0, 0, 0, .075)"
         , Html.Attributes.style "transition" "border-color ease-in-out .15s, box-shadow ease-in-out .15s"
         , Html.Attributes.style "outline" "0"
         ]
            ++ attributes
        )
        []


subscription : Sub Msg
subscription =
    imageInput InputImage


imageInputId : String
imageInputId =
    "imageId"
