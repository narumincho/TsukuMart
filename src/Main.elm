port module Main exposing (main)

import Browser
import Browser.Navigation
import Html
import Html.Attributes
import Html.Events
import Html.Keyed
import Url
import Url.Parser



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
    = MenuNotOpenedYet
    | MenuClose
    | MenuOpen


type Page
    = PageHome Home
    | PageUser
    | PageLikeAndHistory LikeAndHistory
    | PageExhibitionItemList
    | PagePurchaseItemList
    | PageExhibition


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
        { page = urlToPage url |> Maybe.withDefault (PageHome Recommend)
        , menuState = MenuNotOpenedYet
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
                    | menuState = MenuOpen
                }
            , Cmd.none
            )

        CloseMenu ->
            ( Model
                { rec
                    | menuState = MenuClose
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
                    ( case urlToPage url of
                        Just PageExhibition ->
                            Model { rec | page = PageExhibition, menuState = MenuNotOpenedYet }

                        Just page ->
                            Model { rec | page = page, menuState = MenuClose }

                        Nothing ->
                            Model { rec | menuState = MenuClose }
                    , Browser.Navigation.pushUrl rec.key (Url.toString url)
                    )

                Browser.External string ->
                    ( Model rec
                    , Browser.Navigation.load string
                    )


urlToPage : Url.Url -> Maybe Page
urlToPage url =
    Url.Parser.parse urlParser url


urlParser : Url.Parser.Parser (Page -> a) a
urlParser =
    Url.Parser.oneOf
        [ Url.Parser.map (PageHome Recommend) Url.Parser.top
        , Url.Parser.map (PageLikeAndHistory Like) (Url.Parser.s "like-history")
        , Url.Parser.map PageExhibitionItemList (Url.Parser.s "exhibition-item")
        , Url.Parser.map PagePurchaseItemList (Url.Parser.s "purchase-item")
        , Url.Parser.map PageExhibition (Url.Parser.s "exhibition")
        ]


view : Model -> { title : String, body : List (Html.Html Msg) }
view (Model { page, menuState, wideScreenMode }) =
    { title = "つくマート"
    , body =
        [ header wideScreenMode
        , mainTab page
        , menu wideScreenMode menuState
        ]
            ++ (if page == PageExhibition then
                    [ exhibitionView ]

                else
                    [ itemList wideScreenMode, exhibitButton ]
               )
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
                MenuNotOpenedYet ->
                    []

                MenuOpen ->
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

                MenuClose ->
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
        , Html.Attributes.href "/"
        ]
        [ Html.text "ホーム" ]
    , Html.a
        [ Html.Attributes.class "menu-item"
        , Html.Attributes.href "/like-history"
        ]
        [ Html.text "いいね・閲覧した商品" ]
    , Html.a
        [ Html.Attributes.class "menu-item"
        , Html.Attributes.href "exhibition-item"
        ]
        [ Html.text "出品した商品" ]
    , Html.a
        [ Html.Attributes.class "menu-item"
        , Html.Attributes.href "purchase-item"
        ]
        [ Html.text "購入した商品" ]
    ]



{- Main Tab -}


mainTab : Page -> Html.Html Msg
mainTab page =
    let
        tabList =
            case page of
                PageHome _ ->
                    [ ( PageHome Recent, "新着" ), ( PageHome Recommend, "おすすめ" ), ( PageHome Free, "0円" ) ]

                PageLikeAndHistory _ ->
                    [ ( PageLikeAndHistory Like, "いいね" ), ( PageLikeAndHistory History, "閲覧履歴" ) ]

                PagePurchaseItemList ->
                    [ ( PagePurchaseItemList, "購入した商品" ) ]

                PageExhibitionItemList ->
                    [ ( PageExhibitionItemList, "出品した商品" ) ]

                PageUser ->
                    []

                PageExhibition ->
                    [ ( PageExhibition, "商品の情報を入力" ) ]
    in
    Html.div
        [ Html.Attributes.class "mainTab"
        , Html.Attributes.style
            "grid-template-columns"
            (List.repeat (List.length tabList) "1fr" |> String.join " ")
        , Html.Attributes.style
            "height"
            (if tabList == [] then
                "0"

             else
                "3rem"
            )
        ]
        (case tabList of
            _ :: _ ->
                mainTabItemList page tabList

            [] ->
                []
        )


mainTabItemList : Page -> List ( Page, String ) -> List (Html.Html Msg)
mainTabItemList selectedPage tabList =
    (tabList
        |> List.map
            (\( tab, label ) ->
                mainTabItem (tab == selectedPage)
                    label
                    (ChangePage tab)
            )
    )
        ++ [ mainTabSelectLine
                (firstElementIndex selectedPage (List.map Tuple.first tabList) |> Maybe.withDefault 0)
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
            , Html.Attributes.style "left" ("calc( 100% /" ++ String.fromInt count ++ " * " ++ String.fromInt index ++ ")")
            , Html.Attributes.style "width" ("calc( 100% / " ++ String.fromInt count ++ ")")
            ]
            []
        ]


itemList : Bool -> Html.Html Msg
itemList isWideMode =
    Html.div
        [ Html.Attributes.class "itemList"
        , Html.Attributes.style "grid-template-columns"
            (if isWideMode then
                "33.3% 33.4% 33.3%"

             else
                "50% 50%"
            )
        ]
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
    Html.a
        [ Html.Attributes.class "exhibitButton"
        , Html.Attributes.href "/exhibition"
        ]
        [ Html.text "出品" ]


exhibitionView : Html.Html Msg
exhibitionView =
    Html.div
        [ Html.Attributes.class "exhibitionView" ]
        [ exhibitionViewPhoto
        , exhibitionViewItemTitleAndDescription
        ]


exhibitionViewPhoto : Html.Html Msg
exhibitionViewPhoto =
    Html.div
        [ Html.Attributes.class "exhibitionView-photo" ]
        [ Html.img
            [ Html.Attributes.src "assets/add_a_photo.svg"
            , Html.Attributes.class "exhibitionView-photo-icon"
            ]
            []
        ]


exhibitionViewItemTitleAndDescription : Html.Html Msg
exhibitionViewItemTitleAndDescription =
    Html.div
        []
        [ Html.input
            [ Html.Attributes.placeholder "商品名(40文字まで)"
            , Html.Attributes.class "exhibitionView-itemTitle"
            , Html.Attributes.maxlength 40
            ]
            []
        , Html.textarea
            [ Html.Attributes.placeholder "商品の説明"
            , Html.Attributes.class "exhibitionView-itemDescription"
            ]
            []
        ]


subscription : Model -> Sub Msg
subscription (Model { wideScreenMode }) =
    Sub.batch
        (if wideScreenMode then
            [ toNarrowScreenMode (always ToNarrowScreenMode) ]

         else
            [ toWideScreenMode (always ToWideScreenMode) ]
        )
