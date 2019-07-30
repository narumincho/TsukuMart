module Page.TradesInPast exposing
    ( Emission(..)
    , Model
    , Msg(..)
    , getAllProducts
    , getAllTrades
    , initModel
    , update
    , view
    )

import Api
import BasicParts
import Data.LogInState as LogInState
import Data.Product as Product
import Data.Trade as Trade
import Html
import Html.Attributes
import Html.Styled
import Page.Component.LogIn as LogIn
import Page.Component.TradeList as TradeList
import Page.Style


type Model
    = Model
        { normal : NormalModel
        , logIn : LogIn.Model
        }


type NormalModel
    = Loading
    | Normal (List Trade.Trade)
    | Error


type Msg
    = GetTradesResponse (Result String (List Trade.Trade))
    | MsgByLogIn LogIn.Msg


type Emission
    = EmissionGetTradedProducts Api.Token
    | EmissionByLogIn LogIn.Emission
    | EmissionAddLogMessage String


initModel : Maybe Product.Id -> LogInState.LogInState -> ( Model, List Emission )
initModel goodIdMaybe logInState =
    ( Model
        { normal = Loading
        , logIn = LogIn.initModel
        }
    , case LogInState.getToken logInState of
        Just accessToken ->
            [ EmissionGetTradedProducts accessToken
            ]

        Nothing ->
            []
    )


{-| この画面から取得できる商品のデータを集める
-}
getAllTrades : Model -> List Trade.Trade
getAllTrades (Model { normal }) =
    case normal of
        Normal trades ->
            trades

        _ ->
            []


getAllProducts : Model -> List Product.Product
getAllProducts =
    getAllTrades
        >> List.map Trade.getProduct


update : Msg -> Model -> ( Model, List Emission )
update msg (Model rec) =
    case msg of
        GetTradesResponse result ->
            case result of
                Ok products ->
                    ( Model { rec | normal = Normal products }
                    , []
                    )

                Err errorMessage ->
                    ( Model
                        { rec | normal = Error }
                    , [ EmissionAddLogMessage ("取引した商品の取得に失敗 " ++ errorMessage) ]
                    )

        MsgByLogIn logInOrSignUpMsg ->
            let
                ( newModel, emissionList ) =
                    rec.logIn |> LogIn.update logInOrSignUpMsg
            in
            ( Model
                { rec | logIn = newModel }
            , emissionList |> List.map EmissionByLogIn
            )


view :
    LogInState.LogInState
    -> Model
    ->
        { title : Maybe String
        , tab : BasicParts.Tab Msg
        , html : List (Html.Styled.Html Msg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view logInState (Model rec) =
    { title = Just "過去にした取引"
    , tab = BasicParts.tabSingle "過去にした取引"
    , html =
        case logInState of
            LogInState.None ->
                [ Page.Style.container
                    [ Html.Styled.text "ログインか新規登録をして、いいねと閲覧履歴を使えるようにしよう!"
                    , LogIn.view
                        rec.logIn
                        |> Html.Styled.map MsgByLogIn
                    ]
                ]

            _ ->
                [ TradeList.view
                    (case rec.normal of
                        Loading ->
                            Nothing

                        Normal trades ->
                            Just (trades |> List.reverse)

                        Error ->
                            Just []
                    )
                ]
    , bottomNavigation = Nothing
    }
