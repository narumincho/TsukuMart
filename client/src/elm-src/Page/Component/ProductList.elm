module Page.Component.ProductList exposing (Emit(..), Model, Msg(..), initModel, update, view)

{-| 商品の一覧表示
-}

import Api
import Data.Product as Product
import Data.LogInState
import Data.User
import Html
import Html.Attributes
import Html.Events
import Json.Decode
import SiteMap


type Model
    = Model { sending : Bool }


type Msg
    = Like Data.User.UserId Api.Token Product.Id
    | UnLike Data.User.UserId Api.Token Product.Id
    | LikeResponse Data.User.UserId Product.Id (Result () ())
    | UnlikeResponse Data.User.UserId Product.Id (Result () ())


type Emit
    = EmitLike Data.User.UserId Api.Token Product.Id
    | EmitUnlike Data.User.UserId Api.Token Product.Id
    | EmitScrollIntoView String


initModel : Maybe Product.Id -> ( Model, List Emit )
initModel goodIdMaybe =
    ( Model { sending = False }
    , case goodIdMaybe of
        Just goodId ->
            [ EmitScrollIntoView (goodIdString goodId) ]

        Nothing ->
            []
    )


update : Msg -> Model -> ( Model, List Emit )
update msg _ =
    case msg of
        Like userId token productId ->
            ( Model { sending = True }
            , [ EmitLike userId token productId ]
            )

        UnLike userId token productId ->
            ( Model { sending = True }
            , [ EmitUnlike userId token productId ]
            )

        LikeResponse _ _ _ ->
            ( Model { sending = False }
            , []
            )

        UnlikeResponse _ _ _ ->
            ( Model { sending = False }
            , []
            )



{- ============================================
                商品の一覧表示
   ============================================
-}


{-| 商品の一覧表示
goodList:Maybe (List Good.Good)は、Nothingで読み込み中、Justで商品の指定をする
-}
view : Model -> Data.LogInState.LogInState -> Bool -> Maybe (List Product.Product) -> Html.Html Msg
view (Model { sending }) logInState isWideMode productList =
    case productList of
        Just [] ->
            zeroGoodsView

        Just (x :: xs) ->
            goodListView sending logInState isWideMode x xs

        Nothing ->
            Html.div
                [ Html.Attributes.class "container" ]
                [ Html.div
                    []
                    [ Html.text "読み込み中" ]
                ]


zeroGoodsView : Html.Html Msg
zeroGoodsView =
    Html.div
        [ Html.Attributes.class "container" ]
        [ Html.div
            [ Html.Attributes.class "goodList-zero" ]
            [ Html.img
                [ Html.Attributes.src "/assets/logo_bird.png"
                , Html.Attributes.class "goodList-zeroImage"
                , Html.Attributes.alt "ざんねん。商品がありません"
                ]
                []
            , Html.text "ここに表示する商品がありません"
            ]
        ]


goodListView : Bool -> Data.LogInState.LogInState -> Bool -> Product.Product -> List Product.Product -> Html.Html Msg
goodListView sending logInState isWideMode good goodList =
    Html.div
        [ Html.Attributes.style "display" "grid"
        , Html.Attributes.style "grid-template-columns"
            (if isWideMode then
                "33.3% 33.4% 33.3%"

             else
                "50% 50%"
            )
        ]
        ((good :: goodList)
            |> List.map (goodListItem logInState sending)
        )


goodListItem : Data.LogInState.LogInState -> Bool -> Product.Product -> Html.Html Msg
goodListItem logInState sending good =
    Html.a
        [ Html.Attributes.class "goodList-item"
        , Html.Attributes.href (SiteMap.productUrl (Product.getId good))
        , Html.Attributes.id (goodIdString (Product.getId good))
        ]
        [ itemImage (Product.getName good) (Product.getFirstImageUrl good)
        , Html.div
            [ Html.Attributes.class "goodList-name" ]
            [ Html.text (Product.getName good) ]
        , Html.div
            [ Html.Attributes.class "goodList-priceAndLike" ]
            [ itemLike logInState sending good
            , itemPrice (Product.getPrice good)
            ]
        ]


goodIdString : Product.Id -> String
goodIdString goodId =
    "good-" ++ Product.idToString goodId


itemPrice : Int -> Html.Html msg
itemPrice price =
    Html.div
        []
        [ Html.span
            [ Html.Attributes.class "goodList-price" ]
            [ Html.text (Product.priceToStringWithoutYen price) ]
        , Html.text "円"
        ]


itemLike : Data.LogInState.LogInState -> Bool -> Product.Product -> Html.Html Msg
itemLike logInState sending good =
    if sending then
        Html.button
            [ Html.Attributes.class "goodList-like"
            , Html.Attributes.class "goodList-like-sending"
            , Html.Attributes.disabled True
            ]
            (itemLikeBody (Product.getLikedCount good))

    else
        case logInState of
            Data.LogInState.Ok { userWithProfile, accessToken } ->
                let
                    userId =
                        Data.User.withProfileGetId userWithProfile
                in
                if False then
                    Html.button
                        [ Html.Events.custom "click"
                            (Json.Decode.succeed
                                { message = UnLike userId accessToken (Product.getId good)
                                , stopPropagation = True
                                , preventDefault = True
                                }
                            )
                        , Html.Attributes.class "goodList-liked"
                        , Html.Attributes.class "goodList-like"
                        ]
                        (itemLikeBody (Product.getLikedCount good))

                else
                    Html.button
                        [ Html.Events.custom "click"
                            (Json.Decode.succeed
                                { message = Like userId accessToken (Product.getId good)
                                , stopPropagation = True
                                , preventDefault = True
                                }
                            )
                        , Html.Attributes.class "goodList-like"
                        ]
                        (itemLikeBody (Product.getLikedCount good))

            _ ->
                Html.div
                    [ Html.Attributes.class "goodList-like-label" ]
                    (itemLikeBody (Product.getLikedCount good))


itemLikeBody : Int -> List (Html.Html msg)
itemLikeBody count =
    [ Html.text "いいね"
    , Html.span
        [ Html.Attributes.class "goodList-like-number" ]
        [ Html.text (String.fromInt count) ]
    ]


itemImage : String -> String -> Html.Html msg
itemImage name url =
    Html.img
        [ Html.Attributes.class "goodList-image"
        , Html.Attributes.src url
        , Html.Attributes.alt (name ++ "の画像")
        ]
        []
