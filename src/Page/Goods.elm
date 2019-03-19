module Page.Goods exposing
    ( goodsListView
    , goodsView
    )

{-| 商品の表示
-}

import Data.Goods as Goods
import Html
import Html.Attributes
import SiteMap



{- ============================================
                商品の一覧表示
   ============================================
-}


{-| 商品の一覧表示
-}
goodsListView : Bool -> List Goods.Goods -> Html.Html msg
goodsListView isWideMode goodsList =
    Html.div
        [ Html.Attributes.style "display" "grid"
        , Html.Attributes.style "grid-template-columns"
            (if isWideMode then
                "33.3% 33.4% 33.3%"

             else
                "50% 50%"
            )
        ]
        (goodsList |> List.map goodsListItem)


goodsListItem : Goods.Goods -> Html.Html msg
goodsListItem goods =
    Html.a
        [ Html.Attributes.class "item"
        , Html.Attributes.href (SiteMap.goodsUrl "id")
        ]
        [ itemImage (Goods.getFirstImageUrl goods)
        , Html.div [ Html.Attributes.class "itemTitle" ] [ Html.text (Goods.getName goods) ]
        , Html.div [ Html.Attributes.class "itemPrice" ] [ Html.text (Goods.priceToString (Goods.getPrice goods)) ]
        , Html.div [] [ Html.text ("いいね" ++ String.fromInt (Goods.getLike goods)) ]
        ]


itemImage : String -> Html.Html msg
itemImage url =
    Html.img
        [ Html.Attributes.class "itemImage"
        , Html.Attributes.src url
        ]
        []


goodsView : Bool -> Goods.Goods -> List (Html.Html msg)
goodsView isWideScreenMode goods =
    [ Html.div
        [ Html.Attributes.class "goods-container" ]
        [ Html.div
            [ Html.Attributes.class "goods" ]
            [ goodsViewImage (Goods.getFirstImageUrl goods)
            , goodsViewName (Goods.getName goods)
            , goodsViewLike (Goods.getLike goods)
            , goodsViewDescription (Goods.getDescription goods)
            , goodsViewCondition (Goods.getCondition goods)
            ]
        , goodsViewPriceAndBuyButton isWideScreenMode (Goods.getPrice goods)
        ]
    ]


goodsViewImage : String -> Html.Html msg
goodsViewImage dataUrl =
    Html.img
        [ Html.Attributes.class "goods-image"
        , Html.Attributes.src dataUrl
        ]
        []


goodsViewName : String -> Html.Html msg
goodsViewName name =
    Html.div
        [ Html.Attributes.class "goods-name" ]
        [ Html.text name ]


goodsViewLike : Int -> Html.Html msg
goodsViewLike likeCount =
    Html.div
        [ Html.Attributes.class "goods-like" ]
        [ Html.span [] [ Html.text "いいね" ]
        , Html.span [] [ Html.text (String.fromInt likeCount) ]
        ]


goodsViewDescription : String -> Html.Html msg
goodsViewDescription description =
    Html.div
        [ Html.Attributes.class "goods-description" ]
        [ Html.div [ Html.Attributes.class "goods-label" ] [ Html.text "商品の説明" ]
        , Html.div [] [ Html.text description ]
        ]


goodsViewPriceAndBuyButton : Bool -> Int -> Html.Html msg
goodsViewPriceAndBuyButton isWideScreenMode price =
    Html.div
        [ Html.Attributes.classList [ ( "goods-priceAndBuyButton", True ), ( "goods-priceAndBuyButton-wide", isWideScreenMode ) ]
        ]
        [ Html.div [ Html.Attributes.class "goods-price" ] [ Html.text (Goods.priceToString price) ]
        , Html.button [] [ Html.text "購入手続きへ" ]
        ]


goodsViewCondition : Goods.Condition -> Html.Html msg
goodsViewCondition condition =
    Html.div []
        [ Html.div
            [ Html.Attributes.class "goods-label" ]
            [ Html.text "商品の状態" ]
        , Html.div
            [ Html.Attributes.class "goods-condition" ]
            [ Html.text (Goods.conditionToJapaneseString condition)
            ]
        ]
