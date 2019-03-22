module Page.GoodsList exposing (goodsListView)

{-| 商品の一覧表示
-}

{- ============================================
                商品の一覧表示
   ============================================
-}

import Data.Goods as Goods
import Html
import Html.Attributes
import SiteMap


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
        , Html.Attributes.href (SiteMap.goodsUrl (Goods.getId goods))
        ]
        [ itemImage (Goods.getFirstImageUrl goods)
        , Html.div [ Html.Attributes.class "itemTitle" ] [ Html.text (Goods.getName goods) ]
        , Html.div [ Html.Attributes.class "itemPrice" ] [ Html.text (Goods.priceToString (Goods.getPrice goods)) ]
        , Html.div [] [ Html.text ("いいね" ++ String.fromInt (Goods.getLikedCount goods)) ]
        ]


itemImage : String -> Html.Html msg
itemImage url =
    Html.img
        [ Html.Attributes.class "itemImage"
        , Html.Attributes.src url
        ]
        []
