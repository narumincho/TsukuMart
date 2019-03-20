module Page.LogIn exposing
    ( Emit(..)
    , Model
    , Msg(..)
    , initModel
    , update
    , view
    )

import Html
import Html.Attributes
import Page.Component.LogInOrSignUp as LogInOrSignUp
import Tab


type Model
    = Model LogInOrSignUp.Model


type Emit
    = LogInOrSignUpEmit LogInOrSignUp.Emit


type Msg
    = Msg LogInOrSignUp.Msg


initModel : Model
initModel =
    Model
        LogInOrSignUp.initModel


update : Msg -> Model -> ( Model, Maybe Emit )
update msg (Model logInOrSignUpModel) =
    case msg of
        Msg logInOrSignUpMsg ->
            logInOrSignUpModel
                |> LogInOrSignUp.update logInOrSignUpMsg
                |> Tuple.mapBoth Model (Maybe.map LogInOrSignUpEmit)


{-| ログイン画面
-}
view : Model -> ( Tab.Tab Never, List (Html.Html Msg) )
view (Model logInOrSignUpModel) =
    ( Tab.Single "ログイン"
    , [ Html.div
            [ Html.Attributes.class "logIn-Container" ]
            [ LogInOrSignUp.view logInOrSignUpModel
                |> Html.map Msg
            ]
      ]
    )
