module Page.Product exposing
    ( Cmd(..)
    , Model
    , Msg(..)
    , getProductId
    , imageView
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
import Html
import Html.Attributes
import Html.Events
import Html.Styled
import Html.Styled.Attributes
import Html.Styled.Events
import Icon
import Page.Style
import PageLocation
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
    | Confirm { product : Product.Id }


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


type Msg
    = GetCommentListResponse (Result String (List Product.Comment))
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
    , case LogInState.getToken logInState of
        Just accessToken ->
            [ CmdGetProductAndMarkHistory
                { productId = id
                , token = accessToken
                }
            , CmdGetCommentList id
            ]

        Nothing ->
            [ CmdGetCommentList id ]
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

        Confirm { product } ->
            product


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
                ( Ok _, Normal rec ) ->
                    ( Normal
                        { rec
                            | likeSending = False
                        }
                    , []
                    )

                ( Ok _, _ ) ->
                    ( model
                    , []
                    )

                ( Err text, _ ) ->
                    ( model
                    , [ CmdAddLogMessage ("いいねをするのに失敗 " ++ text) ]
                    )

        UnlikeResponse result ->
            case ( result, model ) of
                ( Ok likedCount, Normal rec ) ->
                    ( Normal
                        { rec
                            | likeSending = False
                        }
                    , []
                    )

                ( Ok _, _ ) ->
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
        , html : List (Html.Styled.Html Msg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view logInState isWideScreen nowMaybe productAllMaybe model =
    case ( model, productAllMaybe ) of
        ( _, Nothing ) ->
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

        ( Normal rec, Just productAll ) ->
            normalView logInState
                isWideScreen
                nowMaybe
                { likeSending = rec.likeSending
                , commentSending = rec.commentSending
                , product = productAll |> Product.searchFromId rec.product
                , commentList = rec.commentList
                }

        ( Edit { productEditor, beforeProduct, sending }, Just productAll ) ->
            let
                product =
                    productAll |> Product.searchFromId beforeProduct
            in
            { title = Just (Product.getName product)
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

        ( Confirm { product }, Just productAll ) ->
            let
                productData =
                    productAll |> Product.searchFromId product
            in
            { title = Just (Product.getName productData)
            , tab = BasicParts.tabNone
            , html =
                [ Page.Style.container
                    [ Html.Styled.text "購入確認画面。この商品の取引を開始しますか?"
                    , productsViewImage (Product.getImageUrls productData)
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
        , commentSending : Bool
        , commentList : Maybe (List Product.Comment)
        }
    ->
        { title : Maybe String
        , tab : BasicParts.Tab Msg
        , html : List (Html.Styled.Html Msg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
normalView logInState isWideScreen nowMaybe { product, likeSending, commentSending, commentList } =
    { title = Just (Product.getName product)
    , tab = BasicParts.tabNone
    , html =
        [ Page.Style.container
            ([ productsViewImage (Product.getImageUrls product)
             , productsViewName (Product.getName product)
             , productsViewLike
                logInState
                likeSending
                (Product.getLikedCount product)
                (Product.getId product)
             , statusView (Product.getStatus product)
             , sellerNameView (Product.getSeller product)
             , descriptionView (Product.getDescription product)
             , categoryView (Product.getCategory product)
             , conditionView (Product.getCondition product)
             , createdAtView nowMaybe (Product.getCreatedAt product)
             , commentListView commentSending
                nowMaybe
                (product |> Product.getSeller |> User.withNameGetId)
                logInState
                commentList
             ]
                ++ (case logInState of
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
        [ Html.Styled.Attributes.css
            [ Css.paddingBottom (Css.px 64) ]
        ]
        ((case LogInState.getToken logInState of
            Just token ->
                [ commentInputArea commentSending token ]

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
                        [ Html.Styled.Attributes.css [ Component.Comment.commentSendButtonStyle ]
                        , Html.Styled.Attributes.disabled True
                        ]
                        [ Icon.loading { size = 24, color = Css.rgb 0 0 0 }
                        ]
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
    Html.div
        [ Html.Attributes.classList
            [ ( "product-priceAndBuyButton", True )
            , ( "product-priceAndBuyButton-wide", isWideScreen )
            ]
        ]
        ([ Html.div [ Html.Attributes.class "product-price" ]
            [ Html.text (Product.priceToString (Product.getPrice product)) ]
         ]
            ++ (case buyButton product userWithNameMaybe of
                    Just button ->
                        [ button ]

                    Nothing ->
                        []
               )
        )
        |> Html.Styled.fromUnstyled


buyButton : Product.Product -> Maybe User.WithName -> Maybe (Html.Html Msg)
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


editOkCancelButton : Api.Token -> Product.Id -> Bool -> Maybe Api.UpdateProductRequest -> Html.Styled.Html Msg
editOkCancelButton token productId sending requestDataMaybe =
    if sending then
        Html.Styled.div
            [ Html.Styled.Attributes.class "profile-editButtonArea" ]
            [ Html.Styled.button
                [ Html.Styled.Attributes.class "profile-editOkButton"
                , Html.Styled.Attributes.disabled True
                ]
                [ Icon.loading { size = 32, color = Css.rgb 0 0 0 } ]
            ]

    else
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
                            Just requestData ->
                                [ Html.Styled.Events.onClick (UpdateProductData token productId requestData)
                                , Html.Styled.Attributes.disabled False
                                ]

                            Nothing ->
                                [ Html.Styled.Attributes.disabled True ]
                       )
                )
                [ Html.Styled.text "変更する" ]
            ]
