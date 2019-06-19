module Page.SoldProducts exposing (Emit(..), Model, Msg(..), initModel, update, view)

import Api
import Data.LogInState as LogInState
import Data.Product
import Html
import Html.Attributes
import Page.Component.LogIn as LogInOrSignUp
import Page.Component.ProductList as ProductList
import Tab


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


type Emit
    = EmitGetSoldProducts Api.Token
    | EmitLogInOrSignUp LogInOrSignUp.Emit
    | EmitByProductList ProductList.Emit


type Msg
    = GetSoldProductListResponse (Result () (List Data.Product.Product))
    | LogInOrSignUpMsg LogInOrSignUp.Msg
    | MsgByProductList ProductList.Msg


initModel : Maybe Data.Product.Id -> LogInState.LogInState -> ( Model, List Emit )
initModel productIdMaybe logInState =
    let
        ( productListModel, emitList ) =
            ProductList.initModel productIdMaybe
    in
    ( Model
        { logInOrSignUpModel = LogInOrSignUp.initModel
        , normalModel = Loading
        , productListModel = productListModel
        }
    , (case LogInState.getAccessToken logInState of
        Just accessToken ->
            [ EmitGetSoldProducts accessToken ]

        Nothing ->
            []
      )
        ++ (emitList |> List.map EmitByProductList)
    )


update : Msg -> Model -> ( Model, List Emit )
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
                ( newModel, emitList ) =
                    LogInOrSignUp.update logInOrSignUpMsg rec.logInOrSignUpModel
            in
            ( Model { rec | logInOrSignUpModel = newModel }
            , emitList |> List.map EmitLogInOrSignUp
            )

        MsgByProductList productListMsg ->
            let
                ( newModel, emitList ) =
                    rec.productListModel |> ProductList.update productListMsg
            in
            ( case productListMsg of
                ProductList.LikeResponse id (Ok ()) ->
                    let
                        likeFunc =
                            Data.Product.listMapIf (\g -> Data.Product.getId g == id) Data.Product.like
                    in
                    Model
                        { rec
                            | normalModel =
                                case rec.normalModel of
                                    Loading ->
                                        Loading

                                    Normal { soldProductList } ->
                                        Normal
                                            { soldProductList = likeFunc soldProductList }

                                    Error ->
                                        Error
                            , productListModel = newModel
                        }

                ProductList.UnlikeResponse id (Ok ()) ->
                    let
                        unlikeFunc =
                            Data.Product.listMapIf (\g -> Data.Product.getId g == id) Data.Product.unlike
                    in
                    Model
                        { rec
                            | normalModel =
                                case rec.normalModel of
                                    Loading ->
                                        Loading

                                    Normal { soldProductList } ->
                                        Normal
                                            { soldProductList = unlikeFunc soldProductList }

                                    Error ->
                                        Error
                            , productListModel = newModel
                        }

                _ ->
                    Model { rec | productListModel = newModel }
            , emitList |> List.map EmitByProductList
            )


view :
    LogInState.LogInState
    -> Bool
    -> Model
    -> { title : Maybe String, tab : Tab.Tab Msg, html : List (Html.Html Msg) }
view logInState isWideScreenMode (Model rec) =
    { title = Just "出品した商品"
    , tab = Tab.single "出品した商品"
    , html =
        case logInState of
            LogInState.None ->
                [ Html.div
                    [ Html.Attributes.class "container" ]
                    [ Html.div
                        [ Html.Attributes.class "logInRecommendText" ]
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
