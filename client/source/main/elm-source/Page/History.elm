module Page.History exposing
    ( Cmd(..)
    , Model
    , Msg(..)
    , getAllProducts
    , initModel
    , update
    , view
    )

import Api
import BasicParts
import Component.LogIn as LogIn
import Component.ProductList as ProductList
import Data.LogInState as LogInState
import Data.Product as Product
import Html.Styled
import Page.Style


type Model
    = Model
        { normal : NormalModel
        , logIn : LogIn.Model
        , productList : ProductList.Model
        }


type NormalModel
    = Loading
    | Normal (List Product.Product)
    | Error


type Msg
    = GetProductsResponse (Result String (List Product.Product))
    | MsgByLogIn LogIn.Msg
    | MsgByProductList ProductList.Msg


type Cmd
    = CmdGetHistoryProducts Api.Token
    | CmdByLogIn LogIn.Cmd
    | CmdByProductList ProductList.Cmd
    | CmdAddLogMessage String


initModel : Maybe Product.Id -> LogInState.LogInState -> ( Model, List Cmd )
initModel goodIdMaybe logInState =
    let
        ( productListModel, cmdList ) =
            ProductList.initModel goodIdMaybe
    in
    ( Model
        { normal = Loading
        , logIn = LogIn.initModel
        , productList = productListModel
        }
    , (case LogInState.getToken logInState of
        Just accessToken ->
            [ CmdGetHistoryProducts accessToken ]

        Nothing ->
            []
      )
        ++ (cmdList |> List.map CmdByProductList)
    )


{-| この画面から取得できる商品のデータを集める
-}
getAllProducts : Model -> List Product.Product
getAllProducts (Model { normal }) =
    case normal of
        Normal products ->
            products

        _ ->
            []


update : Msg -> Model -> ( Model, List Cmd )
update msg (Model rec) =
    case msg of
        GetProductsResponse result ->
            case result of
                Ok products ->
                    ( Model
                        { rec | normal = Normal products }
                    , []
                    )

                Err errorMessage ->
                    ( Model
                        { rec | normal = Error }
                    , [ CmdAddLogMessage ("閲覧履歴の取得に失敗 " ++ errorMessage) ]
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

        MsgByProductList productListMsg ->
            let
                ( newModel, cmdList ) =
                    rec.productList |> ProductList.update productListMsg
            in
            ( Model { rec | productList = newModel }
            , cmdList |> List.map CmdByProductList
            )


view :
    LogInState.LogInState
    -> Bool
    -> Model
    ->
        { title : Maybe String
        , tab : BasicParts.Tab Msg
        , html : List (Html.Styled.Html Msg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view logInState isWideScreen (Model rec) =
    { title = Just "いいね・閲覧した商品"
    , tab = BasicParts.tabSingle "閲覧履歴"
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
                [ ProductList.view
                    rec.productList
                    logInState
                    isWideScreen
                    (case rec.normal of
                        Loading ->
                            Nothing

                        Normal products ->
                            Just products

                        Error ->
                            Just []
                    )
                    |> Html.Styled.map MsgByProductList
                ]
    , bottomNavigation = Nothing
    }
