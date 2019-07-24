module Page.Style exposing
    ( displayGridAndGap
    , formItem
    , inputText
    , primaryColor
    , primaryColorLight
    , select
    , titleAndContent
    , titleAndContentStyle
    , userImage
    )

import Css
import Css.Animations
import Css.Transitions
import Data.ImageId
import Html
import Html.Styled as H
import Html.Styled.Attributes as A
import Html.Styled.Events
import Json.Decode


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


select : String -> List String -> H.Html (Maybe Int)
select id labelList =
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


inputText : { id : String, type_ : String, required : Bool } -> H.Html String
inputText { id, type_, required } =
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
        , A.required required
        ]
        []


inputTextFocusBoxShadow =
    let
        none =
            Css.none
    in
    { none | value = "inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6)" }
