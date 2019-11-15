module Page.Trade exposing
    ( Cmd(..)
    , Model
    , Msg(..)
    , initModelFromId
    , initModelFromTrade
    , update
    , view
    )

import Api
import BasicParts
import Component.Comment
import Css
import Data.DateTime
import Data.LogInState as LogInState
import Data.Product as Product
import Data.Trade as Trade
import Data.User as User
import Html
import Html.Styled
import Html.Styled.Attributes
import Html.Styled.Events
import Icon
import Page.Style
import PageLocation
import Time


type Model
    = CheckingTrader Trade.Id
    | Main
        { trade : Trade.Trade
        , commentInput : String
        , sending : Maybe Sending
        , comments : Maybe (List Trade.Comment)
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
    | FinishTradeResponse (Result String ( Trade.Trade, List Trade.Comment ))
    | CancelTradeResponse (Result String ( Trade.Trade, List Trade.Comment ))
    | AddCommentResponse (Result String ( Trade.Trade, List Trade.Comment ))
    | TradeResponse (Result String ( Trade.Trade, List Trade.Comment ))


type Cmd
    = CmdUpdateNowTime
    | CmdGetTrade Api.Token Trade.Id
    | CmdAddComment Api.Token Trade.Id String
    | CmdFinishTrade Api.Token Trade.Id
    | CmdCancelTrade Api.Token Trade.Id
    | CmdAddLogMessage String
    | CmdReplaceElementText { id : String, text : String }


initModelFromId : LogInState.LogInState -> Trade.Id -> ( Model, List Cmd )
initModelFromId logInState id =
    ( CheckingTrader id
    , case LogInState.getToken logInState of
        Just token ->
            [ CmdGetTrade token id ]

        Nothing ->
            []
    )


initModelFromTrade : LogInState.LogInState -> Trade.Trade -> ( Model, List Cmd )
initModelFromTrade logInState trade =
    ( Main
        { trade = trade
        , commentInput = ""
        , sending = Nothing
        , comments = Nothing
        }
    , case LogInState.getToken logInState of
        Just token ->
            [ CmdGetTrade token (Trade.getId trade) ]

        Nothing ->
            []
    )


update : Msg -> Model -> ( Model, List Cmd )
update msg model =
    case ( msg, model ) of
        ( InputComment string, Main rec ) ->
            ( Main { rec | commentInput = string }
            , []
            )

        ( AddComment token, Main rec ) ->
            case rec.sending of
                Just _ ->
                    ( model
                    , [ CmdAddLogMessage "同時に複数のリクエストをすることはできません" ]
                    )

                Nothing ->
                    ( Main { rec | sending = Just Comment }
                    , [ CmdAddComment token (Trade.getId rec.trade) rec.commentInput ]
                    )

        ( FinishTrade token, Main rec ) ->
            case rec.sending of
                Just _ ->
                    ( model
                    , [ CmdAddLogMessage "同時に複数のリクエストをすることはできません" ]
                    )

                Nothing ->
                    ( Main { rec | sending = Just Finish }
                    , [ CmdFinishTrade token (Trade.getId rec.trade) ]
                    )

        ( CancelTrade token, Main rec ) ->
            case rec.sending of
                Just _ ->
                    ( model
                    , [ CmdAddLogMessage "同時に複数のリクエストをすることはできません" ]
                    )

                Nothing ->
                    ( Main { rec | sending = Just Cancel }
                    , [ CmdCancelTrade token (Trade.getId rec.trade) ]
                    )

        ( FinishTradeResponse result, Main rec ) ->
            case result of
                Ok ( trade, comments ) ->
                    ( Main { trade = trade, commentInput = "", sending = Nothing, comments = Just comments }
                    , [ CmdReplaceElementText { id = commentTextAreaId, text = "" }
                      , CmdAddLogMessage
                            (case Trade.getStatus trade of
                                Trade.Finish ->
                                    "取引を完了しました"

                                _ ->
                                    "相手の回答を待ちます"
                            )
                      ]
                    )

                Err errMsg ->
                    ( Main { rec | sending = Nothing }
                    , [ CmdAddLogMessage ("取引の完了に失敗 " ++ errMsg) ]
                    )

        ( CancelTradeResponse result, Main rec ) ->
            case result of
                Ok ( trade, comments ) ->
                    ( Main { trade = trade, commentInput = "", sending = Nothing, comments = Just comments }
                    , [ CmdReplaceElementText { id = commentTextAreaId, text = "" }
                      , CmdAddLogMessage "取引をキャンセルしました"
                      , CmdUpdateNowTime
                      ]
                    )

                Err errMsg ->
                    ( Main { rec | sending = Nothing }
                    , [ CmdAddLogMessage ("取引のキャンセルに失敗 " ++ errMsg) ]
                    )

        ( AddCommentResponse result, Main rec ) ->
            case result of
                Ok ( trade, comments ) ->
                    ( Main { trade = trade, commentInput = "", sending = Nothing, comments = Just comments }
                    , [ CmdReplaceElementText { id = commentTextAreaId, text = "" }
                      , CmdUpdateNowTime
                      ]
                    )

                Err errMsg ->
                    ( Main { rec | sending = Nothing }
                    , [ CmdAddLogMessage ("コメントの追加に失敗 " ++ errMsg) ]
                    )

        ( TradeResponse result, _ ) ->
            case result of
                Ok ( trade, comments ) ->
                    ( Main { trade = trade, commentInput = "", sending = Nothing, comments = Just comments }
                    , [ CmdReplaceElementText { id = commentTextAreaId, text = "" }
                      , CmdUpdateNowTime
                      ]
                    )

                Err errMsg ->
                    ( case model of
                        Main rec ->
                            Main { rec | sending = Nothing }

                        _ ->
                            model
                    , [ CmdAddLogMessage ("取引の情報の取得に失敗 " ++ errMsg) ]
                    )

        ( _, CheckingTrader _ ) ->
            ( model
            , [ CmdAddLogMessage "取引の関係者かどうか調べているときに取引に関する結果を受け取ってしまった" ]
            )


view :
    LogInState.LogInState
    -> Maybe ( Time.Posix, Time.Zone )
    -> Maybe (List Product.Product)
    -> Model
    ->
        { title : Maybe String
        , tab : BasicParts.Tab Msg
        , html : List (Html.Styled.Html Msg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view logInState timeData allProductsMaybe model =
    { title = Just "取引"
    , tab = BasicParts.tabNone
    , html =
        [ Page.Style.container
            (case logInState of
                LogInState.Ok { token, userWithName } ->
                    case model of
                        CheckingTrader id ->
                            [ Html.Styled.text ("id=" ++ Trade.idToString id ++ "の取引の関係者かどうかの調べてる")
                            , Icon.loading { size = 64, color = Css.rgb 0 0 0 }
                            ]

                        Main { trade, sending, comments } ->
                            case allProductsMaybe of
                                Just allProducts ->
                                    mainView sending token timeData userWithName allProducts comments trade

                                Nothing ->
                                    [ Html.Styled.text "商品データの読み込み中"
                                    , Icon.loading { size = 64, color = Css.rgb 0 0 0 }
                                    ]

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


mainView :
    Maybe Sending
    -> Api.Token
    -> Maybe ( Time.Posix, Time.Zone )
    -> User.WithName
    -> List Product.Product
    -> Maybe (List Trade.Comment)
    -> Trade.Trade
    -> List (Html.Styled.Html Msg)
mainView sending token timeData user allProducts comments trade =
    let
        product =
            allProducts |> Product.searchFromId (Trade.getProductId trade)

        tradeStatus =
            Trade.getStatus trade

        position =
            if
                User.withNameGetId (Trade.getBuyer trade)
                    == User.withNameGetId user
            then
                Trade.Buyer

            else
                Trade.Seller
    in
    [ productImageView (Product.getImageUrls product)
    , Page.Style.titleAndContent
        "商品名"
        (Html.div [] [ Html.text (Product.getName product) ])
    , Page.Style.titleAndContent
        "値段"
        (Html.div [] [ Html.text (Product.priceToString (Product.getPrice product)) ])
    , Page.Style.titleAndContent
        "取引状態"
        (Html.text (Trade.statusToJapaneseString (Trade.getStatus trade)))
    , Page.Style.titleAndContent
        "更新日時"
        (Html.text (Data.DateTime.toDiffString timeData (Trade.getUpdateAt trade)))
    , Page.Style.titleAndContent
        "開始日時"
        (Html.text (Data.DateTime.toDiffString timeData (Trade.getCreatedAt trade)))
    , Html.Styled.a
        [ Html.Styled.Attributes.css
            [ Css.display Css.block ]
        , Html.Styled.Attributes.href
            (PageLocation.toUrlAsString
                (PageLocation.Product
                    (Trade.getProductId trade)
                )
            )
        ]
        [ Html.Styled.text "商品詳細ページ" ]
    , sellerAndBuyerView (Product.getSeller product) (Trade.getBuyer trade)
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
        ++ [ commentView timeData user allProducts trade comments ]
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
    Html.Styled.div
        []
        ([ Html.Styled.textarea
            [ Html.Styled.Events.onInput InputComment
            , Html.Styled.Attributes.class "form-textarea"
            , Html.Styled.Attributes.id commentTextAreaId
            ]
            []
         ]
            ++ (case sending of
                    Just Comment ->
                        [ Html.Styled.button
                            [ Html.Styled.Attributes.css [ Component.Comment.commentSendButtonStyle ]
                            , Html.Styled.Attributes.disabled True
                            ]
                            [ Icon.loading { size = 24, color = Css.rgb 0 0 0 } ]
                        ]

                    Just _ ->
                        [ Html.Styled.button
                            [ Html.Styled.Attributes.css [ Component.Comment.commentSendButtonStyle ]
                            , Html.Styled.Attributes.disabled True
                            ]
                            [ Html.Styled.text "コメントを送信" ]
                        ]

                    Nothing ->
                        [ Html.Styled.button
                            [ Html.Styled.Events.onClick (AddComment token)
                            , Html.Styled.Attributes.css [ Component.Comment.commentSendButtonStyle ]
                            ]
                            [ Html.Styled.text "コメントを送信" ]
                        ]
               )
        )


commentTextAreaId : String
commentTextAreaId =
    "comment-text-area"


commentView :
    Maybe ( Time.Posix, Time.Zone )
    -> User.WithName
    -> List Product.Product
    -> Trade.Trade
    -> Maybe (List Trade.Comment)
    -> Html.Styled.Html msg
commentView timeData user allProducts trade commentsMaybe =
    Html.Styled.div
        []
        [ Component.Comment.view timeData
            (commentsMaybe
                |> Maybe.map
                    (List.map
                        (tradeCommentToCommentData trade
                            (User.withNameGetId user)
                            (allProducts
                                |> Product.searchFromId (Trade.getProductId trade)
                                |> Product.getSeller
                            )
                        )
                    )
            )
        ]


tradeCommentToCommentData :
    Trade.Trade
    -> User.Id
    -> User.WithName
    -> Trade.Comment
    ->
        { isMine : Bool
        , isSeller : Bool
        , user : User.WithName
        , body : String
        , createdAt : Time.Posix
        }
tradeCommentToCommentData trade myId seller (Trade.Comment { body, speaker, createdAt }) =
    case speaker of
        Trade.Seller ->
            { isMine = User.withNameGetId seller == myId
            , isSeller = True
            , user = seller
            , body = body
            , createdAt = createdAt
            }

        Trade.Buyer ->
            let
                commentUser =
                    trade |> Trade.getBuyer
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
