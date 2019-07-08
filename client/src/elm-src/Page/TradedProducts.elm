module Page.TradedProducts exposing
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
import Page.Component.LogIn as LogIn
import Page.Component.TradeList as TradeList


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
                    ( Model rec
                    , [ EmissionAddLogMessage "取引データの表示は調整中" ]
                      -- TODO
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
    -> Bool
    -> Model
    -> { title : Maybe String, tab : BasicParts.Tab Msg, html : List (Html.Html Msg) }
view logInState isWideScreen (Model rec) =
    { title = Just "取引した商品"
    , tab = BasicParts.tabSingle "取引した商品"
    , html =
        case logInState of
            LogInState.None ->
                [ Html.div
                    [ Html.Attributes.class "container" ]
                    [ Html.div
                        []
                        [ Html.text "ログインか新規登録をして、いいねと閲覧履歴を使えるようにしよう!" ]
                    , LogIn.view
                        rec.logIn
                        |> Html.map MsgByLogIn
                    ]
                ]

            _ ->
                [ TradeList.view
                    isWideScreen
                    (case rec.normal of
                        Loading ->
                            Nothing

                        Normal products ->
                            Just products

                        Error ->
                            Just []
                    )
                ]
    }
