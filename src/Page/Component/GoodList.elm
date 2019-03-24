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


type Emit
    = EmitLikeGood Data.User.UserId Api.Token Int
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
        [ Html.Attributes.class "item"
        , Html.Attributes.href (SiteMap.goodsUrl (Good.getId good))
        , Html.Attributes.id (goodIdString (Good.getId good))
        ]
        [ itemImage (Good.getFirstImageUrl good)
        , Html.div
            [ Html.Attributes.class "itemTitle" ]
            [ Html.text (Good.getName good) ]
        , Html.div
            [ Html.Attributes.class "itemPrice" ]
            [ Html.text (Good.priceToString (Good.getPrice good)) ]
        , Html.div
            (case logInState of
                Data.LogInState.LogInStateOk { profile, access } ->
                    [ Html.Events.preventDefaultOn "click"
                        (Json.Decode.succeed
                            ( LikeGood (Data.User.getUserId profile) access (Good.getId good)
                            , True
                            )
                        )
                    ]

                Data.LogInState.LogInStateNone ->
                    []
            )
            [ Html.text ("いいね" ++ String.fromInt (Good.getLikedCount good)) ]
        ]


goodIdString : Int -> String
goodIdString goodId =
    "good-" ++ String.fromInt goodId


itemImage : String -> Html.Html msg
itemImage url =
    Html.img
        [ Html.Attributes.class "itemImage"
        , Html.Attributes.src url
        ]
        []
