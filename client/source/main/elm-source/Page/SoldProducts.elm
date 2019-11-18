module Page.SoldProducts exposing
    ( Cmd(..)
    , Model
    , Msg(..)
    , initModel
    , update
    , view
    )

import BasicParts
import Component.ProductList as ProductList
import Data.LogInState as LogInState
import Data.Product as Product
import Data.User as User
import Html.Styled


type Model
    = Model
        { normal : NormalModel
        , userId : User.Id
        , productList : ProductList.Model
        }


type NormalModel
    = Loading
    | Normal (List Product.Id)
    | Error


type Cmd
    = CmdGetSoldProducts User.Id
    | CmdByProductList ProductList.Cmd
    | CmdAddLogMessage String


type Msg
    = GetSoldProductListResponse (Result String (List Product.Id))
    | MsgByProductList ProductList.Msg


initModel : User.Id -> Maybe Product.Id -> ( Model, List Cmd )
initModel userId productIdMaybe =
    let
        ( productListModel, cmdList ) =
            ProductList.initModel productIdMaybe
    in
    ( Model
        { normal = Loading
        , userId = userId
        , productList = productListModel
        }
    , CmdGetSoldProducts userId
        :: (cmdList |> List.map CmdByProductList)
    )


update : Msg -> Model -> ( Model, List Cmd )
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
                    , [ CmdAddLogMessage errorMessage ]
                    )

        MsgByProductList productListMsg ->
            let
                ( newModel, cmdList ) =
                    rec.productList |> ProductList.update productListMsg
            in
            ( Model { rec | productList = newModel }
            , cmdList |> List.map CmdByProductList
            )


view :
    LogInState.LogInState
    -> Bool
    -> Maybe (List Product.Product)
    -> Model
    ->
        { title : Maybe String
        , tab : BasicParts.Tab Msg
        , html : List (Html.Styled.Html Msg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view logInState isWideScreen allProductsMaybe (Model rec) =
    { title = Just "出品した商品"
    , tab = BasicParts.tabSingle "出品した商品"
    , html =
        [ ProductList.view
            rec.productList
            logInState
            isWideScreen
            (case ( rec.normal, allProductsMaybe ) of
                ( Normal soldProducts, Just allProducts ) ->
                    soldProducts
                        |> List.map (\id -> Product.searchFromId id allProducts)
                        |> Just

                ( Normal _, Nothing ) ->
                    Nothing

                ( Loading, _ ) ->
                    Nothing

                ( Error, _ ) ->
                    Just []
            )
            |> Html.Styled.map MsgByProductList
        ]
    , bottomNavigation = Nothing
    }
