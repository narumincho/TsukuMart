module Page.Notification exposing
    ( Emission(..)
    , Model
    , Msg
    , initModel
    , update
    , view
    )

import BasicParts
import Html
import Html.Attributes


type Msg
    = Msg


type Model
    = Model


type Emission
    = Emission


initModel : ( Model, List Emission )
initModel =
    ( Model, [] )


update : Msg -> Model -> ( Model, List Emission )
update msg model =
    ( model, [] )


view : Model -> { title : Maybe String, tab : BasicParts.Tab Msg, html : List (Html.Html Msg) }
view model =
    { title = Just "通知"
    , tab = BasicParts.tabSingle "通知"
    , html =
        [ Html.div
            [ Html.Attributes.class "notification" ]
            [ Html.text "通知。まだ作り途中" ]
        ]
    }
