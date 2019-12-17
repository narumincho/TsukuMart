module Style exposing
    ( RadioSelect(..)
    , alertColorButton
    , cardListContainer
    , container
    , containerKeyed
    , displayGridAndGap
    , displayGridFlowColumn
    , emptyList
    , formItem
    , gridColumn
    , gridRow
    , gridTemplateColumns
    , gridTemplateRows
    , inputText
    , justifyItemsCenter
    , mainButton
    , mainButtonLink
    , mainId
    , mainView
    , normalShadow
    , pointerEventsNone
    , primaryColor
    , primaryColorLight
    , productImageList
    , radioForm
    , selectMenu
    , titleAndContent
    , userImage
    , userSelectNone
    , webkitOverflowScrolling
    , webkitTapHighlightColorTransparent
    )

import Css
import Css.Transitions
import Data.ImageId
import Html.Styled as H
import Html.Styled.Attributes as A
import Html.Styled.Events
import Html.Styled.Keyed
import Icon
import Json.Decode
import PageLocation


primaryColor : Css.Color
primaryColor =
    Css.rgb 115 63 167


primaryColorLight : Css.Color
primaryColorLight =
    Css.rgb 154 108 201


container : List (H.Html msg) -> H.Html msg
container children =
    H.div
        [ A.css [ containerStyle ]
        ]
        [ H.div
            [ A.css [ containerInnerStyle ]
            ]
            children
        ]


containerKeyed : List ( String, H.Html msg ) -> H.Html msg
containerKeyed children =
    H.div
        [ A.css [ containerStyle ]
        ]
        [ Html.Styled.Keyed.node "div"
            [ A.css [ containerInnerStyle ] ]
            children
        ]


containerStyle : Css.Style
containerStyle =
    Css.batch
        [ Css.displayFlex
        , Css.alignItems Css.center
        , Css.width (Css.pct 100)
        , Css.flexDirection Css.column
        , Css.overflowY Css.auto
        ]


containerInnerStyle : Css.Style
containerInnerStyle =
    Css.batch
        [ displayGridAndGap 48
        , Css.maxWidth (Css.px 640)
        , Css.padding (Css.px 16)
        , Css.boxSizing Css.borderBox
        , Css.width (Css.pct 100)
        ]


titleAndContent : String -> H.Html msg -> H.Html msg
titleAndContent title content =
    H.div
        [ A.css [ displayGridAndGap 4 ]
        ]
        [ H.div
            [ A.css [ labelStyle ] ]
            [ H.text title ]
        , content
        ]


formItem : String -> String -> List (H.Html msg) -> H.Html msg
formItem title idString content =
    H.div
        [ A.css
            [ displayGridAndGap 4 ]
        ]
        (H.label
            [ A.css [ labelStyle ], A.for idString ]
            [ H.text title ]
            :: content
        )


labelStyle : Css.Style
labelStyle =
    [] |> Css.batch


displayGridAndGap : Int -> Css.Style
displayGridAndGap gap =
    let
        block =
            Css.block
    in
    (Css.display { block | value = "grid" }
        :: (if gap == 0 then
                []

            else
                [ Css.property "gap" (String.fromInt gap ++ "px") ]
           )
    )
        |> Css.batch


displayGridFlowColumn : Int -> Css.Style
displayGridFlowColumn gap =
    let
        block =
            Css.block
    in
    ([ Css.display { block | value = "grid" }
     , Css.property "grid-auto-flow" "column"
     ]
        ++ (if gap == 0 then
                []

            else
                [ Css.property "gap" (String.fromInt gap ++ "px") ]
           )
    )
        |> Css.batch


gridTemplateRows : String -> Css.Style
gridTemplateRows =
    Css.property "grid-template-rows"


gridTemplateColumns : String -> Css.Style
gridTemplateColumns =
    Css.property "grid-template-columns"


gridRow : Int -> Int -> Css.Style
gridRow start end =
    Css.property "grid-row" (String.fromInt start ++ " / " ++ String.fromInt end)


gridColumn : Int -> Int -> Css.Style
gridColumn start end =
    Css.property "grid-column" (String.fromInt start ++ " / " ++ String.fromInt end)


webkitTapHighlightColorTransparent : Css.Style
webkitTapHighlightColorTransparent =
    Css.property "-webkit-tap-highlight-color" "transparent"


webkitOverflowScrolling : Css.Style
webkitOverflowScrolling =
    Css.property "-webkit-overflow-scrolling" "touch"


justifyItemsCenter : Css.Style
justifyItemsCenter =
    Css.property "justify-items" "center"


userSelectNone : Css.Style
userSelectNone =
    Css.property "user-select" "none"


pointerEventsNone : Css.Style
pointerEventsNone =
    Css.property "pointer-events" "none"


userImage : Int -> Data.ImageId.ImageId -> H.Html msg
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


{-| 選択肢から選べるメニュー。一番上は選択してください固定でこれを選んだらNothingが返ってくる
-}
selectMenu : Bool -> String -> List String -> H.Html (Maybe Int)
selectMenu disabled id labelList =
    H.select
        [ A.css
            [ Css.display Css.block
            , Css.width (Css.pct 100)
            , Css.height (Css.px 64)
            , Css.border3 (Css.px 1) Css.solid (Css.rgb 204 204 204)
            , Css.boxSizing Css.borderBox
            , Css.borderRadius (Css.px 8)
            , Css.fontSize (Css.px 24)
            ]
        , A.id id
        , A.disabled disabled
        , Html.Styled.Events.on "change" selectDecoder
        ]
        (blankOption
            :: (labelList
                    |> List.map
                        (\s ->
                            H.option [] [ H.text s ]
                        )
               )
        )


selectDecoder : Json.Decode.Decoder (Maybe Int)
selectDecoder =
    Json.Decode.at
        [ "target", "selectedIndex" ]
        Json.Decode.int
        |> Json.Decode.map
            (\index ->
                case index of
                    0 ->
                        Nothing

                    x ->
                        Just (x - 1)
            )


blankOption : H.Html msg
blankOption =
    H.option [] [ H.text "--選択してください--" ]


inputText : { id : String, type_ : String, autoComplete : String, required : Bool } -> H.Html String
inputText { id, type_, autoComplete, required } =
    H.input
        [ A.css
            [ Css.fontSize (Css.rem 1.2)
            , Css.padding (Css.px 8)
            , Css.width (Css.pct 100)
            , Css.border3 (Css.px 1) Css.solid (Css.rgb 204 204 204)
            , Css.boxSizing Css.borderBox
            , Css.borderRadius (Css.px 8)
            , Css.boxShadow5 Css.inset Css.zero (Css.px 1) (Css.px 1) (Css.rgba 0 0 0 0.075)
            , Css.outline Css.zero
            , Css.Transitions.transition
                [ Css.Transitions.borderColor3 150 0 Css.Transitions.easeInOut
                , Css.Transitions.boxShadow3 150 0 Css.Transitions.easeInOut
                ]
            , Css.focus
                [ Css.boxShadow inputTextFocusBoxShadow
                , Css.border3 (Css.px 1) Css.solid (Css.rgb 102 175 233)
                ]
            ]
        , A.id id
        , Html.Styled.Events.onInput identity
        , A.type_ type_
        , A.attribute "autocomplete" autoComplete
        , A.required required
        ]
        []


inputTextFocusBoxShadow =
    let
        none =
            Css.none
    in
    { none | value = "inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6)" }


mainButton : List (H.Html Never) -> Maybe msg -> H.Html msg
mainButton children msgMaybe =
    H.button
        (case msgMaybe of
            Just msg ->
                [ Html.Styled.Events.custom
                    "click"
                    (Json.Decode.succeed
                        { message = msg
                        , stopPropagation = True
                        , preventDefault = True
                        }
                    )
                , A.css [ mainButtonStyle ]
                ]

            Nothing ->
                [ A.disabled True
                , A.css [ mainButtonDisabledStyle ]
                ]
        )
        (children |> List.map (H.map never))


mainButtonLink : List (H.Html Never) -> Maybe PageLocation.PageLocation -> H.Html msg
mainButtonLink children locationMaybe =
    case locationMaybe of
        Just location ->
            H.a
                [ A.href (PageLocation.toUrlAsString location)
                , A.css [ mainButtonStyle ]
                ]
                (children |> List.map (H.map never))

        Nothing ->
            H.div
                [ A.css [ mainButtonDisabledStyle ]
                ]
                (children |> List.map (H.map never))


mainButtonStyle : Css.Style
mainButtonStyle =
    Css.batch
        [ Css.backgroundColor primaryColor
        , Css.color (Css.rgb 221 221 221)
        , Css.fill (Css.rgb 221 221 221)
        , Css.padding (Css.px 16)
        , Css.width (Css.pct 100)
        , Css.fontSize (Css.rem 1.5)
        , Css.borderRadius (Css.px 8)
        , normalShadow
        , Css.border2 Css.zero Css.none
        , Css.displayFlex
        , Css.alignItems Css.center
        , Css.justifyContent Css.center
        , Css.boxSizing Css.borderBox
        , Css.textDecoration Css.none
        ]


mainButtonDisabledStyle : Css.Style
mainButtonDisabledStyle =
    Css.batch
        [ Css.backgroundColor (Css.rgb 170 170 170)
        , Css.color (Css.rgb 221 221 221)
        , Css.fill (Css.rgb 221 221 221)
        , Css.padding (Css.px 16)
        , Css.width (Css.pct 100)
        , Css.fontSize (Css.rem 1.5)
        , Css.borderRadius (Css.px 8)
        , normalShadow
        , Css.border2 Css.zero Css.none
        , Css.displayFlex
        , Css.alignItems Css.center
        , Css.justifyContent Css.center
        , Css.boxSizing Css.borderBox
        ]


type RadioSelect
    = Left
    | Right


radioForm :
    { select : RadioSelect
    , leftText : String
    , rightText : String
    , name : String
    }
    -> H.Html RadioSelect
radioForm { select, leftText, rightText, name } =
    H.div
        [ A.css
            [ Css.width (Css.pct 100)
            , Css.padding (Css.px 8)
            , displayGridAndGap 0
            , Css.property "grid-template-columns" "1fr 1fr"
            , Css.boxSizing Css.borderBox
            ]
        ]
        [ H.input
            [ A.type_ "radio"
            , A.name name
            , A.id (name ++ "Left")
            , A.css
                [ radioInputStyle
                ]
            , Html.Styled.Events.on "change" (Json.Decode.succeed Left)
            , A.checked (select == Left)
            ]
            []
        , H.label
            [ A.for (name ++ "Left")
            , A.css
                [ radioLabelStyle (select == Left)
                , Css.borderRadius4 (Css.px 8) Css.zero Css.zero (Css.px 8)
                , gridColumn 1 2
                , gridRow 1 2
                ]
            ]
            [ H.text leftText ]
        , H.input
            [ A.type_ "radio"
            , A.name name
            , A.id (name ++ "Right")
            , A.css
                [ radioInputStyle
                ]
            , Html.Styled.Events.on "change" (Json.Decode.succeed Right)
            , A.checked (select == Right)
            ]
            []
        , H.label
            [ A.for (name ++ "Right")
            , A.css
                [ radioLabelStyle (select == Right)
                , Css.borderRadius4 Css.zero (Css.px 8) (Css.px 8) Css.zero
                , gridColumn 2 3
                , gridRow 1 2
                ]
            ]
            [ H.text rightText ]
        ]


radioInputStyle : Css.Style
radioInputStyle =
    [ Css.width Css.zero
    , Css.height Css.zero
    ]
        |> Css.batch


radioLabelStyle : Bool -> Css.Style
radioLabelStyle select =
    ([ Css.backgroundColor
        (if select then
            primaryColor

         else
            Css.rgb 153 153 153
        )
     , Css.padding (Css.px 8)
     , Css.textAlign Css.center
     , Css.cursor Css.pointer
     , Css.border2 Css.zero Css.none
     , normalShadow
     , Css.color
        (if select then
            Css.rgb 255 255 255

         else
            Css.rgb 0 0 0
        )
     ]
        ++ (if select then
                []

            else
                [ Css.hover
                    [ Css.backgroundColor (Css.rgb 187 187 187)
                    ]
                ]
           )
    )
        |> Css.batch


normalShadow : Css.Style
normalShadow =
    Css.boxShadow4 Css.zero (Css.px 2) (Css.px 4) (Css.rgba 0 0 0 0.18)


emptyList : String -> H.Html msg
emptyList text =
    H.div
        [ A.css
            [ Css.displayFlex
            , Css.flexDirection Css.column
            , Css.alignItems Css.center
            , Css.padding (Css.px 32)
            ]
        ]
        [ H.img
            [ A.src "/assets/logo_bird.png"
            , A.css
                [ Css.property "filter" "grayscale(100%)"
                , Css.width (Css.px 128)
                ]
            , A.alt "無いことを悲しむつくバード"
            ]
            []
        , H.text text
        ]


cardListContainer : List { url : String, delete : Maybe (Int -> msg) } -> H.Html msg
cardListContainer children =
    H.div
        [ A.css
            [ Css.backgroundColor (Css.rgb 100 100 100)
            , Css.overflowX Css.auto
            , Css.position Css.relative
            ]
        ]
        [ H.div
            [ A.css
                [ Css.displayFlex
                , Css.flexDirection Css.row
                ]
            ]
            (children
                |> List.indexedMap cardListItem
            )
        ]


cardListItem : Int -> { url : String, delete : Maybe (Int -> msg) } -> H.Html msg
cardListItem index data =
    H.div
        [ A.css
            [ Css.position Css.relative
            , Css.width (Css.px 120)
            , Css.height (Css.px 120)
            , Css.padding (Css.px 16)
            ]
        ]
        ((case data.delete of
            Just deleteMessage ->
                [ Icon.delete
                    |> H.map (always (deleteMessage index))
                ]

            Nothing ->
                []
         )
            ++ [ H.img
                    [ A.css
                        [ Css.display Css.block
                        , Css.width (Css.px 120)
                        , Css.height (Css.px 120)
                        , Css.property "object-fit" "contain"
                        ]
                    , A.src data.url
                    ]
                    []
               ]
        )


productImageList : List String -> H.Html msg
productImageList urlList =
    H.div
        [ A.css
            [ Css.backgroundColor (Css.rgb 128 128 128)
            , Css.overflowX Css.auto
            , Css.height (Css.px 320)
            ]
        ]
        [ H.div
            [ A.css
                [ displayGridAndGap 16
                , Css.property "grid-auto-flow" "column"
                ]
            ]
            (urlList |> List.map imageView)
        ]


imageView : String -> H.Html msg
imageView url =
    H.img
        [ A.css
            [ Css.display Css.block
            , Css.width (Css.px 320)
            , Css.height (Css.px 320)
            , Css.property "object-fit" "contain"
            ]
        , A.src url
        ]
        []


{-| 主に表示するもの。mainViewというIDがつき、Commandで一番上にスクロールするようにできる
-}
mainView : List (H.Html msg) -> H.Html msg
mainView =
    H.div
        [ mainId
        , A.css
            [ Css.overflowX Css.auto
            , gridColumn 2 3
            , gridRow 3 4
            , webkitOverflowScrolling
            ]
        ]


mainId : H.Attribute msg
mainId =
    A.id "mainView"


alertColorButton : Maybe msg -> List (H.Html msg) -> H.Html msg
alertColorButton msgMaybe =
    H.div
        [ case msgMaybe of
            Just msg ->
                Html.Styled.Events.onClick msg

            Nothing ->
                A.disabled True
        , A.css
            [ Css.backgroundColor (Css.rgb 189 46 46)
            , Css.color (Css.rgb 238 238 238)
            , Css.padding (Css.px 16)
            , Css.width (Css.pct 100)
            , Css.fontSize (Css.rem 1.5)
            , Css.borderRadius (Css.px 8)
            , Css.boxShadow4 Css.zero (Css.px 2) (Css.px 4) (Css.rgba 0 0 0 0.18)
            , userSelectNone
            , Css.displayFlex
            , Css.alignItems Css.center
            , Css.justifyContent Css.center
            , Css.boxSizing Css.borderBox
            , Css.cursor Css.pointer
            , Css.border2 Css.zero Css.none
            , Css.hover
                [ Css.backgroundColor (Css.rgb 221 84 84) ]
            ]
        ]
