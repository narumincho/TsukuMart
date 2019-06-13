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
    = Model { sending : Bool }


type Msg
    = LikeGood Data.User.UserId Api.Token Good.GoodId
    | UnLikeGood Data.User.UserId Api.Token Good.GoodId
    | LikeGoodResponse Data.User.UserId Good.GoodId (Result () ())
    | UnlikeGoodResponse Data.User.UserId Good.GoodId (Result () ())


type Emit
    = EmitLikeGood Data.User.UserId Api.Token Good.GoodId
    | EmitUnlikeGood Data.User.UserId Api.Token Good.GoodId
    | EmitScrollIntoView String


initModel : Maybe Good.GoodId -> ( Model, List Emit )
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
        LikeGood userId token goodId ->
            ( Model { sending = True }
            , [ EmitLikeGood userId token goodId ]
            )

        UnLikeGood userId token goodId ->
            ( Model { sending = True }
            , [ EmitUnlikeGood userId token goodId ]
            )

        LikeGoodResponse _ _ _ ->
            ( Model { sending = False }
            , []
            )

        UnlikeGoodResponse _ _ _ ->
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
view : Model -> Data.LogInState.LogInState -> Bool -> Maybe (List Good.Good) -> Html.Html Msg
view (Model { sending }) logInState isWideMode goodsList =
    case goodsList of
        Just [] ->
            zeroGoodsView

        Just (x :: xs) ->
            goodListView sending logInState isWideMode x xs

        Nothing ->
            Html.div
                [ Html.Attributes.class "container" ]
                [ Html.div
                    [ Html.Attributes.class "goodList-loading" ]
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


goodListView : Bool -> Data.LogInState.LogInState -> Bool -> Good.Good -> List Good.Good -> Html.Html Msg
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


goodListItem : Data.LogInState.LogInState -> Bool -> Good.Good -> Html.Html Msg
goodListItem logInState sending good =
    Html.a
        [ Html.Attributes.class "goodList-item"
        , Html.Attributes.href (SiteMap.goodsUrl (Good.getId good))
        , Html.Attributes.id (goodIdString (Good.getId good))
        ]
        [ itemImage (Good.getName good) (Good.getFirstImageUrl good)
        , Html.div
            [ Html.Attributes.class "goodList-name" ]
            [ Html.text (Good.getName good) ]
        , Html.div
            [ Html.Attributes.class "goodList-priceAndLike" ]
            [ itemLike logInState sending good
            , itemPrice (Good.getPrice good)
            ]
        ]


goodIdString : Good.GoodId -> String
goodIdString goodId =
    "good-" ++ Good.goodIdToString goodId


itemPrice : Int -> Html.Html msg
itemPrice price =
    Html.div
        []
        [ Html.span
            [ Html.Attributes.class "goodList-price" ]
            [ Html.text (Good.priceToStringWithoutYen price) ]
        , Html.text "円"
        ]


itemLike : Data.LogInState.LogInState -> Bool -> Good.Good -> Html.Html Msg
itemLike logInState sending good =
    if sending then
        Html.button
            [ Html.Attributes.class "goodList-like"
            , Html.Attributes.class "goodList-like-sending"
            , Html.Attributes.disabled True
            ]
            (itemLikeBody (Good.getLikedCount good))

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
                                { message = UnLikeGood userId accessToken (Good.getId good)
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
                                { message = LikeGood userId accessToken (Good.getId good)
                                , stopPropagation = True
                                , preventDefault = True
                                }
                            )
                        , Html.Attributes.class "goodList-like"
                        ]
                        (itemLikeBody (Good.getLikedCount good))

            _ ->
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


itemImage : String -> String -> Html.Html msg
itemImage name url =
    Html.img
        [ Html.Attributes.class "goodList-image"
        , Html.Attributes.src url
        , Html.Attributes.alt (name ++ "の画像")
        ]
        []
