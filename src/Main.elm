port module Main exposing (main)

import Browser
import Browser.Navigation
import Html
import Html.Attributes
import Html.Events
import Html.Keyed
import Url



{- Intは意味のない値 -}


port toWideScreenMode : (Int -> msg) -> Sub msg


port toNarrowScreenMode : (Int -> msg) -> Sub msg


type Model
    = Model
        { selectedTab : Tab
        , menuState : MenuState
        , wideScreenMode : Bool
        , key : Browser.Navigation.Key
        }


type MenuState
    = NotOpenedYet
    | Close
    | Open


type Tab
    = Recent
    | Recommend
    | Free


type Msg
    = TabChange Tab
    | OpenMenu
    | CloseMenu
    | ToWideScreenMode
    | ToNarrowScreenMode
    | UrlChange Url.Url
    | UrlRequest Browser.UrlRequest


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , update = update
        , view = view
        , subscriptions = subscription
        , onUrlRequest = onUrlRequest
        , onUrlChange = onUrlChange
        }


init : () -> Url.Url -> Browser.Navigation.Key -> ( Model, Cmd Msg )
init _ url key =
    let
        _ =
            Debug.log "load url" (Url.toString url)
    in
    ( Model
        { selectedTab = Recommend
        , menuState = NotOpenedYet
        , wideScreenMode = False
        , key = key
        }
    , Cmd.none
    )


onUrlRequest : Browser.UrlRequest -> Msg
onUrlRequest =
    UrlRequest


onUrlChange : Url.Url -> Msg
onUrlChange =
    UrlChange


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

        OpenMenu ->
            ( Model
                { rec
                    | menuState = Open
                }
            , Cmd.none
            )

        CloseMenu ->
            ( Model
                { rec
                    | menuState = Close
                }
            , Cmd.none
            )

        ToWideScreenMode ->
            ( Model
                { rec | wideScreenMode = True }
            , Cmd.none
            )

        ToNarrowScreenMode ->
            ( Model
                { rec | wideScreenMode = False }
            , Cmd.none
            )

        UrlChange url ->
            let
                _ =
                    Debug.log "url change" url
            in
            ( Model rec
            , Cmd.none
            )

        UrlRequest urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    let
                        _ =
                            Debug.log "url request internal" url
                    in
                    ( Model rec
                    , Browser.Navigation.pushUrl rec.key (Url.toString url)
                    )

                Browser.External string ->
                    ( Model rec
                    , Browser.Navigation.load string
                    )


view : Model -> { title : String, body : List (Html.Html Msg) }
view (Model { selectedTab, menuState, wideScreenMode }) =
    { title = "つくマート"
    , body =
        [ header wideScreenMode
        , mainTab selectedTab
        , itemList
        , exhibitButton
        , menu wideScreenMode menuState
        ]
    }



{- Header -}


header : Bool -> Html.Html Msg
header wideMode =
    Html.header
        []
        ((if wideMode then
            []

          else
            [ menuButton ]
         )
            ++ [ Html.h1 [] [ logo ]
               , searchButton
               , notificationsButton
               ]
        )


menuButton : Html.Html Msg
menuButton =
    Html.img
        [ Html.Attributes.src "assets/menu.svg"
        , Html.Attributes.alt "メニュー"
        , headerButton
        , Html.Events.onClick OpenMenu
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



{- Menu -}


menu : Bool -> MenuState -> Html.Html Msg
menu isWideMode menuState =
    if isWideMode then
        Html.div
            [ Html.Attributes.class "menu-always-show" ]
            menuMain

    else
        Html.Keyed.node "div"
            [ Html.Attributes.class "menu" ]
            (case menuState of
                NotOpenedYet ->
                    []

                Open ->
                    [ ( "os"
                      , Html.div
                            [ Html.Attributes.class "menu-shadow menu-shadow-appear"
                            , Html.Events.onClick CloseMenu
                            ]
                            []
                      )
                    , ( "om"
                      , Html.div
                            [ Html.Attributes.class "menu-list menu-list-open" ]
                            menuMain
                      )
                    ]

                Close ->
                    [ ( "cs"
                      , Html.div
                            [ Html.Attributes.class "menu-shadow menu-shadow-disappear" ]
                            []
                      )
                    , ( "cm"
                      , Html.div
                            [ Html.Attributes.class "menu-list menu-list-close" ]
                            menuMain
                      )
                    ]
            )


menuMain : List (Html.Html Msg)
menuMain =
    [ Html.div
        [ Html.Attributes.class "menu-account" ]
        [ Html.img
            [ Html.Attributes.class "menu-account-image"
            , Html.Attributes.src "assets/accountImage.png"
            ]
            []
        , Html.text "user"
        ]
    , Html.a
        [ Html.Attributes.class "menu-item"
        , Html.Attributes.href "/like-history"
        ]
        [ Html.text "いいね・閲覧した商品" ]
    , Html.div
        [ Html.Attributes.class "menu-item" ]
        [ Html.text "出品した商品" ]
    , Html.div
        [ Html.Attributes.class "menu-item" ]
        [ Html.text "購入した商品" ]
    ]



{- Main Tab -}


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
         , { title = "棚", price = 1000, like = 2 }
         , { title = "いす", price = 1000, like = 2 }
         , { title = "バッテリー", price = 300, like = 20 }
         , { title = "教科書", price = 20, like = 10 }
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


subscription : Model -> Sub Msg
subscription (Model { wideScreenMode }) =
    Sub.batch
        (if wideScreenMode then
            [ toNarrowScreenMode (always ToNarrowScreenMode) ]

         else
            [ toWideScreenMode (always ToWideScreenMode) ]
        )
