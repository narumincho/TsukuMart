module Page.Product exposing
    ( Emission(..)
    , Model
    , Msg(..)
    , getProductId
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
import Data.User
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
    = Loading
        { productId : Product.Id
        }
    | WaitNewData
        { product : Product.Product
        }
    | Normal
        { product : Product.ProductDetail
        , sending : Bool -- いいねを送信中か送信中じゃないか
        , comment : String
        }
    | Edit
        { beforeProduct : Product.Product
        , editorModel : ProductEditor.Model
        }
    | Confirm
        { product : Product.Product
        }


type Emission
    = EmissionGetProduct { productId : Product.Id }
    | EmissionGetCommentList { productId : Product.Id }
    | EmissionPostComment Api.Token { productId : Product.Id } String
    | EmissionLike Api.Token Product.Id
    | EmissionUnLike Api.Token Product.Id
    | EmissionTradeStart Api.Token Product.Id
    | EmissionAddLogMessage String
    | EmissionUpdateNowTime
    | EmissionDelete Api.Token Product.Id
    | EmissionByProductEditor ProductEditor.Emission
    | EmissionUpdateProductData Api.Token Product.Id Api.EditProductRequest


type Msg
    = GetProductResponse (Result () Product.Product)
    | GetCommentListResponse (Result () (List Product.Comment))
    | PostCommentResponse (Result () Product.Comment)
    | Like Api.Token Product.Id
    | UnLike Api.Token Product.Id
    | LikeResponse (Result () ())
    | UnlikeResponse (Result () ())
    | TradeStart Api.Token Product.Id
    | TradeStartResponse (Result () ())
    | ToConfirmPage
    | InputComment String
    | SendComment Api.Token
    | Delete Api.Token Product.Id
    | EditProduct
    | MsgBackToViewMode
    | MsgByProductEditor ProductEditor.Msg
    | UpdateProductData Api.Token Product.Id ProductEditor.RequestData
    | UpdateProductDataResponse (Result String ())


{-| 指定したIDの商品詳細ページ
-}
initModel : Product.Id -> ( Model, List Emission )
initModel id =
    ( Loading { productId = id }
    , [ EmissionGetProduct { productId = id } ]
    )


{-| 商品の内容があらかじめ、わかっているときのもの。でも、一応また聞きに行く
-}
initModelFromProduct : Product.Product -> ( Model, List Emission )
initModelFromProduct product =
    ( Normal { product = product, sending = False, comment = "" }
    , [ EmissionGetProduct { productId = Product.getId product } ]
    )


{-| 表示している商品のIDを取得する
-}
getProductId : Model -> Product.Id
getProductId model =
    case model of
        Loading { productId } ->
            productId

        WaitNewData { product } ->
            Product.getId product

        Normal { product } ->
            Product.getId product

        Edit { beforeProduct } ->
            Product.getId beforeProduct

        Confirm { product } ->
            Product.getId product


update : Msg -> Model -> ( Model, List Emission )
update msg model =
    case msg of
        GetProductResponse productsResult ->
            case ( model, productsResult ) of
                ( Normal rec, Ok product ) ->
                    ( Normal { rec | product = product }
                    , [ EmissionGetCommentList { productId = Product.getId product }
                      , EmissionUpdateNowTime
                      ]
                    )

                ( _, Ok product ) ->
                    ( Normal { product = product, sending = False, comment = "" }
                    , [ EmissionGetCommentList { productId = Product.getId product }
                      , EmissionUpdateNowTime
                      ]
                    )

                ( _, Err () ) ->
                    ( model
                    , [ EmissionAddLogMessage "商品情報の取得に失敗しました" ]
                    )

        GetCommentListResponse commentListResult ->
            case ( model, commentListResult ) of
                ( Normal rec, Ok commentList ) ->
                    ( Normal { rec | product = rec.product |> Product.setCommentList commentList }
                    , []
                    )

                ( _, Err () ) ->
                    ( model
                    , [ EmissionAddLogMessage "コメント取得に失敗しました" ]
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

                ( _, Err () ) ->
                    ( model, [ EmissionAddLogMessage "コメントの送信に失敗しました" ] )

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
            ( case ( result, model ) of
                ( Ok (), Normal rec ) ->
                    Normal
                        { rec
                            | product = rec.product |> Product.like
                            , sending = False
                        }

                ( _, _ ) ->
                    model
            , []
            )

        UnlikeResponse result ->
            ( case ( result, model ) of
                ( Ok (), Normal rec ) ->
                    Normal
                        { rec
                            | product = rec.product |> Product.unlike
                            , sending = False
                        }

                ( _, _ ) ->
                    model
            , []
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

                Err () ->
                    [ EmissionAddLogMessage "取引開始を失敗しました" ]
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
                    , [ EmissionPostComment token { productId = Product.getId product } comment ]
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
                    ( WaitNewData { product = beforeProduct }
                    , [ EmissionGetProduct { productId = Product.getId beforeProduct } ]
                    )

                _ ->
                    ( model, [] )

        MsgByProductEditor productEditorMsg ->
            case model of
                Edit r ->
                    ProductEditor.update productEditorMsg r.editorModel
                        |> Tuple.mapBoth
                            (\editorModel -> Edit { r | editorModel = editorModel })
                            (List.map EmissionByProductEditor)

                _ ->
                    ( model, [] )

        UpdateProductData token productId requestData ->
            ( model
            , [ EmissionUpdateProductData token
                    productId
                    (ProductEditor.requestDataToEditApiRequest requestData)
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
view logInState isWideScreenMode nowMaybe model =
    case model of
        Loading _ ->
            { title = Just "商品詳細ページ 読み込み中"
            , tab = BasicParts.tabNone
            , html = [ Html.text "読み込み中" ]
            }

        WaitNewData { product } ->
            { title = Just (Product.getName product)
            , tab = BasicParts.tabNone
            , html =
                [ Html.div
                    [ Html.Attributes.class "container" ]
                    [ Html.div
                        [ Html.Attributes.class "product" ]
                        [ Html.text "最新の情報を取得中…"
                        , productsViewImage (Product.getFirstImageUrl product) (Product.getOthersImageUrlList product)
                        , productsViewName (Product.getName product)
                        , productsViewLike LogInState.None False product
                        , sellerNameView (Product.getSellerId product) (Product.getSellerName product)
                        , descriptionView (Product.getDescription product)
                        , productsViewCondition (Product.getCondition product)
                        ]
                    ]
                ]
            }

        Normal { product, sending } ->
            { title = Just (Product.getName product)
            , tab = BasicParts.tabNone
            , html =
                [ Html.div
                    [ Html.Attributes.class "container" ]
                    [ Html.div
                        [ Html.Attributes.class "product" ]
                        ([ productsViewImage (Product.getFirstImageUrl product) (Product.getOthersImageUrlList product)
                         , productsViewName (Product.getName product)
                         , productsViewLike logInState sending product
                         , sellerNameView (Product.getSellerId product) (Product.getSellerName product)
                         , descriptionView (Product.getDescription product)
                         , productsViewCondition (Product.getCondition product)
                         , commentListView nowMaybe (Product.getSellerId product) logInState (Product.getCommentList product)
                         ]
                            ++ (case logInState of
                                    LogInState.Ok { accessToken, userWithProfile } ->
                                        if
                                            Data.User.withProfileGetId userWithProfile
                                                == Product.getSellerId product
                                        then
                                            [ editButton
                                            , deleteView (Product.getId product) accessToken
                                            ]

                                        else
                                            []

                                    _ ->
                                        []
                               )
                        )
                    , productsViewPriceAndBuyButton isWideScreenMode (Product.getPrice product)
                    ]
                ]
            }

        Edit { editorModel, beforeProduct } ->
            { title = Just (Product.getName beforeProduct)
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
                                    ++ (ProductEditor.view editorModel
                                            |> List.map (Html.map MsgByProductEditor)
                                       )
                                    ++ [ editOkCancelButton
                                            accessToken
                                            (Product.getId beforeProduct)
                                            (ProductEditor.toRequestData editorModel)
                                       ]

                            Nothing ->
                                [ Html.text "ログインしていないときに商品の編集はできません" ]
                        )
                    ]
                ]
            }

        Confirm { product } ->
            { title = Just (Product.getName product)
            , tab = BasicParts.tabNone
            , html =
                [ Html.div
                    [ Html.Attributes.class "container" ]
                    [ Html.div
                        [ Html.Attributes.class "product" ]
                        [ Html.text "購入確認画面。この商品の取引を開始しますか?"
                        , productsViewImage (Product.getFirstImageUrl product) (Product.getOthersImageUrlList product)
                        , productsViewName (Product.getName product)
                        , descriptionView (Product.getDescription product)
                        , productsViewCondition (Product.getCondition product)
                        , tradeStartButton logInState (Product.getId product)
                        ]
                    ]
                ]
            }


productsViewImage : String -> List String -> Html.Html msg
productsViewImage url urlList =
    Html.div
        [ Html.Attributes.class "product-imageListContainer" ]
        [ Html.div
            [ Html.Attributes.class "product-imageList"
            ]
            (url :: urlList |> List.map imageView)
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


productsViewLike : LogInState.LogInState -> Bool -> Product.Product -> Html.Html Msg
productsViewLike logInState sending product =
    Html.div
        [ Html.Attributes.class "product-like-container" ]
        [ likeButton logInState sending product
        ]


likeButton : LogInState.LogInState -> Bool -> Product.Product -> Html.Html Msg
likeButton logInState sending product =
    if sending then
        Html.button
            [ Html.Attributes.class "product-like-sending"
            , Html.Attributes.class "product-like"
            ]
            (itemLikeBody (Product.getLikedCount product))

    else
        case logInState of
            LogInState.Ok { userWithProfile, accessToken } ->
                let
                    userId =
                        Data.User.withProfileGetId userWithProfile
                in
                if False then
                    -- TODO いいねで自分がいいねした商品から判断する
                    Html.button
                        [ Html.Events.onClick (UnLike accessToken (Product.getId product))
                        , Html.Attributes.class "product-liked"
                        , Html.Attributes.class "product-like"
                        ]
                        (itemLikeBody (Product.getLikedCount product))

                else
                    Html.button
                        [ Html.Events.onClick (Like accessToken (Product.getId product))
                        , Html.Attributes.class "product-like"
                        ]
                        (itemLikeBody (Product.getLikedCount product))

            _ ->
                Html.div
                    [ Html.Attributes.class "product-like-label" ]
                    (itemLikeBody (Product.getLikedCount product))


itemLikeBody : Int -> List (Html.Html msg)
itemLikeBody count =
    [ Html.text "いいね"
    , Html.span
        [ Html.Attributes.class "product-like-number" ]
        [ Html.text (String.fromInt count) ]
    ]


sellerNameView : Data.User.Id -> Maybe String -> Html.Html msg
sellerNameView userId nameMaybe =
    Html.div
        []
        [ Html.div [ Html.Attributes.class "product-label" ] [ Html.text "出品者" ]
        , Html.a
            [ Html.Attributes.href (SiteMap.userUrl userId) ]
            [ case nameMaybe of
                Just name ->
                    Html.text name

                Nothing ->
                    Html.text "出品者の名前を取得中"
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
        [ Icon.edit
        , Html.text "編集する"
        ]


deleteView : Product.Id -> Api.Token -> Html.Html Msg
deleteView productId token =
    Html.button
        [ Html.Attributes.class "product-deleteButton"
        , Html.Events.onClick (Delete token productId)
        ]
        [ Icon.delete
        , Html.text "削除する"
        ]


{-|

    コメントの表示

-}
commentListView : Maybe ( Time.Posix, Time.Zone ) -> Data.User.Id -> LogInState.LogInState -> Maybe (List Product.Comment) -> Html.Html Msg
commentListView nowMaybe sellerId logInState commentListMaybe =
    Html.div
        [ Html.Attributes.class "product-commentList" ]
        (case commentListMaybe of
            Just commentList ->
                case logInState of
                    LogInState.Ok { accessToken, userWithProfile } ->
                        [ commentInputArea accessToken ]
                            ++ (commentList
                                    |> List.reverse
                                    |> List.map
                                        (commentView nowMaybe
                                            sellerId
                                            (Just
                                                (Data.User.withProfileGetId userWithProfile)
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


commentView : Maybe ( Time.Posix, Time.Zone ) -> Data.User.Id -> Maybe Data.User.Id -> Product.Comment -> Html.Html msg
commentView nowMaybe sellerId myIdMaybe { text, createdAt, userName, userId } =
    let
        isSellerComment =
            sellerId == userId

        isMyComment =
            myIdMaybe == Just userId
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
            , Html.Attributes.href (SiteMap.userUrl userId)
            ]
            [ Html.text userName ]
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
                        [ Html.text text ]
                   ]
                ++ (if isSellerComment then
                        []

                    else
                        [ commentTriangleRight isMyComment ]
                   )
            )
        , Html.div
            [ Html.Attributes.class "product-comment-time" ]
            [ Html.text (Product.createdAtToString nowMaybe createdAt) ]
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
productsViewPriceAndBuyButton isWideScreenMode price =
    Html.div
        [ Html.Attributes.classList
            [ ( "product-priceAndBuyButton", True )
            , ( "product-priceAndBuyButton-wide", isWideScreenMode )
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


editOkCancelButton : Api.Token -> Product.Id -> Maybe ProductEditor.RequestData -> Html.Html Msg
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
