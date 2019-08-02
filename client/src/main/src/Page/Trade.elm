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
import Css
import Data.DateTime
import Data.LogInState as LogInState
import Data.Product as Product
import Data.Trade as Trade
import Data.User as User
import Html
import Html.Attributes
import Html.Events
import Html.Styled
import Html.Styled.Attributes
import Html.Styled.Events
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
        , sending : Maybe Sending
        }


type Sending
    = Comment
    | Finish
    | Cancel


type Msg
    = InputComment String
    | AddComment Api.Token
    | FinishTrade Api.Token
    | CancelTrade Api.Token
    | FinishTradeResponse (Result String Trade.TradeDetail)
    | CancelTradeResponse (Result String Trade.TradeDetail)
    | AddCommentResponse (Result String Trade.TradeDetail)
    | TradeDetailResponse (Result String Trade.TradeDetail)


type Emission
    = EmissionUpdateNowTime
    | EmissionGetTradeDetail Api.Token Trade.Id
    | EmissionAddComment Api.Token Trade.Id String
    | EmissionFinishTrade Api.Token Trade.Id
    | EmissionCancelTrade Api.Token Trade.Id
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

        AddComment token ->
            case model of
                Main rec ->
                    case rec.sending of
                        Just _ ->
                            ( model
                            , [ EmissionAddLogMessage "同時に複数のリクエストをすることはできません" ]
                            )

                        Nothing ->
                            ( Main { rec | sending = Just Comment }
                            , [ EmissionAddComment token (Trade.detailGetId rec.trade) rec.commentInput ]
                            )

                _ ->
                    ( model, [] )

        FinishTrade token ->
            case model of
                Main rec ->
                    case rec.sending of
                        Just _ ->
                            ( model
                            , [ EmissionAddLogMessage "同時に複数のリクエストをすることはできません" ]
                            )

                        Nothing ->
                            ( Main { rec | sending = Just Finish }
                            , [ EmissionFinishTrade token (Trade.detailGetId rec.trade) ]
                            )

                _ ->
                    ( model, [] )

        CancelTrade token ->
            case model of
                Main rec ->
                    case rec.sending of
                        Just _ ->
                            ( model
                            , [ EmissionAddLogMessage "同時に複数のリクエストをすることはできません" ]
                            )

                        Nothing ->
                            ( Main { rec | sending = Just Cancel }
                            , [ EmissionCancelTrade token (Trade.detailGetId rec.trade) ]
                            )

                _ ->
                    ( model, [] )

        FinishTradeResponse result ->
            case result of
                Ok trade ->
                    ( Main { trade = trade, commentInput = "", sending = Nothing }
                    , [ EmissionReplaceElementText { id = commentTextAreaId, text = "" }
                      , EmissionAddLogMessage
                            (case Trade.detailGetStatus trade of
                                Trade.Finish ->
                                    "取引を完了しました"

                                _ ->
                                    "相手の回答を待ちます"
                            )
                      ]
                    )

                Err errMsg ->
                    ( case model of
                        Main rec ->
                            Main { rec | sending = Nothing }

                        _ ->
                            model
                    , [ EmissionAddLogMessage ("取引の完了に失敗 " ++ errMsg) ]
                    )

        CancelTradeResponse result ->
            case result of
                Ok trade ->
                    ( Main { trade = trade, commentInput = "", sending = Nothing }
                    , [ EmissionReplaceElementText { id = commentTextAreaId, text = "" }
                      , EmissionAddLogMessage "取引をキャンセルしました"
                      , EmissionUpdateNowTime
                      ]
                    )

                Err errMsg ->
                    ( case model of
                        Main rec ->
                            Main { rec | sending = Nothing }

                        _ ->
                            model
                    , [ EmissionAddLogMessage ("取引のキャンセルに失敗 " ++ errMsg) ]
                    )

        AddCommentResponse result ->
            case result of
                Ok trade ->
                    ( Main { trade = trade, commentInput = "", sending = Nothing }
                    , [ EmissionReplaceElementText { id = commentTextAreaId, text = "" }
                      , EmissionUpdateNowTime
                      ]
                    )

                Err errMsg ->
                    ( case model of
                        Main rec ->
                            Main { rec | sending = Nothing }

                        _ ->
                            model
                    , [ EmissionAddLogMessage ("コメントの追加に失敗 " ++ errMsg) ]
                    )

        TradeDetailResponse result ->
            case result of
                Ok trade ->
                    ( Main { trade = trade, commentInput = "", sending = Nothing }
                    , [ EmissionReplaceElementText { id = commentTextAreaId, text = "" }
                      , EmissionUpdateNowTime
                      ]
                    )

                Err errMsg ->
                    ( case model of
                        Main rec ->
                            Main { rec | sending = Nothing }

                        _ ->
                            model
                    , [ EmissionAddLogMessage ("取引の情報の取得に失敗 " ++ errMsg) ]
                    )


view :
    LogInState.LogInState
    -> Maybe ( Time.Posix, Time.Zone )
    -> Model
    ->
        { title : Maybe String
        , tab : BasicParts.Tab Msg
        , html : List (Html.Styled.Html Msg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view logInState timeData model =
    { title = Just "取引"
    , tab = BasicParts.tabNone
    , html =
        [ Page.Style.container
            (case logInState of
                LogInState.Ok { token, userWithName } ->
                    case model of
                        CheckTrader id ->
                            [ Html.Styled.text ("id=" ++ Trade.idToString id ++ "の取引データを読み込み中")
                            , Icon.loading { size = 64, color = Css.rgb 0 0 0 }
                            ]

                        Loading trade ->
                            loadingView trade

                        Main { trade, sending } ->
                            mainView sending token timeData userWithName trade

                LogInState.LoadingProfile _ ->
                    [ Html.Styled.text "読み込み中"
                    , Icon.loading { size = 64, color = Css.rgb 0 0 0 }
                    ]

                LogInState.None ->
                    [ Html.Styled.text "取引するにはログインが必要です" ]
            )
        ]
    , bottomNavigation = Nothing
    }


loadingView : Trade.Trade -> List (Html.Styled.Html Msg)
loadingView trade =
    let
        product =
            Trade.getProduct trade
    in
    [ productImageView [ Product.getThumbnailImageUrl product ]
    , Page.Style.titleAndContent
        "商品名"
        (Html.div [] [ Html.text (Product.getName product) ])
    , Page.Style.titleAndContent
        "値段"
        (Html.div [] [ Html.text (Product.priceToString (Product.getPrice product)) ])
    , Html.Styled.text "読み込み中"
    , Icon.loading { size = 64, color = Css.rgb 0 0 0 }
    ]


mainView :
    Maybe Sending
    -> Api.Token
    -> Maybe ( Time.Posix, Time.Zone )
    -> User.WithName
    -> Trade.TradeDetail
    -> List (Html.Styled.Html Msg)
mainView sending token timeData user trade =
    let
        product =
            Trade.detailGetProduct trade

        tradeStatus =
            Trade.detailGetStatus trade

        position =
            if
                User.withNameGetId (Trade.detailGetBuyer trade)
                    == User.withNameGetId user
            then
                Trade.Buyer

            else
                Trade.Seller
    in
    [ productImageView (Product.detailGetImageUrls product)
    , Page.Style.titleAndContent
        "商品名"
        (Html.div [] [ Html.text (Product.detailGetName product) ])
    , Page.Style.titleAndContent
        "値段"
        (Html.div [] [ Html.text (Product.priceToString (Product.detailGetPrice product)) ])
    , Page.Style.titleAndContent
        "取引状態"
        (Html.text (Trade.statusToJapaneseString (Trade.detailGetStatus trade)))
    , Page.Style.titleAndContent
        "更新日時"
        (Html.text (Data.DateTime.toDiffString timeData (Trade.detailGetUpdateAt trade)))
    , Page.Style.titleAndContent
        "開始日時"
        (Html.text (Data.DateTime.toDiffString timeData (Trade.detailGetCreatedAt trade)))
    , Html.Styled.a
        [ Html.Styled.Attributes.css
            [ Css.display Css.block ]
        , Html.Styled.Attributes.href
            (PageLocation.toUrlAsString
                (PageLocation.Product
                    (Product.detailGetId product)
                )
            )
        ]
        [ Html.Styled.text "商品詳細ページ" ]
    , sellerAndBuyerView (Product.detailGetSeller product) (Trade.detailGetBuyer trade)
    ]
        ++ (case tradeStatus of
                Trade.InProgress ->
                    [ commentInputArea sending token ]

                Trade.WaitSellerFinish ->
                    [ commentInputArea sending token ]

                Trade.WaitBuyerFinish ->
                    [ commentInputArea sending token ]

                Trade.CancelBySeller ->
                    []

                Trade.CancelByBuyer ->
                    []

                Trade.Finish ->
                    []
           )
        ++ [ commentView timeData user trade ]
        ++ (case tradeStatus of
                Trade.InProgress ->
                    [ finishButton sending position token ]

                Trade.WaitSellerFinish ->
                    case position of
                        Trade.Buyer ->
                            []

                        Trade.Seller ->
                            [ finishButton sending position token ]

                Trade.WaitBuyerFinish ->
                    case position of
                        Trade.Buyer ->
                            [ finishButton sending position token ]

                        Trade.Seller ->
                            []

                _ ->
                    []
           )
        ++ (case tradeStatus of
                Trade.InProgress ->
                    [ cancelButton sending token ]

                Trade.WaitSellerFinish ->
                    [ cancelButton sending token ]

                Trade.WaitBuyerFinish ->
                    [ cancelButton sending token ]

                Trade.CancelBySeller ->
                    []

                Trade.CancelByBuyer ->
                    []

                Trade.Finish ->
                    []
           )


productImageView : List String -> Html.Styled.Html Msg
productImageView urlList =
    Html.Styled.div
        [ Html.Styled.Attributes.class "product-imageListContainer" ]
        [ Html.Styled.div
            [ Html.Styled.Attributes.class "product-imageList"
            ]
            (urlList |> List.map imageView)
        ]


imageView : String -> Html.Styled.Html msg
imageView url =
    Html.Styled.img
        [ Html.Styled.Attributes.class "product-image"
        , Html.Styled.Attributes.css
            [ Css.display Css.block ]
        , Html.Styled.Attributes.src url
        ]
        []


sellerAndBuyerView : User.WithName -> User.WithName -> Html.Styled.Html msg
sellerAndBuyerView seller buyer =
    Html.Styled.div
        [ Html.Styled.Attributes.css
            [ Css.displayFlex ]
        ]
        [ userView seller
        , Html.Styled.div
            [ Html.Styled.Attributes.css
                [ Css.fontSize (Css.px 32) ]
            ]
            [ Html.Styled.text "→" ]
        , userView buyer
        ]


userView : User.WithName -> Html.Styled.Html msg
userView userWithName =
    Html.Styled.a
        [ Html.Styled.Attributes.href
            (PageLocation.toUrlAsString
                (PageLocation.User (User.withNameGetId userWithName))
            )
        ]
        [ Page.Style.userImage 48 (User.withNameGetImageId userWithName)
        , Html.Styled.text (User.withNameGetDisplayName userWithName)
        ]


commentInputArea : Maybe Sending -> Api.Token -> Html.Styled.Html Msg
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
            ++ (case sending of
                    Just Comment ->
                        [ Html.button
                            [ Html.Attributes.class "product-comment-sendButton"
                            , Html.Attributes.disabled True
                            ]
                            [ Icon.loading { size = 24, color = Css.rgb 0 0 0 } |> Html.Styled.toUnstyled ]
                        ]

                    Just _ ->
                        [ Html.button
                            [ Html.Attributes.class "product-comment-sendButton"
                            , Html.Attributes.disabled True
                            ]
                            [ Html.text "コメントを送信" ]
                        ]

                    Nothing ->
                        [ Html.button
                            [ Html.Events.onClick (AddComment token)
                            , Html.Attributes.class "product-comment-sendButton"
                            ]
                            [ Html.text "コメントを送信" ]
                        ]
               )
        )
        |> Html.Styled.fromUnstyled


commentTextAreaId : String
commentTextAreaId =
    "comment-text-area"


commentView : Maybe ( Time.Posix, Time.Zone ) -> User.WithName -> Trade.TradeDetail -> Html.Styled.Html msg
commentView timeData user trade =
    Html.Styled.div
        []
        [ Page.Component.Comment.view timeData
            (trade
                |> Trade.detailGetComment
                |> List.map (tradeCommentToCommentData trade (User.withNameGetId user))
                |> Just
            )
            |> Html.Styled.fromUnstyled
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


finishButton : Maybe Sending -> Trade.SellerOrBuyer -> Api.Token -> Html.Styled.Html Msg
finishButton sending position token =
    case sending of
        Just Finish ->
            Html.Styled.button
                [ Html.Styled.Attributes.class "mainButton"
                , Html.Styled.Attributes.disabled True
                ]
                [ Icon.loading { size = 24, color = Css.rgb 0 0 0 } ]

        Just _ ->
            Html.Styled.button
                [ Html.Styled.Attributes.class "mainButton"
                , Html.Styled.Attributes.disabled True
                ]
                [ Html.Styled.text (finishText position) ]

        Nothing ->
            Html.Styled.button
                [ Html.Styled.Attributes.class "mainButton"
                , Html.Styled.Events.onClick (FinishTrade token)
                ]
                [ Html.Styled.text (finishText position) ]


finishText : Trade.SellerOrBuyer -> String
finishText position =
    case position of
        Trade.Seller ->
            "商品を渡した"

        Trade.Buyer ->
            "商品を受け取った"


cancelButton : Maybe Sending -> Api.Token -> Html.Styled.Html Msg
cancelButton sending token =
    case sending of
        Just Cancel ->
            Html.Styled.button
                [ Html.Styled.Attributes.class "product-deleteButton"
                , Html.Styled.Attributes.disabled True
                ]
                [ Icon.loading { size = 24, color = Css.rgb 0 0 0 } ]

        Just _ ->
            Html.Styled.button
                [ Html.Styled.Attributes.class "product-deleteButton"
                , Html.Styled.Attributes.disabled True
                ]
                [ Html.Styled.text "取引をキャンセルする" ]

        Nothing ->
            Html.Styled.button
                [ Html.Styled.Attributes.class "product-deleteButton"
                , Html.Styled.Events.onClick (CancelTrade token)
                ]
                [ Html.Styled.text "取引をキャンセルする" ]
