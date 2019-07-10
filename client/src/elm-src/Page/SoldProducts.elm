module Page.SoldProducts exposing
    ( Emission(..)
    , Model
    , Msg(..)
    , getAllProducts
    , initModel
    , update
    , view
    )

import BasicParts
import Data.LogInState as LogInState
import Data.Product as Product
import Data.User as User
import Html
import Page.Component.ProductList as ProductList


type Model
    = Model
        { normal : NormalModel
        , userId : User.Id
        , productList : ProductList.Model
        }


type NormalModel
    = Loading
    | Normal (List Product.Product)
    | Error


type Emission
    = EmissionGetSoldProducts User.Id
    | EmissionByProductList ProductList.Emission
    | EmissionAddLogMessage String


type Msg
    = GetSoldProductListResponse (Result String (List Product.Product))
    | MsgByProductList ProductList.Msg


initModel : User.Id -> Maybe Product.Id -> ( Model, List Emission )
initModel userId productIdMaybe =
    let
        ( productListModel, emissionList ) =
            ProductList.initModel productIdMaybe
    in
    ( Model
        { normal = Loading
        , userId = userId
        , productList = productListModel
        }
    , [ EmissionGetSoldProducts userId ]
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

                Err errorMessage ->
                    ( Model { rec | normal = Error }
                    , [ EmissionAddLogMessage errorMessage ]
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
        , html : List (Html.Html Msg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view logInState isWideScreen (Model rec) =
    { title = Just "出品した商品"
    , tab = BasicParts.tabSingle "出品した商品"
    , html =
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
    , bottomNavigation = Nothing
    }
