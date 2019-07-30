module Page.History exposing
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
import Html.Styled
import Page.Component.LogIn as LogIn
import Page.Component.ProductList as ProductList
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


type Emission
    = EmissionGetHistoryProducts Api.Token
    | EmissionByLogIn LogIn.Emission
    | EmissionByProductList ProductList.Emission
    | EmissionAddLogMessage String


initModel : Maybe Product.Id -> LogInState.LogInState -> ( Model, List Emission )
initModel goodIdMaybe logInState =
    let
        ( productListModel, emissionList ) =
            ProductList.initModel goodIdMaybe
    in
    ( Model
        { normal = Loading
        , logIn = LogIn.initModel
        , productList = productListModel
        }
    , (case LogInState.getToken logInState of
        Just accessToken ->
            [ EmissionGetHistoryProducts accessToken ]

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
                    , [ EmissionAddLogMessage ("閲覧履歴の取得に失敗 " ++ errorMessage) ]
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
    ->
        { title : Maybe String
        , tab : BasicParts.Tab Msg
        , html : List (Html.Styled.Html Msg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view logInState isWideScreen (Model rec) =
    { title = Just "いいね・閲覧した商品"
    , tab = BasicParts.tabSingle "閲覧履歴"
    , html =
        case logInState of
            LogInState.None ->
                [ Page.Style.container
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
