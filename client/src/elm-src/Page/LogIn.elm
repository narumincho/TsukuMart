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
    | EmitPageToHome


type Msg
    = Msg LogInOrSignUp.Msg


initModel : Model
initModel =
    Model
        LogInOrSignUp.initModel


update : Msg -> Model -> ( Model, List Emit )
update msg (Model logInOrSignUpModel) =
    case msg of
        Msg logInOrSignUpMsg ->
            logInOrSignUpModel
                |> LogInOrSignUp.update logInOrSignUpMsg
                |> Tuple.mapBoth Model
                    (\e ->
                        e |> List.map LogInOrSignUpEmit
                    )


{-| ログイン画面
-}
view : Model -> ( String, Tab.Tab Msg, List (Html.Html Msg) )
view (Model logInOrSignUpModel) =
    ( "ログイン"
    , Tab.single "ログイン"
    , [ Html.div
            [ Html.Attributes.class "container" ]
            [ LogInOrSignUp.view logInOrSignUpModel
                |> Html.map Msg
            ]
      ]
    )
