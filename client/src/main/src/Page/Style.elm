module Page.Style exposing
    ( displayGridAndGap
    , formItem
    , primaryColor
    , primaryColorLight
    , titleAndContent
    , titleAndContentStyle
    , userImage
    )

import Css
import Data.ImageId
import Html
import Html.Styled as H
import Html.Styled.Attributes as A


primaryColor : Css.Color
primaryColor =
    Css.rgb 115 63 167


primaryColorLight : Css.Color
primaryColorLight =
    Css.rgb 154 108 201


titleAndContent : String -> Html.Html msg -> Html.Html msg
titleAndContent title content =
    H.div
        [ A.css [ displayGridAndGap 4 ]
        ]
        [ H.div
            [ A.css [ labelStyle ] ]
            [ H.text title ]
        , content |> H.fromUnstyled
        ]
        |> H.toUnstyled


titleAndContentStyle : String -> H.Html msg -> H.Html msg
titleAndContentStyle title content =
    H.div
        [ A.css [ displayGridAndGap 4 ]
        ]
        [ H.div
            [ A.css [ labelStyle ] ]
            [ H.text title ]
        , content
        ]


formItem : String -> String -> Html.Html msg -> H.Html msg
formItem title idString content =
    H.div
        [ A.css
            [ displayGridAndGap 4 ]
        ]
        [ H.label
            [ A.css [ labelStyle ], A.for idString ]
            [ H.text title ]
        , content |> H.fromUnstyled
        ]


labelStyle : Css.Style
labelStyle =
    [ Css.backgroundColor (Css.rgb 221 221 221) ]
        |> Css.batch


displayGridAndGap : Int -> Css.Style
displayGridAndGap gap =
    let
        block =
            Css.block
    in
    ([ Css.display { block | value = "grid" }
     ]
        ++ (if gap == 0 then
                []

            else
                [ Css.property "gap" (String.fromInt gap ++ "px") ]
           )
    )
        |> Css.batch


userImage : Int -> Data.ImageId.ImageId -> Html.Html msg
userImage size imageId =
    H.img
        [ A.css
            [ Css.display Css.block
            , Css.width (Css.px (toFloat size))
            , Css.height (Css.px (toFloat size))
            , Css.borderRadius (Css.pct 50)
            , Css.flexShrink (Css.int 0)
            , Css.padding (Css.px 4)
            ]
        , A.src (Data.ImageId.toUrlString imageId)
        ]
        []
        |> H.toUnstyled
