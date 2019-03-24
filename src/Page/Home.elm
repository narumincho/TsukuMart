module Page.Home exposing (Emit(..), Model, Msg(..), getGoodAllGoodList, initModel, update, view)

import Data.Good as Good
import Data.LogInState as LogInState
import Html
import Tab


type Model
    = Model
        { tabSelect : TabSelect
        , recent : Maybe (Result () (List Good.Good))
        , recommend : Maybe (Result () (List Good.Good))
        , free : Maybe (Result () (List Good.Good))
        }


type TabSelect
    = TabRecent
    | TabRecommend
    | TabFree


type Emit
    = EmitGetRecentGoodList
    | EmitGetRecommendGoodList
    | EmitGetFreeGoodList


type Msg
    = SelectTab TabSelect
    | GetRecentGoodListResponse (Result () (List Good.Good))
    | GetRecommendGoodListResponse (Result () (List Good.Good))
    | GetFreeGoodListResponse (Result () (List Good.Good))


{-| 最初の状態。真ん中のタブ「おすすめ」が選択されている
-}
initModel : ( Model, List Emit )
initModel =
    ( Model
        { tabSelect = TabRecommend
        , recent = Nothing
        , recommend = Nothing
        , free = Nothing
        }
    , [ EmitGetRecommendGoodList ]
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
        |> Maybe.map (Result.withDefault [])
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
            ( Model { rec | recent = Just result }
            , []
            )

        GetRecommendGoodListResponse result ->
            ( Model { rec | recommend = Just result }
            , []
            )

        GetFreeGoodListResponse result ->
            ( Model { rec | free = Just result }
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
    , [ Html.text "まってな" ]
    )
