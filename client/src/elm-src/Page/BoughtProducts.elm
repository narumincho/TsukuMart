module Page.BoughtProducts exposing
    ( Emit(..)
    , Model
    , Msg(..)
    , initModel
    , update
    , view
    )

import Api
import BasicParts
import Data.LogInState as LogInState
import Data.Product as Product
import Html
import Html.Attributes
import Page.Component.LogIn as LogIn
import Page.Component.ProductList as ProductList


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


type Emit
    = EmitGetPurchaseProducts Api.Token
    | EmitByLogIn LogIn.Emit
    | EmitByProductList ProductList.Emit
    | EmitAddLogMessage String


initModel : Maybe Product.Id -> LogInState.LogInState -> ( Model, List Emit )
initModel productIdMaybe logInState =
    let
        ( productListModel, productListEmitList ) =
            ProductList.initModel productIdMaybe
    in
    ( Model
        { normal = Loading
        , logIn = LogIn.initModel
        , productList = productListModel
        }
    , (case LogInState.getAccessToken logInState of
        Just accessToken ->
            [ EmitGetPurchaseProducts accessToken ]

        Nothing ->
            []
      )
        ++ (productListEmitList |> List.map EmitByProductList)
    )


update : Msg -> Model -> ( Model, List Emit )
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
                    , [ EmitAddLogMessage ("商品の取得に失敗 " ++ errorMessage) ]
                    )

        MsgByLogIn logInOrSignUpMsg ->
            let
                ( newModel, emitList ) =
                    LogIn.update logInOrSignUpMsg rec.logIn
            in
            ( Model { rec | logIn = newModel }
            , emitList |> List.map EmitByLogIn
            )

        MsgByProductList productListMsg ->
            let
                ( newModel, emitList ) =
                    rec.productList |> ProductList.update productListMsg
            in
            ( case productListMsg of
                ProductList.LikeResponse id (Ok ()) ->
                    Model
                        { rec
                            | normal = likeProduct id rec.normal
                            , productList = newModel
                        }

                ProductList.UnlikeResponse id (Ok ()) ->
                    Model
                        { rec
                            | normal = unlikeProduct id rec.normal
                            , productList = newModel
                        }

                _ ->
                    Model { rec | productList = newModel }
            , emitList |> List.map EmitByProductList
            )


likeProduct : Product.Id -> NormalModel -> NormalModel
likeProduct id normalModel =
    case normalModel of
        Loading ->
            Loading

        Normal products ->
            Normal
                (products
                    |> Product.updateById id Product.like
                )

        Error ->
            Error


unlikeProduct : Product.Id -> NormalModel -> NormalModel
unlikeProduct id normalModel =
    case normalModel of
        Loading ->
            Loading

        Normal products ->
            Normal
                (products
                    |> Product.updateById id Product.unlike
                )

        Error ->
            Error


view :
    LogInState.LogInState
    -> Bool
    -> Model
    -> { title : Maybe String, tab : BasicParts.Tab Msg, html : List (Html.Html Msg) }
view logInState isWideScreenMode (Model rec) =
    { title = Just "購入した商品"
    , tab = BasicParts.tabSingle "購入した商品"
    , html =
        case logInState of
            LogInState.None ->
                [ Html.div
                    [ Html.Attributes.class "container" ]
                    [ Html.div
                        []
                        [ Html.text "ログインか新規登録をして、購入した商品一覧機能を使えるようにしよう!" ]
                    , LogIn.view
                        rec.logIn
                        |> Html.map MsgByLogIn
                    ]
                ]

            _ ->
                [ ProductList.view
                    rec.productList
                    logInState
                    isWideScreenMode
                    (case rec.normal of
                        Loading ->
                            Nothing

                        Normal products ->
                            Just products

                        Error ->
                            Just []
                    )
                    |> Html.map MsgByProductList
                ]
    }
