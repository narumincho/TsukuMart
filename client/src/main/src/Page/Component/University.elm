module Page.Component.University exposing
    ( Cmd(..)
    , Model
    , Msg
    , getUniversity
    , initModelFromUniversity
    , initModelNone
    , update
    , view
    )

import Data.University as University
import Html.Styled
import Page.Style


type Model
    = School SchoolSelect
    | GraduateTsukuba
        { graduate : Maybe University.Graduate
        , school : SchoolSelect
        }
    | GraduateNoTsukuba (Maybe University.Graduate)


type SchoolSelect
    = SchoolNone
    | SchoolSchool University.School
    | SchoolSchoolAndDepartment University.Department


type Msg
    = SwitchGraduate
    | SwitchSchool
    | SwitchGraduateTsukuba
    | SwitchGraduateNoTsukuba
    | SelectGraduate (Maybe Int)
    | SelectSchool (Maybe Int)
    | SelectDepartment (Maybe Int)


type Cmd
    = CmdChangeSelectedIndex { id : String, index : Int }


{-| 何も選択していない状態
-}
initModelNone : ( Model, List Cmd )
initModelNone =
    ( School SchoolNone
    , [ CmdChangeSelectedIndex
            { id = schoolSelectId, index = 0 }
      ]
    )


{-| 最初から選択している状態
-}
initModelFromUniversity : University.University -> ( Model, List Cmd )
initModelFromUniversity university =
    case university of
        University.GraduateTsukuba graduate schoolAndDepartment ->
            ( GraduateTsukuba
                { graduate = Just graduate
                , school = SchoolSchoolAndDepartment schoolAndDepartment
                }
            , [ CmdChangeSelectedIndex
                    { id = graduateSelectId, index = University.graduateToIndex graduate + 1 }
              , CmdChangeSelectedIndex
                    { id = schoolSelectId, index = University.schoolToIndex (University.schoolFromDepartment schoolAndDepartment) + 1 }
              , CmdChangeSelectedIndex
                    { id = departmentSelectId, index = University.departmentToIndexInSchool schoolAndDepartment + 1 }
              ]
            )

        University.GraduateNoTsukuba graduate ->
            ( GraduateNoTsukuba (Just graduate)
            , [ CmdChangeSelectedIndex
                    { id = graduateSelectId, index = University.graduateToIndex graduate + 1 }
              ]
            )

        University.NotGraduate schoolAndDepartment ->
            ( School
                (SchoolSchoolAndDepartment schoolAndDepartment)
            , [ CmdChangeSelectedIndex
                    { id = schoolSelectId, index = University.schoolToIndex (University.schoolFromDepartment schoolAndDepartment) + 1 }
              , CmdChangeSelectedIndex
                    { id = departmentSelectId, index = University.departmentToIndexInSchool schoolAndDepartment + 1 }
              ]
            )


{-| 学群学類研究科の情報を取得する
-}
getUniversity : Model -> Maybe University.University
getUniversity universitySelect =
    case universitySelect of
        School schoolSelect ->
            getDepartment schoolSelect
                |> Maybe.map University.NotGraduate

        GraduateTsukuba { graduate, school } ->
            case ( graduate, getDepartment school ) of
                ( Just g, Just department ) ->
                    Just (University.GraduateTsukuba g department)

                ( _, _ ) ->
                    Nothing

        GraduateNoTsukuba (Just graduate) ->
            Just (University.GraduateNoTsukuba graduate)

        GraduateNoTsukuba Nothing ->
            Nothing


getDepartment : SchoolSelect -> Maybe University.Department
getDepartment select =
    case select of
        SchoolNone ->
            Nothing

        SchoolSchoolAndDepartment department ->
            Just department

        SchoolSchool school ->
            University.departmentFromOneSchool school


update : Msg -> Model -> ( Model, List Cmd )
update msg model =
    ( case ( msg, model ) of
        ( SwitchGraduate, School schoolSelect ) ->
            GraduateTsukuba
                { school = schoolSelect
                , graduate = Nothing
                }

        ( SwitchSchool, GraduateTsukuba { school } ) ->
            School school

        ( SwitchSchool, GraduateNoTsukuba _ ) ->
            School SchoolNone

        ( SwitchGraduateTsukuba, GraduateNoTsukuba graduate ) ->
            GraduateTsukuba
                { school = SchoolNone
                , graduate = graduate
                }

        ( SwitchGraduateNoTsukuba, GraduateTsukuba { graduate } ) ->
            GraduateNoTsukuba
                graduate

        ( SelectGraduate index, GraduateTsukuba rec ) ->
            GraduateTsukuba
                { rec
                    | graduate =
                        index
                            |> Maybe.andThen University.graduateFromIndex
                }

        ( SelectGraduate index, GraduateNoTsukuba _ ) ->
            GraduateNoTsukuba (index |> Maybe.andThen University.graduateFromIndex)

        ( SelectSchool index, School school ) ->
            School (selectSchool index school)

        ( SelectSchool index, GraduateTsukuba rec ) ->
            GraduateTsukuba
                { rec
                    | school = selectSchool index rec.school
                }

        ( SelectDepartment index, School school ) ->
            School (selectDepartment index school)

        ( SelectDepartment index, GraduateTsukuba rec ) ->
            GraduateTsukuba { rec | school = selectDepartment index rec.school }

        ( _, _ ) ->
            model
    , []
    )


selectSchool : Maybe Int -> SchoolSelect -> SchoolSelect
selectSchool index schoolSelect =
    case index |> Maybe.andThen University.schoolFromIndex of
        Just school ->
            case schoolSelect of
                SchoolNone ->
                    SchoolSchool school

                SchoolSchool _ ->
                    SchoolSchool school

                SchoolSchoolAndDepartment schoolAndDepartment ->
                    if University.schoolFromDepartment schoolAndDepartment == school then
                        schoolSelect

                    else
                        SchoolSchool school

        Nothing ->
            SchoolNone


selectDepartment : Maybe Int -> SchoolSelect -> SchoolSelect
selectDepartment index schoolSelect =
    case schoolSelect of
        SchoolNone ->
            SchoolNone

        SchoolSchool school ->
            case index |> Maybe.andThen (University.departmentFromIndexInSchool school) of
                Just department ->
                    SchoolSchoolAndDepartment department

                Nothing ->
                    SchoolSchool school

        SchoolSchoolAndDepartment schoolAndDepartment ->
            case
                index
                    |> Maybe.andThen
                        (University.departmentFromIndexInSchool
                            (University.schoolFromDepartment schoolAndDepartment)
                        )
            of
                Just department ->
                    SchoolSchoolAndDepartment department

                Nothing ->
                    SchoolSchool (schoolAndDepartment |> University.schoolFromDepartment)



{- ====================================
                   View
   ====================================
-}


{-| 研究科学群学類入力フォーム
-}
view : Model -> List ( String, Html.Styled.Html Msg )
view model =
    case model of
        School schoolSelect ->
            schoolOrGraduateView Page.Style.Left
                :: schoolView schoolSelect

        GraduateTsukuba { graduate, school } ->
            schoolOrGraduateView Page.Style.Right
                :: graduateTsukubaView graduate school

        GraduateNoTsukuba graduate ->
            schoolOrGraduateView Page.Style.Right
                :: graduateNoTsukubaView graduate


{-| 研究科に所属しているかしていないか?
-}
schoolOrGraduateView : Page.Style.RadioSelect -> ( String, Html.Styled.Html Msg )
schoolOrGraduateView select =
    ( "schoolOrGraduate"
    , Page.Style.titleAndContentStyle
        "所属"
        (Page.Style.radioForm
            { select = select
            , leftText = "学群生"
            , rightText = "院生"
            , name = "schoolOrGraduate"
            }
            |> Html.Styled.map
                (\msg ->
                    case msg of
                        Page.Style.Left ->
                            SwitchSchool

                        Page.Style.Right ->
                            SwitchGraduate
                )
        )
    )


{-| 研究科に所属していない人のフォーム
-}
schoolView : SchoolSelect -> List ( String, Html.Styled.Html Msg )
schoolView schoolSelect =
    case schoolSelect of
        SchoolNone ->
            [ selectSchoolView Nothing ]

        SchoolSchool school ->
            [ selectSchoolView (Just school)
            ]
                ++ (case selectDepartmentView school Nothing of
                        Just v ->
                            [ v ]

                        Nothing ->
                            []
                   )

        SchoolSchoolAndDepartment department ->
            [ selectSchoolView (Just (University.schoolFromDepartment department))
            ]
                ++ (case selectDepartmentView (University.schoolFromDepartment department) (Just department) of
                        Just v ->
                            [ v ]

                        Nothing ->
                            []
                   )


graduateTsukubaView : Maybe University.Graduate -> SchoolSelect -> List ( String, Html.Styled.Html Msg )
graduateTsukubaView graduateSelect schoolSelect =
    [ graduateSelectView graduateSelect
    , graduateYesNoTsukubaView Page.Style.Left
    ]
        ++ schoolView schoolSelect


graduateNoTsukubaView : Maybe University.Graduate -> List ( String, Html.Styled.Html Msg )
graduateNoTsukubaView graduateSelect =
    [ graduateSelectView graduateSelect
    , graduateYesNoTsukubaView Page.Style.Right
    ]


graduateSelectView : Maybe University.Graduate -> ( String, Html.Styled.Html Msg )
graduateSelectView graduateMaybe =
    ( "selectGraduate"
    , Page.Style.formItem
        "研究科"
        graduateSelectId
        [ Page.Style.selectMenu
            graduateSelectId
            (University.graduateAllValue
                |> List.map University.graduateToJapaneseString
            )
        ]
        |> Html.Styled.map SelectGraduate
    )


graduateSelectId : String
graduateSelectId =
    "signUp-selectGraduate"


{-| 筑波大学に所属していたかしていなかったか
Boolは左(筑波大学所属していた)を選択しているか
-}
graduateYesNoTsukubaView : Page.Style.RadioSelect -> ( String, Html.Styled.Html Msg )
graduateYesNoTsukubaView select =
    ( "tsukubaUniversitySchoolOrNo"
    , Page.Style.titleAndContentStyle
        "院進前の所属"
        (Page.Style.radioForm
            { select = select
            , leftText = "筑波大学に所属していた"
            , rightText = "筑波大学に所属していなかった"
            , name = "graduateYesNoTsukuba"
            }
            |> Html.Styled.map
                (\msg ->
                    case msg of
                        Page.Style.Left ->
                            SwitchGraduateTsukuba

                        Page.Style.Right ->
                            SwitchGraduateNoTsukuba
                )
        )
    )


{-| 学群の選択
-}
selectSchoolView : Maybe University.School -> ( String, Html.Styled.Html Msg )
selectSchoolView schoolMaybe =
    ( "schoolSelect"
    , Page.Style.formItem
        "学群"
        schoolSelectId
        [ Page.Style.selectMenu
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
selectDepartmentView school departmentMaybe =
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
    , Page.Style.formItem
        "学類"
        departmentSelectId
        [ Page.Style.selectMenu
            departmentSelectId
            labelList
        ]
        |> Html.Styled.map SelectDepartment
    )


departmentSelectId : String
departmentSelectId =
    "signUp-selectDepartment"
