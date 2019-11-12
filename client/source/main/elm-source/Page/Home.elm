module Page.Home exposing (Cmd(..), Model, Msg(..), getAllProducts, initModel, update, view)

import BasicParts
import Component.ProductList as ProductList
import Css
import Data.LogInState as LogInState
import Data.Product as Product
import Html.Styled
import Html.Styled.Attributes
import Page.Style
import PageLocation
import Utility


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


type Cmd
    = CmdGetRecentProducts
    | CmdGetRecommendProducts
    | CmdGetFreeProducts
    | CmdProducts ProductList.Cmd
    | CmdAddLogMessage String


type Msg
    = SelectTab TabSelect
    | GetRecentProductsResponse (Result String (List Product.Product))
    | GetRecommendProductsResponse (List Product.Firestore)
    | GetFreeProductsResponse (Result String (List Product.Product))
    | MsgByProductList ProductList.Msg


{-| 最初の状態。真ん中のタブ「おすすめ」が選択されている。Maybe Product.Idで指定した商品のところまでスクロールする
-}
initModel : Maybe Product.Id -> ( Model, List Cmd )
initModel productIdMaybe =
    let
        ( productListModel, cmdList ) =
            ProductList.initModel productIdMaybe
    in
    ( Model
        { tabSelect = TabRecommend
        , recent = Nothing
        , recommend = Nothing
        , free = Nothing
        , productListModel = productListModel
        }
    , [ CmdGetRecommendProducts ] ++ (cmdList |> List.map CmdProducts)
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


update : Msg -> Model -> ( Model, List Cmd )
update msg (Model rec) =
    case msg of
        SelectTab tabSelect ->
            ( Model { rec | tabSelect = tabSelect }
            , case tabSelect of
                TabRecent ->
                    [ CmdGetRecentProducts ]

                TabRecommend ->
                    [ CmdGetRecommendProducts ]

                TabFree ->
                    [ CmdGetFreeProducts ]
            )

        GetRecentProductsResponse result ->
            case result of
                Ok goodList ->
                    ( Model { rec | recent = Just goodList }, [] )

                Err errorMessage ->
                    ( Model rec
                    , [ CmdAddLogMessage errorMessage ]
                    )

        GetRecommendProductsResponse productFirestoreList ->
            case productFirestoreList |> List.map Product.fromFirestore |> Utility.sequenceMaybeList of
                Just products ->
                    ( Model { rec | recommend = Just products }, [] )

                Nothing ->
                    ( Model rec
                    , [ CmdAddLogMessage "firestoreから直接取得したデータの型が合いません" ]
                    )

        GetFreeProductsResponse result ->
            case result of
                Ok goodList ->
                    ( Model { rec | free = Just goodList }, [] )

                Err errorMessage ->
                    ( Model rec, [ CmdAddLogMessage errorMessage ] )

        MsgByProductList productListMsg ->
            let
                ( newModel, cmdList ) =
                    rec.productListModel |> ProductList.update productListMsg
            in
            ( case productListMsg of
                ProductList.UpdateLikedCountResponse id (Ok likedCount) ->
                    let
                        likeFunc =
                            Maybe.map (Product.updateById id (Product.updateLikedCount likedCount))
                    in
                    Model
                        { rec
                            | recent = likeFunc rec.recent
                            , recommend = likeFunc rec.recommend
                            , free = likeFunc rec.free
                            , productListModel = newModel
                        }

                _ ->
                    Model { rec | productListModel = newModel }
            , cmdList |> List.map CmdProducts
            )


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
            isWideScreen
            (case rec.tabSelect of
                TabRecent ->
                    rec.recent

                TabRecommend ->
                    rec.recommend

                TabFree ->
                    rec.free
            )
            |> Html.Styled.map MsgByProductList
        ]
            ++ (case LogInState.getToken logInState of
                    Just _ ->
                        [ exhibitButton ]

                    Nothing ->
                        []
               )
    , bottomNavigation = Just BasicParts.Home
    }


exhibitButton : Html.Styled.Html Msg
exhibitButton =
    Html.Styled.a
        [ Html.Styled.Attributes.css
            [ Css.position Css.fixed
            , Css.bottom (Css.px 80)
            , Css.right (Css.px 16)
            , Css.borderRadius (Css.pct 50)
            , Css.backgroundColor (Css.rgb 255 165 0)
            , Css.color (Css.rgb 0 0 0)
            , Css.width (Css.px 96)
            , Css.height (Css.px 96)
            , Page.Style.normalShadow
            , Css.textDecoration Css.none
            , Css.displayFlex
            , Css.justifyContent Css.center
            , Css.alignItems Css.center
            , Css.hover
                [ Css.backgroundColor (Css.rgb 200 145 0) ]
            ]
        , Html.Styled.Attributes.href (PageLocation.toUrlAsString PageLocation.Exhibition)
        ]
        [ Html.Styled.text "出品" ]
