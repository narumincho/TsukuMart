module Component.TradeList exposing (view)

import Css
import Data.Product as Product
import Data.Trade as Trade
import Data.User as User
import Html.Styled
import Html.Styled.Attributes
import Icon
import PageLocation
import Style


view : Maybe (List Product.Product) -> Maybe (List Trade.Trade) -> Html.Styled.Html msg
view allProductsMaybe tradesMaybe =
    Html.Styled.div
        []
        (case ( allProductsMaybe, tradesMaybe ) of
            ( Just allProducts, Just (x :: xs) ) ->
                mainView allProducts ( x, xs )

            ( _, Just [] ) ->
                [ Style.emptyList "ここに表示する取引がありません" ]

            ( _, Nothing ) ->
                [ Html.Styled.text "取引情報を読み込み中"
                , Icon.loading { size = 64, color = Css.rgb 0 0 0 }
                ]

            ( Nothing, _ ) ->
                [ Html.Styled.text "商品情報を読み込み中"
                , Icon.loading { size = 64, color = Css.rgb 0 0 0 }
                ]
        )


mainView : List Product.Product -> ( Trade.Trade, List Trade.Trade ) -> List (Html.Styled.Html msg)
mainView allProducts ( x, xs ) =
    (x :: xs) |> List.map (itemView allProducts)


itemView : List Product.Product -> Trade.Trade -> Html.Styled.Html msg
itemView allProducts trade =
    let
        product =
            allProducts |> Product.searchFromId (Trade.getProductId trade)
    in
    Html.Styled.a
        [ Html.Styled.Attributes.href
            (PageLocation.toUrlAsString
                (PageLocation.Trade (Trade.getId trade))
            )
        , Html.Styled.Attributes.css
            [ Style.displayGridAndGap 0
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
                [ Css.display Css.block
                , Style.gridColumn 1 2
                , Style.gridRow 1 4
                , Css.width (Css.px 192)
                , Css.height (Css.px 192)
                , Css.property "object-fit" "contain"
                ]
            ]
            []
        , Html.Styled.div
            [ Html.Styled.Attributes.css
                [ Style.gridColumn 2 3
                , Style.gridRow 1 2
                , Css.color (Css.rgb 0 0 0)
                , Css.fontSize (Css.px 32)
                ]
            ]
            [ Html.Styled.text (Product.getName product) ]
        , Html.Styled.div
            [ Html.Styled.Attributes.css
                [ Style.gridColumn 2 3
                , Style.gridRow 2 3
                ]
            ]
            [ Html.Styled.text (Product.priceToString (Product.getPrice product)) ]
        , Html.Styled.div
            [ Html.Styled.Attributes.css
                [ Style.gridColumn 2 3
                , Style.gridRow 3 4
                , Css.displayFlex
                ]
            ]
            [ userView (Product.getSeller product)
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
        [ Style.userImage 48 (User.withNameGetImageId userWithName)
        , Html.Styled.text (User.withNameGetDisplayName userWithName)
        ]
