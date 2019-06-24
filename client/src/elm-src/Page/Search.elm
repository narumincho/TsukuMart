module Page.Search exposing (Model, Msg, view, update, initModel, Emit(..))

import BasicParts
import Data.SearchCondition as SearchCondition
import Html
import Html.Attributes


type Model
    = Condition SearchCondition.Condition


type Msg
    = Msg


type Emit
    = EmitReplaceElementText { id : String, text : String }


initModel : SearchCondition.Condition -> ( Model, List Emit )
initModel condition =
    ( Condition condition
    , case condition of
        SearchCondition.None ->
            []

        SearchCondition.ByText text ->
            [ EmitReplaceElementText { id = textAreaId, text = text } ]
    )


update : Msg -> Model -> ( Model, List Emit )
update msg model =
    ( model, [] )


view : Model -> { title : Maybe String, tab : BasicParts.Tab Msg, html : List (Html.Html Msg) }
view model =
    { title = Just "検索"
    , tab = BasicParts.tabNone
    , html =
        [ Html.div
            [ Html.Attributes.class "container" ]
            [ Html.text "検索" ]
        ]
    }


textAreaId : String
textAreaId =
    "search-text"
