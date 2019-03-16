module Page.Goods exposing
    ( goodsList
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
goodsList : Bool -> Html.Html msg
goodsList isWideMode =
    Html.div
        [ Html.Attributes.style "display" "grid"
        , Html.Attributes.style "grid-template-columns"
            (if isWideMode then
                "33.3% 33.4% 33.3%"

             else
                "50% 50%"
            )
        ]
        ([ { title = "冷蔵庫", price = 300, like = 1 }
         , { title = "洗濯機", price = 100, like = 5 }
         , { title = "時計", price = 10, like = 99 }
         , { title = "掃除機", price = 100, like = 5 }
         , { title = "自転車", price = 200, like = 9 }
         , { title = "マンガ", price = 10, like = 99 }
         , { title = "ゲーム", price = 10, like = 99 }
         , { title = "絵本", price = 100, like = 5 }
         , { title = "棚", price = 1000, like = 2 }
         , { title = "いす", price = 1000, like = 2 }
         , { title = "バッテリー", price = 300, like = 20 }
         , { title = "教科書", price = 20, like = 10 }
         ]
            |> List.map goodsListItem
        )


goodsListItem : { title : String, price : Int, like : Int } -> Html.Html msg
goodsListItem { title, price, like } =
    Html.a
        [ Html.Attributes.class "item"
        , Html.Attributes.href (SiteMap.goodsUrl "id")
        ]
        [ itemImage
        , Html.div [ Html.Attributes.class "itemTitle" ] [ Html.text title ]
        , Html.div [ Html.Attributes.class "itemPrice" ] [ Html.text (priceToString price) ]
        , Html.div [] [ Html.text ("いいね" ++ String.fromInt like) ]
        ]


{-| 価格(整数)を3桁ごとに,がついたものにする
-}
priceToString : Int -> String
priceToString price =
    ((if price < 1000 then
        ( price, [] )

      else if price < 1000000 then
        ( price // 1000, [ price |> modBy 1000 ] )

      else
        ( price // 1000000, [ price // 1000 |> modBy 1000, price |> modBy 1000 ] )
     )
        |> Tuple.mapFirst String.fromInt
        |> Tuple.mapSecond (List.map (String.fromInt >> String.padLeft 3 '0'))
        |> (\( a, b ) -> a :: b)
        |> String.join ","
    )
        ++ "円"


itemImage : Html.Html msg
itemImage =
    Html.img
        [ Html.Attributes.class "itemImage"
        , Html.Attributes.src "/assets/itemDummy.png"
        ]
        []


goodsView : Bool -> Goods.Goods -> List (Html.Html msg)
goodsView isWideScreenMode goods =
    [ Html.div
        [ Html.Attributes.class "goods-container" ]
        [ Html.div
            [ Html.Attributes.class "goods" ]
            [ goodsViewImage (Goods.getImage goods)
            , goodsViewName (Goods.getName goods)
            , goodsViewLike (Goods.getLike goods)
            , goodsViewDescription (Goods.getDescription goods)
            , goodsViewCondition (Goods.getCondition goods)
            , goodsViewLocation (Goods.getLocation goods)
            , Html.div []
                [ Html.text
                    (if Goods.getComplete goods then
                        "売却済み"

                     else
                        "まだ売れていない"
                    )
                ]
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
        [ Html.div [ Html.Attributes.class "goods-price" ] [ Html.text (priceToString price) ]
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
            [ Html.text
                (case condition of
                    Goods.New ->
                        "新品・未使用"

                    Goods.LikeNew ->
                        "ほぼ未使用"

                    Goods.VeryGood ->
                        "目立った傷や汚れなし"

                    Goods.Good ->
                        "多少の傷や汚れあり"

                    Goods.Acceptable ->
                        "目立つ傷や汚れあり"

                    Goods.Junk ->
                        "状態が悪い・ジャンク"
                )
            ]
        ]


goodsViewLocation : Goods.Location -> Html.Html msg
goodsViewLocation location =
    Html.div [ Html.Attributes.class "goods-location" ]
        [ Html.div [ Html.Attributes.class "goods-label" ] [ Html.text "取引場所" ]
        , Html.div [] [ Html.text location ]
        ]
