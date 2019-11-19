module Page.CommentedProducts exposing
    ( Cmd(..)
    , Model
    , Msg(..)
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
import Style


type Model
    = Model
        { normal : NormalModel
        , logIn : LogIn.Model
        , productList : ProductList.Model
        }


type NormalModel
    = Loading
    | Normal (List Product.Id)
    | Error


type Msg
    = GetProductsResponse (Result String (List Product.Id))
    | MsgByLogIn LogIn.Msg
    | MsgByProductList ProductList.Msg


type Cmd
    = CmdGetCommentedProducts Api.Token
    | CmdByLogIn LogIn.Cmd
    | CmdByProductList ProductList.Cmd
    | CmdAddLogMessage String


initModel : Maybe Product.Id -> LogInState.LogInState -> ( Model, List Cmd )
initModel productIdMaybe logInState =
    let
        ( productListModel, cmdList ) =
            ProductList.initModel productIdMaybe
    in
    ( Model
        { normal = Loading
        , logIn = LogIn.initModel
        , productList = productListModel
        }
    , (case LogInState.getToken logInState of
        Just accessToken ->
            [ CmdGetCommentedProducts accessToken
            ]

        Nothing ->
            []
      )
        ++ (cmdList |> List.map CmdByProductList)
    )


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
                    , [ CmdAddLogMessage ("コメントした商品の取得に失敗 " ++ errorMessage) ]
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
    -> Maybe (List Product.Product)
    -> Model
    ->
        { title : Maybe String
        , tab : BasicParts.Tab Msg
        , html : List (Html.Styled.Html Msg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view logInState isWideScreen allProductsMaybe (Model rec) =
    { title = Just "コメントした商品"
    , tab = BasicParts.tabSingle "コメントした商品"
    , html =
        case logInState of
            LogInState.None ->
                [ Style.container
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
                    (case ( rec.normal, allProductsMaybe ) of
                        ( Normal productIds, Just allProducts ) ->
                            productIds
                                |> List.map (\id -> Product.searchFromId id allProducts)
                                |> Just

                        ( Normal _, _ ) ->
                            Nothing

                        ( Loading, _ ) ->
                            Nothing

                        ( Error, _ ) ->
                            Just []
                    )
                    |> Html.Styled.map MsgByProductList
                ]
    , bottomNavigation = Nothing
    }
