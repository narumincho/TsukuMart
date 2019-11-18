module Page.SearchResult exposing
    ( Command(..)
    , Model
    , Msg(..)
    , initModel
    , update
    , view
    )

import BasicParts
import Component.ProductList as ProductList
import Data.LogInState
import Data.Product
import Data.SearchCondition as SearchCondition
import Html.Styled


type Model
    = Model
        { productList : ProductList.Model
        , condition : SearchCondition.Condition
        , result : Maybe (List Data.Product.Id)
        }


type Msg
    = MessageFromProductList ProductList.Msg


type Command
    = CommandByProductList ProductList.Cmd


initModel : Maybe Data.Product.Id -> SearchCondition.Condition -> Maybe (List Data.Product.Product) -> ( Model, List Command )
initModel productIdMaybe condition allProductMaybe =
    let
        ( productListModel, cmdList ) =
            ProductList.initModel productIdMaybe
    in
    ( Model
        { productList = productListModel
        , condition = condition
        , result = allProductMaybe |> Maybe.map (SearchCondition.search condition)
        }
    , cmdList |> List.map CommandByProductList
    )


update : Msg -> Model -> ( Model, List Command )
update msg (Model rec) =
    case msg of
        MessageFromProductList productListMsg ->
            let
                ( newModel, cmdList ) =
                    rec.productList |> ProductList.update productListMsg
            in
            ( Model { rec | productList = newModel }
            , cmdList |> List.map CommandByProductList
            )


view :
    Data.LogInState.LogInState
    -> Bool
    -> Maybe (List Data.Product.Product)
    -> Model
    ->
        { title : Maybe String
        , tab : BasicParts.Tab Msg
        , html : List (Html.Styled.Html Msg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view logInState isWideScreen allProductsMaybe (Model rec) =
    { title = Just "検索結果"
    , tab = BasicParts.tabSingle "検索結果"
    , html =
        [ ProductList.view
            rec.productList
            logInState
            isWideScreen
            (case ( allProductsMaybe, rec.result ) of
                ( Just allProducts, Just ids ) ->
                    ids |> List.map (\id -> Data.Product.searchFromId id allProducts) |> Just

                ( _, _ ) ->
                    Nothing
            )
            |> Html.Styled.map MessageFromProductList
        ]
    , bottomNavigation = Nothing
    }
