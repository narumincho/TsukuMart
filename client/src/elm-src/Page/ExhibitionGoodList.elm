module Page.ExhibitionGoodList exposing (Emit(..), Model, Msg(..), initModel, update, view)

import Api
import Data.Good
import Data.LogInState as LogInState
import Data.User
import Html
import Html.Attributes
import Page.Component.GoodList as GoodList
import Page.Component.LogInOrSignUp as LogInOrSignUp
import Tab


type Model
    = Model
        { normalModel : NormalModel
        , logInOrSignUpModel : LogInOrSignUp.Model
        , goodListModel : GoodList.Model
        }


type NormalModel
    = Loading
    | Normal { exhibitionGoodList : List Data.Good.Good }
    | Error


type Emit
    = EmitGetExhibitionGood Api.Token
    | EmitLogInOrSignUp LogInOrSignUp.Emit
    | EmitGoodList GoodList.Emit


type Msg
    = GetExhibitionGoodResponse (Result () (List Data.Good.Good))
    | LogInOrSignUpMsg LogInOrSignUp.Msg
    | GoodListMsg GoodList.Msg


initModel : Maybe Data.Good.GoodId -> LogInState.LogInState -> ( Model, List Emit )
initModel goodIdMaybe logInState =
    let
        ( goodListModel, emitList ) =
            GoodList.initModel goodIdMaybe
    in
    ( Model
        { logInOrSignUpModel = LogInOrSignUp.initModel
        , normalModel = Loading
        , goodListModel = goodListModel
        }
    , (case logInState of
        LogInState.LogInStateOk { access } ->
            [ EmitGetExhibitionGood access ]

        LogInState.LogInStateNone ->
            []
      )
        ++ (emitList |> List.map EmitGoodList)
    )


update : Msg -> Model -> ( Model, List Emit )
update msg (Model rec) =
    case msg of
        GetExhibitionGoodResponse result ->
            case result of
                Ok goodList ->
                    ( Model
                        { rec | normalModel = Normal { exhibitionGoodList = goodList } }
                    , []
                    )

                Err () ->
                    ( Model { rec | normalModel = Error }
                    , []
                    )

        LogInOrSignUpMsg logInOrSignUpMsg ->
            let
                ( newModel, emitList ) =
                    LogInOrSignUp.update logInOrSignUpMsg rec.logInOrSignUpModel
            in
            ( Model { rec | logInOrSignUpModel = newModel }
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
                        likeGoodList =
                            Data.Good.listMapIf (\g -> Data.Good.getId g == id) (Data.Good.like userId)
                    in
                    Model
                        { rec
                            | normalModel =
                                case rec.normalModel of
                                    Loading ->
                                        Loading

                                    Normal { exhibitionGoodList } ->
                                        Normal
                                            { exhibitionGoodList = likeGoodList exhibitionGoodList }

                                    Error ->
                                        Error
                            , goodListModel = newModel
                        }

                GoodList.UnlikeGoodResponse userId id (Ok ()) ->
                    let
                        unlikeGoodList =
                            Data.Good.listMapIf (\g -> Data.Good.getId g == id) (Data.Good.unlike userId)
                    in
                    Model
                        { rec
                            | normalModel =
                                case rec.normalModel of
                                    Loading ->
                                        Loading

                                    Normal { exhibitionGoodList } ->
                                        Normal
                                            { exhibitionGoodList = unlikeGoodList exhibitionGoodList }

                                    Error ->
                                        Error
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
    { title = Just "出品した商品"
    , tab = Tab.single "出品した商品"
    , html =
        case logInState of
            LogInState.LogInStateOk _ ->
                [ GoodList.view
                    rec.goodListModel
                    logInState
                    isWideScreenMode
                    (case rec.normalModel of
                        Loading ->
                            Nothing

                        Normal { exhibitionGoodList } ->
                            Just exhibitionGoodList

                        Error ->
                            Just []
                    )
                    |> Html.map GoodListMsg
                ]

            LogInState.LogInStateNone ->
                [ Html.div
                    [ Html.Attributes.class "container" ]
                    [ Html.div
                        [ Html.Attributes.class "logInRecommendText" ]
                        [ Html.text "ログインか新規登録をして、出品した商品一覧機能を使えるようにしよう!" ]
                    , LogInOrSignUp.view
                        rec.logInOrSignUpModel
                        |> Html.map LogInOrSignUpMsg
                    ]
                ]
    }
