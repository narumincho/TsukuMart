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

import Css
import Data.University as University
import Html.Styled
import Html.Styled.Attributes
import Html.Styled.Events
import Json.Decode
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
                    { id = graduateSelectId, index = University.graduateToIndex graduate + 1 }
              , EmissionChangeSelectedIndex
                    { id = schoolSelectId, index = University.schoolToIndex (University.schoolFromDepartment schoolAndDepartment) + 1 }
              , EmissionChangeSelectedIndex
                    { id = departmentSelectId, index = University.departmentToIndexInSchool schoolAndDepartment + 1 }
              ]
            )

        University.GraduateNoTsukuba graduate ->
            ( GraduateNoTsukuba (Just graduate)
            , [ EmissionChangeSelectedIndex
                    { id = graduateSelectId, index = University.graduateToIndex graduate + 1 }
              ]
            )

        University.NotGraduate schoolAndDepartment ->
            ( School
                (SchoolSchoolAndDepartment schoolAndDepartment)
            , [ EmissionChangeSelectedIndex
                    { id = schoolSelectId, index = University.schoolToIndex (University.schoolFromDepartment schoolAndDepartment) + 1 }
              , EmissionChangeSelectedIndex
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


update : Msg -> Model -> ( Model, List Emission )
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
            schoolOrGraduateView Left
                :: schoolView schoolSelect

        GraduateTsukuba { graduate, school } ->
            schoolOrGraduateView Right
                :: graduateTsukubaView graduate school

        GraduateNoTsukuba graduate ->
            schoolOrGraduateView Right
                :: graduateNoTsukubaView graduate


{-| 研究科に所属しているかしていないか?
-}
schoolOrGraduateView : RadioSelect -> ( String, Html.Styled.Html Msg )
schoolOrGraduateView select =
    ( "schoolOrGraduate"
    , Page.Style.titleAndContentStyle
        "所属"
        (radioForm
            { select = select
            , leftText = "学群生"
            , rightText = "院生"
            , name = "schoolOrGraduate"
            }
            |> Html.Styled.map
                (\msg ->
                    case msg of
                        Left ->
                            SwitchSchool

                        Right ->
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
    , graduateYesNoTsukubaView Left
    ]
        ++ schoolView schoolSelect


graduateNoTsukubaView : Maybe University.Graduate -> List ( String, Html.Styled.Html Msg )
graduateNoTsukubaView graduateSelect =
    [ graduateSelectView graduateSelect
    , graduateYesNoTsukubaView Right
    ]


graduateSelectView : Maybe University.Graduate -> ( String, Html.Styled.Html Msg )
graduateSelectView graduateMaybe =
    ( "selectGraduate"
    , Page.Style.formItem
        "研究科"
        graduateSelectId
        [ Page.Style.select
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
graduateYesNoTsukubaView : RadioSelect -> ( String, Html.Styled.Html Msg )
graduateYesNoTsukubaView select =
    ( "tsukubaUniversitySchoolOrNo"
    , Page.Style.titleAndContentStyle
        "院進前の所属"
        (radioForm
            { select = select
            , leftText = "筑波大学に所属していた"
            , rightText = "筑波大学に所属していなかった"
            , name = "graduateYesNoTsukuba"
            }
            |> Html.Styled.map
                (\msg ->
                    case msg of
                        Left ->
                            SwitchGraduateTsukuba

                        Right ->
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
        [ Page.Style.select
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
        [ Page.Style.select
            departmentSelectId
            labelList
        ]
        |> Html.Styled.map SelectDepartment
    )


departmentSelectId : String
departmentSelectId =
    "signUp-selectDepartment"


type RadioSelect
    = Left
    | Right


radioForm :
    { select : RadioSelect
    , leftText : String
    , rightText : String
    , name : String
    }
    -> Html.Styled.Html RadioSelect
radioForm { select, leftText, rightText, name } =
    Html.Styled.div
        [ Html.Styled.Attributes.css
            [ Css.width (Css.pct 100)
            , Css.padding (Css.px 8)
            , Page.Style.displayGridAndGap 0
            , Css.property "grid-template-columns" "1fr 1fr"
            , Css.boxSizing Css.borderBox
            ]
        ]
        [ Html.Styled.input
            [ Html.Styled.Attributes.type_ "radio"
            , Html.Styled.Attributes.name name
            , Html.Styled.Attributes.id (name ++ "Left")
            , Html.Styled.Attributes.css
                [ radioInputStyle
                ]
            , Html.Styled.Events.on "change" (Json.Decode.succeed Left)
            , Html.Styled.Attributes.checked (select == Left)
            ]
            []
        , Html.Styled.label
            [ Html.Styled.Attributes.for (name ++ "Left")
            , Html.Styled.Attributes.css
                [ radioLabelStyle (select == Left)
                , Css.borderRadius4 (Css.px 8) Css.zero Css.zero (Css.px 8)
                , Css.property "grid-column" "1 / 2"
                , Css.property "grid-row" "1 / 2"
                ]
            ]
            [ Html.Styled.text leftText ]
        , Html.Styled.input
            [ Html.Styled.Attributes.type_ "radio"
            , Html.Styled.Attributes.name name
            , Html.Styled.Attributes.id (name ++ "Right")
            , Html.Styled.Attributes.css
                [ radioInputStyle
                ]
            , Html.Styled.Events.on "change" (Json.Decode.succeed Right)
            , Html.Styled.Attributes.checked (select == Right)
            ]
            []
        , Html.Styled.label
            [ Html.Styled.Attributes.for (name ++ "Right")
            , Html.Styled.Attributes.css
                [ radioLabelStyle (select == Right)
                , Css.borderRadius4 Css.zero (Css.px 8) (Css.px 8) Css.zero
                , Css.property "grid-column" "2 / 3"
                , Css.property "grid-row" "1 / 2"
                ]
            ]
            [ Html.Styled.text rightText ]
        ]


radioInputStyle : Css.Style
radioInputStyle =
    [ Css.width Css.zero
    , Css.height Css.zero
    ]
        |> Css.batch


radioLabelStyle : Bool -> Css.Style
radioLabelStyle select =
    ([ Css.backgroundColor
        (if select then
            Page.Style.primaryColor

         else
            Css.rgb 153 153 153
        )
     , Css.padding (Css.px 8)
     , Css.textAlign Css.center
     , Css.cursor Css.pointer
     , Css.border2 Css.zero Css.none
     , Css.boxShadow4 Css.zero (Css.px 2) (Css.px 4) (Css.rgba 0 0 0 0.18)
     , Css.color
        (if select then
            Css.rgb 255 255 255

         else
            Css.rgb 0 0 0
        )
     ]
        ++ (if select then
                []

            else
                [ Css.hover
                    [ Css.backgroundColor (Css.rgb 187 187 187)
                    ]
                ]
           )
    )
        |> Css.batch
