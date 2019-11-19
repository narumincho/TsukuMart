module Component.SchoolSelect exposing
    ( Cmd(..)
    , Model
    , Msg
    , getDepartment
    , getSchool
    , initNone
    , initSelected
    , update
    , view
    )

import Data.University as University
import Html.Styled
import Style


type Model
    = None
    | School University.School
    | Department University.Department


type Msg
    = SelectSchool (Maybe Int)
    | SelectDepartment (Maybe Int)


type Cmd
    = CmdChangeSelectedIndex { id : String, index : Int }


initNone : ( Model, List Cmd )
initNone =
    ( None
    , [ CmdChangeSelectedIndex
            { id = schoolSelectId, index = 0 }
      ]
    )


initSelected : University.Department -> ( Model, List Cmd )
initSelected department =
    ( Department department
    , [ CmdChangeSelectedIndex
            { id = schoolSelectId
            , index = University.schoolToIndex (University.schoolFromDepartment department) + 1
            }
      , CmdChangeSelectedIndex
            { id = departmentSelectId
            , index = University.departmentToIndexInSchool department + 1
            }
      ]
    )


getSchool : Model -> Maybe University.School
getSchool model =
    case model of
        None ->
            Nothing

        School school ->
            Just school

        Department department ->
            Just (University.schoolFromDepartment department)


getDepartment : Model -> Maybe University.Department
getDepartment select =
    case select of
        None ->
            Nothing

        Department department ->
            Just department

        School school ->
            University.departmentFromOneSchool school


update : Msg -> Model -> Model
update msg =
    case msg of
        SelectSchool index ->
            selectSchool index

        SelectDepartment index ->
            selectDepartment index


selectSchool : Maybe Int -> Model -> Model
selectSchool index schoolSelect =
    case index |> Maybe.andThen University.schoolFromIndex of
        Just school ->
            case schoolSelect of
                None ->
                    School school

                School _ ->
                    School school

                Department department ->
                    if University.schoolFromDepartment department == school then
                        schoolSelect

                    else
                        School school

        Nothing ->
            None


selectDepartment : Maybe Int -> Model -> Model
selectDepartment index schoolSelect =
    case schoolSelect of
        None ->
            None

        School school ->
            case index |> Maybe.andThen (University.departmentFromIndexInSchool school) of
                Just department ->
                    Department department

                Nothing ->
                    School school

        Department schoolAndDepartment ->
            case
                index
                    |> Maybe.andThen
                        (University.departmentFromIndexInSchool
                            (University.schoolFromDepartment schoolAndDepartment)
                        )
            of
                Just department ->
                    Department department

                Nothing ->
                    School (schoolAndDepartment |> University.schoolFromDepartment)


{-| 研究科に所属していない人のフォーム
-}
view : Model -> List ( String, Html.Styled.Html Msg )
view schoolSelect =
    case schoolSelect of
        None ->
            [ selectSchoolView Nothing ]

        School school ->
            selectSchoolView (Just school)
                :: (case selectDepartmentView school Nothing of
                        Just v ->
                            [ v ]

                        Nothing ->
                            []
                   )

        Department department ->
            selectSchoolView (Just (University.schoolFromDepartment department))
                :: (case selectDepartmentView (University.schoolFromDepartment department) (Just department) of
                        Just v ->
                            [ v ]

                        Nothing ->
                            []
                   )


{-| 学群の選択
-}
selectSchoolView : Maybe University.School -> ( String, Html.Styled.Html Msg )
selectSchoolView _ =
    ( "schoolSelect"
    , Style.formItem
        "学群"
        schoolSelectId
        [ Style.selectMenu
            False
            schoolSelectId
            (University.schoolAll
                |> List.map University.schoolToJapaneseString
            )
        ]
        |> Html.Styled.map SelectSchool
    )


schoolSelectId : String
schoolSelectId =
    "signUp-selectSchool"


{-| 学類の選択
-}
selectDepartmentView :
    University.School
    -> Maybe University.Department
    -> Maybe ( String, Html.Styled.Html Msg )
selectDepartmentView school _ =
    case University.schoolToDepartmentList school of
        x :: xs ->
            selectDepartmentViewFromLabelString school
                (x
                    :: xs
                    |> List.filterMap University.departmentToJapaneseString
                )
                |> Just

        [] ->
            Nothing


selectDepartmentViewFromLabelString : University.School -> List String -> ( String, Html.Styled.Html Msg )
selectDepartmentViewFromLabelString school labelList =
    ( "selectDepartment-" ++ University.schoolToIdString school
    , Style.formItem
        "学類"
        departmentSelectId
        [ Style.selectMenu
            False
            departmentSelectId
            labelList
        ]
        |> Html.Styled.map SelectDepartment
    )


departmentSelectId : String
departmentSelectId =
    "signUp-selectDepartment"
