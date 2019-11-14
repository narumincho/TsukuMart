module Page.Home exposing (Cmd(..), Model, Msg(..), initModel, update, view)

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
        , productListModel : ProductList.Model
        }


type TabSelect
    = TabRecent
    | TabRecommend
    | TabFree


type Cmd
    = CmdProducts ProductList.Cmd
    | CmdAddLogMessage String


type Msg
    = SelectTab TabSelect
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
        , productListModel = productListModel
        }
    , [ CmdGetRecommendProducts ] ++ (cmdList |> List.map CmdProducts)
    )

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
