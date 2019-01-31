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
        { page : Page
        , menuState : MenuState
        , wideScreenMode : Bool
        , key : Browser.Navigation.Key
        }


type MenuState
    = NotOpenedYet
    | Close
    | Open


type Page
    = PageHome Home
    | PageUser
    | PageLikeAndHistory LikeAndHistory
    | PageExhibitionItem
    | PagePurchaseItem


type Home
    = Recent
    | Recommend
    | Free


type LikeAndHistory
    = Like
    | History


type Msg
    = ChangePage Page
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
        { page = PageHome Recommend
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
        ChangePage page ->
            ( Model
                { rec
                    | page = page
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
view (Model { page, menuState, wideScreenMode }) =
    { title = "つくマート"
    , body =
        [ header wideScreenMode
        , mainTab page
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


mainTab : Page -> Html.Html Msg
mainTab page =
    Html.div
        [ Html.Attributes.class "mainTab" ]
        (case page of
            PageHome tab ->
                [ ( Recent, "新着" ), ( Recommend, "おすすめ" ), ( Free, "0円" ) ]
                    |> mainTabItemList tab PageHome

            PageLikeAndHistory tab ->
                [ ( Like, "いいね" ), ( History, "閲覧履歴" ) ]
                    |> mainTabItemList tab PageLikeAndHistory

            PageExhibitionItem ->
                []

            PageUser ->
                []

            PagePurchaseItem ->
                []
        )


mainTabItemList : a -> (a -> Page) -> List ( a, String ) -> List (Html.Html Msg)
mainTabItemList selectedTab page tabList =
    (tabList
        |> List.map
            (\( tab, label ) ->
                mainTabItem (tab == selectedTab)
                    label
                    (ChangePage (page tab))
            )
    )
        ++ [ mainTabSelectLine
                (firstElementIndex selectedTab (List.map Tuple.first tabList) |> Maybe.withDefault 0)
                (List.length tabList)
           ]


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


mainTabItem : Bool -> String -> Msg -> Html.Html Msg
mainTabItem isSelected label clickEvent =
    if isSelected then
        Html.div
            [ Html.Attributes.class "mainTab-item-select" ]
            [ Html.text label ]

    else
        Html.div
            [ Html.Attributes.class "mainTab-item"
            , Html.Events.onClick clickEvent
            ]
            [ Html.text label ]


{-| タブの下線
-}
mainTabSelectLine : Int -> Int -> Html.Html Msg
mainTabSelectLine index count =
    Html.div [ Html.Attributes.class "mainTab-selectLineArea" ]
        [ Html.div
            [ Html.Attributes.class "mainTab-selectLine"
            , Html.Attributes.style "left" ("calc( 100% /" ++ String.fromInt count ++ " * " ++ String.fromInt index)
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
