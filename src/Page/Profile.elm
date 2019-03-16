module Page.Profile exposing (Model, initModel, view)

import Html
import Tab


type Model
    = Model


initModel : Model
initModel =
    Model


view : Model -> ( Tab.Tab Never, List (Html.Html msg) )
view model =
    ( Tab.Single "プロフィール"
    , [ Html.text "プロフィール画面" ]
    )
