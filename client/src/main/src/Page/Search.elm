module Page.Search exposing (Emission(..), Model, Msg, initModel, update, view)

import BasicParts
import Data.SearchCondition as SearchCondition
import Html
import Html.Attributes


type Model
    = Condition SearchCondition.Condition


type Msg
    = Msg


type Emission
    = EmissionReplaceElementText { id : String, text : String }


initModel : SearchCondition.Condition -> ( Model, List Emission )
initModel condition =
    ( Condition condition
    , case condition of
        SearchCondition.None ->
            []

        SearchCondition.ByText text ->
            [ EmissionReplaceElementText { id = textAreaId, text = text } ]
    )


update : Msg -> Model -> ( Model, List Emission )
update msg model =
    ( model, [] )


view :
    Model
    ->
        { title : Maybe String
        , tab : BasicParts.Tab Msg
        , html : List (Html.Html Msg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view model =
    { title = Just "検索"
    , tab = BasicParts.tabNone
    , html =
        [ Html.div
            [ Html.Attributes.class "container" ]
            [ Html.text "検索" ]
        ]
    , bottomNavigation = Just BasicParts.Search
    }


textAreaId : String
textAreaId =
    "search-text"
