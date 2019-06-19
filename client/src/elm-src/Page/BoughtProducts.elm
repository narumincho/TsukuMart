module Page.BoughtProducts exposing (Emit(..), Model, Msg(..), initModel, update, view)

import Api
import Data.LogInState as LogInState
import Data.Product
import Html
import Html.Attributes
import Page.Component.LogIn as LogIn
import Page.Component.ProductList as ProductList
import Tab


type Model
    = Model
        { normalModel : NormalModel
        , logInModel : LogIn.Model
        , productListModel : ProductList.Model
        }


type NormalModel
    = Loading
    | Normal (List Data.Product.Product)
    | Error


type Emit
    = EmitGetPurchaseProducts Api.Token
    | EmitLogInOrSignUp LogIn.Emit
    | EmitByProductList ProductList.Emit


type Msg
    = GetPurchaseProductsResponse (Result () (List Data.Product.Product))
    | LogInOrSignUpMsg LogIn.Msg
    | MsgByProductList ProductList.Msg


initModel : Maybe Data.Product.Id -> LogInState.LogInState -> ( Model, List Emit )
initModel productIdMaybe logInState =
    let
        ( productListModel, emitList ) =
            ProductList.initModel productIdMaybe
    in
    ( Model
        { logInModel = LogIn.initModel
        , normalModel = Loading
        , productListModel = productListModel
        }
    , (case LogInState.getAccessToken logInState of
        Just accessToken ->
            [ EmitGetPurchaseProducts accessToken ]

        Nothing ->
            []
      )
        ++ (emitList |> List.map EmitByProductList)
    )


update : Msg -> Model -> ( Model, List Emit )
update msg (Model rec) =
    case msg of
        GetPurchaseProductsResponse result ->
            case result of
                Ok products ->
                    ( Model
                        { rec | normalModel = Normal products }
                    , []
                    )

                Err () ->
                    ( Model { rec | normalModel = Error }
                    , []
                    )

        LogInOrSignUpMsg logInOrSignUpMsg ->
            let
                ( newModel, emitList ) =
                    LogIn.update logInOrSignUpMsg rec.logInModel
            in
            ( Model { rec | logInModel = newModel }
            , emitList |> List.map EmitLogInOrSignUp
            )

        MsgByProductList productListMsg ->
            let
                ( newModel, emitList ) =
                    rec.productListModel |> ProductList.update productListMsg
            in
            ( case productListMsg of
                ProductList.LikeResponse id (Ok ()) ->
                    Model
                        { rec
                            | normalModel = likeProduct id rec.normalModel
                            , productListModel = newModel
                        }

                ProductList.UnlikeResponse id (Ok ()) ->
                    Model
                        { rec
                            | normalModel = unlikeProduct id rec.normalModel
                            , productListModel = newModel
                        }

                _ ->
                    Model { rec | productListModel = newModel }
            , emitList |> List.map EmitByProductList
            )


likeProduct : Data.Product.Id -> NormalModel -> NormalModel
likeProduct id normalModel =
    case normalModel of
        Loading ->
            Loading

        Normal products ->
            Normal
                (products
                    |> Data.Product.listMapIf (\g -> Data.Product.getId g == id) Data.Product.like
                )

        Error ->
            Error


unlikeProduct : Data.Product.Id -> NormalModel -> NormalModel
unlikeProduct id normalModel =
    case normalModel of
        Loading ->
            Loading

        Normal products ->
            Normal
                (products
                    |> Data.Product.listMapIf (\g -> Data.Product.getId g == id) Data.Product.unlike
                )

        Error ->
            Error


view :
    LogInState.LogInState
    -> Bool
    -> Model
    -> { title : Maybe String, tab : Tab.Tab Msg, html : List (Html.Html Msg) }
view logInState isWideScreenMode (Model rec) =
    { title = Just "購入した商品"
    , tab = Tab.single "購入した商品"
    , html =
        case logInState of
            LogInState.None ->
                [ Html.div
                    [ Html.Attributes.class "container" ]
                    [ Html.div
                        [ Html.Attributes.class "logInRecommendText" ]
                        [ Html.text "ログインか新規登録をして、購入した商品一覧機能を使えるようにしよう!" ]
                    , LogIn.view
                        rec.logInModel
                        |> Html.map LogInOrSignUpMsg
                    ]
                ]

            _ ->
                [ ProductList.view
                    rec.productListModel
                    logInState
                    isWideScreenMode
                    (case rec.normalModel of
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
