module Page.Component.TradeList exposing (view)

import Data.Trade as Trade
import Html

view : Bool -> Maybe (List Trade.Trade) -> Html.Html msg
view isWideScreen tradesMaybe =
    Html.div
        []
        []
