port module SignUp exposing (main)

import BasicParts
import Browser
import Data.ImageId
import Html
import Html.Attributes
import Page.Style


port imageInput : (String -> msg) -> Sub msg


port load : String -> Cmd msg


type Model
    = Model Image


type Image
    = ServiceImage Data.ImageId.ImageId
    | CustomizeImage String


type Msg
    = InputImage String


main : Program String Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = always subscription
        }


init : String -> ( Model, Cmd Msg )
init urlFragment =
    ( Model (ServiceImage (Data.ImageId.fromString ""))
    , load imageInputId
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg _ =
    case msg of
        InputImage imageDataUrl ->
            ( Model (CustomizeImage imageDataUrl)
            , Cmd.none
            )


view : Model -> Html.Html Msg
view model =
    Html.div []
        [ BasicParts.headerWithoutBackArrow
        , Html.form
            [ Html.Attributes.style "padding" "64px 8px 8px 8px"
            , Html.Attributes.style "width" "100%"
            , Html.Attributes.style "max-width" "512px"
            , Html.Attributes.style "display" "grid"
            , Html.Attributes.style "gap" "16px"
            ]
            []
        , Html.h1
            []
            [ Html.text "新規登録!" ]
        , Page.Style.formItem "学籍番号"
            studentInputId
            (inputTextHtml
                [ Html.Attributes.id studentInputId
                , Html.Attributes.type_ "text"
                , Html.Attributes.required True
                ]
            )
        ]


studentInputId : String
studentInputId =
    "studentId"


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
