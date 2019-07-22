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
import Html
import Html.Styled
import Html.Styled.Attributes
import Svg.Styled as S
import Svg.Styled.Attributes as A
import Svg.Styled.Events


edit : List Css.Style -> Html.Html msg
edit styleList =
    S.svg
        [ A.viewBox "0 0 24 24"
        , A.css styleList
        ]
        [ S.path
            [ A.d
                "M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
            ]
            []
        ]
        |> Html.Styled.toUnstyled


deleteGarbageCan : List Css.Style -> Html.Html msg
deleteGarbageCan styleList =
    S.svg
        [ A.viewBox "0 0 24 24"
        , A.css styleList
        ]
        [ S.path
            [ A.d "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z" ]
            []
        ]
        |> Html.Styled.toUnstyled


home : List Css.Style -> Html.Html msg
home styleList =
    S.svg
        [ A.viewBox "0 0 24 24"
        , A.css styleList
        ]
        [ S.path
            [ A.d "M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z" ]
            []
        ]
        |> Html.Styled.toUnstyled


search : List Css.Style -> Html.Html msg
search styleList =
    S.svg
        [ A.viewBox "0 0 24 24"
        , A.css styleList
        ]
        [ S.path
            [ A.d "M15.5 14h-.79l-.28-.27c1.2-1.4 1.82-3.31 1.48-5.34-.47-2.78-2.79-5-5.59-5.34-4.23-.52-7.79 3.04-7.27 7.27.34 2.8 2.56 5.12 5.34 5.59 2.03.34 3.94-.28 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
            ]
            []
        ]
        |> Html.Styled.toUnstyled


notifications : List Css.Style -> Html.Html msg
notifications styleList =
    S.svg
        [ A.viewBox "0 0 24 24"
        , A.css styleList
        ]
        [ S.path
            [ A.d "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.89 0 1.34-1.08.71-1.71L18 16z"
            ]
            []
        ]
        |> Html.Styled.toUnstyled


information : List Css.Style -> Html.Html msg
information styleList =
    S.svg
        [ A.viewBox "0 0 24 24"
        , A.css styleList
        ]
        [ S.path
            [ A.d "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z"
            ]
            []
        ]
        |> Html.Styled.toUnstyled


loading : { size : Int, color : Css.ColorValue c } -> Html.Html msg
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
        |> Html.Styled.toUnstyled


infinite =
    let
        a =
            Css.int 0
    in
    { a | value = "infinite" }


photo : Html.Html msg
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
        |> Html.Styled.toUnstyled


delete : Html.Html ()
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
        |> Html.Styled.toUnstyled


gitHub : Html.Html msg
gitHub =
    S.svg
        serviceAttributes
        [ S.path
            [ A.d
                "M10 0C4.476 0 0 4.477 0 10c0 4.418 2.865 8.166 6.84 9.49.5.09.68-.218.68-.483 0-.237-.007-.866-.012-1.7-2.782.603-3.37-1.34-3.37-1.34-.454-1.157-1.11-1.464-1.11-1.464-.907-.62.07-.608.07-.608 1.003.07 1.53 1.03 1.53 1.03.893 1.53 2.342 1.087 2.912.83.09-.645.35-1.085.634-1.335-2.22-.253-4.555-1.11-4.555-4.943 0-1.09.39-1.984 1.03-2.683-.105-.253-.448-1.27.096-2.647 0 0 .84-.268 2.75 1.026C8.294 4.95 9.15 4.84 10 4.836c.85.004 1.705.115 2.504.337 1.91-1.294 2.747-1.026 2.747-1.026.548 1.377.204 2.394.1 2.647.64.7 1.03 1.592 1.03 2.683 0 3.842-2.34 4.687-4.566 4.935.36.308.678.92.678 1.852 0 1.336-.01 2.415-.01 2.743 0 .267.18.578.687.48C17.14 18.163 20 14.417 20 10c0-5.522-4.478-10-10-10"
            , A.stroke "none"
            , A.fill "#000000"
            ]
            []
        ]
        |> Html.Styled.toUnstyled


google : Html.Html msg
google =
    S.svg
        serviceAttributes
        [ S.path
            [ A.d "M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"
            , A.stroke "none"
            , A.fill "rgb(66,133,244)"
            ]
            []
        , S.path
            [ A.d
                "M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"
            , A.stroke "none"
            , A.fill "rgb(52,168,83)"
            ]
            []
        , S.path
            [ A.d
                "M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 0 0 0 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"
            , A.stroke "none"
            , A.fill "rgb(251,188,5)"
            ]
            []
        , S.path
            [ A.d
                "M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"
            , A.stroke "none"
            , A.fill "rgb(234,67,53)"
            ]
            []
        ]
        |> S.toUnstyled


twitter : Html.Html msg
twitter =
    S.svg
        serviceAttributes
        [ S.path
            [ A.d "M20 3.924c-.736.326-1.527.547-2.357.646.848-.508 1.498-1.312 1.804-2.27-.792.47-1.67.812-2.605.996C16.092 2.498 15.027 2 13.847 2 11.58 2 9.743 3.837 9.743 6.103c0 .322.037.635.107.935-3.41-.17-6.434-1.804-8.458-4.287-.352.61-.555 1.314-.555 2.066 0 1.423.724 2.68 1.825 3.415-.672-.02-1.305-.206-1.858-.513v.052c0 1.987 1.414 3.645 3.29 4.022-.344.096-.706.146-1.08.146-.265 0-.522-.026-.772-.074.522 1.63 2.037 2.818 3.833 2.85C4.67 15.81 2.9 16.468.98 16.468c-.332 0-.66-.02-.98-.057 1.816 1.166 3.973 1.846 6.29 1.846 7.547 0 11.674-6.253 11.674-11.675 0-.18-.004-.355-.01-.53.8-.58 1.496-1.3 2.046-2.125"
            , A.stroke "none"
            , A.fill "rgb(85,172,238)"
            ]
            []
        ]
        |> S.toUnstyled


serviceAttributes : List (S.Attribute msg)
serviceAttributes =
    [ A.viewBox "0 0 20 20"
    , A.css [ Css.width (Css.px 40), Css.height (Css.px 40), Css.padding (Css.px 6) ]
    ]
