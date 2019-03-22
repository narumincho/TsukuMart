module Page.Goods exposing
    ( Emit(..)
    , Model
    , Msg(..)
    , imageView
    , initModel
    , initModelFromGoods
    , update
    , view
    )

{-| 商品の表示
-}

import Data.Goods as Goods
import Html
import Html.Attributes
import SiteMap
import Tab



{- 商品詳細ページ -}


type Model
    = Normal Goods.Goods
    | Loading { goodsId : Int }


type Emit
    = EmitGetGoods { goodsId : Int }


type Msg
    = GetGoodsResponse Goods.Goods


{-| 指定したIDの商品詳細ページ
-}
initModel : Int -> ( Model, Maybe Emit )
initModel id =
    ( Loading { goodsId = id }
    , Just (EmitGetGoods { goodsId = id })
    )


{-| 商品の内容があらかじめ、わかっているときのもの。でも、一応また聞きに行く
-}
initModelFromGoods : Goods.Goods -> ( Model, Maybe Emit )
initModelFromGoods goods =
    ( Normal goods
    , Just (EmitGetGoods { goodsId = Goods.getId goods })
    )


update : Msg -> Model -> ( Model, Maybe Emit )
update msg _ =
    case msg of
        GetGoodsResponse goods ->
            ( Normal goods, Nothing )


view : Bool -> Model -> ( String, Tab.Tab Never, List (Html.Html msg) )
view isWideScreenMode model =
    case model of
        Loading _ ->
            ( "商品詳細ページ"
            , Tab.None
            , [ Html.text "読み込み中" ]
            )

        Normal goods ->
            ( Goods.getName goods
            , Tab.None
            , [ Html.div
                    [ Html.Attributes.class "goods-container" ]
                    [ Html.div
                        [ Html.Attributes.class "goods" ]
                        [ goodsViewImage (Goods.getFirstImageUrl goods) (Goods.getOthersImageUrlList goods)
                        , goodsViewName (Goods.getName goods)
                        , goodsViewLike (Goods.getLikedCount goods)
                        , goodsViewDescription (Goods.getDescription goods)
                        , goodsViewCondition (Goods.getCondition goods)
                        ]
                    , goodsViewPriceAndBuyButton isWideScreenMode (Goods.getPrice goods)
                    ]
              ]
            )


goodsViewImage : String -> List String -> Html.Html msg
goodsViewImage url urlList =
    Html.div
        [ Html.Attributes.class "goods-imageListContainer" ]
        [ Html.div
            [ Html.Attributes.class "goods-imageList"
            ]
            (url :: urlList |> List.map imageView)
        ]


imageView : String -> Html.Html msg
imageView url =
    Html.img
        [ Html.Attributes.class "goods-image"
        , Html.Attributes.src url
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
