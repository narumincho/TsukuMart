module Page.LikedProducts exposing
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


type Msg
    = GetProductsResponse (Result String (List Product.Product))
    | MsgByLogIn LogIn.Msg
    | MsgByProductList ProductList.Msg


type Emission
    = EmissionGetLikedProducts Api.Token
    | EmissionByLogIn LogIn.Emission
    | EmissionByProductList ProductList.Emission
    | EmissionAddLogMessage String


initModel : Maybe Product.Id -> LogInState.LogInState -> ( Model, List Emission )
initModel goodIdMaybe logInState =
    let
        ( productListModel, productListEmissions ) =
            ProductList.initModel goodIdMaybe
    in
    ( Model
        { normal = Loading
        , logIn = LogIn.initModel
        , productList = productListModel
        }
    , (case LogInState.getAccessToken logInState of
        Just accessToken ->
            [ EmissionGetLikedProducts accessToken ]

        Nothing ->
            []
      )
        ++ (productListEmissions |> List.map EmissionByProductList)
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
                    , [ EmissionAddLogMessage ("いいねした商品の取得に失敗 " ++ errorMessage) ]
                    )

        MsgByLogIn logInOrSignUpMsg ->
            let
                ( newModel, emissionList ) =
                    rec.logIn |> LogIn.update logInOrSignUpMsg
            in
            ( Model
                { rec | logIn = newModel }
            , emissionList |> List.map EmissionByLogIn
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
    { title = Just "いいねした商品"
    , tab = BasicParts.tabSingle "いいねした商品"
    , html =
        case logInState of
            LogInState.None ->
                [ Html.div
                    [ Html.Attributes.class "container" ]
                    [ Html.div
                        []
                        [ Html.text "ログインか新規登録をして、いいねと閲覧履歴を使えるようにしよう!" ]
                    , LogIn.view
                        rec.logIn
                        |> Html.map MsgByLogIn
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
                    |> Html.map MsgByProductList
                ]
    }
