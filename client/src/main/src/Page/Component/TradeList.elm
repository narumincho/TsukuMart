module Page.Component.TradeList exposing (view)

import Css
import Data.Product as Product
import Data.Trade as Trade
import Data.User as User
import Html.Styled
import Html.Styled.Attributes
import Icon
import Page.Style
import PageLocation


view : Maybe (List Trade.Trade) -> Html.Styled.Html msg
view tradesMaybe =
    Html.Styled.div
        []
        (case tradesMaybe of
            Just (x :: xs) ->
                mainView ( x, xs )

            Just [] ->
                [ Page.Style.emptyList "ここに表示する取引がありません" ]

            Nothing ->
                [ Html.Styled.text "読み込み中"
                , Icon.loading { size = 64, color = Css.rgb 0 0 0 }
                ]
        )


mainView : ( Trade.Trade, List Trade.Trade ) -> List (Html.Styled.Html msg)
mainView ( x, xs ) =
    List.map itemView (x :: xs)


itemView : Trade.Trade -> Html.Styled.Html msg
itemView trade =
    let
        product =
            Trade.getProduct trade
    in
    Html.Styled.a
        [ Html.Styled.Attributes.href
            (PageLocation.toUrlAsString
                (PageLocation.Trade (Trade.getId trade))
            )
        , Html.Styled.Attributes.css
            [ Page.Style.displayGridAndGap 0
            , Css.property "grid-template-columns" "194px 1fr"
            , Css.property "grid-template-rows" "max-content max-content max-content"
            , Css.border3 (Css.px 1) Css.solid (Css.rgba 0 0 0 0.4)
            , Css.textDecoration Css.none
            , Css.color (Css.rgb 0 0 0)
            ]
        ]
        [ Html.Styled.img
            [ Html.Styled.Attributes.src (Product.getThumbnailImageUrl product)
            , Html.Styled.Attributes.css
                [ Css.property "grid-column" "1 / 2"
                , Css.property "grid-row" "1 / 4"
                , Css.width (Css.px 192)
                , Css.height (Css.px 192)
                , Css.property "object-fit" "contain"
                ]
            ]
            []
        , Html.Styled.div
            [ Html.Styled.Attributes.css
                [ Css.property "grid-column" "2 / 3"
                , Css.property "grid-row" "1 / 2"
                , Css.color (Css.rgb 0 0 0)
                , Css.fontSize (Css.px 32)
                ]
            ]
            [ Html.Styled.text (Product.getName product) ]
        , Html.Styled.div
            [ Html.Styled.Attributes.css
                [ Css.property "grid-column" "2 / 3"
                , Css.property "grid-row" "2 / 3"
                ]
            ]
            [ Html.Styled.text (Product.priceToString (Product.getPrice product)) ]
        , Html.Styled.div
            [ Html.Styled.Attributes.css
                [ Css.property "grid-column" "2 / 3"
                , Css.property "grid-row" "3 / 4"
                , Css.displayFlex
                ]
            ]
            [ userView (Trade.getSeller trade)
            , Html.Styled.div
                [ Html.Styled.Attributes.css
                    [ Css.fontSize (Css.rem 2) ]
                ]
                [ Html.Styled.text "→" ]
            , userView (Trade.getBuyer trade)
            ]
        ]


userView : User.WithName -> Html.Styled.Html msg
userView userWithName =
    Html.Styled.div
        []
        [ Page.Style.userImage 48 (User.withNameGetImageId userWithName)
        , Html.Styled.text (User.withNameGetDisplayName userWithName)
        ]
