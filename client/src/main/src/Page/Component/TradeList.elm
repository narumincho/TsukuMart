module Page.Component.TradeList exposing (view)

import Css
import Data.Product as Product
import Data.Trade as Trade
import Data.User as User
import Html
import Html.Attributes
import Icon
import Page.Style
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
                [ Html.text "読み込み中"
                , Icon.loading { size = 64, color = Css.rgb 0 0 0 }
                ]
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
        , Html.Attributes.style "grid-template-columns" "194px 1fr"
        , Html.Attributes.style "grid-template-rows" "max-content max-content max-content"
        , Html.Attributes.style "border" "solid 1px rgba(0,0,0,.4)"
        , Html.Attributes.style "text-decoration" "none"
        , Html.Attributes.style "color" "black"
        ]
        [ Html.img
            [ Html.Attributes.src (Product.getThumbnailImageUrl product)
            , Html.Attributes.style "grid-column" "1 / 2"
            , Html.Attributes.style "grid-row" "1 / 4"
            , Html.Attributes.style "width" "192px"
            , Html.Attributes.style "height" "192px"
            , Html.Attributes.style "object-fit" "contain"
            ]
            []
        , Html.div
            [ Html.Attributes.style "grid-column" "2 / 3"
            , Html.Attributes.style "grid-row" "1 / 2"
            , Html.Attributes.style "color" "black"
            , Html.Attributes.style "font-size" "32px"
            ]
            [ Html.text (Product.getName product) ]
        , Html.div
            [ Html.Attributes.style "grid-column" "2 / 3"
            , Html.Attributes.style "grid-row" "2 / 3"
            ]
            [ Html.text (Product.priceToString (Product.getPrice product)) ]
        , Html.div
            [ Html.Attributes.style "grid-column" "2 / 3"
            , Html.Attributes.style "grid-row" "3 / 4"
            , Html.Attributes.style "display" "flex"
            ]
            [ userView (Trade.getSeller trade)
            , Html.div [ Html.Attributes.style "font-size" "32px" ] [ Html.text "→" ]
            , userView (Trade.getBuyer trade)
            ]
        ]


userView : User.WithName -> Html.Html msg
userView userWithName =
    Html.div
        []
        [ Page.Style.userImage 48 (User.withNameGetImageId userWithName)
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
