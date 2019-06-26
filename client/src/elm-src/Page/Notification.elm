module Page.Notification exposing
    ( Emit(..)
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


type Emit
    = Emit


initModel : ( Model, List Emit )
initModel =
    ( Model, [] )


update : Msg -> Model -> ( Model, List Emit )
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
