module Page.BoughtProducts exposing
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
import Data.LogInState as LogInState
import Data.Product as Product
import Html.Styled
import Component.LogIn as LogIn
import Component.ProductList as ProductList
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
    = CmdGetPurchaseProducts Api.Token
    | CmdByLogIn LogIn.Cmd
    | CmdByProductList ProductList.Cmd
    | CmdAddLogMessage String


initModel : Maybe Product.Id -> LogInState.LogInState -> ( Model, List Cmd )
initModel productIdMaybe logInState =
    let
        ( productListModel, productListCmds ) =
            ProductList.initModel productIdMaybe
    in
    ( Model
        { normal = Loading
        , logIn = LogIn.initModel
        , productList = productListModel
        }
    , (case LogInState.getToken logInState of
        Just accessToken ->
            [ CmdGetPurchaseProducts accessToken ]

        Nothing ->
            []
      )
        ++ (productListCmds |> List.map CmdByProductList)
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
                    ( Model { rec | normal = Error }
                    , [ CmdAddLogMessage ("商品の取得に失敗 " ++ errorMessage) ]
                    )

        MsgByLogIn logInOrSignUpMsg ->
            let
                ( newModel, cmdList ) =
                    LogIn.update logInOrSignUpMsg rec.logIn
            in
            ( Model { rec | logIn = newModel }
            , cmdList |> List.map CmdByLogIn
            )

        MsgByProductList productListMsg ->
            let
                ( newModel, cmds ) =
                    rec.productList |> ProductList.update productListMsg
            in
            ( case productListMsg of
                ProductList.UpdateLikedCountResponse id (Ok likedCount) ->
                    Model
                        { rec
                            | normal = updateLikedCount likedCount id rec.normal
                            , productList = newModel
                        }

                _ ->
                    Model { rec | productList = newModel }
            , cmds |> List.map CmdByProductList
            )


updateLikedCount : Int -> Product.Id -> NormalModel -> NormalModel
updateLikedCount likedCount id normalModel =
    case normalModel of
        Loading ->
            Loading

        Normal products ->
            Normal
                (products
                    |> Product.updateById id (Product.updateLikedCount likedCount)
                )

        Error ->
            Error


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
    { title = Just "購入した商品"
    , tab = BasicParts.tabSingle "購入した商品"
    , html =
        case logInState of
            LogInState.None ->
                [ Page.Style.container
                    [ Html.Styled.text "ログインか新規登録をして、購入した商品一覧機能を使えるようにしよう!"
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
