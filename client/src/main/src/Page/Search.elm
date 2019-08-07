module Page.Search exposing (Cmd(..), Model, Msg, initModel, update, view)

import BasicParts
import Data.SearchCondition as SearchCondition
import Html.Styled
import Html.Styled.Keyed
import Page.Component.Category
import Page.Component.GraduateSelect
import Page.Component.SchoolSelect
import Page.Style
import PageLocation


type Model
    = Model
        { query : String
        , categorySelect : Page.Component.Category.Model
        , universitySelect : UniversitySelect
        }


type UniversitySelect
    = School Page.Component.SchoolSelect.Model
    | Graduate Page.Component.GraduateSelect.Model


type Msg
    = InputQuery String
    | MsgByCategory Page.Component.Category.Msg
    | MsgBySchoolSelect Page.Component.SchoolSelect.Msg
    | MsgByGraduateSelect Page.Component.GraduateSelect.Msg
    | SelectSchoolOrDepartment
    | SelectGraduate


type Cmd
    = CmdReplaceElementText { id : String, text : String }
    | CmdByCategory Page.Component.Category.Cmd
    | CmdBySchoolSelect Page.Component.SchoolSelect.Cmd
    | CmdByGraduateSelect Page.Component.GraduateSelect.Cmd


initModel : ( Model, List Cmd )
initModel =
    let
        ( categoryModel, categoryCmd ) =
            Page.Component.Category.initModelWithSearchCondition SearchCondition.CategoryNone

        ( schoolModel, schoolCmd ) =
            Page.Component.SchoolSelect.initNone
    in
    ( Model
        { query = ""
        , categorySelect = categoryModel
        , universitySelect = School schoolModel
        }
    , (categoryCmd |> List.map CmdByCategory) ++ (schoolCmd |> List.map CmdBySchoolSelect)
    )


update : Msg -> Model -> ( Model, List Cmd )
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
            let
                ( schoolModel, schoolCmd ) =
                    Page.Component.SchoolSelect.initNone
            in
            ( Model { rec | universitySelect = School schoolModel }
            , schoolCmd |> List.map CmdBySchoolSelect
            )

        SelectGraduate ->
            let
                ( graduateModel, graduateCmd ) =
                    Page.Component.GraduateSelect.initNone
            in
            ( Model
                { rec | universitySelect = Graduate graduateModel }
            , graduateCmd |> List.map CmdByGraduateSelect
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

        MsgBySchoolSelect schoolSelectMsg ->
            case rec.universitySelect of
                School schoolModel ->
                    ( Model { rec | universitySelect = School (Page.Component.SchoolSelect.update schoolSelectMsg schoolModel) }
                    , []
                    )

                Graduate _ ->
                    ( Model rec
                    , []
                    )

        MsgByGraduateSelect graduateMsg ->
            case rec.universitySelect of
                School _ ->
                    ( Model rec
                    , []
                    )

                Graduate graduateModel ->
                    ( Model
                        { rec
                            | universitySelect = Graduate (Page.Component.GraduateSelect.update graduateMsg graduateModel)
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
            (viewBody model)
        ]
    , bottomNavigation = Just BasicParts.Search
    }


viewBody : Model -> List (Html.Styled.Html Msg)
viewBody (Model rec) =
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
        { select =
            case rec.universitySelect of
                School _ ->
                    Page.Style.Left

                Graduate _ ->
                    Page.Style.Right
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
    ]
        ++ (case rec.universitySelect of
                School schoolModel ->
                    [ Html.Styled.Keyed.node "div"
                        []
                        (Page.Component.SchoolSelect.view
                            schoolModel
                        )
                        |> Html.Styled.map MsgBySchoolSelect
                    ]

                Graduate graduateModel ->
                    [ Html.Styled.Keyed.node "div"
                        []
                        [ Page.Component.GraduateSelect.view
                            graduateModel
                        ]
                        |> Html.Styled.map MsgByGraduateSelect
                    ]
           )
        ++ [ searchLinkButton (Model rec) ]


searchTextId : String
searchTextId =
    "search-text"


searchLinkButton : Model -> Html.Styled.Html Msg
searchLinkButton (Model rec) =
    Page.Style.mainButtonLink
        [ Html.Styled.text "検索する" ]
        (Just
            (PageLocation.SearchResult
                (SearchCondition.init
                    rec.query
                    (Page.Component.Category.getSelect rec.categorySelect)
                    (case rec.universitySelect of
                        School schoolModel ->
                            case Page.Component.SchoolSelect.getDepartment schoolModel of
                                Just department ->
                                    SearchCondition.UniversityDepartment department

                                Nothing ->
                                    case Page.Component.SchoolSelect.getSchool schoolModel of
                                        Just school ->
                                            SearchCondition.UniversitySchool school

                                        Nothing ->
                                            SearchCondition.UniversityNone

                        Graduate graduateModel ->
                            case Page.Component.GraduateSelect.getGraduate graduateModel of
                                Just graduate ->
                                    SearchCondition.UniversityGraduate graduate

                                Nothing ->
                                    SearchCondition.UniversityNone
                    )
                )
            )
        )
