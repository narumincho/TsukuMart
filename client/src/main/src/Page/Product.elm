module Page.Product exposing
    ( Emission(..)
    , Model
    , Msg(..)
    , getProduct
    , getProductId
    , getUser
    , imageView
    , initModel
    , initModelFromProduct
    , update
    , view
    )

{-| 商品の詳細表示
-}

import Api
import BasicParts
import Css
import Data.Category as Category
import Data.DateTime
import Data.LogInState as LogInState
import Data.Product as Product
import Data.Trade as Trade
import Data.User as User
import Html
import Html.Attributes
import Html.Events
import Html.Keyed
import Html.Styled
import Html.Styled.Attributes
import Html.Styled.Events
import Icon
import Page.Component.Comment
import Page.Component.ProductEditor as ProductEditor
import Page.Style
import PageLocation
import Time



{- 商品詳細ページ -}


type Model
    = Loading Product.Id
    | WaitNewData Product.Product
    | Normal
        { product : Product.ProductDetail
        , likeSending : Bool
        , commentSending : Bool
        , comment : String
        }
    | Edit
        { beforeProduct : Product.ProductDetail
        , productEditor : ProductEditor.Model
        }
    | Confirm
        { product : Product.ProductDetail
        }


type Emission
    = EmissionGetProduct { productId : Product.Id }
    | EmissionGetProductAndMarkHistory { productId : Product.Id, token : Api.Token }
    | EmissionGetCommentList { productId : Product.Id }
    | EmissionAddComment Api.Token { productId : Product.Id } String
    | EmissionLike Api.Token Product.Id
    | EmissionUnLike Api.Token Product.Id
    | EmissionTradeStart Api.Token Product.Id
    | EmissionAddLogMessage String
    | EmissionUpdateNowTime
    | EmissionDelete Api.Token Product.Id
    | EmissionJumpToTradePage Trade.Trade
    | EmissionByProductEditor ProductEditor.Emission
    | EmissionUpdateProductData Api.Token Product.Id Api.UpdateProductRequest
    | EmissionReplaceElementText { id : String, text : String }


type Msg
    = GetProductResponse (Result String Product.ProductDetail)
    | GetCommentListResponse (Result String (List Product.Comment))
    | Like Api.Token Product.Id
    | UnLike Api.Token Product.Id
    | LikeResponse (Result String Int)
    | UnlikeResponse (Result String Int)
    | TradeStart Api.Token Product.Id
    | TradeStartResponse (Result String Trade.Trade)
    | ToConfirmPage
    | InputComment String
    | SendComment Api.Token
    | Delete Api.Token Product.Id
    | EditProduct
    | MsgBackToViewMode
    | MsgByProductEditor ProductEditor.Msg
    | UpdateProductData Api.Token Product.Id Api.UpdateProductRequest
    | UpdateProductDataResponse (Result String ())


{-| 指定したIDの商品詳細ページ
-}
initModel : LogInState.LogInState -> Product.Id -> ( Model, List Emission )
initModel logInState id =
    ( Loading id
    , case LogInState.getToken logInState of
        Just accessToken ->
            [ EmissionGetProductAndMarkHistory
                { productId = id
                , token = accessToken
                }
            ]

        Nothing ->
            [ EmissionGetProduct { productId = id } ]
    )


{-| 一覧画面から商品の内容が一部わかっているときのもの
-}
initModelFromProduct : LogInState.LogInState -> Product.Product -> ( Model, List Emission )
initModelFromProduct logInState product =
    ( WaitNewData product
    , case LogInState.getToken logInState of
        Just accessToken ->
            [ EmissionGetProductAndMarkHistory
                { productId = Product.getId product
                , token = accessToken
                }
            ]

        Nothing ->
            [ EmissionGetProduct { productId = Product.getId product } ]
    )


{-| 表示している商品のIDを取得する
-}
getProductId : Model -> Product.Id
getProductId model =
    case model of
        Loading productId ->
            productId

        WaitNewData product ->
            Product.getId product

        Normal { product } ->
            Product.detailGetId product

        Edit { beforeProduct } ->
            Product.detailGetId beforeProduct

        Confirm { product } ->
            Product.detailGetId product


{-| 表示している商品を取得する
-}
getProduct : Model -> Maybe Product.Product
getProduct model =
    case model of
        Loading _ ->
            Nothing

        WaitNewData product ->
            Just product

        Normal { product } ->
            Just (Product.fromDetail product)

        Edit { beforeProduct } ->
            Just (Product.fromDetail beforeProduct)

        Confirm { product } ->
            Just (Product.fromDetail product)


getUser : Model -> List User.WithName
getUser model =
    case model of
        Loading _ ->
            []

        WaitNewData _ ->
            []

        Normal { product } ->
            productGetUser product

        Edit { beforeProduct } ->
            productGetUser beforeProduct

        Confirm { product } ->
            productGetUser product


productGetUser : Product.ProductDetail -> List User.WithName
productGetUser product =
    (product
        |> Product.detailGetSeller
    )
        :: (product
                |> Product.detailGetCommentList
                |> Maybe.withDefault []
                |> List.map Product.commentGetSpeaker
           )


update : Msg -> Model -> ( Model, List Emission )
update msg model =
    case msg of
        GetProductResponse productsResult ->
            case ( model, productsResult ) of
                ( Loading _, Ok product ) ->
                    ( Normal
                        { product = product
                        , likeSending = False
                        , commentSending = False
                        , comment = ""
                        }
                    , [ EmissionGetCommentList { productId = Product.detailGetId product }
                      , EmissionUpdateNowTime
                      ]
                    )

                ( WaitNewData _, Ok product ) ->
                    ( Normal { product = product, likeSending = False, commentSending = False, comment = "" }
                    , [ EmissionGetCommentList { productId = Product.detailGetId product }
                      , EmissionUpdateNowTime
                      ]
                    )

                ( Normal rec, Ok product ) ->
                    ( Normal { rec | product = product }
                    , [ EmissionGetCommentList { productId = Product.detailGetId product }
                      , EmissionUpdateNowTime
                      ]
                    )

                ( _, Err text ) ->
                    ( model
                    , [ EmissionAddLogMessage ("商品情報の取得に失敗しました " ++ text) ]
                    )

                ( _, _ ) ->
                    ( model
                    , [ EmissionAddLogMessage "画面がNormalでないときに商品情報を受け取ってしまった" ]
                    )

        GetCommentListResponse commentListResult ->
            case ( model, commentListResult ) of
                ( Normal rec, Ok commentList ) ->
                    ( Normal
                        { rec
                            | product = rec.product |> Product.setCommentList commentList
                            , comment = ""
                            , commentSending = False
                        }
                    , [ EmissionReplaceElementText
                            { id = commentTextAreaId
                            , text = ""
                            }
                      , EmissionUpdateNowTime
                      ]
                    )

                ( _, Err text ) ->
                    ( model
                    , [ EmissionAddLogMessage ("コメント取得に失敗しました " ++ text) ]
                    )

                ( _, _ ) ->
                    ( model
                    , [ EmissionAddLogMessage "画面がNormalでないときにコメントを受け取ってしまった" ]
                    )

        Like token id ->
            ( case model of
                Normal rec ->
                    Normal { rec | likeSending = True }

                _ ->
                    model
            , [ EmissionLike token id ]
            )

        UnLike token id ->
            ( case model of
                Normal rec ->
                    Normal { rec | likeSending = True }

                _ ->
                    model
            , [ EmissionUnLike token id ]
            )

        LikeResponse result ->
            case ( result, model ) of
                ( Ok likedCount, Normal rec ) ->
                    ( Normal
                        { rec
                            | product = rec.product |> Product.detailUpdateLikedCount likedCount
                            , likeSending = False
                        }
                    , []
                    )

                ( Ok _, _ ) ->
                    ( model
                    , [ EmissionAddLogMessage "画面がNormalでないときにいいねの結果を受け取ってしまった" ]
                    )

                ( Err text, _ ) ->
                    ( model
                    , [ EmissionAddLogMessage ("いいねをするのに失敗 " ++ text) ]
                    )

        UnlikeResponse result ->
            case ( result, model ) of
                ( Ok likedCount, Normal rec ) ->
                    ( Normal
                        { rec
                            | product = rec.product |> Product.detailUpdateLikedCount likedCount
                            , likeSending = False
                        }
                    , []
                    )

                ( Ok _, _ ) ->
                    ( model
                    , [ EmissionAddLogMessage "画面がNormalでないときにいいねを外すの結果を受け取ってしまった" ]
                    )

                ( Err text, _ ) ->
                    ( model
                    , [ EmissionAddLogMessage ("いいねを外すのに失敗 " ++ text) ]
                    )

        TradeStart token productId ->
            ( model
            , [ EmissionTradeStart token productId ]
            )

        TradeStartResponse result ->
            ( model
            , case result of
                Ok trade ->
                    [ EmissionAddLogMessage "取引開始"
                    , EmissionJumpToTradePage trade
                    ]

                Err text ->
                    [ EmissionAddLogMessage ("取引開始を失敗しました " ++ text) ]
            )

        ToConfirmPage ->
            ( case model of
                Normal { product } ->
                    Confirm { product = product }

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
                    , [ EmissionAddComment token { productId = Product.detailGetId rec.product } rec.comment ]
                    )

                _ ->
                    ( model
                    , []
                    )

        Delete token productId ->
            ( model
            , [ EmissionDelete token productId ]
            )

        EditProduct ->
            case model of
                Normal { product } ->
                    ( model
                    , []
                    )

                _ ->
                    ( model, [] )

        MsgBackToViewMode ->
            case model of
                Edit { beforeProduct } ->
                    ( Normal
                        { product = beforeProduct
                        , likeSending = False
                        , commentSending = False
                        , comment = ""
                        }
                    , [ EmissionGetProduct { productId = Product.detailGetId beforeProduct } ]
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
            ( model
            , [ EmissionUpdateProductData token productId requestData
              ]
            )

        UpdateProductDataResponse result ->
            case result of
                Ok () ->
                    update MsgBackToViewMode model

                Err text ->
                    ( model
                    , [ EmissionAddLogMessage ("商品の編集に失敗しました " ++ text) ]
                    )


view :
    LogInState.LogInState
    -> Bool
    -> Maybe ( Time.Posix, Time.Zone )
    -> Model
    ->
        { title : Maybe String
        , tab : BasicParts.Tab Msg
        , html : List (Html.Styled.Html Msg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view logInState isWideScreen nowMaybe model =
    case model of
        Loading _ ->
            { title = Just "商品詳細ページ 読み込み中"
            , tab = BasicParts.tabNone
            , html =
                [ Page.Style.container
                    [ Html.Styled.text "読み込み中"
                    , Icon.loading { size = 48, color = Css.rgb 0 0 0 }
                    ]
                ]
            , bottomNavigation = Nothing
            }

        WaitNewData product ->
            { title = Just (Product.getName product)
            , tab = BasicParts.tabNone
            , html =
                [ Page.Style.container
                    [ Html.Styled.text "最新の情報を取得中…"
                    , Icon.loading { size = 32, color = Css.rgb 0 0 0 }
                    , productsViewImage [ Product.getThumbnailImageUrl product ]
                    , productsViewName (Product.getName product)
                    , productsViewLike
                        LogInState.None
                        False
                        (Product.getLikedCount product)
                        (Product.getId product)
                    ]
                ]
            , bottomNavigation = Nothing
            }

        Normal rec ->
            normalView logInState
                isWideScreen
                nowMaybe
                { likeSending = rec.likeSending
                , commentSending = rec.commentSending
                , product = rec.product
                }

        Edit { productEditor, beforeProduct } ->
            { title = Just (Product.detailGetName beforeProduct)
            , tab = BasicParts.tabNone
            , html =
                [ Page.Style.containerKeyed
                    (case LogInState.getToken logInState of
                        Just accessToken ->
                            (ProductEditor.view productEditor
                                |> List.map (Tuple.mapSecond (Html.Styled.fromUnstyled >> Html.Styled.map MsgByProductEditor))
                            )
                                ++ [ ( "okButton"
                                     , editOkCancelButton
                                        accessToken
                                        (Product.detailGetId beforeProduct)
                                        (ProductEditor.toUpdateRequest productEditor)
                                     )
                                   ]

                        Nothing ->
                            [ ( "needLogIn", Html.Styled.text "ログインしていないときに商品の編集はできません" ) ]
                    )
                ]
            , bottomNavigation = Nothing
            }

        Confirm { product } ->
            { title = Just (Product.detailGetName product)
            , tab = BasicParts.tabNone
            , html =
                [ Page.Style.container
                    [ Html.Styled.text "購入確認画面。この商品の取引を開始しますか?"
                    , productsViewImage (Product.detailGetImageUrls product)
                    , productsViewName (Product.detailGetName product)
                    , descriptionView (Product.detailGetDescription product)
                    , conditionView (Product.detailGetCondition product)
                    , tradeStartButton logInState (Product.detailGetId product)
                    ]
                ]
            , bottomNavigation = Nothing
            }


normalView :
    LogInState.LogInState
    -> Bool
    -> Maybe ( Time.Posix, Time.Zone )
    ->
        { product : Product.ProductDetail
        , likeSending : Bool
        , commentSending : Bool
        }
    ->
        { title : Maybe String
        , tab : BasicParts.Tab Msg
        , html : List (Html.Styled.Html Msg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
normalView logInState isWideScreen nowMaybe { product, likeSending, commentSending } =
    { title = Just (Product.detailGetName product)
    , tab = BasicParts.tabNone
    , html =
        [ Page.Style.container
            ([ productsViewImage (Product.detailGetImageUrls product)
             , productsViewName (Product.detailGetName product)
             , productsViewLike
                logInState
                likeSending
                (Product.detailGetLikedCount product)
                (Product.detailGetId product)
             , statusView (Product.detailGetStatus product)
             , sellerNameView (Product.detailGetSeller product)
             , descriptionView (Product.detailGetDescription product)
             , categoryView (Product.detailGetCategory product)
             , conditionView (Product.detailGetCondition product)
             , createdAtView nowMaybe (Product.detailGetCreatedAt product)
             , commentListView commentSending
                nowMaybe
                (product |> Product.detailGetSeller |> User.withNameGetId)
                logInState
                (Product.detailGetCommentList product)
             ]
                ++ (case logInState of
                        LogInState.Ok { token, userWithName } ->
                            if
                                User.withNameGetId userWithName
                                    == User.withNameGetId (Product.detailGetSeller product)
                            then
                                [ editButton
                                , deleteView (Product.detailGetId product) token
                                ]

                            else
                                []

                        _ ->
                            []
                   )
            )
        , productsViewPriceAndBuyButton isWideScreen
            product
            (case logInState of
                LogInState.Ok { userWithName } ->
                    Just userWithName

                _ ->
                    Nothing
            )
        ]
    , bottomNavigation = Nothing
    }


productsViewImage : List String -> Html.Styled.Html msg
productsViewImage urlList =
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


productsViewName : String -> Html.Styled.Html msg
productsViewName name =
    Html.Styled.div
        [ Html.Styled.Attributes.class "product-name" ]
        [ Html.Styled.text name ]


productsViewLike : LogInState.LogInState -> Bool -> Int -> Product.Id -> Html.Styled.Html Msg
productsViewLike logInState sending likedCount id =
    Html.Styled.div
        [ Html.Styled.Attributes.class "product-like-container" ]
        [ likeButton logInState sending likedCount id
        ]


likeButton : LogInState.LogInState -> Bool -> Int -> Product.Id -> Html.Styled.Html Msg
likeButton logInState sending likedCount id =
    if sending then
        Html.Styled.button
            [ Html.Styled.Attributes.class "product-like"
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
                        , Html.Styled.Attributes.class "product-liked"
                        , Html.Styled.Attributes.class "product-like"
                        ]
                        (itemLikeBody likedCount)

                else
                    Html.Styled.button
                        [ Html.Styled.Events.onClick (Like token id)
                        , Html.Styled.Attributes.class "product-like"
                        ]
                        (itemLikeBody likedCount)

            _ ->
                Html.Styled.div
                    [ Html.Styled.Attributes.class "product-like-label" ]
                    (itemLikeBody likedCount)


itemLikeBody : Int -> List (Html.Styled.Html msg)
itemLikeBody count =
    [ Html.Styled.text "いいね"
    , Html.Styled.span
        [ Html.Styled.Attributes.class "product-like-number" ]
        [ Html.Styled.text (String.fromInt count) ]
    ]


statusView : Product.Status -> Html.Styled.Html msg
statusView status =
    Page.Style.titleAndContent "取引状態"
        (Html.div
            []
            [ Html.text (Product.statusToJapaneseString status) ]
        )


sellerNameView : User.WithName -> Html.Styled.Html msg
sellerNameView user =
    Page.Style.titleAndContentStyle "出品者"
        (Html.Styled.a
            [ Html.Styled.Attributes.href (PageLocation.toUrlAsString (PageLocation.User (User.withNameGetId user)))
            , Html.Styled.Attributes.css
                [ Css.displayFlex
                , Css.alignItems Css.center
                , Css.textDecoration Css.none
                ]
            ]
            [ Page.Style.userImage 48 (User.withNameGetImageId user)
            , Html.Styled.text (User.withNameGetDisplayName user)
            ]
        )


descriptionView : String -> Html.Styled.Html msg
descriptionView description =
    Page.Style.titleAndContent
        "商品の説明"
        (Html.div [] [ Html.text description ])


categoryView : Category.Category -> Html.Styled.Html msg
categoryView category =
    Page.Style.titleAndContent
        "カテゴリー"
        (Html.div [] [ Html.text (Category.toJapaneseString category) ])


conditionView : Product.Condition -> Html.Styled.Html msg
conditionView condition =
    Page.Style.titleAndContent
        "商品の状態"
        (Html.div
            [ Html.Attributes.class "product-condition" ]
            [ Html.text (Product.conditionToJapaneseString condition)
            ]
        )


createdAtView : Maybe ( Time.Posix, Time.Zone ) -> Time.Posix -> Html.Styled.Html msg
createdAtView nowMaybe createdAt =
    Page.Style.titleAndContent
        "出品日時"
        (Html.div
            []
            [ Html.text
                (Data.DateTime.toDiffString nowMaybe createdAt)
            ]
        )


editButton : Html.Styled.Html Msg
editButton =
    Html.Styled.button
        [ Html.Styled.Attributes.class "subButton"
        , Html.Styled.Events.onClick EditProduct
        ]
        [ Icon.edit
            (Css.batch
                [ Css.width (Css.px 32)
                , Css.height (Css.px 32)
                ]
            )
        , Html.Styled.text "編集する"
        ]


deleteView : Product.Id -> Api.Token -> Html.Styled.Html Msg
deleteView productId token =
    Html.Styled.button
        [ Html.Styled.Attributes.class "product-deleteButton"
        , Html.Styled.Events.onClick (Delete token productId)
        ]
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
    Bool
    -> Maybe ( Time.Posix, Time.Zone )
    -> User.Id
    -> LogInState.LogInState
    -> Maybe (List Product.Comment)
    -> Html.Styled.Html Msg
commentListView commentSending nowMaybe sellerId logInState commentListMaybe =
    Html.Styled.div
        []
        ((case LogInState.getToken logInState of
            Just token ->
                [ commentInputArea commentSending token ]

            Nothing ->
                []
         )
            ++ [ Page.Component.Comment.view
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
                    |> Html.Styled.fromUnstyled
               ]
        )


commentInputArea : Bool -> Api.Token -> Html.Styled.Html Msg
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
            ++ (if sending then
                    [ Html.Styled.button
                        [ Html.Styled.Attributes.class "product-comment-sendButton"
                        , Html.Styled.Attributes.disabled True
                        ]
                        [ Icon.loading { size = 24, color = Css.rgb 0 0 0 }
                        ]
                    ]

                else
                    [ Html.Styled.button
                        [ Html.Styled.Events.onClick (SendComment token)
                        , Html.Styled.Attributes.class "product-comment-sendButton"
                        ]
                        [ Html.Styled.text "コメントを送信" ]
                    ]
               )
        )


commentTextAreaId : String
commentTextAreaId =
    "comment-text-area"


productsViewPriceAndBuyButton : Bool -> Product.ProductDetail -> Maybe User.WithName -> Html.Styled.Html Msg
productsViewPriceAndBuyButton isWideScreen product userWithNameMaybe =
    Html.div
        [ Html.Attributes.classList
            [ ( "product-priceAndBuyButton", True )
            , ( "product-priceAndBuyButton-wide", isWideScreen )
            ]
        ]
        ([ Html.div [ Html.Attributes.class "product-price" ]
            [ Html.text (Product.priceToString (Product.detailGetPrice product)) ]
         ]
            ++ (case buyButton product userWithNameMaybe of
                    Just button ->
                        [ button ]

                    Nothing ->
                        []
               )
        )
        |> Html.Styled.fromUnstyled


buyButton : Product.ProductDetail -> Maybe User.WithName -> Maybe (Html.Html Msg)
buyButton product userWithNameMaybe =
    case ( Product.detailGetStatus product, userWithNameMaybe ) of
        ( Product.Selling, Just user ) ->
            if
                User.withNameGetId (Product.detailGetSeller product)
                    == User.withNameGetId user
            then
                Nothing

            else
                Just
                    (Html.button
                        [ Html.Events.onClick ToConfirmPage ]
                        [ Html.text "購入手続きへ" ]
                    )

        _ ->
            Nothing


tradeStartButton : LogInState.LogInState -> Product.Id -> Html.Styled.Html Msg
tradeStartButton logInState productId =
    Html.Styled.div
        []
        [ Html.Styled.button
            ([ Html.Styled.Attributes.class "mainButton" ]
                ++ (case LogInState.getToken logInState of
                        Just accessToken ->
                            [ Html.Styled.Events.onClick (TradeStart accessToken productId) ]

                        Nothing ->
                            [ Html.Styled.Attributes.class "mainButton-disabled" ]
                   )
            )
            [ Html.Styled.text "取引を開始する" ]
        ]


editOkCancelButton : Api.Token -> Product.Id -> Maybe Api.UpdateProductRequest -> Html.Styled.Html Msg
editOkCancelButton token productId requestDataMaybe =
    Html.Styled.div
        [ Html.Styled.Attributes.class "profile-editButtonArea" ]
        [ Html.Styled.button
            [ Html.Styled.Attributes.class "profile-editCancelButton"
            , Html.Styled.Events.onClick MsgBackToViewMode
            ]
            [ Html.Styled.text "キャンセル" ]
        , Html.Styled.button
            ([ Html.Styled.Attributes.class "profile-editOkButton" ]
                ++ (case requestDataMaybe of
                        Just requestDate ->
                            [ Html.Styled.Events.onClick (UpdateProductData token productId requestDate)
                            , Html.Styled.Attributes.disabled False
                            ]

                        Nothing ->
                            [ Html.Styled.Attributes.disabled True ]
                   )
            )
            [ Html.Styled.text "変更する" ]
        ]
