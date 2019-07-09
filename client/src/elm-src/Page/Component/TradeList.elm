module Page.Component.TradeList exposing (view)

import Data.Product as Product
import Data.Trade as Trade
import Data.User as User
import Html
import Html.Attributes
import PageLocation


view : Maybe (List Trade.Trade) -> Html.Html msg
view tradesMaybe =
    Html.div
        []
        (case tradesMaybe of
            Just (x :: xs) ->
                mainView ( x, xs )

            Just [] ->
                emptyView

            Nothing ->
                [ Html.text "読み込み中" ]
        )


mainView : ( Trade.Trade, List Trade.Trade ) -> List (Html.Html msg)
mainView ( x, xs ) =
    List.map item (x :: xs)


item : Trade.Trade -> Html.Html msg
item trade =
    let
        product =
            Trade.getProduct trade
    in
    Html.a
        [ Html.Attributes.href
            (PageLocation.toUrlAsString
                (PageLocation.Trade (Trade.getId trade))
            )
        , Html.Attributes.style "display" "grid"
        , Html.Attributes.style "grid-template-rows" "64px 1fr"
        , Html.Attributes.style "grid-template-columns" "max-content max-content max-content"
        ]
        [ Html.img
            [ Html.Attributes.href (Product.getThumbnailImageUrl product)
            , Html.Attributes.style "grid-row" "1 / 2"
            , Html.Attributes.style "grid-column" "1 / 4"
            ]
            []
        , Html.div
            [ Html.Attributes.style "grid-row" "2 / 3"
            , Html.Attributes.style "grid-column" "1 / 2"
            ]
            [ Html.text (Product.getName product) ]
        , Html.div
            [ Html.Attributes.style "grid-row" "2 / 3"
            , Html.Attributes.style "grid-column" "2 / 3"
            ]
            [ Html.text (String.fromInt (Product.getPrice product)) ]
        , Html.div
            [ Html.Attributes.style "grid-row" "2 / 3"
            , Html.Attributes.style "grid-column" "3 / 4"
            ]
            [ userView (Trade.getSeller trade)
            , Html.text "→"
            , userView (Trade.getBuyer trade)
            ]
        ]


userView : User.WithName -> Html.Html msg
userView userWithName =
    Html.a
        []
        [ Html.img
            [ Html.Attributes.src (User.withNameGetImageUrl userWithName)
            , Html.Attributes.style "border-radius" "50%"
            ]
            []
        , Html.text (User.withNameGetDisplayName userWithName)
        ]


emptyView : List (Html.Html msg)
emptyView =
    [ Html.div
        [ Html.Attributes.class "productList-zero" ]
        [ Html.img
            [ Html.Attributes.src "/assets/logo_bird.png"
            , Html.Attributes.class "productList-zeroImage"
            , Html.Attributes.alt "ざんねん。取引がありません"
            ]
            []
        , Html.text "ここに表示する取引がありません"
        ]
    ]
