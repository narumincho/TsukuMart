module Page.GoodList exposing (Msg(..), view)

{-| 商品の一覧表示
-}

import Api
import Data.Good as Goods
import Data.LogInState
import Html
import Html.Attributes
import Html.Events
import Json.Decode
import SiteMap


type Msg
    = LikeGoods Api.Token Int



{- ============================================
                商品の一覧表示
   ============================================
-}


view : Data.LogInState.LogInState -> Bool -> List Goods.Good -> Html.Html Msg
view logInState isWideMode goodsList =
    Html.div
        [ Html.Attributes.style "display" "grid"
        , Html.Attributes.style "grid-template-columns"
            (if isWideMode then
                "33.3% 33.4% 33.3%"

             else
                "50% 50%"
            )
        ]
        (goodsList
            |> List.map
                (goodsListItem
                    (case logInState of
                        Data.LogInState.LogInStateOk { access } ->
                            Just access

                        Data.LogInState.LogInStateNone ->
                            Nothing
                    )
                )
        )


goodsListItem : Maybe Api.Token -> Goods.Good -> Html.Html Msg
goodsListItem tokenMaybe goods =
    Html.a
        [ Html.Attributes.class "item"
        , Html.Attributes.href (SiteMap.goodsUrl (Goods.getId goods))
        ]
        [ itemImage (Goods.getFirstImageUrl goods)
        , Html.div
            [ Html.Attributes.class "itemTitle" ]
            [ Html.text (Goods.getName goods) ]
        , Html.div
            [ Html.Attributes.class "itemPrice" ]
            [ Html.text (Goods.priceToString (Goods.getPrice goods)) ]
        , Html.div
            (case tokenMaybe of
                Just token ->
                    [ Html.Events.preventDefaultOn "click" (Json.Decode.succeed ( LikeGoods token (Goods.getId goods), True )) ]

                Nothing ->
                    []
            )
            [ Html.text ("いいね" ++ String.fromInt (Goods.getLikedCount goods)) ]
        ]


itemImage : String -> Html.Html msg
itemImage url =
    Html.img
        [ Html.Attributes.class "itemImage"
        , Html.Attributes.src url
        ]
        []
