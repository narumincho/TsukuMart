module Main exposing (main)

import Browser
import Html
import Html.Attributes


type alias Model =
    ()


type alias Msg =
    Never


main : Program () Model Msg
main =
    Browser.sandbox
        { init = ()
        , update = \_ _ -> ()
        , view =
            view
        }


view : Model -> Html.Html Msg
view _ =
    Html.div []
        [ Html.h1 [] [ Html.text "つくマート" ]
        , itemList
        , exhibitButton
        , bottomMenu
        ]


itemList : Html.Html Msg
itemList =
    Html.div
        [ Html.Attributes.class "itemList" ]
        ([ { title = "冷蔵庫", price = 300, like = 1 }
         , { title = "洗濯機", price = 100, like = 5 }
         , { title = "時計", price = 10, like = 99 }
         , { title = "掃除機", price = 100, like = 5 }
         , { title = "自転車", price = 200, like = 9 }
         ]
            |> List.map item
        )


item : { title : String, price : Int, like : Int } -> Html.Html Msg
item { title, price, like } =
    Html.div [ Html.Attributes.class "item" ]
        [ itemImage
        , Html.div [ Html.Attributes.class "itemTitle" ] [ Html.text title ]
        , Html.div [ Html.Attributes.class "itemPrice" ] [ Html.text (String.fromInt price ++ "円") ]
        , Html.div [] [ Html.text ("いいね" ++ String.fromInt like) ]
        ]


itemImage : Html.Html Msg
itemImage =
    Html.img
        [ Html.Attributes.class "itemImage"
        , Html.Attributes.src "assets/itemDummy.png"
        ]
        []


exhibitButton : Html.Html Msg
exhibitButton =
    Html.div
        [ Html.Attributes.class "exhibitButton" ]
        [ Html.text "出品" ]


bottomMenu : Html.Html Msg
bottomMenu =
    Html.div [Html.Attributes.class "bottomMenu"]
        ([ "ホーム", "検索", "通知", "Myページ" ]
            |> List.map (\text -> Html.div [Html.Attributes.class "bottomMenuItem"] [ Html.text text ])
        )
