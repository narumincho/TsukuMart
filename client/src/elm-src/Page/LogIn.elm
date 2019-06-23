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
import Page.Component.LogIn as LogInOrSignUp
import BasicParts


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
view : Model -> { title : Maybe String, tab : BasicParts.Tab Msg, html : List (Html.Html Msg) }
view (Model logInOrSignUpModel) =
    { title = Just "ログイン"
    , tab = BasicParts.tabSingle "ログイン"
    , html =
        [ Html.div
            [ Html.Attributes.class "container" ]
            [ LogInOrSignUp.view logInOrSignUpModel
                |> Html.map Msg
            ]
        ]
    }
