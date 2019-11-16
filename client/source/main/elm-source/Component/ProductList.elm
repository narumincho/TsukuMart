module Component.ProductList exposing
    ( Cmd(..)
    , Model
    , Msg(..)
    , initModel
    , update
    , view
    )

{-| 商品の一覧表示
-}

import Api
import Css
import Data.LogInState
import Data.Product as Product
import Html.Styled
import Html.Styled.Attributes
import Html.Styled.Events
import Icon
import Json.Decode
import Page.Style
import PageLocation
import Set


type Model
    = Model { likeUpdating : Set.Set String }


type Msg
    = Like Api.Token Product.Id
    | UnLike Api.Token Product.Id
    | UpdateLikedCountResponse Product.Id (Result String ())


type Cmd
    = CmdLike Api.Token Product.Id
    | CmdUnlike Api.Token Product.Id
    | CmdScrollIntoView String


initModel : Maybe Product.Id -> ( Model, List Cmd )
initModel productIdMaybe =
    ( Model { likeUpdating = Set.empty }
    , case productIdMaybe of
        Just id ->
            [ CmdScrollIntoView (productIdString id) ]

        Nothing ->
            []
    )


update : Msg -> Model -> ( Model, List Cmd )
update msg (Model rec) =
    case msg of
        Like token productId ->
            ( Model { rec | likeUpdating = rec.likeUpdating |> Set.insert (Product.idToString productId) }
            , [ CmdLike token productId ]
            )

        UnLike token productId ->
            ( Model { rec | likeUpdating = rec.likeUpdating |> Set.insert (Product.idToString productId) }
            , [ CmdUnlike token productId ]
            )

        UpdateLikedCountResponse productId _ ->
            ( Model { rec | likeUpdating = rec.likeUpdating |> Set.remove (Product.idToString productId) }
            , []
            )



{- ============================================
                商品の一覧表示
   ============================================
-}


{-| 商品の一覧表示
-}
view : Model -> Data.LogInState.LogInState -> Bool -> Maybe (List Product.Product) -> Html.Styled.Html Msg
view (Model { likeUpdating }) logInState isWideMode productList =
    case productList of
        Just [] ->
            Page.Style.emptyList "ここに表示する商品がありません"

        Just (x :: xs) ->
            listView likeUpdating logInState isWideMode ( x, xs )

        Nothing ->
            Page.Style.container
                [ Html.Styled.div
                    [ Html.Styled.Attributes.css
                        [ Page.Style.displayGridAndGap 0
                        , Page.Style.justifyItemsCenter
                        ]
                    ]
                    [ Html.Styled.text "読み込み中"
                    , Icon.loading { size = 48, color = Css.rgb 0 0 0 }
                    ]
                ]


listView :
    Set.Set String
    -> Data.LogInState.LogInState
    -> Bool
    -> ( Product.Product, List Product.Product )
    -> Html.Styled.Html Msg
listView sending logInState isWideMode ( product, productList ) =
    Html.Styled.div
        [ Html.Styled.Attributes.css
            [ Page.Style.displayGridAndGap 0
            , Css.property "grid-template-columns"
                (if isWideMode then
                    "33.3% 33.4% 33.3%"

                 else
                    "50% 50%"
                )
            ]
        ]
        ((product :: productList)
            |> List.map
                (\p ->
                    itemView logInState
                        (sending |> Set.member (Product.idToString (Product.getId p)))
                        p
                )
        )


itemView : Data.LogInState.LogInState -> Bool -> Product.Product -> Html.Styled.Html Msg
itemView logInState sending product =
    Html.Styled.a
        [ Html.Styled.Attributes.class "productList-item"
        , Html.Styled.Attributes.href (PageLocation.toUrlAsString (PageLocation.Product (Product.getId product)))
        , Html.Styled.Attributes.id (productIdString (Product.getId product))
        ]
        (itemImage (Product.getName product) (Product.getThumbnailImageUrl product)
            :: (case Product.getStatus product of
                    Product.Selling ->
                        []

                    Product.Trading ->
                        [ soldOutBar ]

                    Product.SoldOut ->
                        [ soldOutBar ]
               )
            ++ [ Html.Styled.div
                    [ Html.Styled.Attributes.class "productList-name" ]
                    [ Html.Styled.text (Product.getName product) ]
               , Html.Styled.div
                    [ Html.Styled.Attributes.class "productList-priceAndLike" ]
                    [ itemLike logInState sending product
                    , itemPrice (Product.getPrice product)
                    ]
               ]
        )


productIdString : Product.Id -> String
productIdString productId =
    "product-" ++ Product.idToString productId


itemPrice : Int -> Html.Styled.Html msg
itemPrice price =
    Html.Styled.div
        []
        [ Html.Styled.span
            [ Html.Styled.Attributes.css
                [ Css.fontSize (Css.rem 1.5)
                , Css.color (Css.rgb 81 33 130)
                ]
            ]
            [ Html.Styled.text (Product.priceToStringWithoutYen price) ]
        , Html.Styled.text "円"
        ]


itemLike : Data.LogInState.LogInState -> Bool -> Product.Product -> Html.Styled.Html Msg
itemLike logInState sending product =
    if sending then
        Html.Styled.button
            [ Html.Styled.Attributes.class "productList-like"
            , Html.Styled.Attributes.disabled True
            , Html.Styled.Attributes.css [ Css.padding2 (Css.px 8) (Css.px 24) ]
            ]
            [ Icon.loading { size = 20, color = Css.rgb 255 255 255 }
            ]

    else
        case logInState of
            Data.LogInState.Ok { likedProductIds, token } ->
                if List.member (Product.getId product) likedProductIds then
                    Html.Styled.button
                        [ Html.Styled.Events.custom "click"
                            (Json.Decode.succeed
                                { message = UnLike token (Product.getId product)
                                , stopPropagation = True
                                , preventDefault = True
                                }
                            )
                        , Html.Styled.Attributes.class "productList-liked"
                        , Html.Styled.Attributes.class "productList-like"
                        ]
                        (itemLikeBody (Product.getLikedCount product))

                else
                    Html.Styled.button
                        [ Html.Styled.Events.custom "click"
                            (Json.Decode.succeed
                                { message = Like token (Product.getId product)
                                , stopPropagation = True
                                , preventDefault = True
                                }
                            )
                        , Html.Styled.Attributes.class "productList-like"
                        ]
                        (itemLikeBody (Product.getLikedCount product))

            _ ->
                Html.Styled.div
                    [ Html.Styled.Attributes.class "productList-like-noLogIn" ]
                    (itemLikeBody (Product.getLikedCount product))


itemLikeBody : Int -> List (Html.Styled.Html msg)
itemLikeBody count =
    [ Html.Styled.text "いいね"
    , Html.Styled.span
        [ Html.Styled.Attributes.css
            [ Css.fontSize (Css.rem 1.3) ]
        ]
        [ Html.Styled.text (String.fromInt count) ]
    ]


itemImage : String -> String -> Html.Styled.Html msg
itemImage name url =
    Html.Styled.img
        [ Html.Styled.Attributes.css
            [ Css.display Css.block
            , Css.width (Css.pct 100)
            , Css.height (Css.px 192)
            , Css.property "object-fit" "contain"
            , Css.property "grid-column" "1 / 2"
            , Css.property "grid-row" "1 / 2"
            , Css.backgroundColor (Css.rgb 128 128 128)
            ]
        , Html.Styled.Attributes.src url
        , Html.Styled.Attributes.alt (name ++ "の画像")
        ]
        []


soldOutBar : Html.Styled.Html msg
soldOutBar =
    Html.Styled.div
        [ Html.Styled.Attributes.css
            [ Css.property "grid-column" "1 / 2"
            , Css.property "grid-row" "1 / 2"
            , Css.overflow Css.hidden
            ]
        ]
        [ Html.Styled.div
            [ Html.Styled.Attributes.css
                [ Css.backgroundColor (Css.rgb 149 12 12)
                , Css.color (Css.rgb 255 255 255)
                , Css.transforms
                    [ Css.translate2 (Css.px -73) (Css.px 42)
                    , Css.rotate (Css.deg 315)
                    ]
                , Css.width (Css.px 256)
                , Css.fontSize (Css.rem 1.5)
                , Css.textAlign Css.center
                ]
            ]
            [ Html.Styled.text "うりきれ" ]
        ]
