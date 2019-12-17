module Page.Search exposing (Cmd(..), Model, Msg, initModel, update, view)

import BasicParts
import Component.Category
import Component.GraduateSelect
import Component.SchoolSelect
import Data.SearchCondition as SearchCondition
import Html.Styled
import Html.Styled.Keyed
import PageLocation
import Style


type Model
    = Model
        { query : String
        , categorySelect : Component.Category.Model
        , universitySelect : UniversitySelect
        }


type UniversitySelect
    = School Component.SchoolSelect.Model
    | Graduate Component.GraduateSelect.Model


type Msg
    = InputQuery String
    | MsgByCategory Component.Category.Msg
    | MsgBySchoolSelect Component.SchoolSelect.Msg
    | MsgByGraduateSelect Component.GraduateSelect.Msg
    | SelectSchoolOrDepartment
    | SelectGraduate


type Cmd
    = CmdReplaceElementText { id : String, text : String }
    | CmdByCategory Component.Category.Cmd
    | CmdBySchoolSelect Component.SchoolSelect.Cmd
    | CmdByGraduateSelect Component.GraduateSelect.Cmd


initModel : ( Model, List Cmd )
initModel =
    let
        ( categoryModel, categoryCmd ) =
            Component.Category.initModelWithSearchCondition SearchCondition.CategoryNone

        ( schoolModel, schoolCmd ) =
            Component.SchoolSelect.initNone
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
                    Component.SchoolSelect.initNone
            in
            ( Model { rec | universitySelect = School schoolModel }
            , schoolCmd |> List.map CmdBySchoolSelect
            )

        SelectGraduate ->
            let
                ( graduateModel, graduateCmd ) =
                    Component.GraduateSelect.initNone
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
                            |> Component.Category.update categoryMsg
                }
            , []
            )

        MsgBySchoolSelect schoolSelectMsg ->
            case rec.universitySelect of
                School schoolModel ->
                    ( Model { rec | universitySelect = School (Component.SchoolSelect.update schoolSelectMsg schoolModel) }
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
                            | universitySelect = Graduate (Component.GraduateSelect.update graduateMsg graduateModel)
                        }
                    , []
                    )


view :
    Model
    ->
        { title : Maybe String
        , tab : BasicParts.Tab Msg
        , view : Html.Styled.Html Msg
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view model =
    { title = Just "検索"
    , tab = BasicParts.tabNone
    , view =
        Style.mainView
            [ Style.container
                (viewBody model)
            ]
    , bottomNavigation = Just BasicParts.Search
    }


viewBody : Model -> List (Html.Styled.Html Msg)
viewBody (Model rec) =
    [ Style.formItem
        "検索語句"
        searchTextId
        [ Style.inputText
            { id = searchTextId
            , type_ = "text"
            , autoCompleteMaybe = Just "searchQuery"
            , required = False
            , maxlengthMaybe = Nothing
            , placeholder = "キーワードからさがす"
            }
            |> Html.Styled.map InputQuery
        ]
    , Style.titleAndContent
        "カテゴリ"
        (Component.Category.view rec.categorySelect
            |> Html.Styled.map MsgByCategory
        )
    , Style.radioForm
        { select =
            case rec.universitySelect of
                School _ ->
                    Style.Left

                Graduate _ ->
                    Style.Right
        , leftText = "学群/学類"
        , rightText = "研究科"
        , name = "searchUniversityType"
        }
        |> Html.Styled.map
            (\m ->
                case m of
                    Style.Left ->
                        SelectSchoolOrDepartment

                    Style.Right ->
                        SelectGraduate
            )
    ]
        ++ (case rec.universitySelect of
                School schoolModel ->
                    [ Html.Styled.Keyed.node "div"
                        []
                        (Component.SchoolSelect.view
                            schoolModel
                        )
                        |> Html.Styled.map MsgBySchoolSelect
                    ]

                Graduate graduateModel ->
                    [ Html.Styled.Keyed.node "div"
                        []
                        [ Component.GraduateSelect.view
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
    Style.mainButtonLink
        [ Html.Styled.text "検索する" ]
        (Just
            (PageLocation.SearchResult
                (SearchCondition.init
                    rec.query
                    (Component.Category.getSelect rec.categorySelect)
                    (case rec.universitySelect of
                        School schoolModel ->
                            case Component.SchoolSelect.getDepartment schoolModel of
                                Just department ->
                                    SearchCondition.UniversityDepartment department

                                Nothing ->
                                    case Component.SchoolSelect.getSchool schoolModel of
                                        Just school ->
                                            SearchCondition.UniversitySchool school

                                        Nothing ->
                                            SearchCondition.UniversityNone

                        Graduate graduateModel ->
                            case Component.GraduateSelect.getGraduate graduateModel of
                                Just graduate ->
                                    SearchCondition.UniversityGraduate graduate

                                Nothing ->
                                    SearchCondition.UniversityNone
                    )
                )
            )
        )
