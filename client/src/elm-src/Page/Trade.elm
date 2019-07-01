module Page.Trade exposing
    ( Emission
    , Model
    , Msg
    , initModel
    , initModelFromId
    )

import Data.Trade as Trade


type Model
    = CheckTrader Trade.Id
    | Main Trade.TradeDetail


type Msg
    = InputComment String


type Emission
    = Emission


initModelFromId : Trade.Id -> ( Model, List Emission )
initModelFromId id =
    ( CheckTrader id, [] )


initModel : Trade.TradeDetail -> ( Model, List Emission )
initModel trade =
    ( Main trade, [] )
