module Page.Style exposing
    ( formItem
    , label
    , primaryColor
    , primaryColorLight
    , titleAndContent
    )

import Css
import Html
import Html.Attributes


primaryColor : Css.Color
primaryColor =
    Css.rgb 115 63 167


primaryColorLight : Css.Color
primaryColorLight =
    Css.rgb 154 108 201


titleAndContent : String -> Html.Html msg -> Html.Html msg
titleAndContent title content =
    Html.div
        [ Html.Attributes.style "display" "grid"
        , Html.Attributes.style "gap" "4px"
        ]
        [ Html.div
            label
            [ Html.text title ]
        , content
        ]


formItem : String -> String -> Html.Html msg -> Html.Html msg
formItem title idString content =
    Html.div
        [ Html.Attributes.style "display" "grid"
        , Html.Attributes.style "gap" "4px"
        ]
        [ Html.label
            (label ++ [ Html.Attributes.for idString ])
            [ Html.text title ]
        , content
        ]


label : List (Html.Attribute a)
label =
    [ Html.Attributes.style "background-color" "#ddd" ]
