module Page.LikeAndHistory exposing (Emit(..), Model(..), Msg(..), initModel, update, view)

import Api
import Data.Good as Good
import Data.LogInState as LogInState
import Html
import Page.Component.LogInOrSignUp as LogInOrSignUp
import Tab


type Model
    = Model
        { normalModel : NormalModel
        , logInOrSignUpModel : LogInOrSignUp.Model
        }


type NormalModel
    = NormalModel
        { tabSelect : TabSelect
        , like : Maybe (Result () (List Good.Good))
        , history : Maybe (Result () (List Good.Good))
        }


normalModelSetSelectTab : TabSelect -> NormalModel -> NormalModel
normalModelSetSelectTab tab (NormalModel rec) =
    NormalModel
        { rec | tabSelect = tab }


normalModelGetSelectTab : NormalModel -> TabSelect
normalModelGetSelectTab (NormalModel { tabSelect }) =
    tabSelect


normalModelSetLikeGoodResponse : Result () (List Good.Good) -> NormalModel -> NormalModel
normalModelSetLikeGoodResponse goodList (NormalModel rec) =
    NormalModel
        { rec | like = Just goodList }


normalModelSetHistoryGoodResponse : Result () (List Good.Good) -> NormalModel -> NormalModel
normalModelSetHistoryGoodResponse historyGoodList (NormalModel rec) =
    NormalModel
        { rec | history = Just historyGoodList }


type TabSelect
    = TabLike
    | TabHistory


type Msg
    = SelectTab TabSelect
    | LikeGoodListResponse (Result () (List Good.Good))
    | HistoryGoodListResponse (Result () (List Good.Good))
    | LogInOrSignUpMsg LogInOrSignUp.Msg


type Emit
    = EmitGetLikeGoodList Api.Token
    | EmitGetHistoryGoodList Api.Token
    | EmitLogInOrSignUp LogInOrSignUp.Emit


{-| 初期状態 いいねが選ばれている
-}
initModel : LogInState.LogInState -> ( Model, List Emit )
initModel logInState =
    ( Model
        { normalModel =
            NormalModel
                { tabSelect = TabLike
                , like = Nothing
                , history = Nothing
                }
        , logInOrSignUpModel = LogInOrSignUp.initModel
        }
    , case logInState of
        LogInState.LogInStateOk { access } ->
            [ EmitGetLikeGoodList access
            , EmitGetHistoryGoodList access
            ]

        LogInState.LogInStateNone ->
            []
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


view : LogInState.LogInState -> Bool -> Model -> ( String, Tab.Tab Msg, List (Html.Html Msg) )
view logInState isWideScreenMode (Model rec) =
    ( "いいね・閲覧した商品"
    , Tab.multi
        { textAndMsgList =
            [ ( "いいね", SelectTab TabLike ), ( "閲覧履歴", SelectTab TabHistory ) ]
        , selectIndex =
            case rec.normalModel |> normalModelGetSelectTab of
                TabLike ->
                    0

                TabHistory ->
                    1
        }
    , [ Html.text "まってな" ]
    )
