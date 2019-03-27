module Page.Good exposing
    ( Emit(..)
    , Model
    , Msg(..)
    , getGoodId
    , imageView
    , initModel
    , initModelFromGoods
    , update
    , view
    )

{-| 商品の表示
-}

import Api
import Data.Good as Good
import Data.LogInState as LogInState
import Data.User
import Html
import Html.Attributes
import Html.Events
import SiteMap
import Tab



{- 商品詳細ページ -}


type Model
    = Normal
        { good : Good.Good
        , sending : Bool
        }
    | Loading { goodId : Int }


type Emit
    = EmitGetGoods { goodId : Int }
    | EmitLikeGood Data.User.UserId Api.Token Int
    | EmitUnLikeGood Data.User.UserId Api.Token Int


type Msg
    = GetGoodsResponse Good.Good
    | LikeGood Data.User.UserId Api.Token Int
    | UnLikeGood Data.User.UserId Api.Token Int
    | LikeGoodResponse Data.User.UserId (Result () ())
    | UnlikeGoodResponse Data.User.UserId (Result () ())


{-| 指定したIDの商品詳細ページ
-}
initModel : Int -> ( Model, List Emit )
initModel id =
    ( Loading { goodId = id }
    , [ EmitGetGoods { goodId = id } ]
    )


{-| 商品の内容があらかじめ、わかっているときのもの。でも、一応また聞きに行く
-}
initModelFromGoods : Good.Good -> ( Model, List Emit )
initModelFromGoods good =
    ( Normal { good = good, sending = False }
    , [ EmitGetGoods { goodId = Good.getId good } ]
    )


{-| 表示している商品のIDを取得する
-}
getGoodId : Model -> Int
getGoodId model =
    case model of
        Normal { good } ->
            Good.getId good

        Loading { goodId } ->
            goodId


update : Msg -> Model -> ( Model, List Emit )
update msg model =
    case msg of
        GetGoodsResponse goods ->
            ( Normal { good = goods, sending = False }, [] )

        LikeGood userId token id ->
            ( case model of
                Normal rec ->
                    Normal { rec | sending = True }

                Loading _ ->
                    model
            , [ EmitLikeGood userId token id ]
            )

        UnLikeGood userId token id ->
            ( case model of
                Normal rec ->
                    Normal { rec | sending = True }

                Loading _ ->
                    model
            , [ EmitUnLikeGood userId token id ]
            )

        LikeGoodResponse userId result ->
            ( case ( result, model ) of
                ( Ok (), Normal rec ) ->
                    Normal
                        { rec
                            | good = rec.good |> Good.like userId
                            , sending = False
                        }

                ( _, _ ) ->
                    model
            , []
            )

        UnlikeGoodResponse userId result ->
            ( case ( result, model ) of
                ( Ok (), Normal rec ) ->
                    Normal
                        { rec
                            | good = rec.good |> Good.unlike userId
                            , sending = False
                        }

                ( _, _ ) ->
                    model
            , []
            )


view : LogInState.LogInState -> Bool -> Model -> ( String, Tab.Tab Msg, List (Html.Html Msg) )
view logInState isWideScreenMode model =
    case model of
        Loading _ ->
            ( "商品詳細ページ"
            , Tab.none
            , [ Html.text "読み込み中" ]
            )

        Normal { good, sending } ->
            ( Good.getName good
            , Tab.none
            , [ Html.div
                    [ Html.Attributes.class "container" ]
                    [ Html.div
                        [ Html.Attributes.class "good" ]
                        [ goodsViewImage (Good.getFirstImageUrl good) (Good.getOthersImageUrlList good)
                        , goodsViewName (Good.getName good)
                        , goodsViewLike logInState sending good
                        , goodsViewDescription (Good.getDescription good)
                        , goodsViewCondition (Good.getCondition good)
                        ]
                    , goodsViewPriceAndBuyButton isWideScreenMode (Good.getPrice good)
                    ]
              ]
            )


goodsViewImage : String -> List String -> Html.Html msg
goodsViewImage url urlList =
    Html.div
        [ Html.Attributes.class "good-imageListContainer" ]
        [ Html.div
            [ Html.Attributes.class "good-imageList"
            ]
            (url :: urlList |> List.map imageView)
        ]


imageView : String -> Html.Html msg
imageView url =
    Html.img
        [ Html.Attributes.class "good-image"
        , Html.Attributes.src url
        ]
        []


goodsViewName : String -> Html.Html msg
goodsViewName name =
    Html.div
        [ Html.Attributes.class "good-name" ]
        [ Html.text name ]


goodsViewLike : LogInState.LogInState -> Bool -> Good.Good -> Html.Html Msg
goodsViewLike logInState sending good =
    Html.div
        [ Html.Attributes.class "good-like-container" ]
        [ likeButton logInState sending good ]


likeButton : LogInState.LogInState -> Bool -> Good.Good -> Html.Html Msg
likeButton logInState sending good =
    if sending then
        Html.button
            [ Html.Attributes.class "good-like-sending"
            , Html.Attributes.class "good-like"
            ]
            (itemLikeBody (Good.getLikedCount good))

    else
        case logInState of
            LogInState.LogInStateOk { profile, access } ->
                if good |> Good.isLikedBy (Data.User.getUserId profile) then
                    Html.button
                        [ Html.Events.onClick
                            (UnLikeGood (Data.User.getUserId profile) access (Good.getId good))
                        , Html.Attributes.class "good-liked"
                        , Html.Attributes.class "good-like"
                        ]
                        (itemLikeBody (Good.getLikedCount good))

                else
                    Html.button
                        [ Html.Events.onClick
                            (LikeGood (Data.User.getUserId profile) access (Good.getId good))
                        , Html.Attributes.class "good-like"
                        ]
                        (itemLikeBody (Good.getLikedCount good))

            LogInState.LogInStateNone ->
                Html.div
                    [ Html.Attributes.class "good-like-label" ]
                    (itemLikeBody (Good.getLikedCount good))


itemLikeBody : Int -> List (Html.Html msg)
itemLikeBody count =
    [ Html.text "いいね"
    , Html.span
        [ Html.Attributes.class "good-like-number" ]
        [ Html.text (String.fromInt count) ]
    ]


goodsViewDescription : String -> Html.Html msg
goodsViewDescription description =
    Html.div
        [ Html.Attributes.class "good-description" ]
        [ Html.div [ Html.Attributes.class "good-label" ] [ Html.text "商品の説明" ]
        , Html.div [] [ Html.text description ]
        ]


goodsViewPriceAndBuyButton : Bool -> Int -> Html.Html msg
goodsViewPriceAndBuyButton isWideScreenMode price =
    Html.div
        [ Html.Attributes.classList
            [ ( "good-priceAndBuyButton", True )
            , ( "good-priceAndBuyButton-wide", isWideScreenMode )
            ]
        ]
        [ Html.div [ Html.Attributes.class "good-price" ] [ Html.text (Good.priceToString price) ]
        , Html.button [] [ Html.text "購入手続きへ" ]
        ]


goodsViewCondition : Good.Condition -> Html.Html msg
goodsViewCondition condition =
    Html.div []
        [ Html.div
            [ Html.Attributes.class "good-label" ]
            [ Html.text "商品の状態" ]
        , Html.div
            [ Html.Attributes.class "good-condition" ]
            [ Html.text (Good.conditionToJapaneseString condition)
            ]
        ]
