module Page.SearchResult exposing
    ( Command(..)
    , Model
    , Msg(..)
    , initModel
    , update
    , view
    )

import BasicParts
import Data.LogInState
import Data.Product
import Data.SearchCondition as SearchCondition
import Html.Styled
import Page.Component.ProductList as ProductList


type Model
    = Model
        { productList : ProductList.Model
        , condition : SearchCondition.Condition
        , result : Maybe (List Data.Product.Product)
        }


type Msg
    = SearchProductsResponse (Result String (List Data.Product.Product))
    | MessageFromProductList ProductList.Msg


type Command
    = SearchProducts SearchCondition.Condition
    | CommandByProductList ProductList.Cmd


initModel : Maybe Data.Product.Id -> SearchCondition.Condition -> ( Model, List Command )
initModel productIdMaybe condition =
    let
        ( productListModel, cmdList ) =
            ProductList.initModel productIdMaybe
    in
    ( Model
        { productList = productListModel
        , condition = condition
        , result = Nothing
        }
    , [ SearchProducts condition ] ++ (cmdList |> List.map CommandByProductList)
    )


update : Msg -> Model -> ( Model, List Command )
update msg (Model rec) =
    case msg of
        SearchProductsResponse result ->
            case result of
                Ok products ->
                    ( Model
                        { rec
                            | result = Just products
                        }
                    , []
                    )

                Err errorMessage ->
                    ( Model rec
                    , []
                    )

        MessageFromProductList productListMsg ->
            let
                ( newModel, cmdList ) =
                    rec.productList |> ProductList.update productListMsg
            in
            ( case productListMsg of
                ProductList.UpdateLikedCountResponse id (Ok likedCount) ->
                    Model
                        { rec
                            | result = updateLikedCount likedCount id rec.result
                            , productList = newModel
                        }

                _ ->
                    Model { rec | productList = newModel }
            , cmdList |> List.map CommandByProductList
            )


updateLikedCount : Int -> Data.Product.Id -> Maybe (List Data.Product.Product) -> Maybe (List Data.Product.Product)
updateLikedCount likedCount id result =
    result
        |> Maybe.map (Data.Product.updateById id (Data.Product.updateLikedCount likedCount))


view :
    Data.LogInState.LogInState
    -> Bool
    -> Model
    ->
        { title : Maybe String
        , tab : BasicParts.Tab Msg
        , html : List (Html.Styled.Html Msg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view logInState isWideScreen (Model rec) =
    { title = Just "検索結果"
    , tab = BasicParts.tabSingle ""
    , html =
        [ ProductList.view
            rec.productList
            logInState
            isWideScreen
            rec.result
            |> Html.Styled.map MessageFromProductList
        ]
    , bottomNavigation = Nothing
    }
