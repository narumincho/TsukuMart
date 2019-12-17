module Page.Product exposing
    ( Cmd(..)
    , Model
    , Msg(..)
    , getProductId
    , initModel
    , update
    , view
    )

{-| 商品の詳細表示
-}

import Api
import BasicParts
import Component.Comment
import Component.ProductEditor as ProductEditor
import Css
import Data.Category as Category
import Data.DateTime
import Data.LogInState as LogInState
import Data.Product as Product
import Data.Trade as Trade
import Data.User as User
import Html.Styled
import Html.Styled.Attributes
import Html.Styled.Events
import Icon
import PageLocation
import Style
import Time



{- 商品詳細ページ -}


type Model
    = Normal
        { product : Product.Id
        , commentList : Maybe (List Product.Comment)
        , likeSending : Bool
        , commentSending : Bool
        , comment : String
        }
    | Edit
        { beforeProduct : Product.Id
        , productEditor : ProductEditor.Model
        , sending : Bool
        }
    | EditConfirm Product.Id


type Cmd
    = CmdGetProductAndMarkHistory { productId : Product.Id, token : Api.Token }
    | CmdGetCommentList Product.Id
    | CmdAddComment Api.Token { productId : Product.Id } String
    | CmdLike Api.Token Product.Id
    | CmdUnLike Api.Token Product.Id
    | CmdTradeStart Api.Token Product.Id
    | CmdAddLogMessage String
    | CmdUpdateNowTime
    | CmdDelete Api.Token Product.Id
    | CmdJumpToTradePage Trade.Trade
    | CmdByProductEditor ProductEditor.Cmd
    | CmdUpdateProductData Api.Token Product.Id Api.UpdateProductRequest
    | CmdReplaceElementText { id : String, text : String }
    | CmdJumpToHome
    | CmdScrollToTop


type Msg
    = GetCommentListResponse (Result String (List Product.Comment))
    | Like Api.Token Product.Id
    | UnLike Api.Token Product.Id
    | LikeResponse (Result String ())
    | UnlikeResponse (Result String ())
    | TradeStart Api.Token Product.Id
    | TradeStartResponse (Result String Trade.Trade)
    | ToConfirmPage
    | InputComment String
    | SendComment Api.Token
    | Delete Api.Token Product.Id
    | DeleteResponse (Result String ())
    | EditProduct
    | MsgBackToViewMode
    | MsgByProductEditor ProductEditor.Msg
    | UpdateProductData Api.Token Product.Id Api.UpdateProductRequest
    | UpdateProductDataResponse (Result String ())


{-| 指定したIDの商品詳細ページ
-}
initModel : LogInState.LogInState -> Product.Id -> ( Model, List Cmd )
initModel logInState id =
    ( Normal
        { product = id
        , commentList = Nothing
        , likeSending = False
        , commentSending = False
        , comment = ""
        }
    , (case LogInState.getToken logInState of
        Just accessToken ->
            [ CmdGetProductAndMarkHistory
                { productId = id
                , token = accessToken
                }
            ]

        Nothing ->
            []
      )
        ++ [ CmdGetCommentList id, CmdScrollToTop ]
    )


{-| 表示している商品のIDを取得する
-}
getProductId : Model -> Product.Id
getProductId model =
    case model of
        Normal { product } ->
            product

        Edit { beforeProduct } ->
            beforeProduct

        EditConfirm productId ->
            productId


update : Maybe (List Product.Product) -> Msg -> Model -> ( Model, List Cmd )
update allProductsMaybe msg model =
    case msg of
        GetCommentListResponse commentListResult ->
            case ( model, commentListResult ) of
                ( Normal rec, Ok commentList ) ->
                    ( Normal
                        { rec
                            | product = rec.product
                            , commentList = Just commentList
                            , comment = ""
                            , commentSending = False
                        }
                    , [ CmdReplaceElementText
                            { id = commentTextAreaId
                            , text = ""
                            }
                      , CmdUpdateNowTime
                      ]
                    )

                ( _, Err text ) ->
                    ( model
                    , [ CmdAddLogMessage ("コメント取得に失敗しました " ++ text) ]
                    )

                ( _, _ ) ->
                    ( model
                    , [ CmdAddLogMessage "画面がNormalでないときにコメントを受け取ってしまった" ]
                    )

        Like token id ->
            ( case model of
                Normal rec ->
                    Normal { rec | likeSending = True }

                _ ->
                    model
            , [ CmdLike token id ]
            )

        UnLike token id ->
            ( case model of
                Normal rec ->
                    Normal { rec | likeSending = True }

                _ ->
                    model
            , [ CmdUnLike token id ]
            )

        LikeResponse result ->
            case ( result, model ) of
                ( Ok (), Normal rec ) ->
                    ( Normal
                        { rec
                            | likeSending = False
                        }
                    , []
                    )

                ( Ok (), _ ) ->
                    ( model
                    , []
                    )

                ( Err text, _ ) ->
                    ( model
                    , [ CmdAddLogMessage ("いいねをするのに失敗 " ++ text) ]
                    )

        UnlikeResponse result ->
            case ( result, model ) of
                ( Ok (), Normal rec ) ->
                    ( Normal
                        { rec
                            | likeSending = False
                        }
                    , []
                    )

                ( Ok (), _ ) ->
                    ( model
                    , []
                    )

                ( Err text, _ ) ->
                    ( model
                    , [ CmdAddLogMessage ("いいねを外すのに失敗 " ++ text) ]
                    )

        TradeStart token productId ->
            ( model
            , [ CmdTradeStart token productId ]
            )

        TradeStartResponse result ->
            ( model
            , case result of
                Ok trade ->
                    [ CmdAddLogMessage "取引開始"
                    , CmdJumpToTradePage trade
                    ]

                Err text ->
                    [ CmdAddLogMessage ("取引開始を失敗しました " ++ text) ]
            )

        ToConfirmPage ->
            ( case model of
                Normal { product } ->
                    EditConfirm product

                _ ->
                    model
            , []
            )

        InputComment string ->
            case model of
                Normal rec ->
                    ( Normal { rec | comment = string }
                    , []
                    )

                _ ->
                    ( model
                    , []
                    )

        SendComment token ->
            case model of
                Normal rec ->
                    ( Normal { rec | commentSending = True }
                    , [ CmdAddComment token { productId = rec.product } rec.comment ]
                    )

                _ ->
                    ( model
                    , []
                    )

        Delete token productId ->
            ( model
            , [ CmdDelete token productId ]
            )

        DeleteResponse result ->
            ( model
            , case result of
                Ok () ->
                    [ CmdAddLogMessage "商品の削除に成功しました"
                    , CmdJumpToHome
                    ]

                Err errorMessage ->
                    [ CmdAddLogMessage ("商品の削除に失敗しました" ++ errorMessage) ]
            )

        EditProduct ->
            case ( model, allProductsMaybe ) of
                ( Normal { product }, Just allProducts ) ->
                    let
                        productData =
                            allProducts |> Product.searchFromId product

                        ( productEditorMode, productEditorCmdList ) =
                            ProductEditor.initModel
                                { name = Product.getName productData
                                , description = Product.getDescription productData
                                , price = Product.getPrice productData
                                , condition = Product.getCondition productData
                                , category = Product.getCategory productData
                                , imageIds = Product.getImageIds productData
                                }
                    in
                    ( Edit
                        { beforeProduct = product
                        , productEditor = productEditorMode
                        , sending = False
                        }
                    , productEditorCmdList |> List.map CmdByProductEditor
                    )

                ( _, _ ) ->
                    ( model, [] )

        MsgBackToViewMode ->
            case model of
                Edit { beforeProduct } ->
                    ( Normal
                        { product = beforeProduct
                        , likeSending = False
                        , commentList = Nothing
                        , commentSending = False
                        , comment = ""
                        }
                    , [ CmdGetCommentList beforeProduct ]
                    )

                _ ->
                    ( model, [] )

        MsgByProductEditor productEditorMsg ->
            ( case model of
                Edit r ->
                    Edit
                        { r
                            | productEditor =
                                ProductEditor.update productEditorMsg r.productEditor
                        }

                _ ->
                    model
            , []
            )

        UpdateProductData token productId requestData ->
            ( case model of
                Edit rec ->
                    Edit { rec | sending = True }

                _ ->
                    model
            , [ CmdUpdateProductData token productId requestData
              ]
            )

        UpdateProductDataResponse result ->
            case result of
                Ok () ->
                    ( Normal
                        { product = getProductId model
                        , likeSending = False
                        , commentSending = False
                        , comment = ""
                        , commentList = Nothing
                        }
                    , [ CmdGetCommentList (getProductId model) ]
                    )

                Err text ->
                    case model of
                        Edit rec ->
                            ( Edit { rec | sending = False }
                            , [ CmdAddLogMessage ("商品の編集に失敗しました " ++ text) ]
                            )

                        _ ->
                            ( model
                            , [ CmdAddLogMessage ("商品の編集に失敗しました " ++ text) ]
                            )


view :
    LogInState.LogInState
    -> Bool
    -> Maybe ( Time.Posix, Time.Zone )
    -> Maybe (List Product.Product)
    -> Model
    ->
        { title : Maybe String
        , tab : BasicParts.Tab Msg
        , view : Html.Styled.Html Msg
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view logInState isWideScreen nowMaybe productAllMaybe model =
    case ( model, productAllMaybe ) of
        ( _, Nothing ) ->
            { title = Just "商品詳細ページ 読み込み中"
            , tab = BasicParts.tabNone
            , view =
                Style.mainView
                    [ Style.container
                        [ Html.Styled.text "読み込み中"
                        , Icon.loading { size = 48, color = Css.rgb 0 0 0 }
                        ]
                    ]
            , bottomNavigation = Nothing
            }

        ( Normal rec, Just productAll ) ->
            normalView
                logInState
                isWideScreen
                nowMaybe
                { likeSending = rec.likeSending
                , commentText = rec.comment
                , commentSending = rec.commentSending
                , product = productAll |> Product.searchFromId rec.product
                , commentList = rec.commentList
                }

        ( Edit { productEditor, beforeProduct, sending }, Just productAll ) ->
            let
                productId =
                    productAll |> Product.searchFromId beforeProduct
            in
            { title = Just (Product.getName productId)
            , tab = BasicParts.tabNone
            , view =
                Style.mainView
                    [ Style.containerKeyed
                        (case LogInState.getToken logInState of
                            Just accessToken ->
                                (ProductEditor.view productEditor
                                    |> List.map (Tuple.mapSecond (Html.Styled.map MsgByProductEditor))
                                )
                                    ++ [ ( "okButton"
                                         , editOkCancelButton
                                            accessToken
                                            beforeProduct
                                            sending
                                            (ProductEditor.toUpdateRequest productEditor)
                                         )
                                       ]

                            Nothing ->
                                [ ( "needLogIn", Html.Styled.text "ログインしていないときに商品の編集はできません" ) ]
                        )
                    ]
            , bottomNavigation = Nothing
            }

        ( EditConfirm product, Just productAll ) ->
            let
                productData =
                    productAll |> Product.searchFromId product
            in
            { title = Just (Product.getName productData)
            , tab = BasicParts.tabNone
            , view =
                Style.mainView
                    [ Style.container
                        [ Html.Styled.text "購入確認画面。この商品の取引を開始しますか?"
                        , Style.productImageList (Product.getImageUrls productData)
                        , productsViewName (Product.getName productData)
                        , descriptionView (Product.getDescription productData)
                        , conditionView (Product.getCondition productData)
                        , tradeStartButton logInState product
                        ]
                    ]
            , bottomNavigation = Nothing
            }


normalView :
    LogInState.LogInState
    -> Bool
    -> Maybe ( Time.Posix, Time.Zone )
    ->
        { product : Product.Product
        , likeSending : Bool
        , commentText : String
        , commentSending : Bool
        , commentList : Maybe (List Product.Comment)
        }
    ->
        { title : Maybe String
        , tab : BasicParts.Tab Msg
        , view : Html.Styled.Html Msg
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
normalView logInState isWideScreen nowMaybe data =
    { title = Just (Product.getName data.product)
    , tab = BasicParts.tabNone
    , view =
        Html.Styled.div
            [ Html.Styled.Attributes.css
                [ Style.displayGridAndGap 0
                , Style.gridColumn 2 3
                , Style.gridRow 2 4
                ]
            ]
            [ Html.Styled.div
                [ Html.Styled.Attributes.css
                    [ Style.displayGridAndGap 16
                    , Css.overflowY Css.auto
                    , Style.webkitOverflowScrolling
                    ]
                , Style.mainId
                ]
                ([ Style.productImageList (Product.getImageUrls data.product)
                 , productsViewName (Product.getName data.product)
                 , productsViewLike
                    logInState
                    data.likeSending
                    (Product.getLikedCount data.product)
                    (Product.getId data.product)
                 , statusView (Product.getStatus data.product)
                 , sellerNameView (Product.getSeller data.product)
                 , descriptionView (Product.getDescription data.product)
                 , categoryView (Product.getCategory data.product)
                 , conditionView (Product.getCondition data.product)
                 , createdAtView nowMaybe (Product.getCreatedAt data.product)
                 , commentListView
                    data.commentText
                    data.commentSending
                    nowMaybe
                    (data.product |> Product.getSeller |> User.withNameGetId)
                    logInState
                    data.commentList
                 ]
                    ++ editButtonAndDeleteButton data.product logInState
                )
            , productsViewPriceAndBuyButton
                isWideScreen
                data.product
                (case logInState of
                    LogInState.Ok { userWithName } ->
                        Just userWithName

                    _ ->
                        Nothing
                )
            ]
    , bottomNavigation = Nothing
    }


editButtonAndDeleteButton : Product.Product -> LogInState.LogInState -> List (Html.Styled.Html Msg)
editButtonAndDeleteButton product logInState =
    case logInState of
        LogInState.Ok { token, userWithName } ->
            if
                User.withNameGetId userWithName
                    == User.withNameGetId (Product.getSeller product)
            then
                case Product.getStatus product of
                    Product.Selling ->
                        [ editButton
                        , deleteView (Product.getId product) token
                        ]

                    _ ->
                        []

            else
                []

        _ ->
            []


productsViewName : String -> Html.Styled.Html msg
productsViewName name =
    Html.Styled.div
        [ Html.Styled.Attributes.css
            [ Css.fontSize (Css.rem 1.5) ]
        ]
        [ Html.Styled.text name ]


productsViewLike : LogInState.LogInState -> Bool -> Int -> Product.Id -> Html.Styled.Html Msg
productsViewLike logInState sending likedCount id =
    Html.Styled.div
        [ Html.Styled.Attributes.css
            [ Css.displayFlex
            , Css.flexDirection Css.row
            ]
        ]
        [ likeButton logInState sending likedCount id
        ]


likeButton : LogInState.LogInState -> Bool -> Int -> Product.Id -> Html.Styled.Html Msg
likeButton logInState sending likedCount id =
    if sending then
        Html.Styled.button
            [ Html.Styled.Attributes.css [ likeStyle False ]
            , Html.Styled.Attributes.disabled True
            ]
            [ Icon.loading { size = 20, color = Css.rgb 255 255 255 }
            ]

    else
        case logInState of
            LogInState.Ok { likedProductIds, token } ->
                if List.member id likedProductIds then
                    Html.Styled.button
                        [ Html.Styled.Events.onClick (UnLike token id)
                        , Html.Styled.Attributes.css [ likeStyle True ]
                        ]
                        (itemLikeBody likedCount)

                else
                    Html.Styled.button
                        [ Html.Styled.Events.onClick (Like token id)
                        , Html.Styled.Attributes.css [ likeStyle False ]
                        ]
                        (itemLikeBody likedCount)

            _ ->
                Html.Styled.div
                    [ Html.Styled.Attributes.css
                        [ Css.borderRadius (Css.px 8)
                        , Style.userSelectNone
                        , Css.padding (Css.px 8)
                        , Css.border3 (Css.px 1) Css.solid (Css.rgb 170 170 170)
                        ]
                    ]
                    (itemLikeBody likedCount)


itemLikeBody : Int -> List (Html.Styled.Html msg)
itemLikeBody count =
    [ Html.Styled.text "いいね"
    , Html.Styled.span
        [ Html.Styled.Attributes.css
            [ Css.fontSize (Css.rem 1.3) ]
        ]
        [ Html.Styled.text (String.fromInt count) ]
    ]


{-| True: いいねしている, False: いいねしていない
-}
likeStyle : Bool -> Css.Style
likeStyle liked =
    Css.batch
        [ Css.backgroundColor
            (if liked then
                Style.primaryColor

             else
                Css.rgb 170 170 170
            )
        , Css.color
            (if liked then
                Css.rgb 255 255 255

             else
                Css.rgb 0 0 0
            )
        , Css.borderRadius (Css.px 8)
        , Style.userSelectNone
        , Css.cursor Css.pointer
        , Css.padding (Css.px 8)
        , Css.border2 Css.zero Css.none
        , Css.hover
            [ Css.backgroundColor
                (if liked then
                    Style.primaryColorLight

                 else
                    Css.rgb 136 136 136
                )
            ]
        ]


statusView : Product.Status -> Html.Styled.Html msg
statusView status =
    Style.titleAndContent "取引状態"
        (Html.Styled.text (Product.statusToJapaneseString status))


sellerNameView : User.WithName -> Html.Styled.Html msg
sellerNameView user =
    Style.titleAndContent "出品者"
        (Html.Styled.a
            [ Html.Styled.Attributes.href (PageLocation.toUrlAsString (PageLocation.User (User.withNameGetId user)))
            , Html.Styled.Attributes.css
                [ Css.displayFlex
                , Css.alignItems Css.center
                , Css.textDecoration Css.none
                ]
            ]
            [ Style.userImage 48 (User.withNameGetImageId user)
            , Html.Styled.text (User.withNameGetDisplayName user)
            ]
        )


descriptionView : String -> Html.Styled.Html msg
descriptionView description =
    Style.titleAndContent
        "商品の説明"
        (Html.Styled.text description)


categoryView : Category.Category -> Html.Styled.Html msg
categoryView category =
    Style.titleAndContent
        "カテゴリー"
        (Html.Styled.text (Category.toJapaneseString category))


conditionView : Product.Condition -> Html.Styled.Html msg
conditionView condition =
    Style.titleAndContent
        "商品の状態"
        (Html.Styled.div
            [ Html.Styled.Attributes.css
                [ Css.fontSize (Css.rem 1.5) ]
            ]
            [ Html.Styled.text (Product.conditionToJapaneseString condition)
            ]
        )


createdAtView : Maybe ( Time.Posix, Time.Zone ) -> Time.Posix -> Html.Styled.Html msg
createdAtView nowMaybe createdAt =
    Style.titleAndContent
        "出品日時"
        (Html.Styled.text
            (Data.DateTime.toDiffString nowMaybe createdAt)
        )


editButton : Html.Styled.Html Msg
editButton =
    Style.subButton
        [ Icon.edit
            (Css.batch
                [ Css.width (Css.px 32)
                , Css.height (Css.px 32)
                ]
            )
        , Html.Styled.text "編集する"
        ]
        EditProduct


deleteView : Product.Id -> Api.Token -> Html.Styled.Html Msg
deleteView productId token =
    Style.alertColorButton
        (Just (Delete token productId))
        [ Icon.deleteGarbageCan
            (Css.batch
                [ Css.width (Css.px 32)
                , Css.height (Css.px 32)
                , Css.fill (Css.rgb 238 238 238)
                ]
            )
        , Html.Styled.text "削除する"
        ]


commentListView :
    String
    -> Bool
    -> Maybe ( Time.Posix, Time.Zone )
    -> User.Id
    -> LogInState.LogInState
    -> Maybe (List Product.Comment)
    -> Html.Styled.Html Msg
commentListView commentText commentSending nowMaybe sellerId logInState commentListMaybe =
    Html.Styled.div
        [ Html.Styled.Attributes.css
            [ Css.paddingBottom (Css.px 64) ]
        ]
        ((case LogInState.getToken logInState of
            Just token ->
                [ commentInputArea commentText commentSending token ]

            Nothing ->
                []
         )
            ++ [ Component.Comment.view
                    nowMaybe
                    (commentListMaybe
                        |> Maybe.map
                            (List.map
                                (\comment ->
                                    { isMine =
                                        (comment
                                            |> Product.commentGetSpeaker
                                            |> User.withNameGetId
                                            |> Just
                                        )
                                            == LogInState.getMyUserId logInState
                                    , isSeller =
                                        (comment
                                            |> Product.commentGetSpeaker
                                            |> User.withNameGetId
                                        )
                                            == sellerId
                                    , user = Product.commentGetSpeaker comment
                                    , body = Product.commentGetBody comment
                                    , createdAt = Product.commentGetCreatedAt comment
                                    }
                                )
                            )
                    )
               ]
        )


commentInputArea : String -> Bool -> Api.Token -> Html.Styled.Html Msg
commentInputArea commentText sending token =
    Html.Styled.div
        []
        (Html.Styled.textarea
            [ Html.Styled.Events.onInput InputComment
            , Html.Styled.Attributes.class "form-textarea"
            , Html.Styled.Attributes.id commentTextAreaId
            ]
            []
            :: (if sending then
                    [ Html.Styled.button
                        [ Html.Styled.Attributes.css [ Component.Comment.commentSendButtonStyle ]
                        , Html.Styled.Attributes.disabled True
                        ]
                        [ Icon.loading { size = 24, color = Css.rgb 0 0 0 }
                        ]
                    ]

                else if String.isEmpty (String.trim commentText) then
                    [ Html.Styled.text "コメントには1文字以上必要です"
                    , Html.Styled.button
                        [ Html.Styled.Attributes.disabled True
                        , Html.Styled.Attributes.css [ Component.Comment.commentSendButtonStyle ]
                        ]
                        [ Html.Styled.text "コメントを送信" ]
                    ]

                else
                    [ Html.Styled.button
                        [ Html.Styled.Events.onClick (SendComment token)
                        , Html.Styled.Attributes.css [ Component.Comment.commentSendButtonStyle ]
                        ]
                        [ Html.Styled.text "コメントを送信" ]
                    ]
               )
        )


commentTextAreaId : String
commentTextAreaId =
    "comment-text-area"


productsViewPriceAndBuyButton : Bool -> Product.Product -> Maybe User.WithName -> Html.Styled.Html Msg
productsViewPriceAndBuyButton isWideScreen product userWithNameMaybe =
    Html.Styled.div
        [ Html.Styled.Attributes.css
            [ Css.padding (Css.px 8)
            , Css.displayFlex
            , Css.justifyContent Css.spaceBetween
            , Css.backgroundColor Style.primaryColor
            , Css.color (Css.rgb 255 255 255)
            ]
        ]
        (Html.Styled.div
            [ Html.Styled.Attributes.css
                [ Css.fontSize (Css.rem 1.5) ]
            ]
            [ Html.Styled.text (Product.priceToString (Product.getPrice product)) ]
            :: (case buyButton product userWithNameMaybe of
                    Just button ->
                        [ button ]

                    Nothing ->
                        []
               )
        )


buyButton : Product.Product -> Maybe User.WithName -> Maybe (Html.Styled.Html Msg)
buyButton product userWithNameMaybe =
    case ( Product.getStatus product, userWithNameMaybe ) of
        ( Product.Selling, Just user ) ->
            if
                User.withNameGetId (Product.getSeller product)
                    == User.withNameGetId user
            then
                Nothing

            else
                Just
                    (Html.Styled.button
                        [ Html.Styled.Events.onClick ToConfirmPage ]
                        [ Html.Styled.text "購入手続きへ" ]
                    )

        _ ->
            Nothing


tradeStartButton : LogInState.LogInState -> Product.Id -> Html.Styled.Html Msg
tradeStartButton logInState productId =
    Html.Styled.div
        []
        [ Style.mainButton
            [ Html.Styled.text "取引を開始する" ]
            (LogInState.getToken logInState |> Maybe.map (\accessToken -> TradeStart accessToken productId))
        ]


editOkCancelButton : Api.Token -> Product.Id -> Bool -> Maybe Api.UpdateProductRequest -> Html.Styled.Html Msg
editOkCancelButton token productId sending requestDataMaybe =
    if sending then
        Html.Styled.div
            [ Html.Styled.Attributes.css
                [ Style.buttonStyle
                , Css.backgroundColor (Css.rgb 153 153 153)
                , Css.width (Css.pct 100)
                , Css.fill (Css.rgb 0 0 0)
                , Css.displayFlex
                , Css.justifyContent Css.center
                ]
            ]
            [ Icon.loading { size = 32, color = Css.rgb 0 0 0 } ]

    else
        Style.okAndCancelButton
            { text = "キャンセル"
            , msg = MsgBackToViewMode
            }
            { text = "変更する"
            , msg = requestDataMaybe |> Maybe.map (UpdateProductData token productId)
            }
