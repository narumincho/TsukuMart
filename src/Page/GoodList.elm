module Page.GoodList exposing (Msg(..), view)

{-| 商品の一覧表示
-}

import Api
import Data.Good as Good
import Data.LogInState
import Html
import Html.Attributes
import Html.Events
import Json.Decode
import SiteMap


type Msg
    = LikeGood Api.Token Int



{- ============================================
                商品の一覧表示
   ============================================
-}


view : Data.LogInState.LogInState -> Bool -> List Good.Good -> Html.Html Msg
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
                (goodListItem
                    (case logInState of
                        Data.LogInState.LogInStateOk { access } ->
                            Just access

                        Data.LogInState.LogInStateNone ->
                            Nothing
                    )
                )
        )


goodListItem : Maybe Api.Token -> Good.Good -> Html.Html Msg
goodListItem tokenMaybe good =
    Html.a
        [ Html.Attributes.class "item"
        , Html.Attributes.href (SiteMap.goodsUrl (Good.getId good))
        ]
        [ itemImage (Good.getFirstImageUrl good)
        , Html.div
            [ Html.Attributes.class "itemTitle" ]
            [ Html.text (Good.getName good) ]
        , Html.div
            [ Html.Attributes.class "itemPrice" ]
            [ Html.text (Good.priceToString (Good.getPrice good)) ]
        , Html.div
            (case tokenMaybe of
                Just token ->
                    [ Html.Events.preventDefaultOn "click" (Json.Decode.succeed ( LikeGood token (Good.getId good), True )) ]

                Nothing ->
                    []
            )
            [ Html.text ("いいね" ++ String.fromInt (Good.getLikedCount good)) ]
        ]


itemImage : String -> Html.Html msg
itemImage url =
    Html.img
        [ Html.Attributes.class "itemImage"
        , Html.Attributes.src url
        ]
        []
