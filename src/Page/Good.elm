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
import Tab



{- 商品詳細ページ -}


type Model
    = Loading { goodId : Good.GoodId }
    | Normal
        { good : Good.Good
        , sending : Bool -- いいねを送信中か送信中じゃないか
        , comment : String
        }
    | Confirm { good : Good.Good }


type Emit
    = EmitGetGoods { goodId : Good.GoodId }
    | EmitGetGoodComment { goodId : Good.GoodId }
    | EmitPostGoodComment Api.Token { goodId : Good.GoodId } String
    | EmitLikeGood Data.User.UserId Api.Token Good.GoodId
    | EmitUnLikeGood Data.User.UserId Api.Token Good.GoodId
    | EmitAddLogMessage String


type Msg
    = GetGoodsResponse (Result () Good.Good)
    | GetGoodsCommentResponse (Result () (List Good.Comment))
    | PostGoodsCommentResponse (Result () Good.Comment)
    | LikeGood Data.User.UserId Api.Token Good.GoodId
    | UnLikeGood Data.User.UserId Api.Token Good.GoodId
    | LikeGoodResponse Data.User.UserId (Result () ())
    | UnlikeGoodResponse Data.User.UserId (Result () ())
    | ToConfirmPage
    | InputComment String
    | SendComment Api.Token


{-| 指定したIDの商品詳細ページ
-}
initModel : Good.GoodId -> ( Model, List Emit )
initModel id =
    ( Loading { goodId = id }
    , [ EmitGetGoods { goodId = id } ]
    )


{-| 商品の内容があらかじめ、わかっているときのもの。でも、一応また聞きに行く
-}
initModelFromGoods : Good.Good -> ( Model, List Emit )
initModelFromGoods good =
    ( Normal { good = good, sending = False, comment = "" }
    , [ EmitGetGoods { goodId = Good.getId good } ]
    )


{-| 表示している商品のIDを取得する
-}
getGoodId : Model -> Good.GoodId
getGoodId model =
    case model of
        Loading { goodId } ->
            goodId

        Normal { good } ->
            Good.getId good

        Confirm { good } ->
            Good.getId good


update : Msg -> Model -> ( Model, List Emit )
update msg model =
    case msg of
        GetGoodsResponse goodsResult ->
            case ( model, goodsResult ) of
                ( Normal rec, Ok good ) ->
                    ( Normal { rec | good = good }
                    , [ EmitGetGoodComment { goodId = Good.getId good } ]
                    )

                ( _, Ok good ) ->
                    ( Normal { good = good, sending = False, comment = "" }
                    , [ EmitGetGoodComment { goodId = Good.getId good } ]
                    )

                ( _, Err () ) ->
                    ( model
                    , [ EmitAddLogMessage "商品情報の取得に失敗しました" ]
                    )

        GetGoodsCommentResponse commentListResult ->
            case ( model, commentListResult ) of
                ( Normal rec, Ok commentList ) ->
                    ( Normal { rec | good = rec.good |> Good.addCommentList commentList }
                    , []
                    )

                ( _, Err () ) ->
                    ( model
                    , [ EmitAddLogMessage "コメント取得に失敗しました" ]
                    )

                ( _, _ ) ->
                    ( model
                    , [ EmitAddLogMessage "画面がNormalでないときにコメントを受け取ってしまった" ]
                    )

        PostGoodsCommentResponse result ->
            case ( model, result ) of
                ( Normal rec, Ok comment ) ->
                    ( Normal { rec | good = rec.good |> Good.addComment comment }, [] )

                ( _, Err () ) ->
                    ( model, [ EmitAddLogMessage "コメントの送信に失敗しました" ] )

                ( _, _ ) ->
                    ( model, [] )

        LikeGood userId token id ->
            ( case model of
                Loading _ ->
                    model

                Normal rec ->
                    Normal { rec | sending = True }

                Confirm _ ->
                    model
            , [ EmitLikeGood userId token id ]
            )

        UnLikeGood userId token id ->
            ( case model of
                Loading _ ->
                    model

                Normal rec ->
                    Normal { rec | sending = True }

                Confirm _ ->
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

        ToConfirmPage ->
            ( case model of
                Loading _ ->
                    model

                Normal { good } ->
                    Confirm { good = good }

                Confirm _ ->
                    model
            , []
            )

        InputComment string ->
            case model of
                Normal rec ->
                    ( Normal { rec | comment = string }
                    , []
                    )

                _ ->
                    ( model
                    , []
                    )

        SendComment token ->
            case model of
                Normal { comment, good } ->
                    ( model
                    , [ EmitPostGoodComment token { goodId = Good.getId good } comment ]
                    )

                _ ->
                    ( model
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
                        , descriptionView (Good.getDescription good)
                        , goodsViewCondition (Good.getCondition good)
                        , commentListView logInState (Good.getCommentList good)
                        ]
                    , goodsViewPriceAndBuyButton isWideScreenMode (Good.getPrice good)
                    ]
              ]
            )

        Confirm { good } ->
            ( Good.getName good
            , Tab.none
            , [ Html.div
                    [ Html.Attributes.class "container" ]
                    [ Html.div
                        [ Html.Attributes.class "good" ]
                        [ Html.text "購入確認画面"
                        , goodsViewImage (Good.getFirstImageUrl good) (Good.getOthersImageUrlList good)
                        , goodsViewName (Good.getName good)
                        , descriptionView (Good.getDescription good)
                        , goodsViewCondition (Good.getCondition good)
                        ]
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
        [ likeButton logInState sending good
        ]


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
            LogInState.LogInStateOk { user, access } ->
                let
                    userId =
                        Data.User.getUserId user
                in
                if good |> Good.isLikedBy userId then
                    Html.button
                        [ Html.Events.onClick (UnLikeGood userId access (Good.getId good))
                        , Html.Attributes.class "good-liked"
                        , Html.Attributes.class "good-like"
                        ]
                        (itemLikeBody (Good.getLikedCount good))

                else
                    Html.button
                        [ Html.Events.onClick (LikeGood userId access (Good.getId good))
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


descriptionView : String -> Html.Html msg
descriptionView description =
    Html.div
        [ Html.Attributes.class "good-description" ]
        [ Html.div [ Html.Attributes.class "good-label" ] [ Html.text "商品の説明" ]
        , Html.div [] [ Html.text description ]
        ]


commentListView : LogInState.LogInState -> Maybe (List Good.Comment) -> Html.Html Msg
commentListView logInState commentListMaybe =
    Html.div
        [ Html.Attributes.class "good-commentList" ]
        (case commentListMaybe of
            Just commentList ->
                (commentList |> List.map commentView)
                    ++ (case logInState of
                            LogInState.LogInStateOk { access } ->
                                [ commentInputArea access ]

                            LogInState.LogInStateNone ->
                                []
                       )

            Nothing ->
                [ Html.text "読み込み中" ]
        )


commentView : Good.Comment -> Html.Html msg
commentView { text, createdAt, userName } =
    Html.div
        [ Html.Attributes.class "good-comment" ]
        [ Html.div
            [ Html.Attributes.class "good-comment-content" ]
            [ Html.div [] [ Html.text userName ]
            , Html.div [ Html.Attributes.class "good-comment-text" ] [ Html.text text ]
            ]
        , Html.div [] [ Html.text createdAt ]
        ]


commentInputArea : Api.Token -> Html.Html Msg
commentInputArea token =
    Html.div
        []
        [ Html.textarea
            [ Html.Events.onInput InputComment
            , Html.Attributes.class "form-textarea"
            ]
            []
        , Html.button
            [ Html.Events.onClick (SendComment token)
            , Html.Attributes.class "good-comment-sendButton"
            ]
            [ Html.text "コメントを送信" ]
        ]


goodsViewPriceAndBuyButton : Bool -> Int -> Html.Html Msg
goodsViewPriceAndBuyButton isWideScreenMode price =
    Html.div
        [ Html.Attributes.classList
            [ ( "good-priceAndBuyButton", True )
            , ( "good-priceAndBuyButton-wide", isWideScreenMode )
            ]
        ]
        [ Html.div [ Html.Attributes.class "good-price" ] [ Html.text (Good.priceToString price) ]
        , Html.button
            [ Html.Events.onClick ToConfirmPage ]
            [ Html.text "購入手続きへ" ]
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
