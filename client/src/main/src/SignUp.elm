module SignUp exposing (main)

import Browser
import Html


type Model
    = Model


type Msg
    = Msg


main : Program String Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = always Sub.none
        }


init : String -> ( Model, Cmd Msg )
init urlFragment =
    ( Model, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    ( model, Cmd.none )


view : Model -> Html.Html Msg
view model =
    Html.div [] [ Html.text "やっぱりElmで" ]
