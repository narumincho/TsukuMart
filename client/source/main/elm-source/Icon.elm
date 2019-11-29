module Icon exposing
    ( delete
    , deleteGarbageCan
    , edit
    , gitHub
    , google
    , home
    , information
    , loading
    , notifications
    , photo
    , search
    , twitter
    )

import Css
import Css.Animations
import Html.Styled
import Html.Styled.Attributes
import Svg.Styled as S
import Svg.Styled.Attributes as A
import Svg.Styled.Events


edit : Css.Style -> Html.Styled.Html msg
edit style =
    S.svg
        [ A.viewBox "0 0 24 24"
        , A.css [ style ]
        ]
        [ S.path
            [ A.d
                "M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
            ]
            []
        ]


deleteGarbageCan : Css.Style -> Html.Styled.Html msg
deleteGarbageCan style =
    S.svg
        [ A.viewBox "0 0 24 24"
        , A.css [ style ]
        ]
        [ S.path
            [ A.d "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z" ]
            []
        ]


home : Css.Style -> Html.Styled.Html msg
home style =
    S.svg
        [ A.viewBox "0 0 24 24"
        , A.css [ style ]
        ]
        [ S.path
            [ A.d "M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z" ]
            []
        ]


search : Css.Style -> Html.Styled.Html msg
search style =
    S.svg
        [ A.viewBox "0 0 24 24"
        , A.css [ style ]
        ]
        [ S.path
            [ A.d "M15.5 14h-.79l-.28-.27c1.2-1.4 1.82-3.31 1.48-5.34-.47-2.78-2.79-5-5.59-5.34-4.23-.52-7.79 3.04-7.27 7.27.34 2.8 2.56 5.12 5.34 5.59 2.03.34 3.94-.28 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
            ]
            []
        ]


notifications : Css.Style -> Html.Styled.Html msg
notifications style =
    S.svg
        [ A.viewBox "0 0 24 24"
        , A.css [ style ]
        ]
        [ S.path
            [ A.d "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.89 0 1.34-1.08.71-1.71L18 16z"
            ]
            []
        ]


information : Css.Style -> Html.Styled.Html msg
information style =
    S.svg
        [ A.viewBox "0 0 24 24"
        , A.css [ style ]
        ]
        [ S.path
            [ A.d "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z"
            ]
            []
        ]


loading : { size : Int, color : Css.ColorValue c } -> Html.Styled.Html msg
loading { size, color } =
    Html.Styled.div
        [ Html.Styled.Attributes.css
            [ Css.borderRadius (Css.pct 50)
            , Css.width (Css.px (toFloat size))
            , Css.height (Css.px (toFloat size))
            , Css.border3 (Css.px 3) Css.solid color
            , Css.borderRightColor Css.transparent
            , Css.animationName
                (Css.Animations.keyframes
                    [ ( 100, [ Css.Animations.transform [ Css.rotate (Css.turn 1) ] ] ) ]
                )
            , Css.animationIterationCount infinite
            , Css.animationDuration (Css.sec 0.6)
            , Css.property "animation-timing-function" "linear"
            ]
        ]
        []


infinite =
    let
        a =
            Css.int 0
    in
    { a | value = "infinite" }


photo : Html.Styled.Html msg
photo =
    S.svg
        [ A.css
            [ Css.width (Css.px 112)
            , Css.height (Css.px 112)
            ]
        , A.viewBox "0 0 24 24"
        ]
        [ S.path
            [ A.d "M3 8c0 .55.45 1 1 1s1-.45 1-1V6h2c.55 0 1-.45 1-1s-.45-1-1-1H5V2c0-.55-.45-1-1-1s-1 .45-1 1v2H1c-.55 0-1 .45-1 1s.45 1 1 1h2v2z" ]
            []
        , S.circle
            [ A.cx "13", A.cy "14", A.r "3" ]
            []
        , S.path
            [ A.d
                "M21 6h-3.17l-1.24-1.35c-.37-.41-.91-.65-1.47-.65h-6.4c.17.3.28.63.28 1 0 1.1-.9 2-2 2H6v1c0 1.1-.9 2-2 2-.37 0-.7-.11-1-.28V20c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
            ]
            []
        ]


delete : Html.Styled.Html ()
delete =
    S.svg
        [ A.css
            [ Css.width (Css.px 32)
            , Css.height (Css.px 32)
            , Css.position Css.absolute
            , Css.right (Css.px 8)
            , Css.top (Css.px 8)
            , Css.fill (Css.rgb 0 0 0)
            , Css.cursor Css.pointer
            , Css.hover
                [ Css.fill (Css.rgb 68 68 68) ]
            ]
        , A.viewBox "0 0 10 10"
        , Svg.Styled.Events.onClick ()
        ]
        [ S.circle
            [ A.cx "5", A.cy "5", A.r "5", A.stroke "none" ]
            []
        , S.line
            [ A.x1 "3", A.y1 "3", A.x2 "7", A.y2 "7", A.stroke "white" ]
            []
        , S.line
            [ A.x1 "7", A.y1 "3", A.x2 "3", A.y2 "7", A.stroke "white" ]
            []
        ]
