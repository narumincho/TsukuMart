module Tab exposing (Tab, isNone, map, multi, none, single, view)

import Html
import Html.Attributes
import Html.Events


type Tab msg
    = Multi (List ( String, msg )) Int
    | Single String
    | None


multi : { textAndMsgList : List ( String, msg ), selectIndex : Int } -> Tab msg
multi { textAndMsgList, selectIndex } =
    Multi textAndMsgList selectIndex


single : String -> Tab msg
single =
    Single


none : Tab msg
none =
    None


map : (a -> b) -> Tab a -> Tab b
map f tab =
    case tab of
        Multi list selectIndex ->
            Multi
                (list
                    |> List.map (Tuple.mapSecond f)
                )
                selectIndex

        Single string ->
            Single string

        None ->
            None


{-| タブの項目数
-}
toCount : Tab a -> Int
toCount tab =
    case tab of
        Multi list _ ->
            List.length list

        Single _ ->
            1

        None ->
            0


isNone : Tab a -> Bool
isNone tab =
    tab == None


{-| タブの見た目
-}
view : Bool -> Tab msg -> Html.Html msg
view isWideScreenMode tabData =
    Html.div
        ([ Html.Attributes.classList
            [ ( "mainTab", True ), ( "mainTab-wide", isWideScreenMode ) ]
         ]
            ++ (case tabData of
                    None ->
                        [ Html.Attributes.style "height" "0" ]

                    _ ->
                        [ Html.Attributes.style "grid-template-columns"
                            (List.repeat (toCount tabData) "1fr" |> String.join " ")
                        , Html.Attributes.style "height" "3rem"
                        ]
               )
        )
        (case tabData of
            Multi tabList selectIndex ->
                (tabList
                    |> List.indexedMap
                        (\index ( label, msg ) ->
                            itemView
                                (index == selectIndex)
                                label
                                (Just msg)
                        )
                )
                    ++ [ selectLineView
                            selectIndex
                            (List.length tabList)
                       ]

            Single label ->
                [ itemView
                    True
                    label
                    Nothing
                , selectLineView 0 1
                ]

            None ->
                []
        )


firstElementIndex : a -> List a -> Maybe Int
firstElementIndex a list =
    case list of
        [] ->
            Nothing

        x :: xs ->
            if x == a then
                Just 0

            else
                firstElementIndex a xs |> Maybe.map ((+) 1)


itemView : Bool -> String -> Maybe msg -> Html.Html msg
itemView isSelected label clickEventMaybe =
    Html.div
        (if isSelected then
            [ Html.Attributes.class "mainTab-item-select" ]

         else
            case clickEventMaybe of
                Just clickEvent ->
                    [ Html.Attributes.class "mainTab-item"
                    , Html.Events.onClick clickEvent
                    ]

                Nothing ->
                    [ Html.Attributes.class "mainTab-item" ]
        )
        [ Html.text label ]


{-| タブの下線

  - index : 何番目のタブを選択しているか
  - count : 全部で何個のタブがあるか

-}
selectLineView : Int -> Int -> Html.Html msg
selectLineView index count =
    Html.div [ Html.Attributes.class "mainTab-selectLineArea" ]
        [ Html.div
            [ Html.Attributes.class "mainTab-selectLine"
            , Html.Attributes.style "left" ("calc( 100% /" ++ String.fromInt count ++ " * " ++ String.fromInt index ++ ")")
            , Html.Attributes.style "width" ("calc( 100% / " ++ String.fromInt count ++ ")")
            ]
            []
        ]
