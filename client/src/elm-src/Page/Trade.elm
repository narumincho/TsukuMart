module Page.Trade exposing
    ( Emission(..)
    , Model
    , Msg
    , initModelFromId
    , initModelFromTrade
    , view
    , update)

import BasicParts
import Data.LogInState as LogInState
import Data.Trade as Trade
import Html


type Model
    = CheckTrader Trade.Id
    | Loading Trade.Trade
    | Main Trade.TradeDetail


type Msg
    = InputComment String


type Emission
    = Emission


initModelFromId : LogInState.LogInState -> Trade.Id -> ( Model, List Emission )
initModelFromId logInState id =
    ( CheckTrader id, [] )


initModelFromTrade : LogInState.LogInState -> Trade.Trade -> ( Model, List Emission )
initModelFromTrade logInState trade =
    ( Loading trade, [] )


update : Msg -> Model -> ( Model, List Emission )
update msg model =
    ( model
    , []
    )


view : Model -> { title : Maybe String, tab : BasicParts.Tab Msg, html : List (Html.Html Msg) }
view model =
    { title = Just "取引"
    , tab = BasicParts.tabNone
    , html = [ Html.text "取引画面" ]
    }
