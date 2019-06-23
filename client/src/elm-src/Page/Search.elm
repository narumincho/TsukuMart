module Page.Search exposing (view)

import Html
import Html.Attributes
import BasicParts


type Model
    = InputMode
    | ResultMode String


view : Model -> ( String, BasicParts.Tab msg, List (Html.Html msg) )
view model =
    ( "検索"
    , BasicParts.tabNone
    , [ Html.div
            [ Html.Attributes.class "container" ]
            [ Html.text "検索" ]
      ]
    )
