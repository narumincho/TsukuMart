module Page.Component.GoodList exposing (Emit(..), Model, Msg(..), initModel, update, view)

{-| 商品の一覧表示
-}

import Api
import Data.Good as Good
import Data.LogInState
import Data.User
import Html
import Html.Attributes
import Html.Events
import Json.Decode
import SiteMap


type Model
    = Model


type Msg
    = LikeGood Data.User.UserId Api.Token Int
    | UnLikeGood Data.User.UserId Api.Token Int


type Emit
    = EmitLikeGood Data.User.UserId Api.Token Int
    | EmitUnlikeGood Data.User.UserId Api.Token Int
    | EmitScrollIntoView String


initModel : Maybe Int -> ( Model, List Emit )
initModel goodIdMaybe =
    ( Model
    , case goodIdMaybe of
        Just goodId ->
            [ EmitScrollIntoView (goodIdString goodId) ]

        Nothing ->
            []
    )


update : Msg -> Model -> ( Model, List Emit )
update msg _ =
    case msg of
        LikeGood userId token goodId ->
            ( Model
            , [ EmitLikeGood userId token goodId ]
            )

        UnLikeGood userId token goodId ->
            ( Model
            , [ EmitUnlikeGood userId token goodId ]
            )



{- ============================================
                商品の一覧表示
   ============================================
-}


view : Model -> Data.LogInState.LogInState -> Bool -> List Good.Good -> Html.Html Msg
view _ logInState isWideMode goodsList =
    Html.div
        [ Html.Attributes.style "display" "grid"
        , Html.Attributes.style "grid-template-columns"
            (if isWideMode then
                "33.3% 33.4% 33.3%"

             else
                "50% 50%"
            )
        ]
        (goodsList |> List.map (goodListItem logInState))


goodListItem : Data.LogInState.LogInState -> Good.Good -> Html.Html Msg
goodListItem logInState good =
    Html.a
        [ Html.Attributes.class "goodList-item"
        , Html.Attributes.href (SiteMap.goodsUrl (Good.getId good))
        , Html.Attributes.id (goodIdString (Good.getId good))
        ]
        [ itemImage (Good.getFirstImageUrl good)
        , Html.div
            [ Html.Attributes.class "goodList-name" ]
            [ Html.text (Good.getName good) ]
        , Html.div
            [ Html.Attributes.class "goodList-priceAndLike" ]
            [ itemLike logInState good
            , itemPrice (Good.getPrice good)
            ]
        ]


goodIdString : Int -> String
goodIdString goodId =
    "good-" ++ String.fromInt goodId


itemPrice : Int -> Html.Html msg
itemPrice price =
    Html.div
        []
        [ Html.span
            [ Html.Attributes.class "goodList-price" ]
            [ Html.text (Good.priceToStringWithoutYen price) ]
        , Html.text "円"
        ]


itemLike : Data.LogInState.LogInState -> Good.Good -> Html.Html Msg
itemLike logInState good =
    case logInState of
        Data.LogInState.LogInStateOk { profile, access } ->
            if good |> Good.isLikedBy (Data.User.getUserId profile) then
                Html.button
                    [ Html.Events.custom "click"
                        (Json.Decode.succeed
                            { message = UnLikeGood (Data.User.getUserId profile) access (Good.getId good)
                            , stopPropagation = True
                            , preventDefault = True
                            }
                        )
                    , Html.Attributes.class "goodList-liked"
                    , Html.Attributes.class "goodList-like"
                    ]
                    (itemLikeBody (Good.getLikedCount good))

            else
                Html.button
                    [ Html.Events.custom "click"
                        (Json.Decode.succeed
                            { message = LikeGood (Data.User.getUserId profile) access (Good.getId good)
                            , stopPropagation = True
                            , preventDefault = True
                            }
                        )
                    , Html.Attributes.class "goodList-like"
                    ]
                    (itemLikeBody (Good.getLikedCount good))

        Data.LogInState.LogInStateNone ->
            Html.div
                [ Html.Attributes.class "goodList-like-label" ]
                (itemLikeBody (Good.getLikedCount good))


itemLikeBody : Int -> List (Html.Html msg)
itemLikeBody count =
    [ Html.text "いいね"
    , Html.span
        [ Html.Attributes.class "goodList-like-number" ]
        [ Html.text (String.fromInt count) ]
    ]


itemImage : String -> Html.Html msg
itemImage url =
    Html.img
        [ Html.Attributes.class "goodList-image"
        , Html.Attributes.src url
        ]
        []
