module Page.Search exposing (Emission(..), Model, Msg, initModel, update, view)

import BasicParts
import Data.SearchCondition as SearchCondition
import Html
import Html.Attributes
import Html.Styled
import Page.Component.Category
import Page.Style


type Model
    = InputPage
        { query : String
        , categorySelect : Page.Component.Category.Model
        }


type Msg
    = InputQuery String
    | MsgByCategory Page.Component.Category.Msg


type Emission
    = EmissionReplaceElementText { id : String, text : String }
    | EmissionByCategory Page.Component.Category.Emission



{- TODO 検索条件があるかないかで検索条件画面か、検索結果画面か 切り替える -}


initModel : Maybe SearchCondition.Condition -> ( Model, List Emission )
initModel conditionMaybe =
    case conditionMaybe of
        Just condition ->
            let
                ( categoryModel, categoryEmissions ) =
                    Page.Component.Category.initModelWithSearchCondition (SearchCondition.getCategory condition)
            in
            ( InputPage
                { query = SearchCondition.getQuery condition
                , categorySelect = categoryModel
                }
            , categoryEmissions |> List.map EmissionByCategory
            )

        Nothing ->
            let
                ( categoryModel, categoryEmissions ) =
                    Page.Component.Category.initModelWithSearchCondition SearchCondition.CategorySelectNone
            in
            ( InputPage
                { query = ""
                , categorySelect = categoryModel
                }
            , categoryEmissions |> List.map EmissionByCategory
            )


update : Msg -> Model -> ( Model, List Emission )
update msg (InputPage rec) =
    case msg of
        InputQuery string ->
            ( InputPage
                { rec
                    | query = string
                }
            , []
            )

        MsgByCategory categoryMsg ->
            ( InputPage
                { rec
                    | categorySelect =
                        rec.categorySelect
                            |> Page.Component.Category.update categoryMsg
                }
            , []
            )


view :
    Model
    ->
        { title : Maybe String
        , tab : BasicParts.Tab Msg
        , html : List (Html.Html Msg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view (InputPage rec) =
    { title = Just "検索"
    , tab = BasicParts.tabNone
    , html =
        [ Html.div
            [ Html.Attributes.class "container" ]
            [ viewBody rec.categorySelect |> Html.Styled.toUnstyled ]
        ]
    , bottomNavigation = Just BasicParts.Search
    }


viewBody : Page.Component.Category.Model -> Html.Styled.Html Msg
viewBody categoryModel =
    Html.Styled.div
        []
        [ Page.Style.formItem
            "検索語句"
            searchTextId
            [ Page.Style.inputText
                { id = searchTextId
                , type_ = "text"
                , autoComplete = ""
                , required = False
                }
                |> Html.Styled.map InputQuery
            ]
        , Page.Style.titleAndContentStyle
            "カテゴリ"
            (Page.Component.Category.view categoryModel
                |> Html.Styled.map MsgByCategory
            )
        ]


searchTextId : String
searchTextId =
    "search-text"
