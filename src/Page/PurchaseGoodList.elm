module Page.PurchaseGoodList exposing (Emit(..), Model, Msg(..), initModel, update, view)

import Api
import Data.Good
import Data.LogInState as LogInState
import Data.User
import Html
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
    | Normal { purchaseGoodList : List Data.Good.Good }
    | Error


type Emit
    = EmitGetPurchaseGoodList Api.Token
    | EmitLogInOrSignUp LogInOrSignUp.Emit
    | EmitGoodList GoodList.Emit


type Msg
    = GetPurchaseGoodResponse (Result () (List Data.Good.Good))
    | LogInOrSignUpMsg LogInOrSignUp.Msg
    | GoodListMsg GoodList.Msg
    | GoodLikeResponse Data.User.UserId Int (Result () ())
    | GoodUnlikeResponse Data.User.UserId Int (Result () ())


initModel : Maybe Int -> LogInState.LogInState -> ( Model, List Emit )
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
            [ EmitGetPurchaseGoodList access ]

        LogInState.LogInStateNone ->
            []
      )
        ++ (emitList |> List.map EmitGoodList)
    )


update : Msg -> Model -> ( Model, List Emit )
update msg (Model rec) =
    case msg of
        GetPurchaseGoodResponse result ->
            case result of
                Ok goodList ->
                    ( Model
                        { rec | normalModel = Normal { purchaseGoodList = goodList } }
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
            ( Model { rec | goodListModel = newModel }
            , emitList |> List.map EmitGoodList
            )

        GoodLikeResponse userId id result ->
            ( case result of
                Ok () ->
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

                                    Normal { purchaseGoodList } ->
                                        Normal
                                            { purchaseGoodList = likeGoodList purchaseGoodList }

                                    Error ->
                                        Error
                        }

                Err () ->
                    Model rec
            , []
            )

        GoodUnlikeResponse userId id result ->
            ( case result of
                Ok () ->
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

                                    Normal { purchaseGoodList } ->
                                        Normal
                                            { purchaseGoodList = unlikeGoodList purchaseGoodList }

                                    Error ->
                                        Error
                        }

                Err () ->
                    Model rec
            , []
            )


view : LogInState.LogInState -> Bool -> Model -> ( String, Tab.Tab Msg, List (Html.Html Msg) )
view logInState isWideScreenMode (Model rec) =
    ( "購入した商品"
    , Tab.single "購入した商品"
    , case logInState of
        LogInState.LogInStateOk _ ->
            [ GoodList.view
                rec.goodListModel
                logInState
                isWideScreenMode
                (case rec.normalModel of
                    Loading ->
                        []

                    Normal { purchaseGoodList } ->
                        purchaseGoodList

                    Error ->
                        []
                )
                |> Html.map GoodListMsg
            ]

        LogInState.LogInStateNone ->
            [ Html.text "ログインか新規登録をして、購入した商品一覧機能を使えるようにしよう!"
            , LogInOrSignUp.view
                rec.logInOrSignUpModel
                |> Html.map LogInOrSignUpMsg
            ]
    )
