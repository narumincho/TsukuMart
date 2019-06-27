module Page.SoldProducts exposing (Emission(..), Model, Msg(..), initModel, update, view)

import Api
import BasicParts
import Data.LogInState as LogInState
import Data.Product
import Html
import Html.Attributes
import Page.Component.LogIn as LogInOrSignUp
import Page.Component.ProductList as ProductList


type Model
    = Model
        { normalModel : NormalModel
        , logInOrSignUpModel : LogInOrSignUp.Model
        , productListModel : ProductList.Model
        }


type NormalModel
    = Loading
    | Normal { soldProductList : List Data.Product.Product }
    | Error


type Emission
    = EmissionGetSoldProducts Api.Token
    | EmissionLogInOrSignUp LogInOrSignUp.Emission
    | EmissionByProductList ProductList.Emission


type Msg
    = GetSoldProductListResponse (Result () (List Data.Product.Product))
    | LogInOrSignUpMsg LogInOrSignUp.Msg
    | MsgByProductList ProductList.Msg


initModel : Maybe Data.Product.Id -> LogInState.LogInState -> ( Model, List Emission )
initModel productIdMaybe logInState =
    let
        ( productListModel, emissionList ) =
            ProductList.initModel productIdMaybe
    in
    ( Model
        { logInOrSignUpModel = LogInOrSignUp.initModel
        , normalModel = Loading
        , productListModel = productListModel
        }
    , (case LogInState.getAccessToken logInState of
        Just accessToken ->
            [ EmissionGetSoldProducts accessToken ]

        Nothing ->
            []
      )
        ++ (emissionList |> List.map EmissionByProductList)
    )


update : Msg -> Model -> ( Model, List Emission )
update msg (Model rec) =
    case msg of
        GetSoldProductListResponse result ->
            case result of
                Ok soldProductList ->
                    ( Model
                        { rec | normalModel = Normal { soldProductList = soldProductList } }
                    , []
                    )

                Err () ->
                    ( Model { rec | normalModel = Error }
                    , []
                    )

        LogInOrSignUpMsg logInOrSignUpMsg ->
            let
                ( newModel, emissionList ) =
                    LogInOrSignUp.update logInOrSignUpMsg rec.logInOrSignUpModel
            in
            ( Model { rec | logInOrSignUpModel = newModel }
            , emissionList |> List.map EmissionLogInOrSignUp
            )

        MsgByProductList productListMsg ->
            let
                ( newModel, emissionList ) =
                    rec.productListModel |> ProductList.update productListMsg
            in
            ( case productListMsg of
                ProductList.LikeResponse id (Ok ()) ->
                    Model
                        { rec
                            | normalModel =
                                case rec.normalModel of
                                    Loading ->
                                        Loading

                                    Normal { soldProductList } ->
                                        Normal
                                            { soldProductList =
                                                Data.Product.updateById
                                                    id
                                                    Data.Product.like
                                                    soldProductList
                                            }

                                    Error ->
                                        Error
                            , productListModel = newModel
                        }

                ProductList.UnlikeResponse id (Ok ()) ->
                    Model
                        { rec
                            | normalModel =
                                case rec.normalModel of
                                    Loading ->
                                        Loading

                                    Normal { soldProductList } ->
                                        Normal
                                            { soldProductList =
                                                Data.Product.updateById
                                                    id
                                                    Data.Product.unlike
                                                    soldProductList
                                            }

                                    Error ->
                                        Error
                            , productListModel = newModel
                        }

                _ ->
                    Model { rec | productListModel = newModel }
            , emissionList |> List.map EmissionByProductList
            )


view :
    LogInState.LogInState
    -> Bool
    -> Model
    -> { title : Maybe String, tab : BasicParts.Tab Msg, html : List (Html.Html Msg) }
view logInState isWideScreenMode (Model rec) =
    { title = Just "出品した商品"
    , tab = BasicParts.tabSingle "出品した商品"
    , html =
        case logInState of
            LogInState.None ->
                [ Html.div
                    [ Html.Attributes.class "container" ]
                    [ Html.div
                        []
                        [ Html.text "ログインか新規登録をして、出品した商品一覧機能を使えるようにしよう!" ]
                    , LogInOrSignUp.view
                        rec.logInOrSignUpModel
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

                        Normal { soldProductList } ->
                            Just soldProductList

                        Error ->
                            Just []
                    )
                    |> Html.map MsgByProductList
                ]
    }
