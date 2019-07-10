module Page.Trade exposing
    ( Emission(..)
    , Model
    , Msg(..)
    , initModelFromId
    , initModelFromTrade
    , update
    , view
    )

import Api
import BasicParts
import Data.LogInState as LogInState
import Data.Product as Product
import Data.Trade as Trade
import Data.User as User
import Html
import Html.Attributes
import Html.Events
import Icon
import Page.Component.Comment
import Page.Style
import PageLocation
import Time


type Model
    = CheckTrader Trade.Id
    | Loading Trade.Trade
    | Main
        { trade : Trade.TradeDetail
        , commentInput : String
        , commentSending : Bool
        }


type Msg
    = InputComment String
    | SendComment Api.Token
    | TradeDetailResponse (Result String Trade.TradeDetail)


type Emission
    = EmissionGetTradeDetail Api.Token Trade.Id
    | EmissionSendComment Api.Token Trade.Id String
    | EmissionAddLogMessage String
    | EmissionReplaceElementText { id : String, text : String }


initModelFromId : LogInState.LogInState -> Trade.Id -> ( Model, List Emission )
initModelFromId logInState id =
    ( CheckTrader id
    , case LogInState.getToken logInState of
        Just token ->
            [ EmissionGetTradeDetail token id ]

        Nothing ->
            []
    )


initModelFromTrade : LogInState.LogInState -> Trade.Trade -> ( Model, List Emission )
initModelFromTrade logInState trade =
    ( Loading trade
    , case LogInState.getToken logInState of
        Just token ->
            [ EmissionGetTradeDetail token (Trade.getId trade) ]

        Nothing ->
            []
    )


update : Msg -> Model -> ( Model, List Emission )
update msg model =
    case msg of
        InputComment string ->
            case model of
                Main rec ->
                    ( Main { rec | commentInput = string }
                    , []
                    )

                _ ->
                    ( model, [] )

        SendComment token ->
            case model of
                Main rec ->
                    ( Main { rec | commentSending = True }
                    , [ EmissionSendComment token (Trade.detailGetId rec.trade) rec.commentInput ]
                    )

                _ ->
                    ( model, [] )

        TradeDetailResponse result ->
            case result of
                Ok trade ->
                    ( Main { trade = trade, commentInput = "", commentSending = False }
                    , [ EmissionReplaceElementText { id = commentTextAreaId, text = "" } ]
                    )

                Err errMsg ->
                    ( case model of
                        Main rec ->
                            Main { rec | commentSending = False }

                        _ ->
                            model
                    , [ EmissionAddLogMessage ("取引の情報取得に失敗 " ++ errMsg) ]
                    )


view :
    LogInState.LogInState
    -> Maybe ( Time.Posix, Time.Zone )
    -> Model
    ->
        { title : Maybe String
        , tab : BasicParts.Tab Msg
        , html : List (Html.Html Msg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view logInState timeData model =
    { title = Just "取引"
    , tab = BasicParts.tabNone
    , html =
        [ Html.div
            [ Html.Attributes.class "container" ]
            [ Html.div
                [ Html.Attributes.class "product" ]
                (case logInState of
                    LogInState.Ok { token, userWithName } ->
                        case model of
                            CheckTrader id ->
                                [ Html.text ("id=" ++ Trade.idToString id ++ "の取引データを読み込み中")
                                , Icon.loading { size = 64, color = "black" }
                                ]

                            Loading trade ->
                                loadingView trade

                            Main { trade, commentSending } ->
                                mainView commentSending token timeData userWithName trade

                    LogInState.LoadingProfile _ ->
                        [ Html.text "読み込み中"
                        , Icon.loading { size = 64, color = "black" }
                        ]

                    LogInState.None ->
                        [ Html.text "取引するにはログインが必要です" ]
                )
            ]
        ]
    , bottomNavigation = Nothing
    }


loadingView : Trade.Trade -> List (Html.Html Msg)
loadingView trade =
    let
        product =
            Trade.getProduct trade
    in
    [ Html.div
        []
        [ Html.text "読み込み中"
        , Icon.loading { size = 64, color = "black" }
        ]
    ]


mainView : Bool -> Api.Token -> Maybe ( Time.Posix, Time.Zone ) -> User.WithName -> Trade.TradeDetail -> List (Html.Html Msg)
mainView commentSending token timeData user trade =
    let
        product =
            Trade.detailGetProduct trade
    in
    [ productImageView (Product.detailGetImageUrls product)
    , Page.Style.titleAndContent
        "商品名"
        (Html.text (Product.detailGetName product))
    , Page.Style.titleAndContent
        "値段"
        (Html.text (Product.priceToString (Product.detailGetPrice product)))
    , Html.a
        [ Html.Attributes.style "display" "block"
        , Html.Attributes.href
            (PageLocation.toUrlAsString
                (PageLocation.Product
                    (Product.detailGetId product)
                )
            )
        ]
        [ Html.text "商品詳細ページ" ]
    , sellerAndBuyerView (Product.detailGetSeller product) (Trade.detailGetBuyer trade)
    , commentInputArea commentSending token
    , commentView timeData user trade
    ]


productImageView : List String -> Html.Html Msg
productImageView urlList =
    Html.div
        [ Html.Attributes.class "product-imageListContainer" ]
        [ Html.div
            [ Html.Attributes.class "product-imageList"
            ]
            (urlList |> List.map imageView)
        ]


imageView : String -> Html.Html msg
imageView url =
    Html.img
        [ Html.Attributes.class "product-image"
        , Html.Attributes.src url
        ]
        []


sellerAndBuyerView : User.WithName -> User.WithName -> Html.Html msg
sellerAndBuyerView seller buyer =
    Html.div
        [ Html.Attributes.style "display" "flex"
        ]
        [ userView seller
        , Html.div [ Html.Attributes.style "font-size" "32px" ] [ Html.text "→" ]
        , userView buyer
        ]


userView : User.WithName -> Html.Html msg
userView userWithName =
    Html.a
        [ Html.Attributes.href
            (PageLocation.toUrlAsString
                (PageLocation.User (User.withNameGetId userWithName))
            )
        ]
        [ Html.img
            [ Html.Attributes.src (User.withNameGetImageUrl userWithName)
            , Html.Attributes.style "border-radius" "50%"
            , Html.Attributes.style "width" "48px"
            , Html.Attributes.style "height" "48px"
            ]
            []
        , Html.text (User.withNameGetDisplayName userWithName)
        ]


commentInputArea : Bool -> Api.Token -> Html.Html Msg
commentInputArea sending token =
    Html.div
        []
        ([ Html.textarea
            [ Html.Events.onInput InputComment
            , Html.Attributes.class "form-textarea"
            , Html.Attributes.id commentTextAreaId
            ]
            []
         ]
            ++ (if sending then
                    [ Html.button
                        [ Html.Attributes.class "product-comment-sendButton"
                        , Html.Attributes.disabled True
                        ]
                        [ Icon.loading { size = 24, color = "black" } ]
                    ]

                else
                    [ Html.button
                        [ Html.Events.onClick (SendComment token)
                        , Html.Attributes.class "product-comment-sendButton"
                        ]
                        [ Html.text "コメントを送信" ]
                    ]
               )
        )


commentTextAreaId : String
commentTextAreaId =
    "comment-text-area"


commentView : Maybe ( Time.Posix, Time.Zone ) -> User.WithName -> Trade.TradeDetail -> Html.Html msg
commentView timeData user trade =
    Html.div
        []
        [ Page.Component.Comment.view timeData
            (trade
                |> Trade.detailGetComment
                |> List.map (tradeCommentToCommentData trade (User.withNameGetId user))
                |> Just
            )
        ]


tradeCommentToCommentData :
    Trade.TradeDetail
    -> User.Id
    -> Trade.Comment
    ->
        { isMine : Bool
        , isSeller : Bool
        , user : User.WithName
        , body : String
        , createdAt : Time.Posix
        }
tradeCommentToCommentData trade myId (Trade.Comment { body, speaker, createdAt }) =
    case speaker of
        Trade.Seller ->
            let
                commentUser =
                    trade |> Trade.detailGetProduct |> Product.detailGetSeller
            in
            { isMine = User.withNameGetId commentUser == myId
            , isSeller = True
            , user = commentUser
            , body = body
            , createdAt = createdAt
            }

        Trade.Buyer ->
            let
                commentUser =
                    trade |> Trade.detailGetBuyer
            in
            { isMine = User.withNameGetId commentUser == myId
            , isSeller = False
            , user = commentUser
            , body = body
            , createdAt = createdAt
            }
