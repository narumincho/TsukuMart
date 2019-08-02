module Page.Search exposing (Emission(..), Model, Msg, initModel, update, view)

import BasicParts
import Data.SearchCondition as SearchCondition
import Html.Styled
import Page.Component.Category
import Page.Style
import PageLocation


type Model
    = Model
        { query : String
        , categorySelect : Page.Component.Category.Model
        , universitySelect : SearchCondition.UniversitySelect
        }


type Msg
    = InputQuery String
    | MsgByCategory Page.Component.Category.Msg
    | SelectSchoolOrDepartment
    | SelectGraduate


type Emission
    = EmissionReplaceElementText { id : String, text : String }
    | EmissionByCategory Page.Component.Category.Emission


initModel : ( Model, List Emission )
initModel =
    let
        ( categoryModel, categoryEmissions ) =
            Page.Component.Category.initModelWithSearchCondition SearchCondition.CategorySelectNone
    in
    ( Model
        { query = ""
        , categorySelect = categoryModel
        , universitySelect = SearchCondition.UniversitySelectNone
        }
    , categoryEmissions |> List.map EmissionByCategory
    )


update : Msg -> Model -> ( Model, List Emission )
update msg (Model rec) =
    case msg of
        InputQuery string ->
            ( Model
                { rec
                    | query = string
                }
            , []
            )

        SelectSchoolOrDepartment ->
            ( Model rec
            , []
            )

        SelectGraduate ->
            ( Model rec
            , []
            )

        MsgByCategory categoryMsg ->
            ( Model
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
        , html : List (Html.Styled.Html Msg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view model =
    { title = Just "検索"
    , tab = BasicParts.tabNone
    , html =
        [ Page.Style.container
            [ viewBody model ]
        ]
    , bottomNavigation = Just BasicParts.Search
    }


viewBody : Model -> Html.Styled.Html Msg
viewBody (Model rec) =
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
            (Page.Component.Category.view rec.categorySelect
                |> Html.Styled.map MsgByCategory
            )
        , Page.Style.radioForm
            { select = Page.Style.Left
            , leftText = "学群/学類"
            , rightText = "研究科"
            , name = "searchUniversityType"
            }
            |> Html.Styled.map
                (\m ->
                    case m of
                        Page.Style.Left ->
                            SelectSchoolOrDepartment

                        Page.Style.Right ->
                            SelectGraduate
                )
        , Page.Style.mainButtonLink
            [ Html.Styled.text "検索する" ]
            (Just
                (PageLocation.SearchResult
                    (SearchCondition.init
                        rec.query
                        (Page.Component.Category.getSelect rec.categorySelect)
                        SearchCondition.UniversitySelectNone
                    )
                )
            )
        ]


searchTextId : String
searchTextId =
    "search-text"
