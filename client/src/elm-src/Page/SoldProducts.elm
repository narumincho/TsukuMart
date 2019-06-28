module Page.SoldProducts exposing
    ( Emission(..)
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


type Emission
    = EmissionGetSoldProducts Api.Token
    | EmissionLogInOrSignUp LogIn.Emission
    | EmissionByProductList ProductList.Emission


type Msg
    = GetSoldProductListResponse (Result () (List Product.Product))
    | LogInOrSignUpMsg LogIn.Msg
    | MsgByProductList ProductList.Msg


initModel : Maybe Product.Id -> LogInState.LogInState -> ( Model, List Emission )
initModel productIdMaybe logInState =
    let
        ( productListModel, emissionList ) =
            ProductList.initModel productIdMaybe
    in
    ( Model
        { logIn = LogIn.initModel
        , normal = Loading
        , productList = productListModel
        }
    , (case LogInState.getAccessToken logInState of
        Just accessToken ->
            [ EmissionGetSoldProducts accessToken ]

        Nothing ->
            []
      )
        ++ (emissionList |> List.map EmissionByProductList)
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


update : Msg -> Model -> ( Model, List Emission )
update msg (Model rec) =
    case msg of
        GetSoldProductListResponse result ->
            case result of
                Ok soldProductList ->
                    ( Model
                        { rec | normal = Normal soldProductList }
                    , []
                    )

                Err () ->
                    ( Model { rec | normal = Error }
                    , []
                    )

        LogInOrSignUpMsg logInOrSignUpMsg ->
            let
                ( newModel, emissionList ) =
                    LogIn.update logInOrSignUpMsg rec.logIn
            in
            ( Model { rec | logIn = newModel }
            , emissionList |> List.map EmissionLogInOrSignUp
            )

        MsgByProductList productListMsg ->
            let
                ( newModel, emissionList ) =
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
            , emissionList |> List.map EmissionByProductList
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
    -> { title : Maybe String, tab : BasicParts.Tab Msg, html : List (Html.Html Msg) }
view logInState isWideScreen (Model rec) =
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
                    , LogIn.view
                        rec.logIn
                        |> Html.map LogInOrSignUpMsg
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

                        Normal soldProducts ->
                            Just soldProducts

                        Error ->
                            Just []
                    )
                    |> Html.map MsgByProductList
                ]
    }
