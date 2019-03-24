module Page.PurchaseGoodList exposing (Emit(..), Model, Msg(..), initModel, update, view)

import Api
import Data.Good
import Data.LogInState as LogInState
import Html
import Page.Component.LogInOrSignUp as LogInOrSignUp
import Tab


type Model
    = Model
        { logInOrSignUpModel : LogInOrSignUp.Model
        , normalModel : NormalModel
        }


type NormalModel
    = Loading
    | Normal { exhibitionGood : List Data.Good.Good }
    | Error


type Emit
    = EmitGetPurchaseGoodList Api.Token
    | EmitLogInOrSignUp LogInOrSignUp.Emit


type Msg
    = GetPurchaseGoodResponse (Result () (List Data.Good.Good))
    | LogInOrSignUpMsg LogInOrSignUp.Msg


initModel : LogInState.LogInState -> ( Model, List Emit )
initModel logInState =
    ( Model
        { logInOrSignUpModel = LogInOrSignUp.initModel
        , normalModel = Loading
        }
    , case logInState of
        LogInState.LogInStateOk { access } ->
            [ EmitGetPurchaseGoodList access ]

        LogInState.LogInStateNone ->
            []
    )


update : Msg -> Model -> ( Model, List Emit )
update msg (Model rec) =
    case msg of
        GetPurchaseGoodResponse result ->
            case result of
                Ok goodList ->
                    ( Model
                        { rec | normalModel = Normal { exhibitionGood = goodList } }
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


view : LogInState.LogInState -> Bool -> Model -> ( String, Tab.Tab Msg, List (Html.Html Msg) )
view logInState isWideScreenMode _ =
    ( "購入した商品"
    , Tab.single "購入した商品"
    , [ Html.text "つくり途中" ]
    )
