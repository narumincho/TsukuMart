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
import Icon
import Page.Component.GoodEditor as GoodEditor
import Svg
import Svg.Attributes
import Tab
import Time



{- 商品詳細ページ -}


type Model
    = Loading
        { goodId : Good.GoodId
        }
    | WaitNewData
        { good : Good.Good
        }
    | Normal
        { good : Good.Good
        , sending : Bool -- いいねを送信中か送信中じゃないか
        , comment : String
        }
    | Edit
        { beforeGood : Good.Good
        , editorModel : GoodEditor.Model
        }
    | Confirm
        { good : Good.Good
        }


type Emit
    = EmitGetGoods { goodId : Good.GoodId }
    | EmitGetGoodComment { goodId : Good.GoodId }
    | EmitPostGoodComment Data.User.User Api.Token { goodId : Good.GoodId } String
    | EmitLikeGood Data.User.UserId Api.Token Good.GoodId
    | EmitUnLikeGood Data.User.UserId Api.Token Good.GoodId
    | EmitTradeStart Api.Token Good.GoodId
    | EmitAddLogMessage String
    | EmitUpdateNowTime
    | EmitTimeStringToTimePosix Good.GoodId (List String)
    | EmitDeleteGood Api.Token Good.GoodId
    | EmitGoodEditor GoodEditor.Emit
    | EmitUpdateGoodData Api.Token Good.GoodId Api.SellGoodsRequest
    | EmitGetGoodImageAsFileAndBlobUrl (List String)


type Msg
    = GetGoodsResponse (Result () Good.Good)
    | GetGoodsCommentResponse (Result () (List Good.Comment))
    | PostGoodsCommentResponse (Result () Good.Comment)
    | LikeGood Data.User.UserId Api.Token Good.GoodId
    | UnLikeGood Data.User.UserId Api.Token Good.GoodId
    | LikeGoodResponse Data.User.UserId (Result () ())
    | UnlikeGoodResponse Data.User.UserId (Result () ())
    | TradeStart Api.Token Good.GoodId
    | TradeStartResponse (Result () ())
    | ToConfirmPage
    | InputComment String
    | SendComment Data.User.User Api.Token
    | ReceiveTimeStringToMillisecond { goodId : Int, second : List Int }
    | DeleteGood Api.Token Good.GoodId
    | EditGood
    | MsgBackToViewMode
    | GoodEditorMsg GoodEditor.Msg
    | UpdateGoodData Api.Token Good.GoodId GoodEditor.RequestData
    | ReceiveGoodImageAsFileAndBlobUrl (List GoodEditor.Image)
    | GoodUpdateResponse (Result () ())


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

        WaitNewData { good } ->
            Good.getId good

        Normal { good } ->
            Good.getId good

        Edit { beforeGood } ->
            Good.getId beforeGood

        Confirm { good } ->
            Good.getId good


update : Msg -> Model -> ( Model, List Emit )
update msg model =
    case msg of
        GetGoodsResponse goodsResult ->
            case ( model, goodsResult ) of
                ( Normal rec, Ok good ) ->
                    ( Normal { rec | good = good }
                    , [ EmitGetGoodComment { goodId = Good.getId good }
                      , EmitUpdateNowTime
                      ]
                    )

                ( _, Ok good ) ->
                    ( Normal { good = good, sending = False, comment = "" }
                    , [ EmitGetGoodComment { goodId = Good.getId good }
                      , EmitUpdateNowTime
                      ]
                    )

                ( _, Err () ) ->
                    ( model
                    , [ EmitAddLogMessage "商品情報の取得に失敗しました" ]
                    )

        GetGoodsCommentResponse commentListResult ->
            case ( model, commentListResult ) of
                ( Normal rec, Ok commentList ) ->
                    ( Normal { rec | good = rec.good |> Good.setCommentList commentList }
                    , [ EmitTimeStringToTimePosix
                            (rec.good |> Good.getId)
                            (commentList |> Good.getCommentCreatedAtString)
                      ]
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
                    let
                        newGood =
                            rec.good |> Good.addComment comment
                    in
                    ( Normal { rec | good = newGood }
                    , [ EmitTimeStringToTimePosix
                            (newGood |> Good.getId)
                            (newGood |> Good.getCommentList |> Maybe.withDefault [] |> Good.getCommentCreatedAtString)
                      ]
                    )

                ( _, Err () ) ->
                    ( model, [ EmitAddLogMessage "コメントの送信に失敗しました" ] )

                ( _, _ ) ->
                    ( model, [] )

        LikeGood userId token id ->
            ( case model of
                Normal rec ->
                    Normal { rec | sending = True }

                _ ->
                    model
            , [ EmitLikeGood userId token id ]
            )

        UnLikeGood userId token id ->
            ( case model of
                Normal rec ->
                    Normal { rec | sending = True }

                _ ->
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

        TradeStart token goodId ->
            ( model
            , [ EmitTradeStart token goodId ]
            )

        TradeStartResponse result ->
            ( model
            , case result of
                Ok () ->
                    [ EmitAddLogMessage "取引開始" ]

                Err () ->
                    [ EmitAddLogMessage "取引開始を失敗しました" ]
            )

        ToConfirmPage ->
            ( case model of
                Normal { good } ->
                    Confirm { good = good }

                _ ->
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

        SendComment user token ->
            case model of
                Normal { comment, good } ->
                    ( model
                    , [ EmitPostGoodComment user token { goodId = Good.getId good } comment ]
                    )

                _ ->
                    ( model
                    , []
                    )

        ReceiveTimeStringToMillisecond { goodId, second } ->
            ( case model of
                Normal r ->
                    Normal { r | good = r.good |> Good.replaceCommentTimeStringToTimePosix (second |> List.map Time.millisToPosix) }

                _ ->
                    model
            , []
            )

        DeleteGood token goodId ->
            ( model
            , [ EmitDeleteGood token goodId ]
            )

        EditGood ->
            case model of
                Normal { good } ->
                    ( model
                    , [ EmitGetGoodImageAsFileAndBlobUrl
                            (Good.getFirstImageUrl good :: Good.getOthersImageUrlList good)
                      ]
                    )

                _ ->
                    ( model, [] )

        ReceiveGoodImageAsFileAndBlobUrl goodImageList ->
            case model of
                Normal { good } ->
                    let
                        ( goodEditorModel, goodEditorEmit ) =
                            GoodEditor.initModel
                                { name = Good.getName good
                                , description = Good.getDescription good
                                , price = Just (Good.getPrice good)
                                , condition = Just (Good.getCondition good)
                                , image = GoodEditor.imageListFromList goodImageList
                                }
                    in
                    ( Edit
                        { beforeGood = good
                        , editorModel = goodEditorModel
                        }
                    , goodEditorEmit |> List.map EmitGoodEditor
                    )

                _ ->
                    ( model, [] )

        MsgBackToViewMode ->
            case model of
                Edit { beforeGood } ->
                    ( WaitNewData { good = beforeGood }
                    , [ EmitGetGoods { goodId = Good.getId beforeGood } ]
                    )

                _ ->
                    ( model, [] )

        GoodEditorMsg goodEditorMsg ->
            case model of
                Edit r ->
                    GoodEditor.update goodEditorMsg r.editorModel
                        |> Tuple.mapBoth
                            (\editorModel -> Edit { r | editorModel = editorModel })
                            (List.map EmitGoodEditor)

                _ ->
                    ( model, [] )

        UpdateGoodData token goodId requestData ->
            ( model
            , [ EmitUpdateGoodData token goodId (GoodEditor.requestDataToApiRequest requestData) ]
            )

        GoodUpdateResponse result ->
            case result of
                Ok () ->
                    update MsgBackToViewMode model

                Err () ->
                    ( model
                    , []
                    )


view : LogInState.LogInState -> Bool -> Maybe ( Time.Posix, Time.Zone ) -> Model -> ( String, Tab.Tab Msg, List (Html.Html Msg) )
view logInState isWideScreenMode nowMaybe model =
    case model of
        Loading _ ->
            ( "商品詳細ページ"
            , Tab.none
            , [ Html.text "読み込み中" ]
            )

        WaitNewData { good } ->
            ( Good.getName good
            , Tab.none
            , [ Html.div
                    [ Html.Attributes.class "container" ]
                    [ Html.div
                        [ Html.Attributes.class "good" ]
                        [ Html.text "最新の情報を取得中…"
                        , goodsViewImage (Good.getFirstImageUrl good) (Good.getOthersImageUrlList good)
                        , goodsViewName (Good.getName good)
                        , goodsViewLike LogInState.LogInStateNone False good
                        , sellerNameView (Good.getSellerName good)
                        , descriptionView (Good.getDescription good)
                        , goodsViewCondition (Good.getCondition good)
                        ]
                    ]
              ]
            )

        Normal { good, sending } ->
            ( Good.getName good
            , Tab.none
            , [ Html.div
                    [ Html.Attributes.class "container" ]
                    [ Html.div
                        [ Html.Attributes.class "good" ]
                        ([ goodsViewImage (Good.getFirstImageUrl good) (Good.getOthersImageUrlList good)
                         , goodsViewName (Good.getName good)
                         , goodsViewLike logInState sending good
                         , sellerNameView (Good.getSellerName good)
                         , descriptionView (Good.getDescription good)
                         , goodsViewCondition (Good.getCondition good)
                         , commentListView nowMaybe (Good.getSellerId good) logInState (Good.getCommentList good)
                         ]
                            ++ (case logInState of
                                    LogInState.LogInStateOk { access, user } ->
                                        if Data.User.getUserId user == Good.getSellerId good then
                                            [ editButton
                                            , deleteView (Good.getId good) access
                                            ]

                                        else
                                            []

                                    LogInState.LogInStateNone ->
                                        []
                               )
                        )
                    , goodsViewPriceAndBuyButton isWideScreenMode (Good.getPrice good)
                    ]
              ]
            )

        Edit { editorModel, beforeGood } ->
            ( Good.getName beforeGood ++ "編集中"
            , Tab.none
            , [ Html.div
                    [ Html.Attributes.class "container" ]
                    [ Html.div
                        [ Html.Attributes.class "good" ]
                        (case logInState of
                            LogInState.LogInStateOk { access } ->
                                [ Html.text "編集画面"
                                ]
                                    ++ (GoodEditor.view editorModel
                                            |> List.map (Html.map GoodEditorMsg)
                                       )
                                    ++ [ editOkCancelButton
                                            access
                                            (Good.getId beforeGood)
                                            (GoodEditor.toRequestData editorModel)
                                       ]

                            LogInState.LogInStateNone ->
                                [ Html.text "ログインしていないときに商品の編集はできません" ]
                        )
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
                        [ Html.text "購入確認画面。この商品の取引を開始しますか?"
                        , goodsViewImage (Good.getFirstImageUrl good) (Good.getOthersImageUrlList good)
                        , goodsViewName (Good.getName good)
                        , descriptionView (Good.getDescription good)
                        , goodsViewCondition (Good.getCondition good)
                        , tradeStartButton logInState (Good.getId good)
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


sellerNameView : Maybe String -> Html.Html msg
sellerNameView nameMaybe =
    Html.div
        []
        [ Html.div [ Html.Attributes.class "good-label" ] [ Html.text "出品者" ]
        , Html.div []
            [ case nameMaybe of
                Just name ->
                    Html.text name

                Nothing ->
                    Html.text "出品者の名前を取得中"
            ]
        ]


descriptionView : String -> Html.Html msg
descriptionView description =
    Html.div
        [ Html.Attributes.class "good-description" ]
        [ Html.div [ Html.Attributes.class "good-label" ] [ Html.text "商品の説明" ]
        , Html.div [] [ Html.text description ]
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


editButton : Html.Html Msg
editButton =
    Html.button
        [ Html.Attributes.class "subButton"
        , Html.Events.onClick EditGood
        ]
        [ Icon.editIcon
        , Html.text "編集する"
        ]


deleteView : Good.GoodId -> Api.Token -> Html.Html Msg
deleteView goodId token =
    Html.button
        [ Html.Attributes.class "good-deleteButton"
        , Html.Events.onClick (DeleteGood token goodId)
        ]
        [ Icon.deleteIcon
        , Html.text "削除する"
        ]


{-|

    コメントの表示

-}
commentListView : Maybe ( Time.Posix, Time.Zone ) -> Data.User.UserId -> LogInState.LogInState -> Maybe (List Good.Comment) -> Html.Html Msg
commentListView nowMaybe sellerId logInState commentListMaybe =
    Html.div
        [ Html.Attributes.class "good-commentList" ]
        (case commentListMaybe of
            Just commentList ->
                case logInState of
                    LogInState.LogInStateOk { access, user } ->
                        [ commentInputArea access user ]
                            ++ (commentList
                                    |> List.reverse
                                    |> List.map (commentView nowMaybe sellerId (Just (Data.User.getUserId user)))
                               )

                    LogInState.LogInStateNone ->
                        commentList |> List.reverse |> List.map (commentView nowMaybe sellerId Nothing)

            Nothing ->
                [ Html.text "読み込み中" ]
        )


commentView : Maybe ( Time.Posix, Time.Zone ) -> Data.User.UserId -> Maybe Data.User.UserId -> Good.Comment -> Html.Html msg
commentView nowMaybe sellerId myIdMaybe { text, createdAt, userName, userId } =
    let
        isSellerComment =
            sellerId == userId

        isMyComment =
            myIdMaybe == Just userId
    in
    Html.div
        [ Html.Attributes.class "good-comment" ]
        [ Html.div
            [ Html.Attributes.class
                (if isSellerComment then
                    "good-comment-sellerName"

                 else
                    "good-comment-name"
                )
            ]
            [ Html.text userName ]
        , Html.div
            [ Html.Attributes.class
                (if isSellerComment then
                    "good-comment-sellerBox"

                 else
                    "good-comment-box"
                )
            ]
            ((if isSellerComment then
                [ commentTriangleLeft isMyComment ]

              else
                []
             )
                ++ [ Html.div
                        [ Html.Attributes.classList
                            [ ( "good-comment-text", True )
                            , ( "good-comment-text-mine", isMyComment )
                            , ( "good-comment-text-seller", isSellerComment )
                            ]
                        ]
                        [ Html.text text ]
                   ]
                ++ (if isSellerComment then
                        []

                    else
                        [ commentTriangleRight isMyComment ]
                   )
            )
        , Html.div
            [ Html.Attributes.class "good-comment-time" ]
            [ Html.text (Good.createdAtToString nowMaybe createdAt) ]
        ]


commentTriangleLeft : Bool -> Html.Html msg
commentTriangleLeft isMine =
    Svg.svg
        ([ Svg.Attributes.viewBox "0 0 10 10"
         , Svg.Attributes.class "good-comment-text-triangle"
         ]
            ++ (if isMine then
                    [ Svg.Attributes.class "good-comment-text-triangle-mine" ]

                else
                    []
               )
        )
        [ Svg.polygon
            [ Svg.Attributes.points "10 0 0 0 10 10" ]
            []
        ]


commentTriangleRight : Bool -> Html.Html msg
commentTriangleRight isMine =
    Svg.svg
        ([ Svg.Attributes.viewBox "0 0 10 10"
         , Svg.Attributes.class "good-comment-text-triangle"
         ]
            ++ (if isMine then
                    [ Svg.Attributes.class "good-comment-text-triangle-mine" ]

                else
                    []
               )
        )
        [ Svg.polygon
            [ Svg.Attributes.points "0 0 10 0 0 10" ]
            []
        ]


commentInputArea : Api.Token -> Data.User.User -> Html.Html Msg
commentInputArea token user =
    Html.div
        []
        [ Html.textarea
            [ Html.Events.onInput InputComment
            , Html.Attributes.class "form-textarea"
            ]
            []
        , Html.button
            [ Html.Events.onClick (SendComment user token)
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


tradeStartButton : LogInState.LogInState -> Good.GoodId -> Html.Html Msg
tradeStartButton logInState goodId =
    Html.div
        []
        [ Html.button
            ([ Html.Attributes.class "mainButton" ]
                ++ (case logInState of
                        LogInState.LogInStateOk { access } ->
                            [ Html.Events.onClick (TradeStart access goodId) ]

                        LogInState.LogInStateNone ->
                            [ Html.Attributes.class "mainButton-disabled" ]
                   )
            )
            [ Html.text "取引を開始する" ]
        ]


editOkCancelButton : Api.Token -> Good.GoodId -> Maybe GoodEditor.RequestData -> Html.Html Msg
editOkCancelButton token goodId requestDataMaybe =
    Html.div
        [ Html.Attributes.class "profile-editButtonArea" ]
        [ Html.button
            [ Html.Attributes.class "profile-editCancelButton"
            , Html.Events.onClick MsgBackToViewMode
            ]
            [ Html.text "キャンセル" ]
        , Html.button
            ([ Html.Attributes.class "profile-editOkButton" ]
                ++ (case requestDataMaybe of
                        Just requestDate ->
                            [ Html.Events.onClick (UpdateGoodData token goodId requestDate)
                            , Html.Attributes.disabled False
                            ]

                        Nothing ->
                            [ Html.Attributes.disabled True ]
                   )
            )
            [ Html.text "変更する" ]
        ]
