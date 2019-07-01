module Page.Component.ProductList exposing (Emission(..), Model, Msg(..), initModel, update, view)

{-| 商品の一覧表示
-}

import Api
import Data.LogInState
import Data.Product as Product
import Html
import Html.Attributes
import Html.Events
import Json.Decode
import SiteMap


type Model
    = Model { sending : Bool }


type Msg
    = Like Api.Token Product.Id
    | UnLike Api.Token Product.Id
    | UpdateLikedCountResponse Product.Id (Result String Int)


type Emission
    = EmissionLike Api.Token Product.Id
    | EmissionUnlike Api.Token Product.Id
    | EmissionScrollIntoView String


initModel : Maybe Product.Id -> ( Model, List Emission )
initModel productIdMaybe =
    ( Model { sending = False }
    , case productIdMaybe of
        Just id ->
            [ EmissionScrollIntoView (productIdString id) ]

        Nothing ->
            []
    )


update : Msg -> Model -> ( Model, List Emission )
update msg _ =
    case msg of
        Like token productId ->
            ( Model { sending = True }
            , [ EmissionLike token productId ]
            )

        UnLike token productId ->
            ( Model { sending = True }
            , [ EmissionUnlike token productId ]
            )

        UpdateLikedCountResponse _ _ ->
            ( Model { sending = False }
            , []
            )



{- ============================================
                商品の一覧表示
   ============================================
-}


{-| 商品の一覧表示
-}
view : Model -> Data.LogInState.LogInState -> Bool -> Maybe (List Product.Product) -> Html.Html Msg
view (Model { sending }) logInState isWideMode productList =
    case productList of
        Just [] ->
            emptyView

        Just (x :: xs) ->
            listView sending logInState isWideMode x xs

        Nothing ->
            Html.div
                [ Html.Attributes.class "container" ]
                [ Html.div
                    []
                    [ Html.text "読み込み中" ]
                ]


emptyView : Html.Html Msg
emptyView =
    Html.div
        [ Html.Attributes.class "container" ]
        [ Html.div
            [ Html.Attributes.class "productList-zero" ]
            [ Html.img
                [ Html.Attributes.src "/assets/logo_bird.png"
                , Html.Attributes.class "productList-zeroImage"
                , Html.Attributes.alt "ざんねん。商品がありません"
                ]
                []
            , Html.text "ここに表示する商品がありません"
            ]
        ]


listView : Bool -> Data.LogInState.LogInState -> Bool -> Product.Product -> List Product.Product -> Html.Html Msg
listView sending logInState isWideMode product productList =
    Html.div
        [ Html.Attributes.style "display" "grid"
        , Html.Attributes.style "grid-template-columns"
            (if isWideMode then
                "33.3% 33.4% 33.3%"

             else
                "50% 50%"
            )
        ]
        ((product :: productList)
            |> List.map (item logInState sending)
        )


item : Data.LogInState.LogInState -> Bool -> Product.Product -> Html.Html Msg
item logInState sending product =
    Html.a
        [ Html.Attributes.class "productList-item"
        , Html.Attributes.href (SiteMap.productUrl (Product.getId product))
        , Html.Attributes.id (productIdString (Product.getId product))
        ]
        [ itemImage (Product.getName product) (Product.getThumbnailImageUrl product)
        , Html.div
            [ Html.Attributes.class "productList-name" ]
            [ Html.text (Product.getName product) ]
        , Html.div
            [ Html.Attributes.class "productList-priceAndLike" ]
            [ itemLike logInState sending product
            , itemPrice (Product.getPrice product)
            ]
        ]


productIdString : Product.Id -> String
productIdString productId =
    "product-" ++ Product.idToString productId


itemPrice : Int -> Html.Html msg
itemPrice price =
    Html.div
        []
        [ Html.span
            [ Html.Attributes.class "productList-price" ]
            [ Html.text (Product.priceToStringWithoutYen price) ]
        , Html.text "円"
        ]


itemLike : Data.LogInState.LogInState -> Bool -> Product.Product -> Html.Html Msg
itemLike logInState sending product =
    if sending then
        Html.button
            [ Html.Attributes.class "productList-like"
            , Html.Attributes.class "productList-like-sending"
            , Html.Attributes.disabled True
            ]
            (itemLikeBody (Product.getLikedCount product))

    else
        case logInState of
            Data.LogInState.Ok { likedProductIds, accessToken } ->
                if List.member (Product.getId product) likedProductIds then
                    Html.button
                        [ Html.Events.custom "click"
                            (Json.Decode.succeed
                                { message = UnLike accessToken (Product.getId product)
                                , stopPropagation = True
                                , preventDefault = True
                                }
                            )
                        , Html.Attributes.class "productList-liked"
                        , Html.Attributes.class "productList-like"
                        ]
                        (itemLikeBody (Product.getLikedCount product))

                else
                    Html.button
                        [ Html.Events.custom "click"
                            (Json.Decode.succeed
                                { message = Like accessToken (Product.getId product)
                                , stopPropagation = True
                                , preventDefault = True
                                }
                            )
                        , Html.Attributes.class "productList-like"
                        ]
                        (itemLikeBody (Product.getLikedCount product))

            _ ->
                Html.div
                    [ Html.Attributes.class "productList-like-label" ]
                    (itemLikeBody (Product.getLikedCount product))


itemLikeBody : Int -> List (Html.Html msg)
itemLikeBody count =
    [ Html.text "いいね"
    , Html.span
        [ Html.Attributes.class "productList-like-number" ]
        [ Html.text (String.fromInt count) ]
    ]


itemImage : String -> String -> Html.Html msg
itemImage name url =
    Html.img
        [ Html.Attributes.class "productList-image"
        , Html.Attributes.src url
        , Html.Attributes.alt (name ++ "の画像")
        ]
        []
