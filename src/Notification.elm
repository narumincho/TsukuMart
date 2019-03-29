module Notification exposing (view)

import Html
import Html.Attributes


view : Html.Html msg
view =
    Html.div
        [ Html.Attributes.class "notification" ]
        [ Html.text "通知。まだ作り途中" ]
