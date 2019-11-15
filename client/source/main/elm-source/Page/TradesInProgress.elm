module Page.TradesInProgress exposing
    ( Cmd(..)
    , Model
    , Msg(..)
    , getAllTrades
    , initModel
    , update
    , view
    )

import Api
import BasicParts
import Component.LogIn as LogIn
import Component.TradeList as TradeList
import Data.LogInState as LogInState
import Data.Product as Product
import Data.Trade as Trade
import Html.Styled
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
    = GetProductsResponse (Result String (List Trade.Trade))
    | MsgByLogIn LogIn.Msg


type Cmd
    = CmdGetTradingProducts Api.Token
    | CmdByLogIn LogIn.Cmd
    | CmdAddLogMessage String


initModel : Maybe Product.Id -> LogInState.LogInState -> ( Model, List Cmd )
initModel goodIdMaybe logInState =
    ( Model
        { normal = Loading
        , logIn = LogIn.initModel
        }
    , case LogInState.getToken logInState of
        Just accessToken ->
            [ CmdGetTradingProducts accessToken
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


update : Msg -> Model -> ( Model, List Cmd )
update msg (Model rec) =
    case msg of
        GetProductsResponse result ->
            case result of
                Ok products ->
                    ( Model { rec | normal = Normal products }
                    , []
                    )

                Err errorMessage ->
                    ( Model
                        { rec | normal = Error }
                    , [ CmdAddLogMessage ("取引中の商品の取得に失敗 " ++ errorMessage) ]
                    )

        MsgByLogIn logInOrSignUpMsg ->
            let
                ( newModel, cmdList ) =
                    rec.logIn |> LogIn.update logInOrSignUpMsg
            in
            ( Model
                { rec | logIn = newModel }
            , cmdList |> List.map CmdByLogIn
            )


view :
    LogInState.LogInState
    -> Maybe (List Product.Product)
    -> Model
    ->
        { title : Maybe String
        , tab : BasicParts.Tab Msg
        , html : List (Html.Styled.Html Msg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view logInState allProductsMaybe (Model rec) =
    { title = Just "進行中の取引"
    , tab = BasicParts.tabSingle "進行中の取引"
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
                    allProductsMaybe
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
