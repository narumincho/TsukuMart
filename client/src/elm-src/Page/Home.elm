module Page.Home exposing (Emission(..), Model, Msg(..), getAllProducts, initModel, update, view)

import Data.LogInState as LogInState
import Data.Product as Product
import Html
import Html.Attributes
import Page.Component.ProductList as ProductList
import SiteMap
import BasicParts


type Model
    = Model
        { tabSelect : TabSelect
        , recent : Maybe (List Product.Product)
        , recommend : Maybe (List Product.Product)
        , free : Maybe (List Product.Product)
        , productListModel : ProductList.Model
        }


type TabSelect
    = TabRecent
    | TabRecommend
    | TabFree


type Emission
    = EmissionGetRecentProducts
    | EmissionGetRecommendProducts
    | EmissionGetFreeProducts
    | EmissionProducts ProductList.Emission


type Msg
    = SelectTab TabSelect
    | GetRecentProductsResponse (Result () (List Product.Product))
    | GetRecommendProductsResponse (Result () (List Product.Product))
    | GetFreeProductsResponse (Result () (List Product.Product))
    | MsgByProductList ProductList.Msg


{-| 最初の状態。真ん中のタブ「おすすめ」が選択されている。Maybe Product.Idで指定した商品のところまでスクロールする
-}
initModel : Maybe Product.Id -> ( Model, List Emission )
initModel productIdMaybe =
    let
        ( productListModel, emissionList ) =
            ProductList.initModel productIdMaybe
    in
    ( Model
        { tabSelect = TabRecommend
        , recent = Nothing
        , recommend = Nothing
        , free = Nothing
        , productListModel = productListModel
        }
    , [ EmissionGetRecommendProducts ] ++ (emissionList |> List.map EmissionProducts)
    )


{-| この画面から取得できる商品のデータを集める
-}
getAllProducts : Model -> List Product.Product
getAllProducts (Model rec) =
    (case rec.tabSelect of
        TabRecent ->
            rec.recent

        TabRecommend ->
            rec.recommend

        TabFree ->
            rec.free
    )
        |> Maybe.withDefault []


update : Msg -> Model -> ( Model, List Emission )
update msg (Model rec) =
    case msg of
        SelectTab tabSelect ->
            ( Model { rec | tabSelect = tabSelect }
            , case tabSelect of
                TabRecent ->
                    [ EmissionGetRecentProducts ]

                TabRecommend ->
                    [ EmissionGetRecommendProducts ]

                TabFree ->
                    [ EmissionGetFreeProducts ]
            )

        GetRecentProductsResponse result ->
            ( case result of
                Ok goodList ->
                    Model { rec | recent = Just goodList }

                Err () ->
                    Model rec
            , []
            )

        GetRecommendProductsResponse result ->
            ( case result of
                Ok goodList ->
                    Model { rec | recommend = Just goodList }

                Err () ->
                    Model rec
            , []
            )

        GetFreeProductsResponse result ->
            ( case result of
                Ok goodList ->
                    Model { rec | free = Just goodList }

                Err () ->
                    Model rec
            , []
            )

        MsgByProductList productListMsg ->
            let
                ( newModel, emissionList ) =
                    rec.productListModel |> ProductList.update productListMsg
            in
            ( case productListMsg of
                ProductList.LikeResponse id (Ok ()) ->
                    let
                        likeFunc =
                            Maybe.map (Product.updateById id Product.like)
                    in
                    Model
                        { rec
                            | recent = likeFunc rec.recent
                            , recommend = likeFunc rec.recommend
                            , free = likeFunc rec.free
                            , productListModel = newModel
                        }

                ProductList.UnlikeResponse id (Ok ()) ->
                    let
                        unlikeFunc =
                            Maybe.map (Product.updateById id Product.unlike)
                    in
                    Model
                        { rec
                            | recent = unlikeFunc rec.recent
                            , recommend = unlikeFunc rec.recommend
                            , free = unlikeFunc rec.free
                            , productListModel = newModel
                        }

                _ ->
                    Model { rec | productListModel = newModel }
            , emissionList |> List.map EmissionProducts
            )


view :
    LogInState.LogInState
    -> Bool
    -> Model
    -> { title : Maybe String, tab : BasicParts.Tab Msg, html : List (Html.Html Msg) }
view logInState isWideScreenMode (Model rec) =
    { title = Nothing
    , tab =
        BasicParts.tabMulti
            { textAndMsgList = [ ( "新着", SelectTab TabRecent ), ( "おすすめ", SelectTab TabRecommend ), ( "0円", SelectTab TabFree ) ]
            , selectIndex =
                case rec.tabSelect of
                    TabRecent ->
                        0

                    TabRecommend ->
                        1

                    TabFree ->
                        2
            }
    , html =
        [ ProductList.view rec.productListModel
            logInState
            isWideScreenMode
            (case rec.tabSelect of
                TabRecent ->
                    rec.recent

                TabRecommend ->
                    rec.recommend

                TabFree ->
                    rec.free
            )
            |> Html.map MsgByProductList
        ]
            ++ (case LogInState.getAccessToken logInState of
                    Just _ ->
                        [ exhibitButton ]

                    Nothing ->
                        []
               )
    }


exhibitButton : Html.Html Msg
exhibitButton =
    Html.a
        [ Html.Attributes.class "exhibitionButton"
        , Html.Attributes.href SiteMap.exhibitionUrl
        ]
        [ Html.text "出品" ]
