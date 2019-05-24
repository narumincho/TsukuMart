module Page.Search exposing (view)

import Html
import Html.Attributes
import Tab


type Model
    = InputMode
    | ResultMode String


view : Model -> ( String, Tab.Tab msg, List (Html.Html msg) )
view model =
    ( "検索"
    , Tab.none
    , [ Html.div
            [ Html.Attributes.class "container" ]
            [ Html.text "検索" ]
      ]
    )
