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
import Icon
import Page.Component.Comment
import Time


type Model
    = CheckTrader Trade.Id
    | Loading Trade.Trade
    | Main
        { trade : Trade.TradeDetail
        , commentInput : String
        }


type Msg
    = InputComment String
    | TradeDetailResponse (Result String Trade.TradeDetail)


type Emission
    = EmissionGetTradeDetail Api.Token Trade.Id
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

        TradeDetailResponse result ->
            case result of
                Ok trade ->
                    ( Main { trade = trade, commentInput = "" }
                    , []
                    )

                Err errMsg ->
                    ( model
                    , [ EmissionAddLogMessage errMsg ]
                    )


view :
    LogInState.LogInState
    -> Maybe ( Time.Posix, Time.Zone )
    -> Model
    -> { title : Maybe String, tab : BasicParts.Tab Msg, html : List (Html.Html Msg) }
view logInState timeData model =
    { title = Just "取引"
    , tab = BasicParts.tabNone
    , html =
        case logInState of
            LogInState.Ok { token, userWithName } ->
                case model of
                    CheckTrader id ->
                        [ Html.text "取引データを読み込み中"
                        , Icon.loading { size = 64, color = "black" }
                        ]

                    Loading trade ->
                        loadingView trade

                    Main { trade } ->
                        mainView timeData userWithName trade

            LogInState.LoadingProfile _ ->
                [ Html.text "読み込み中"
                , Icon.loading { size = 64, color = "black" }
                ]

            LogInState.None ->
                [ Html.text "取引するにはログインが必要です" ]
    }


loadingView : Trade.Trade -> List (Html.Html Msg)
loadingView trade =
    let
        product =
            Trade.getProduct trade
    in
    [ Html.div
        []
        []
    ]


mainView : Maybe ( Time.Posix, Time.Zone ) -> User.WithName -> Trade.TradeDetail -> List (Html.Html Msg)
mainView timeData user trade =
    let
        product =
            Trade.detailGetProduct trade
    in
    [ productImageView (Product.detailGetImageUrls product)
    , Html.div
        []
        [ Html.text (Product.detailGetName product) ]
    , Html.div
        []
        [ Html.text (String.fromInt (Product.detailGetPrice product)) ]
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
