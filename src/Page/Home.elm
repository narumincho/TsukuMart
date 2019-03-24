module Page.Home exposing (Emit(..), Model, Msg(..), getGoodAllGoodList, initModel, update, view)

import Data.Good as Good
import Data.LogInState as LogInState
import Data.User
import Html
import Page.Component.GoodList as GoodList
import Tab


type Model
    = Model
        { tabSelect : TabSelect
        , recent : Maybe (List Good.Good)
        , recommend : Maybe (List Good.Good)
        , free : Maybe (List Good.Good)
        , goodListModel : GoodList.Model
        }


type TabSelect
    = TabRecent
    | TabRecommend
    | TabFree


type Emit
    = EmitGetRecentGoodList
    | EmitGetRecommendGoodList
    | EmitGetFreeGoodList
    | EmitGoodList GoodList.Emit


type Msg
    = SelectTab TabSelect
    | GetRecentGoodListResponse (Result () (List Good.Good))
    | GetRecommendGoodListResponse (Result () (List Good.Good))
    | GetFreeGoodListResponse (Result () (List Good.Good))
    | GoodListMsg GoodList.Msg
    | GoodLikeResponse Data.User.UserId Int (Result () ())


{-| 最初の状態。真ん中のタブ「おすすめ」が選択されている
-}
initModel : Maybe Int -> ( Model, List Emit )
initModel goodIdMaybe =
    let
        ( goodListModel, emitList ) =
            GoodList.initModel goodIdMaybe
    in
    ( Model
        { tabSelect = TabRecommend
        , recent = Nothing
        , recommend = Nothing
        , free = Nothing
        , goodListModel = goodListModel
        }
    , [ EmitGetRecommendGoodList ] ++ (emitList |> List.map EmitGoodList)
    )


{-| この画面から取得できる商品のデータを集める
-}
getGoodAllGoodList : Model -> List Good.Good
getGoodAllGoodList (Model rec) =
    (case rec.tabSelect of
        TabRecent ->
            rec.recent

        TabRecommend ->
            rec.recommend

        TabFree ->
            rec.free
    )
        |> Maybe.withDefault []


update : Msg -> Model -> ( Model, List Emit )
update msg (Model rec) =
    case msg of
        SelectTab tabSelect ->
            ( Model { rec | tabSelect = tabSelect }
            , case tabSelect of
                TabRecent ->
                    [ EmitGetRecentGoodList ]

                TabRecommend ->
                    [ EmitGetRecommendGoodList ]

                TabFree ->
                    [ EmitGetFreeGoodList ]
            )

        GetRecentGoodListResponse result ->
            ( case result of
                Ok goodList ->
                    Model { rec | recent = Just goodList }

                Err () ->
                    Model rec
            , []
            )

        GetRecommendGoodListResponse result ->
            ( case result of
                Ok goodList ->
                    Model { rec | recommend = Just goodList }

                Err () ->
                    Model rec
            , []
            )

        GetFreeGoodListResponse result ->
            ( case result of
                Ok goodList ->
                    Model { rec | free = Just goodList }

                Err () ->
                    Model rec
            , []
            )

        GoodListMsg goodListMsg ->
            let
                ( newModel, emitList ) =
                    rec.goodListModel |> GoodList.update goodListMsg
            in
            ( Model { rec | goodListModel = newModel }
            , emitList |> List.map EmitGoodList
            )

        GoodLikeResponse userId id result ->
            ( case result of
                Ok () ->
                    let
                        likeGoodListMaybe =
                            Maybe.map (Good.listMapIf (\g -> Good.getId g == id) (Good.like userId))
                    in
                    Model
                        { rec
                            | recent = likeGoodListMaybe rec.recent
                            , recommend = likeGoodListMaybe rec.recommend
                            , free = likeGoodListMaybe rec.free
                        }

                Err () ->
                    Model rec
            , []
            )


view : LogInState.LogInState -> Bool -> Model -> ( String, Tab.Tab Msg, List (Html.Html Msg) )
view logInState isWideScreenMode (Model rec) =
    ( ""
    , Tab.multi
        { textAndMsgList = [ ( "新着", SelectTab TabRecent ), ( "おすすめ", SelectTab TabRecommend ), ( "0円", SelectTab TabFree ) ]
        , selectIndex =
            case rec.tabSelect of
                TabRecent ->
                    0

                TabRecommend ->
                    1

                TabFree ->
                    2
        }
    , [ GoodList.view rec.goodListModel
            logInState
            isWideScreenMode
            (case rec.tabSelect of
                TabRecent ->
                    rec.recent |> Maybe.withDefault []

                TabRecommend ->
                    rec.recommend |> Maybe.withDefault []

                TabFree ->
                    rec.free |> Maybe.withDefault []
            )
            |> Html.map GoodListMsg
      ]
    )
