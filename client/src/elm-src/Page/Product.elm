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
import Data.LogInState as LogInState
import Data.Product as Product
import Data.User as User
import Html
import Html.Attributes
import Html.Events
import Icon
import Page.Component.ProductEditor as ProductEditor
import SiteMap
import Svg
import Svg.Attributes
import Time



{- 商品詳細ページ -}


type Model
    = Loading Product.Id
    | WaitNewData Product.Product
    | Normal
        { product : Product.ProductDetail
        , sending : Bool -- いいねを送信中か送信中じゃないか
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
    | EmissionGetProductAndMarkHistory { productId : Product.Id, accessToken : Api.Token }
    | EmissionGetCommentList { productId : Product.Id }
    | EmissionPostComment Api.Token { productId : Product.Id } String
    | EmissionLike Api.Token Product.Id
    | EmissionUnLike Api.Token Product.Id
    | EmissionTradeStart Api.Token Product.Id
    | EmissionAddLogMessage String
    | EmissionUpdateNowTime
    | EmissionDelete Api.Token Product.Id
    | EmissionByProductEditor ProductEditor.Emission
    | EmissionUpdateProductData Api.Token Product.Id Api.UpdateProductRequest


type Msg
    = GetProductResponse (Result String Product.ProductDetail)
    | GetCommentListResponse (Result String (List Product.Comment))
    | PostCommentResponse (Result String Product.Comment)
    | Like Api.Token Product.Id
    | UnLike Api.Token Product.Id
    | LikeResponse (Result String Int)
    | UnlikeResponse (Result String Int)
    | TradeStart Api.Token Product.Id
    | TradeStartResponse (Result String ())
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
    , case LogInState.getAccessToken logInState of
        Just accessToken ->
            [ EmissionGetProductAndMarkHistory
                { productId = id
                , accessToken = accessToken
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
    , case LogInState.getAccessToken logInState of
        Just accessToken ->
            [ EmissionGetProductAndMarkHistory
                { productId = Product.getId product
                , accessToken = accessToken
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
                    ( Normal { product = product, sending = False, comment = "" }
                    , [ EmissionGetCommentList { productId = Product.detailGetId product }
                      , EmissionUpdateNowTime
                      ]
                    )

                ( WaitNewData _, Ok product ) ->
                    ( Normal { product = product, sending = False, comment = "" }
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
                    ( Normal { rec | product = rec.product |> Product.setCommentList commentList }
                    , []
                    )

                ( _, Err text ) ->
                    ( model
                    , [ EmissionAddLogMessage ("コメント取得に失敗しました " ++ text) ]
                    )

                ( _, _ ) ->
                    ( model
                    , [ EmissionAddLogMessage "画面がNormalでないときにコメントを受け取ってしまった" ]
                    )

        PostCommentResponse result ->
            case ( model, result ) of
                ( Normal rec, Ok comment ) ->
                    ( Normal { rec | product = rec.product |> Product.addComment comment }
                    , []
                    )

                ( _, Err text ) ->
                    ( model, [ EmissionAddLogMessage ("コメントの送信に失敗しました" ++ text) ] )

                ( _, _ ) ->
                    ( model, [] )

        Like token id ->
            ( case model of
                Normal rec ->
                    Normal { rec | sending = True }

                _ ->
                    model
            , [ EmissionLike token id ]
            )

        UnLike token id ->
            ( case model of
                Normal rec ->
                    Normal { rec | sending = True }

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
                            , sending = False
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
                            , sending = False
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
                Ok () ->
                    [ EmissionAddLogMessage "取引開始" ]

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
                Normal { comment, product } ->
                    ( model
                    , [ EmissionPostComment token { productId = Product.detailGetId product } comment ]
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
                        , sending = False
                        , comment = ""
                        }
                    , [ EmissionGetProduct { productId = Product.detailGetId beforeProduct } ]
                    )

                _ ->
                    ( model, [] )

        MsgByProductEditor productEditorMsg ->
            case model of
                Edit r ->
                    ProductEditor.update productEditorMsg r.productEditor
                        |> Tuple.mapBoth
                            (\editorModel -> Edit { r | productEditor = editorModel })
                            (List.map EmissionByProductEditor)

                _ ->
                    ( model, [] )

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
    -> { title : Maybe String, tab : BasicParts.Tab Msg, html : List (Html.Html Msg) }
view logInState isWideScreen nowMaybe model =
    case model of
        Loading _ ->
            { title = Just "商品詳細ページ 読み込み中"
            , tab = BasicParts.tabNone
            , html = [ Html.text "読み込み中" ]
            }

        WaitNewData product ->
            { title = Just (Product.getName product)
            , tab = BasicParts.tabNone
            , html =
                [ Html.div
                    [ Html.Attributes.class "container" ]
                    [ Html.div
                        [ Html.Attributes.class "product" ]
                        [ Html.text "最新の情報を取得中…"
                        , productsViewImage [ Product.getThumbnailImageUrl product ]
                        , productsViewName (Product.getName product)
                        , productsViewLike
                            LogInState.None
                            False
                            (Product.getLikedCount product)
                            (Product.getId product)
                        ]
                    ]
                ]
            }

        Normal { product, sending } ->
            normalView logInState isWideScreen nowMaybe sending product

        Edit { productEditor, beforeProduct } ->
            { title = Just (Product.detailGetName beforeProduct)
            , tab = BasicParts.tabNone
            , html =
                [ Html.div
                    [ Html.Attributes.class "container" ]
                    [ Html.div
                        [ Html.Attributes.class "product" ]
                        (case LogInState.getAccessToken logInState of
                            Just accessToken ->
                                [ Html.text "編集画面"
                                ]
                                    ++ (ProductEditor.view productEditor
                                            |> List.map (Html.map MsgByProductEditor)
                                       )
                                    ++ [ editOkCancelButton
                                            accessToken
                                            (Product.detailGetId beforeProduct)
                                            (ProductEditor.toUpdateRequest productEditor)
                                       ]

                            Nothing ->
                                [ Html.text "ログインしていないときに商品の編集はできません" ]
                        )
                    ]
                ]
            }

        Confirm { product } ->
            { title = Just (Product.detailGetName product)
            , tab = BasicParts.tabNone
            , html =
                [ Html.div
                    [ Html.Attributes.class "container" ]
                    [ Html.div
                        [ Html.Attributes.class "product" ]
                        [ Html.text "購入確認画面。この商品の取引を開始しますか?"
                        , productsViewImage (Product.detailGetImageUrls product)
                        , productsViewName (Product.detailGetName product)
                        , descriptionView (Product.detailGetDescription product)
                        , productsViewCondition (Product.detailGetCondition product)
                        , tradeStartButton logInState (Product.detailGetId product)
                        ]
                    ]
                ]
            }


normalView :
    LogInState.LogInState
    -> Bool
    -> Maybe ( Time.Posix, Time.Zone )
    -> Bool
    -> Product.ProductDetail
    -> { title : Maybe String, tab : BasicParts.Tab Msg, html : List (Html.Html Msg) }
normalView logInState isWideScreen nowMaybe sending product =
    { title = Just (Product.detailGetName product)
    , tab = BasicParts.tabNone
    , html =
        [ Html.div
            [ Html.Attributes.class "container" ]
            [ Html.div
                [ Html.Attributes.class "product" ]
                ([ productsViewImage (Product.detailGetImageUrls product)
                 , productsViewName (Product.detailGetName product)
                 , productsViewLike
                    logInState
                    sending
                    (Product.detailGetLikedCount product)
                    (Product.detailGetId product)
                 , sellerNameView (Product.detailGetSeller product)
                 , descriptionView (Product.detailGetDescription product)
                 , productsViewCondition (Product.detailGetCondition product)
                 , commentListView nowMaybe
                    (product |> Product.detailGetSeller |> User.withNameGetId)
                    logInState
                    (Product.detailGetCommentList product)
                 ]
                    ++ (case logInState of
                            LogInState.Ok { accessToken, userWithName } ->
                                if
                                    User.withNameGetId userWithName
                                        == User.withNameGetId (Product.detailGetSeller product)
                                then
                                    [ editButton
                                    , deleteView (Product.detailGetId product) accessToken
                                    ]

                                else
                                    []

                            _ ->
                                []
                       )
                )
            , productsViewPriceAndBuyButton isWideScreen (Product.detailGetPrice product)
            ]
        ]
    }


productsViewImage : List String -> Html.Html msg
productsViewImage urlList =
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


productsViewName : String -> Html.Html msg
productsViewName name =
    Html.div
        [ Html.Attributes.class "product-name" ]
        [ Html.text name ]


productsViewLike : LogInState.LogInState -> Bool -> Int -> Product.Id -> Html.Html Msg
productsViewLike logInState sending likedCount id =
    Html.div
        [ Html.Attributes.class "product-like-container" ]
        [ likeButton logInState sending likedCount id
        ]


likeButton : LogInState.LogInState -> Bool -> Int -> Product.Id -> Html.Html Msg
likeButton logInState sending likedCount id =
    if sending then
        Html.button
            [ Html.Attributes.class "product-like-sending"
            , Html.Attributes.class "product-like"
            ]
            (itemLikeBody likedCount)

    else
        case logInState of
            LogInState.Ok { likedProductIds, accessToken } ->
                if List.member id likedProductIds then
                    Html.button
                        [ Html.Events.onClick (UnLike accessToken id)
                        , Html.Attributes.class "product-liked"
                        , Html.Attributes.class "product-like"
                        ]
                        (itemLikeBody likedCount)

                else
                    Html.button
                        [ Html.Events.onClick (Like accessToken id)
                        , Html.Attributes.class "product-like"
                        ]
                        (itemLikeBody likedCount)

            _ ->
                Html.div
                    [ Html.Attributes.class "product-like-label" ]
                    (itemLikeBody likedCount)


itemLikeBody : Int -> List (Html.Html msg)
itemLikeBody count =
    [ Html.text "いいね"
    , Html.span
        [ Html.Attributes.class "product-like-number" ]
        [ Html.text (String.fromInt count) ]
    ]


sellerNameView : User.WithName -> Html.Html msg
sellerNameView user =
    Html.div
        []
        [ Html.div [ Html.Attributes.class "product-label" ] [ Html.text "出品者" ]
        , Html.a
            [ Html.Attributes.href (SiteMap.userUrl (User.withNameGetId user)) ]
            [ Html.img
                [ Html.Attributes.style "border-radius" "50%"
                , Html.Attributes.style "width" "3rem"
                , Html.Attributes.src (User.withNameGetImageUrl user)
                ]
                []
            , Html.text (User.withNameGetDisplayName user)
            ]
        ]


descriptionView : String -> Html.Html msg
descriptionView description =
    Html.div
        [ Html.Attributes.class "product-description" ]
        [ Html.div [ Html.Attributes.class "product-label" ] [ Html.text "商品の説明" ]
        , Html.div [] [ Html.text description ]
        ]


productsViewCondition : Product.Condition -> Html.Html msg
productsViewCondition condition =
    Html.div []
        [ Html.div
            [ Html.Attributes.class "product-label" ]
            [ Html.text "商品の状態" ]
        , Html.div
            [ Html.Attributes.class "product-condition" ]
            [ Html.text (Product.conditionToJapaneseString condition)
            ]
        ]


editButton : Html.Html Msg
editButton =
    Html.button
        [ Html.Attributes.class "subButton"
        , Html.Events.onClick EditProduct
        ]
        [ Icon.edit "width:32px;height:32px"
        , Html.text "編集する"
        ]


deleteView : Product.Id -> Api.Token -> Html.Html Msg
deleteView productId token =
    Html.button
        [ Html.Attributes.class "product-deleteButton"
        , Html.Events.onClick (Delete token productId)
        ]
        [ Icon.delete "width:32px;height:32px;fill:#eee"
        , Html.text "削除する"
        ]


{-|

    コメントの表示

-}
commentListView : Maybe ( Time.Posix, Time.Zone ) -> User.Id -> LogInState.LogInState -> Maybe (List Product.Comment) -> Html.Html Msg
commentListView nowMaybe sellerId logInState commentListMaybe =
    Html.div
        [ Html.Attributes.class "product-commentList" ]
        (case commentListMaybe of
            Just commentList ->
                case logInState of
                    LogInState.Ok { accessToken, userWithName } ->
                        [ commentInputArea accessToken ]
                            ++ (commentList
                                    |> List.reverse
                                    |> List.map
                                        (commentView nowMaybe
                                            sellerId
                                            (Just
                                                (User.withNameGetId userWithName)
                                            )
                                        )
                               )

                    _ ->
                        commentList
                            |> List.reverse
                            |> List.map (commentView nowMaybe sellerId Nothing)

            Nothing ->
                [ Html.text "読み込み中" ]
        )


commentView : Maybe ( Time.Posix, Time.Zone ) -> User.Id -> Maybe User.Id -> Product.Comment -> Html.Html msg
commentView nowMaybe sellerId myIdMaybe comment =
    let
        speaker =
            comment |> Product.commentGetSpeaker

        isSellerComment =
            sellerId == User.withNameGetId speaker

        isMyComment =
            myIdMaybe == Just (User.withNameGetId speaker)
    in
    Html.div
        [ Html.Attributes.class "product-comment" ]
        [ Html.a
            [ Html.Attributes.class
                (if isSellerComment then
                    "product-comment-sellerName"

                 else
                    "product-comment-name"
                )
            , Html.Attributes.href (SiteMap.userUrl (User.withNameGetId speaker))
            ]
            [ Html.img
                [ Html.Attributes.style "border-radius" "50%"
                , Html.Attributes.style "width" "3rem"
                , Html.Attributes.src (User.withNameGetImageUrl speaker)
                ]
                []
            , Html.text (User.withNameGetDisplayName speaker)
            ]
        , Html.div
            [ Html.Attributes.class
                (if isSellerComment then
                    "product-comment-sellerBox"

                 else
                    "product-comment-box"
                )
            ]
            ((if isSellerComment then
                [ commentTriangleLeft isMyComment ]

              else
                []
             )
                ++ [ Html.div
                        [ Html.Attributes.classList
                            [ ( "product-comment-text", True )
                            , ( "product-comment-text-mine", isMyComment )
                            , ( "product-comment-text-seller", isSellerComment )
                            ]
                        ]
                        [ Html.text (Product.commentGetBody comment) ]
                   ]
                ++ (if isSellerComment then
                        []

                    else
                        [ commentTriangleRight isMyComment ]
                   )
            )
        , Html.div
            [ Html.Attributes.class "product-comment-time" ]
            [ Html.text (Product.createdAtToString nowMaybe (Product.commentGetCreatedAt comment)) ]
        ]


commentTriangleLeft : Bool -> Html.Html msg
commentTriangleLeft isMine =
    Svg.svg
        ([ Svg.Attributes.viewBox "0 0 10 10"
         , Svg.Attributes.class "product-comment-text-triangle"
         ]
            ++ (if isMine then
                    [ Svg.Attributes.class "product-comment-text-triangle-mine" ]

                else
                    []
               )
        )
        [ Svg.polygon
            [ Svg.Attributes.points "10 0 0 0 10 10" ]
            []
        ]


commentTriangleRight : Bool -> Html.Html msg
commentTriangleRight isMine =
    Svg.svg
        ([ Svg.Attributes.viewBox "0 0 10 10"
         , Svg.Attributes.class "product-comment-text-triangle"
         ]
            ++ (if isMine then
                    [ Svg.Attributes.class "product-comment-text-triangle-mine" ]

                else
                    []
               )
        )
        [ Svg.polygon
            [ Svg.Attributes.points "0 0 10 0 0 10" ]
            []
        ]


commentInputArea : Api.Token -> Html.Html Msg
commentInputArea token =
    Html.div
        []
        [ Html.textarea
            [ Html.Events.onInput InputComment
            , Html.Attributes.class "form-textarea"
            ]
            []
        , Html.button
            [ Html.Events.onClick (SendComment token)
            , Html.Attributes.class "product-comment-sendButton"
            ]
            [ Html.text "コメントを送信" ]
        ]


productsViewPriceAndBuyButton : Bool -> Int -> Html.Html Msg
productsViewPriceAndBuyButton isWideScreen price =
    Html.div
        [ Html.Attributes.classList
            [ ( "product-priceAndBuyButton", True )
            , ( "product-priceAndBuyButton-wide", isWideScreen )
            ]
        ]
        [ Html.div [ Html.Attributes.class "product-price" ] [ Html.text (Product.priceToString price) ]
        , Html.button
            [ Html.Events.onClick ToConfirmPage ]
            [ Html.text "購入手続きへ" ]
        ]


tradeStartButton : LogInState.LogInState -> Product.Id -> Html.Html Msg
tradeStartButton logInState productId =
    Html.div
        []
        [ Html.button
            ([ Html.Attributes.class "mainButton" ]
                ++ (case LogInState.getAccessToken logInState of
                        Just accessToken ->
                            [ Html.Events.onClick (TradeStart accessToken productId) ]

                        Nothing ->
                            [ Html.Attributes.class "mainButton-disabled" ]
                   )
            )
            [ Html.text "取引を開始する" ]
        ]


editOkCancelButton : Api.Token -> Product.Id -> Maybe Api.UpdateProductRequest -> Html.Html Msg
editOkCancelButton token productId requestDataMaybe =
    Html.div
        [ Html.Attributes.class "profile-editButtonArea" ]
        [ Html.button
            [ Html.Attributes.class "profile-editCancelButton"
            , Html.Events.onClick MsgBackToViewMode
            ]
            [ Html.text "キャンセル" ]
        , Html.button
            ([ Html.Attributes.class "profile-editOkButton" ]
                ++ (case requestDataMaybe of
                        Just requestDate ->
                            [ Html.Events.onClick (UpdateProductData token productId requestDate)
                            , Html.Attributes.disabled False
                            ]

                        Nothing ->
                            [ Html.Attributes.disabled True ]
                   )
            )
            [ Html.text "変更する" ]
        ]
