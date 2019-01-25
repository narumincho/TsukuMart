module Main exposing (main)

import Browser
import Html
import Html.Attributes
import Html.Events


type Model
    = Model { selectedTab : Tab }


type Tab
    = Recent
    | Recommend
    | Free


type Msg
    = TabChange Tab


main : Program () Model Msg
main =
    Browser.document
        { init = init
        , update = update
        , view = view
        , subscriptions = always Sub.none
        }


init : () -> ( Model, Cmd Msg )
init _ =
    ( Model
        { selectedTab = Recommend }
    , Cmd.none
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg (Model rec) =
    case msg of
        TabChange tab ->
            ( Model
                { rec
                    | selectedTab = tab
                }
            , Cmd.none
            )


view : Model -> { title : String, body : List (Html.Html Msg) }
view (Model { selectedTab }) =
    { title = "つくマート"
    , body =
        [ header
        , mainTab selectedTab
        , itemList
        , exhibitButton
        ]
    }


header : Html.Html Msg
header =
    Html.header
        []
        [ menuButton
        , Html.h1 [] [ logo ]
        , searchButton
        , notificationsButton
        ]


mainTab : Tab -> Html.Html Msg
mainTab selectedTab =
    Html.div
        [ Html.Attributes.class "mainTab" ]
        (([ ( Recent, "新着" ), ( Recommend, "おすすめ" ), ( Free, "0円" ) ]
            |> List.map (mainTabItem selectedTab)
         )
            ++ [ mainTabSelectLine selectedTab ]
        )


mainTabItem : Tab -> ( Tab, String ) -> Html.Html Msg
mainTabItem selectedTab ( tab, label ) =
    Html.div
        [ Html.Attributes.class
            (if tab == selectedTab then
                "mainTab-item-select"

             else
                "mainTab-item"
            )
        , Html.Events.onClick (TabChange tab)
        ]
        [ Html.text label ]


mainTabSelectLine : Tab -> Html.Html Msg
mainTabSelectLine selectedTab =
    Html.div [ Html.Attributes.class "mainTab-selectLineArea" ]
        [ Html.div
            [ Html.Attributes.class
                ("mainTab-selectLine "
                    ++ (case selectedTab of
                            Recent ->
                                "mainTab-selectLine-left"

                            Recommend ->
                                "mainTab-selectLine-center"

                            Free ->
                                "mainTab-selectLine-right"
                       )
                )
            ]
            []
        ]


menuButton : Html.Html Msg
menuButton =
    Html.img
        [ Html.Attributes.src "assets/menu.svg"
        , Html.Attributes.alt "メニュー"
        , headerButton
        ]
        []


logo : Html.Html Msg
logo =
    Html.img
        [ Html.Attributes.src "assets/logo.svg"
        , Html.Attributes.alt "つくマート"
        , Html.Attributes.class "logo"
        ]
        []


searchButton : Html.Html Msg
searchButton =
    Html.img
        [ Html.Attributes.src "assets/search.svg"
        , Html.Attributes.alt "探す"
        , headerButton
        ]
        []


notificationsButton : Html.Html Msg
notificationsButton =
    Html.img
        [ Html.Attributes.src "assets/notifications.svg"
        , Html.Attributes.alt "通知"
        , headerButton
        ]
        []


headerButton : Html.Attribute Msg
headerButton =
    Html.Attributes.class "headerButton"


itemList : Html.Html Msg
itemList =
    Html.div
        [ Html.Attributes.class "itemList" ]
        ([ { title = "冷蔵庫", price = 300, like = 1 }
         , { title = "洗濯機", price = 100, like = 5 }
         , { title = "時計", price = 10, like = 99 }
         , { title = "掃除機", price = 100, like = 5 }
         , { title = "自転車", price = 200, like = 9 }
         , { title = "マンガ", price = 10, like = 99 }
         , { title = "ゲーム", price = 10, like = 99 }
         , { title = "絵本", price = 100, like = 5 }
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
