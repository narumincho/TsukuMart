module Page.LikeAndHistory exposing (Emit(..), Model(..), Msg(..), initModel, update, view)

import Api
import Data.Product as Product
import Data.LogInState as LogInState
import Html
import Html.Attributes
import Page.Component.ProductList as ProductList
import Page.Component.LogIn as LogInOrSignUp
import Tab
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
    | LikeGoodListResponse (Result () (List Product.Product))
    | HistoryGoodListResponse (Result () (List Product.Product))
    | MsgByLogIn LogInOrSignUp.Msg
    | MsgByProductList ProductList.Msg


type Emit
    = EmitGetLikeGoodList Api.Token
    | EmitGetHistoryGoodList Api.Token
    | EmitLogInOrSignUp LogInOrSignUp.Emit
    | EmitGoodList ProductList.Emit


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
            [ EmitGetLikeGoodList accessToken
            , EmitGetHistoryGoodList accessToken
            ]

        Nothing ->
            []
      )
        ++ (emitList |> List.map EmitGoodList)
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
                            EmitGetLikeGoodList accessToken

                        TabHistory ->
                            EmitGetHistoryGoodList accessToken
                    ]

                Nothing ->
                    []
            )

        LikeGoodListResponse response ->
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
                ProductList.LikeResponse userId id (Ok ()) ->
                    let
                        likeGoodListResult =
                            Result.map (Product.listMapIf (\g -> Product.getId g == id) (Product.like userId))
                    in
                    Model
                        { rec
                            | normalModel =
                                rec.normalModel
                                    |> normalModelMapLikeGoodResponse likeGoodListResult
                                    |> normalModelMapHistoryGoodResponse likeGoodListResult
                            , productListModel = newModel
                        }

                ProductList.UnlikeResponse userId id (Ok ()) ->
                    let
                        unlikeGoodListResult =
                            Result.map (Product.listMapIf (\g -> Product.getId g == id) (Product.unlike userId))
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
            , emitList |> List.map EmitGoodList
            )


view :
    LogInState.LogInState
    -> Bool
    -> Model
    -> { title : Maybe String, tab : Tab.Tab Msg, html : List (Html.Html Msg) }
view logInState isWideScreenMode (Model rec) =
    { title = Just "いいね・閲覧した商品"
    , tab =
        Tab.multi
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
