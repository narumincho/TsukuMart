module Page.SearchResult exposing
    ( Command
    , Model
    , Msg
    , initModel
    , update
    , view
    )

import BasicParts
import Data.SearchCondition as SearchCondition
import Html
import Html.Styled


type Model
    = Model


type Msg
    = Msg


type Command
    = Command


initModel : SearchCondition.Condition -> ( Model, List Command )
initModel condition =
    ( Model
    , []
    )


update : Msg -> Model -> ( Model, List Command )
update msg model =
    ( model, [] )


view :
    Model
    ->
        { title : Maybe String
        , tab : BasicParts.Tab Msg
        , html : List (Html.Styled.Html Msg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view model =
    { title = Just "検索結果"
    , tab = BasicParts.tabNone
    , html =
        [ Html.Styled.text "検索結果"
        ]
    , bottomNavigation = Nothing
    }
