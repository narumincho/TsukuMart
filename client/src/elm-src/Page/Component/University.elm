module Page.Component.University exposing
    ( Emission(..)
    , Model
    , Msg
    , getUniversity
    , initModelFromUniversity
    , initModelNone
    , update
    , view
    )

import Data.University as University
import Html
import Html.Attributes
import Html.Events
import Json.Decode


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
    | SchoolSchoolAndDepartment University.SchoolAndDepartment


type Msg
    = SwitchGraduate
    | SwitchSchool
    | SwitchGraduateTsukuba
    | SwitchGraduateNoTsukuba
    | SelectGraduate Int
    | SelectSchool Int
    | SelectDepartment Int


type Emission
    = EmissionChangeSelectedIndex { id : String, index : Int }


{-| 何も選択していない状態
-}
initModelNone : ( Model, List Emission )
initModelNone =
    ( School SchoolNone
    , [ EmissionChangeSelectedIndex
            { id = schoolSelectId, index = 0 }
      ]
    )


{-| 最初から選択している状態
-}
initModelFromUniversity : University.University -> ( Model, List Emission )
initModelFromUniversity university =
    case university of
        University.GraduateTsukuba graduate schoolAndDepartment ->
            ( GraduateTsukuba
                { graduate = Just graduate
                , school = SchoolSchoolAndDepartment schoolAndDepartment
                }
            , [ EmissionChangeSelectedIndex
                    { id = graduateSelectId, index = University.graduateToIndex graduate }
              , EmissionChangeSelectedIndex
                    { id = schoolSelectId, index = University.schoolToIndex (University.schoolFromDepartment schoolAndDepartment) }
              , EmissionChangeSelectedIndex
                    { id = departmentSelectId, index = University.departmentToIndexInSchool schoolAndDepartment }
              ]
            )

        University.GraduateNoTsukuba graduate ->
            ( GraduateNoTsukuba (Just graduate)
            , [ EmissionChangeSelectedIndex
                    { id = graduateSelectId, index = University.graduateToIndex graduate }
              ]
            )

        University.NotGraduate schoolAndDepartment ->
            ( School
                (SchoolSchoolAndDepartment schoolAndDepartment)
            , [ EmissionChangeSelectedIndex
                    { id = schoolSelectId, index = University.schoolToIndex (University.schoolFromDepartment schoolAndDepartment) }
              , EmissionChangeSelectedIndex
                    { id = departmentSelectId, index = University.departmentToIndexInSchool schoolAndDepartment }
              ]
            )


{-| 学群学類研究科の情報を取得する
-}
getUniversity : Model -> Maybe University.University
getUniversity universitySelect =
    case universitySelect of
        School (SchoolSchoolAndDepartment schoolAndDepartment) ->
            Just (University.NotGraduate schoolAndDepartment)

        GraduateTsukuba { graduate, school } ->
            case ( graduate, school ) of
                ( Just g, SchoolSchoolAndDepartment s ) ->
                    Just (University.GraduateTsukuba g s)

                ( _, _ ) ->
                    Nothing

        GraduateNoTsukuba (Just graduate) ->
            Just (University.GraduateNoTsukuba graduate)

        _ ->
            Nothing


update : Msg -> Model -> ( Model, List Emission )
update msg model =
    ( case msg of
        SwitchGraduate ->
            case model of
                School schoolSelect ->
                    GraduateTsukuba
                        { school = schoolSelect
                        , graduate = Nothing
                        }

                _ ->
                    model

        SwitchSchool ->
            case model of
                School _ ->
                    model

                GraduateTsukuba { school } ->
                    School school

                GraduateNoTsukuba _ ->
                    School SchoolNone

        SwitchGraduateTsukuba ->
            case model of
                GraduateNoTsukuba graduate ->
                    GraduateTsukuba
                        { school = SchoolNone
                        , graduate = graduate
                        }

                _ ->
                    model

        SwitchGraduateNoTsukuba ->
            case model of
                GraduateTsukuba { graduate } ->
                    GraduateNoTsukuba
                        graduate

                _ ->
                    model

        SelectGraduate index ->
            case University.graduateFromIndex index of
                Just graduate ->
                    case model of
                        GraduateTsukuba rec ->
                            GraduateTsukuba { rec | graduate = Just graduate }

                        GraduateNoTsukuba _ ->
                            GraduateNoTsukuba (Just graduate)

                        School _ ->
                            model

                Nothing ->
                    model

        SelectSchool index ->
            case model of
                School school ->
                    School (selectSchool index school)

                GraduateTsukuba rec ->
                    GraduateTsukuba
                        { rec
                            | school = selectSchool index rec.school
                        }

                GraduateNoTsukuba _ ->
                    model

        SelectDepartment index ->
            case model of
                School school ->
                    School (selectDepartment index school)

                GraduateTsukuba rec ->
                    GraduateTsukuba { rec | school = selectDepartment index rec.school }

                GraduateNoTsukuba _ ->
                    model
    , []
    )


selectSchool : Int -> SchoolSelect -> SchoolSelect
selectSchool index schoolSelect =
    case schoolSelect of
        SchoolNone ->
            University.schoolFromIndex (index - 1)
                |> Maybe.map SchoolSchool
                |> Maybe.withDefault schoolSelect

        SchoolSchool _ ->
            University.schoolFromIndex index
                |> Maybe.map SchoolSchool
                |> Maybe.withDefault schoolSelect

        SchoolSchoolAndDepartment schoolAndDepartment ->
            case University.schoolFromIndex index of
                Just school ->
                    if University.schoolFromDepartment schoolAndDepartment == school then
                        schoolSelect

                    else
                        SchoolSchool school

                Nothing ->
                    schoolSelect


selectDepartment : Int -> SchoolSelect -> SchoolSelect
selectDepartment index schoolSelect =
    case schoolSelect of
        SchoolNone ->
            SchoolNone

        SchoolSchool school ->
            case University.departmentFromIndexInSchool school (index - 1) of
                Just department ->
                    SchoolSchoolAndDepartment department

                Nothing ->
                    schoolSelect

        SchoolSchoolAndDepartment schoolAndDepartment ->
            case University.departmentFromIndexInSchool (University.schoolFromDepartment schoolAndDepartment) index of
                Just department ->
                    SchoolSchoolAndDepartment department

                Nothing ->
                    schoolSelect



{- ====================================
                   View
   ====================================
-}


{-| 研究科学群学類入力フォーム
-}
view : Model -> List ( String, Html.Html Msg )
view model =
    case model of
        School schoolSelect ->
            schoolOrGraduateView True
                :: schoolView schoolSelect

        GraduateTsukuba { graduate, school } ->
            schoolOrGraduateView False
                :: graduateTsukubaView graduate school

        GraduateNoTsukuba graduate ->
            schoolOrGraduateView False
                :: graduateNoTsukubaView graduate


{-| 研究科に所属しているかしていないか?
-}
schoolOrGraduateView : Bool -> ( String, Html.Html Msg )
schoolOrGraduateView leftSelect =
    ( "schoolOrGraduate"
    , Html.div
        []
        [ Html.label
            [ Html.Attributes.class "form-label" ]
            [ Html.text "所属" ]
        , Html.div
            [ Html.Attributes.class "form-select" ]
            [ Html.div
                ([ Html.Attributes.classList
                    [ ( "form-select-item", not leftSelect )
                    , ( "form-select-itemSelect", leftSelect )
                    ]
                 , Html.Attributes.style "border-radius" ".4rem 0 0 .4rem"
                 ]
                    ++ (if leftSelect then
                            []

                        else
                            [ Html.Events.onClick SwitchSchool ]
                       )
                )
                [ Html.text "学群生" ]
            , Html.div
                ([ Html.Attributes.classList
                    [ ( "form-select-item", leftSelect )
                    , ( "form-select-itemSelect", not leftSelect )
                    ]
                 , Html.Attributes.style "border-radius" "0 .4rem .4rem 0"
                 ]
                    ++ (if leftSelect then
                            [ Html.Events.onClick SwitchGraduate ]

                        else
                            []
                       )
                )
                [ Html.text "院生" ]
            ]
        ]
    )


{-| 研究科に所属していない人のフォーム
-}
schoolView : SchoolSelect -> List ( String, Html.Html Msg )
schoolView schoolSelect =
    case schoolSelect of
        SchoolNone ->
            [ selectSchoolView Nothing ]

        SchoolSchool school ->
            [ selectSchoolView (Just school)
            , selectDepartmentView school Nothing
            ]

        SchoolSchoolAndDepartment department ->
            [ selectSchoolView (Just (University.schoolFromDepartment department))
            , selectDepartmentView (University.schoolFromDepartment department) (Just department)
            ]


graduateTsukubaView : Maybe University.Graduate -> SchoolSelect -> List ( String, Html.Html Msg )
graduateTsukubaView graduateSelect schoolSelect =
    [ graduateSelectView graduateSelect
    , graduateYesNoTsukubaView True
    ]
        ++ schoolView schoolSelect


graduateNoTsukubaView : Maybe University.Graduate -> List ( String, Html.Html Msg )
graduateNoTsukubaView graduateSelect =
    [ graduateSelectView graduateSelect
    , graduateYesNoTsukubaView False
    ]


graduateSelectView : Maybe University.Graduate -> ( String, Html.Html Msg )
graduateSelectView graduateMaybe =
    ( "selectGraduate"
    , Html.div
        []
        [ Html.label
            [ Html.Attributes.class "form-label"
            , Html.Attributes.for graduateSelectId
            ]
            [ Html.text "研究科" ]
        , Html.select
            [ Html.Attributes.class "form-menu"
            , Html.Attributes.id graduateSelectId
            , Html.Events.on "change" (selectDecoder |> Json.Decode.map SelectGraduate)
            ]
            ((case graduateMaybe of
                Just _ ->
                    [ blankOption ]

                Nothing ->
                    []
             )
                ++ (University.graduateAllValue
                        |> List.map
                            (\s ->
                                Html.option [] [ Html.text (University.graduateToJapaneseString s) ]
                            )
                   )
            )
        ]
    )


graduateSelectId : String
graduateSelectId =
    "signUp-selectGraduate"


{-| 筑波大学に所属していたかしていなかったか
Boolは左(筑波大学所属していた)を選択しているか
-}
graduateYesNoTsukubaView : Bool -> ( String, Html.Html Msg )
graduateYesNoTsukubaView leftSelect =
    ( "tsukubaUniversitySchoolOrNo"
    , Html.div
        []
        [ Html.label
            [ Html.Attributes.class "form-label" ]
            [ Html.text "院進前の所属" ]
        , Html.div
            [ Html.Attributes.class "form-select" ]
            [ Html.div
                ([ Html.Attributes.classList
                    [ ( "form-select-item", not leftSelect )
                    , ( "form-select-itemSelect", leftSelect )
                    ]
                 , Html.Attributes.style "border-radius" ".4rem 0 0 .4rem"
                 ]
                    ++ (if leftSelect then
                            []

                        else
                            [ Html.Events.onClick SwitchGraduateTsukuba ]
                       )
                )
                [ Html.text "筑波大学に所属していた" ]
            , Html.div
                ([ Html.Attributes.classList
                    [ ( "form-select-item", leftSelect )
                    , ( "form-select-itemSelect", not leftSelect )
                    ]
                 , Html.Attributes.style "border-radius" "0 .4rem .4rem 0"
                 ]
                    ++ (if leftSelect then
                            [ Html.Events.onClick SwitchGraduateNoTsukuba ]

                        else
                            []
                       )
                )
                [ Html.text "筑波大学に所属していなかった" ]
            ]
        ]
    )


{-| 学群の選択
-}
selectSchoolView : Maybe University.School -> ( String, Html.Html Msg )
selectSchoolView schoolMaybe =
    ( "schoolSelect"
    , Html.div
        []
        [ Html.label
            [ Html.Attributes.class "form-label"
            , Html.Attributes.for schoolSelectId
            ]
            [ Html.text "学群" ]
        , Html.select
            [ Html.Attributes.class "form-menu"
            , Html.Attributes.id schoolSelectId
            , Html.Events.on "change" (selectDecoder |> Json.Decode.map SelectSchool)
            ]
            ((case schoolMaybe of
                Just _ ->
                    [ blankOption ]

                Nothing ->
                    []
             )
                ++ (University.schoolAll
                        |> List.map
                            (\s ->
                                Html.option [] [ Html.text (University.schoolToJapaneseString s) ]
                            )
                   )
            )
        ]
    )


schoolSelectId : String
schoolSelectId =
    "signUp-selectSchool"


{-| 学類の選択
-}
selectDepartmentView : University.School -> Maybe University.SchoolAndDepartment -> ( String, Html.Html Msg )
selectDepartmentView school departmentMaybe =
    ( "selectDepartment-" ++ University.schoolToIdString school
    , Html.div
        []
        [ Html.label
            [ Html.Attributes.class "form-label"
            , Html.Attributes.for departmentSelectId
            ]
            [ Html.text "学類" ]
        , Html.select
            [ Html.Attributes.class "form-menu"
            , Html.Attributes.id departmentSelectId
            , Html.Events.on "change" (selectDecoder |> Json.Decode.map SelectDepartment)
            ]
            ((case departmentMaybe of
                Just _ ->
                    [ blankOption ]

                Nothing ->
                    []
             )
                ++ (University.schoolToDepartmentList school
                        |> List.map
                            (\s ->
                                Html.option [] [ Html.text (University.departmentToJapaneseString s |> Maybe.withDefault "?") ]
                            )
                   )
            )
        ]
    )


blankOption : Html.Html msg
blankOption =
    Html.option [] [ Html.text "--選択してください--" ]


departmentSelectId : String
departmentSelectId =
    "signUp-selectDepartment"


selectDecoder : Json.Decode.Decoder Int
selectDecoder =
    Json.Decode.at
        [ "target", "selectedIndex" ]
        Json.Decode.int
