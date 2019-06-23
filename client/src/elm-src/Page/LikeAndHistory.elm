module Page.LikeAndHistory exposing (Emit(..), Model(..), Msg(..), initModel, update, view)

import Api
import Data.LogInState as LogInState
import Data.Product as Product
import Html
import Html.Attributes
import Page.Component.LogIn as LogInOrSignUp
import Page.Component.ProductList as ProductList
import BasicParts
import Utility


type Model
    = Model
        { normalModel : NormalModel
        , logInOrSignUpModel : LogInOrSignUp.Model
        , productListModel : ProductList.Model
        }


type NormalModel
    = NormalModel
        { tabSelect : TabSelect
        , like : Maybe (Result () (List Product.Product))
        , history : Maybe (Result () (List Product.Product))
        }


normalModelGetSelectTab : NormalModel -> TabSelect
normalModelGetSelectTab (NormalModel { tabSelect }) =
    tabSelect


normalModelSetSelectTab : TabSelect -> NormalModel -> NormalModel
normalModelSetSelectTab tab (NormalModel rec) =
    NormalModel
        { rec | tabSelect = tab }


normalModelMapSelectTab : (TabSelect -> TabSelect) -> NormalModel -> NormalModel
normalModelMapSelectTab =
    Utility.toMapper normalModelGetSelectTab normalModelSetSelectTab


normalModelGetLikeGoodResponse : NormalModel -> Maybe (Result () (List Product.Product))
normalModelGetLikeGoodResponse (NormalModel { like }) =
    like


normalModelSetLikeGoodResponse : Result () (List Product.Product) -> NormalModel -> NormalModel
normalModelSetLikeGoodResponse goodList (NormalModel rec) =
    NormalModel
        { rec | like = Just goodList }


normalModelMapLikeGoodResponse : (Result () (List Product.Product) -> Result () (List Product.Product)) -> NormalModel -> NormalModel
normalModelMapLikeGoodResponse =
    Utility.toMapperGetterMaybe normalModelGetLikeGoodResponse normalModelSetLikeGoodResponse


normalModelGetHistoryGoodResponse : NormalModel -> Maybe (Result () (List Product.Product))
normalModelGetHistoryGoodResponse (NormalModel { history }) =
    history


normalModelSetHistoryGoodResponse : Result () (List Product.Product) -> NormalModel -> NormalModel
normalModelSetHistoryGoodResponse historyGoodList (NormalModel rec) =
    NormalModel
        { rec | history = Just historyGoodList }


normalModelMapHistoryGoodResponse : (Result () (List Product.Product) -> Result () (List Product.Product)) -> NormalModel -> NormalModel
normalModelMapHistoryGoodResponse =
    Utility.toMapperGetterMaybe normalModelGetHistoryGoodResponse normalModelSetHistoryGoodResponse


type TabSelect
    = TabLike
    | TabHistory


type Msg
    = SelectTab TabSelect
    | LikedProdutsResponse (Result () (List Product.Product))
    | HistoryGoodListResponse (Result () (List Product.Product))
    | MsgByLogIn LogInOrSignUp.Msg
    | MsgByProductList ProductList.Msg


type Emit
    = EmitGetLikedProduts Api.Token
    | EmitGetHistoryProduts Api.Token
    | EmitLogInOrSignUp LogInOrSignUp.Emit
    | EmitByProductList ProductList.Emit


{-| 初期状態 いいねが選ばれている
-}
initModel : Maybe Product.Id -> LogInState.LogInState -> ( Model, List Emit )
initModel goodIdMaybe logInState =
    let
        ( newGoodListModel, emitList ) =
            ProductList.initModel goodIdMaybe
    in
    ( Model
        { normalModel =
            NormalModel
                { tabSelect = TabLike
                , like = Nothing
                , history = Nothing
                }
        , logInOrSignUpModel = LogInOrSignUp.initModel
        , productListModel = newGoodListModel
        }
    , (case LogInState.getAccessToken logInState of
        Just accessToken ->
            [ EmitGetLikedProduts accessToken
            , EmitGetHistoryProduts accessToken
            ]

        Nothing ->
            []
      )
        ++ (emitList |> List.map EmitByProductList)
    )


update : LogInState.LogInState -> Msg -> Model -> ( Model, List Emit )
update logInState msg (Model rec) =
    case msg of
        SelectTab tabSelect ->
            ( Model
                { rec | normalModel = normalModelSetSelectTab tabSelect rec.normalModel }
            , case LogInState.getAccessToken logInState of
                Just accessToken ->
                    [ case tabSelect of
                        TabLike ->
                            EmitGetLikedProduts accessToken

                        TabHistory ->
                            EmitGetHistoryProduts accessToken
                    ]

                Nothing ->
                    []
            )

        LikedProdutsResponse response ->
            ( Model
                { rec | normalModel = rec.normalModel |> normalModelSetLikeGoodResponse response }
            , []
            )

        HistoryGoodListResponse response ->
            ( Model
                { rec
                    | normalModel =
                        rec.normalModel |> normalModelSetHistoryGoodResponse response
                }
            , []
            )

        MsgByLogIn logInOrSignUpMsg ->
            let
                ( newModel, emitList ) =
                    rec.logInOrSignUpModel |> LogInOrSignUp.update logInOrSignUpMsg
            in
            ( Model
                { rec | logInOrSignUpModel = newModel }
            , emitList |> List.map EmitLogInOrSignUp
            )

        MsgByProductList goodListMsg ->
            let
                ( newModel, emitList ) =
                    rec.productListModel |> ProductList.update goodListMsg
            in
            ( case goodListMsg of
                ProductList.LikeResponse id (Ok ()) ->
                    let
                        likeGoodListResult =
                            Result.map (Product.listMapIf (\g -> Product.getId g == id) Product.like)
                    in
                    Model
                        { rec
                            | normalModel =
                                rec.normalModel
                                    |> normalModelMapLikeGoodResponse likeGoodListResult
                                    |> normalModelMapHistoryGoodResponse likeGoodListResult
                            , productListModel = newModel
                        }

                ProductList.UnlikeResponse id (Ok ()) ->
                    let
                        unlikeGoodListResult =
                            Result.map (Product.listMapIf (\g -> Product.getId g == id) Product.unlike)
                    in
                    Model
                        { rec
                            | normalModel =
                                rec.normalModel
                                    |> normalModelMapLikeGoodResponse unlikeGoodListResult
                                    |> normalModelMapHistoryGoodResponse unlikeGoodListResult
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
    -> { title : Maybe String, tab : BasicParts.Tab Msg, html : List (Html.Html Msg) }
view logInState isWideScreenMode (Model rec) =
    { title = Just "いいね・閲覧した商品"
    , tab =
        BasicParts.tabMulti
            { textAndMsgList =
                [ ( "いいね", SelectTab TabLike ), ( "閲覧履歴", SelectTab TabHistory ) ]
            , selectIndex =
                case rec.normalModel |> normalModelGetSelectTab of
                    TabLike ->
                        0

                    TabHistory ->
                        1
            }
    , html =
        case logInState of
            LogInState.None ->
                [ Html.div
                    [ Html.Attributes.class "container" ]
                    [ Html.div
                        []
                        [ Html.text "ログインか新規登録をして、いいねと閲覧履歴を使えるようにしよう!" ]
                    , LogInOrSignUp.view
                        rec.logInOrSignUpModel
                        |> Html.map MsgByLogIn
                    ]
                ]

            _ ->
                [ ProductList.view
                    rec.productListModel
                    logInState
                    isWideScreenMode
                    (case normalModelGetSelectTab rec.normalModel of
                        TabLike ->
                            rec.normalModel
                                |> normalModelGetLikeGoodResponse
                                |> Maybe.map (Result.withDefault [])

                        TabHistory ->
                            rec.normalModel
                                |> normalModelGetHistoryGoodResponse
                                |> Maybe.map (Result.withDefault [])
                    )
                    |> Html.map MsgByProductList
                ]
    }
