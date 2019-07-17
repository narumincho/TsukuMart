module Page.Style exposing (formItem, label, titleAndContent)

import Html
import Html.Attributes


primaryColor =
    "#733fa7"


primaryColorLight =
    "#9a6cc9"


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
