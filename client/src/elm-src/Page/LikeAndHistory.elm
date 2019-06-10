module Page.LikeAndHistory exposing (Emit(..), Model(..), Msg(..), initModel, update, view)

import Api
import Data.Good as Good
import Data.LogInState as LogInState
import Data.User
import Html
import Html.Attributes
import Page.Component.GoodList as GoodList
import Page.Component.LogInOrSignUp as LogInOrSignUp
import Tab
import Utility


type Model
    = Model
        { normalModel : NormalModel
        , logInOrSignUpModel : LogInOrSignUp.Model
        , goodListModel : GoodList.Model
        }


type NormalModel
    = NormalModel
        { tabSelect : TabSelect
        , like : Maybe (Result () (List Good.Good))
        , history : Maybe (Result () (List Good.Good))
        }


normalModelGetSelectTab : NormalModel -> TabSelect
normalModelGetSelectTab (NormalModel { tabSelect }) =
    tabSelect


normalModelSetSelectTab : TabSelect -> NormalModel -> NormalModel
normalModelSetSelectTab tab (NormalModel rec) =
    NormalModel
        { rec | tabSelect = tab }


normalModelMapSelectTab : (TabSelect -> TabSelect) -> NormalModel -> NormalModel
normalModelMapSelectTab =
    Utility.toMapper normalModelGetSelectTab normalModelSetSelectTab


normalModelGetLikeGoodResponse : NormalModel -> Maybe (Result () (List Good.Good))
normalModelGetLikeGoodResponse (NormalModel { like }) =
    like


normalModelSetLikeGoodResponse : Result () (List Good.Good) -> NormalModel -> NormalModel
normalModelSetLikeGoodResponse goodList (NormalModel rec) =
    NormalModel
        { rec | like = Just goodList }


normalModelMapLikeGoodResponse : (Result () (List Good.Good) -> Result () (List Good.Good)) -> NormalModel -> NormalModel
normalModelMapLikeGoodResponse =
    Utility.toMapperGetterMaybe normalModelGetLikeGoodResponse normalModelSetLikeGoodResponse


normalModelGetHistoryGoodResponse : NormalModel -> Maybe (Result () (List Good.Good))
normalModelGetHistoryGoodResponse (NormalModel { history }) =
    history


normalModelSetHistoryGoodResponse : Result () (List Good.Good) -> NormalModel -> NormalModel
normalModelSetHistoryGoodResponse historyGoodList (NormalModel rec) =
    NormalModel
        { rec | history = Just historyGoodList }


normalModelMapHistoryGoodResponse : (Result () (List Good.Good) -> Result () (List Good.Good)) -> NormalModel -> NormalModel
normalModelMapHistoryGoodResponse =
    Utility.toMapperGetterMaybe normalModelGetHistoryGoodResponse normalModelSetHistoryGoodResponse


type TabSelect
    = TabLike
    | TabHistory


type Msg
    = SelectTab TabSelect
    | LikeGoodListResponse (Result () (List Good.Good))
    | HistoryGoodListResponse (Result () (List Good.Good))
    | LogInOrSignUpMsg LogInOrSignUp.Msg
    | GoodListMsg GoodList.Msg


type Emit
    = EmitGetLikeGoodList Api.Token
    | EmitGetHistoryGoodList Api.Token
    | EmitLogInOrSignUp LogInOrSignUp.Emit
    | EmitGoodList GoodList.Emit


{-| 初期状態 いいねが選ばれている
-}
initModel : Maybe Good.GoodId -> LogInState.LogInState -> ( Model, List Emit )
initModel goodIdMaybe logInState =
    let
        ( newGoodListModel, emitList ) =
            GoodList.initModel goodIdMaybe
    in
    ( Model
        { normalModel =
            NormalModel
                { tabSelect = TabLike
                , like = Nothing
                , history = Nothing
                }
        , logInOrSignUpModel = LogInOrSignUp.initModel
        , goodListModel = newGoodListModel
        }
    , (case logInState of
        LogInState.LogInStateOk { access } ->
            [ EmitGetLikeGoodList access
            , EmitGetHistoryGoodList access
            ]

        LogInState.LogInStateNone ->
            []
      )
        ++ (emitList |> List.map EmitGoodList)
    )


update : LogInState.LogInState -> Msg -> Model -> ( Model, List Emit )
update logInState msg (Model rec) =
    case msg of
        SelectTab tabSelect ->
            ( Model
                { rec | normalModel = normalModelSetSelectTab tabSelect rec.normalModel }
            , case logInState of
                LogInState.LogInStateOk { access } ->
                    [ case tabSelect of
                        TabLike ->
                            EmitGetLikeGoodList access

                        TabHistory ->
                            EmitGetHistoryGoodList access
                    ]

                LogInState.LogInStateNone ->
                    []
            )

        LikeGoodListResponse response ->
            ( Model
                { rec | normalModel = rec.normalModel |> normalModelSetLikeGoodResponse response }
            , []
            )

        HistoryGoodListResponse response ->
            ( Model
                { rec
                    | normalModel =
                        rec.normalModel |> normalModelSetHistoryGoodResponse response
                }
            , []
            )

        LogInOrSignUpMsg logInOrSignUpMsg ->
            let
                ( newModel, emitList ) =
                    rec.logInOrSignUpModel |> LogInOrSignUp.update logInOrSignUpMsg
            in
            ( Model
                { rec | logInOrSignUpModel = newModel }
            , emitList |> List.map EmitLogInOrSignUp
            )

        GoodListMsg goodListMsg ->
            let
                ( newModel, emitList ) =
                    rec.goodListModel |> GoodList.update goodListMsg
            in
            ( case goodListMsg of
                GoodList.LikeGoodResponse userId id (Ok ()) ->
                    let
                        likeGoodListResult =
                            Result.map (Good.listMapIf (\g -> Good.getId g == id) (Good.like userId))
                    in
                    Model
                        { rec
                            | normalModel =
                                rec.normalModel
                                    |> normalModelMapLikeGoodResponse likeGoodListResult
                                    |> normalModelMapHistoryGoodResponse likeGoodListResult
                            , goodListModel = newModel
                        }

                GoodList.UnlikeGoodResponse userId id (Ok ()) ->
                    let
                        unlikeGoodListResult =
                            Result.map (Good.listMapIf (\g -> Good.getId g == id) (Good.unlike userId))
                    in
                    Model
                        { rec
                            | normalModel =
                                rec.normalModel
                                    |> normalModelMapLikeGoodResponse unlikeGoodListResult
                                    |> normalModelMapHistoryGoodResponse unlikeGoodListResult
                            , goodListModel = newModel
                        }

                _ ->
                    Model { rec | goodListModel = newModel }
            , emitList |> List.map EmitGoodList
            )


view :
    LogInState.LogInState
    -> Bool
    -> Model
    -> { title : Maybe String, tab : Tab.Tab Msg, html : List (Html.Html Msg) }
view logInState isWideScreenMode (Model rec) =
    { title = Just "いいね・閲覧した商品"
    , tab =
        Tab.multi
            { textAndMsgList =
                [ ( "いいね", SelectTab TabLike ), ( "閲覧履歴", SelectTab TabHistory ) ]
            , selectIndex =
                case rec.normalModel |> normalModelGetSelectTab of
                    TabLike ->
                        0

                    TabHistory ->
                        1
            }
    , html =
        case logInState of
            LogInState.LogInStateOk _ ->
                [ GoodList.view
                    rec.goodListModel
                    logInState
                    isWideScreenMode
                    (case normalModelGetSelectTab rec.normalModel of
                        TabLike ->
                            rec.normalModel
                                |> normalModelGetLikeGoodResponse
                                |> Maybe.map (Result.withDefault [])

                        TabHistory ->
                            rec.normalModel
                                |> normalModelGetHistoryGoodResponse
                                |> Maybe.map (Result.withDefault [])
                    )
                    |> Html.map GoodListMsg
                ]

            LogInState.LogInStateNone ->
                [ Html.div
                    [ Html.Attributes.class "container" ]
                    [ Html.div
                        []
                        [ Html.text "ログインか新規登録をして、いいねと閲覧履歴を使えるようにしよう!" ]
                    , LogInOrSignUp.view
                        rec.logInOrSignUpModel
                        |> Html.map LogInOrSignUpMsg
                    ]
                ]
    }
