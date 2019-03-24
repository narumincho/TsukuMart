module Page.Good exposing
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

import Data.Good as Good
import Html
import Html.Attributes
import SiteMap
import Tab



{- 商品詳細ページ -}


type Model
    = Normal Good.Good
    | Loading { goodsId : Int }


type Emit
    = EmitGetGoods { goodsId : Int }


type Msg
    = GetGoodsResponse Good.Good


{-| 指定したIDの商品詳細ページ
-}
initModel : Int -> ( Model, Maybe Emit )
initModel id =
    ( Loading { goodsId = id }
    , Just (EmitGetGoods { goodsId = id })
    )


{-| 商品の内容があらかじめ、わかっているときのもの。でも、一応また聞きに行く
-}
initModelFromGoods : Good.Good -> ( Model, Maybe Emit )
initModelFromGoods goods =
    ( Normal goods
    , Just (EmitGetGoods { goodsId = Good.getId goods })
    )


update : Msg -> Model -> ( Model, Maybe Emit )
update msg _ =
    case msg of
        GetGoodsResponse goods ->
            ( Normal goods, Nothing )


view : Bool -> Model -> ( String, Tab.Tab Msg, List (Html.Html msg) )
view isWideScreenMode model =
    case model of
        Loading _ ->
            ( "商品詳細ページ"
            , Tab.none
            , [ Html.text "読み込み中" ]
            )

        Normal goods ->
            ( Good.getName goods
            , Tab.none
            , [ Html.div
                    [ Html.Attributes.class "goods-container" ]
                    [ Html.div
                        [ Html.Attributes.class "goods" ]
                        [ goodsViewImage (Good.getFirstImageUrl goods) (Good.getOthersImageUrlList goods)
                        , goodsViewName (Good.getName goods)
                        , goodsViewLike (Good.getLikedCount goods)
                        , goodsViewDescription (Good.getDescription goods)
                        , goodsViewCondition (Good.getCondition goods)
                        ]
                    , goodsViewPriceAndBuyButton isWideScreenMode (Good.getPrice goods)
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
        [ Html.div [ Html.Attributes.class "goods-price" ] [ Html.text (Good.priceToString price) ]
        , Html.button [] [ Html.text "購入手続きへ" ]
        ]


goodsViewCondition : Good.Condition -> Html.Html msg
goodsViewCondition condition =
    Html.div []
        [ Html.div
            [ Html.Attributes.class "goods-label" ]
            [ Html.text "商品の状態" ]
        , Html.div
            [ Html.Attributes.class "goods-condition" ]
            [ Html.text (Good.conditionToJapaneseString condition)
            ]
        ]
