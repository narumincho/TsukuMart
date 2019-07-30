module Page.LogIn exposing
    ( Emission(..)
    , Model
    , Msg(..)
    , initModel
    , update
    , view
    )

import BasicParts
import Html
import Html.Attributes
import Html.Styled
import Page.Component.LogIn as LogInOrSignUp
import Page.Style


type Model
    = Model LogInOrSignUp.Model


type Emission
    = LogInOrSignUpEmission LogInOrSignUp.Emission
    | EmissionPageToHome


type Msg
    = Msg LogInOrSignUp.Msg


initModel : ( Model, List Emission )
initModel =
    ( Model LogInOrSignUp.initModel
    , []
    )


update : Msg -> Model -> ( Model, List Emission )
update msg (Model logInOrSignUpModel) =
    case msg of
        Msg logInOrSignUpMsg ->
            logInOrSignUpModel
                |> LogInOrSignUp.update logInOrSignUpMsg
                |> Tuple.mapBoth Model
                    (\e ->
                        e |> List.map LogInOrSignUpEmission
                    )


{-| ログイン画面
-}
view :
    Model
    ->
        { title : Maybe String
        , tab : BasicParts.Tab Msg
        , html : List (Html.Html Msg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view (Model logInOrSignUpModel) =
    { title = Just "ログイン"
    , tab = BasicParts.tabSingle "ログイン"
    , html =
        [ Page.Style.container
            [ LogInOrSignUp.view logInOrSignUpModel
                |> Html.Styled.map Msg
            ]
        ]
    , bottomNavigation = Just BasicParts.User
    }
