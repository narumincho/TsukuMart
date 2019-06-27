module Page.Component.University exposing
    ( Emission(..)
    , Model
    , emission
    , getUniversity
    , initSelect
    , selectFromUniversity
    , view
    )

import Array
import Data.University
import Html
import Html.Attributes
import Html.Events
import Json.Decode


type Model
    = UniversitySchool SchoolSelect
    | UniversityGraduate GraduateSelect


type SchoolSelect
    = SchoolNone
    | SchoolSelectSchool Data.University.School
    | SchoolSelectSchoolAndDepartment Data.University.SchoolAndDepartment


type GraduateSelect
    = GraduateSelect (Maybe Data.University.Graduate) (Maybe SchoolSelect)


{-| 何も選択していない状態
-}
initSelect : Model
initSelect =
    UniversitySchool SchoolNone


{-| データから選択モデルへ
-}
selectFromUniversity : Data.University.University -> Model
selectFromUniversity university =
    case university of
        Data.University.GraduateTsukuba graduate schoolAndDepartment ->
            UniversityGraduate
                (GraduateSelect (Just graduate) (Just (SchoolSelectSchoolAndDepartment schoolAndDepartment)))

        Data.University.GraduateNotTsukuba graduate ->
            UniversityGraduate
                (GraduateSelect (Just graduate) Nothing)

        Data.University.NotGraduate schoolAndDepartment ->
            UniversitySchool
                (SchoolSelectSchoolAndDepartment schoolAndDepartment)


schoolSelectGetSchool : SchoolSelect -> Maybe Data.University.School
schoolSelectGetSchool schoolSelect =
    case schoolSelect of
        SchoolNone ->
            Nothing

        SchoolSelectSchool school ->
            Just school

        SchoolSelectSchoolAndDepartment schoolAndDepartment ->
            Just (Data.University.schoolFromDepartment schoolAndDepartment)


schoolSelectGetDepartment : SchoolSelect -> Maybe Data.University.SchoolAndDepartment
schoolSelectGetDepartment schoolSelect =
    case schoolSelect of
        SchoolNone ->
            Nothing

        SchoolSelectSchool _ ->
            Nothing

        SchoolSelectSchoolAndDepartment schoolAndDepartment ->
            Just schoolAndDepartment


{-| 学群学類研究科の情報を取得する
-}
getUniversity : Model -> Maybe Data.University.University
getUniversity universitySelect =
    case universitySelect of
        UniversitySchool (SchoolSelectSchoolAndDepartment schoolAndDepartment) ->
            Just (Data.University.NotGraduate schoolAndDepartment)

        UniversityGraduate (GraduateSelect (Just graduate) (Just (SchoolSelectSchoolAndDepartment schoolAndDepartment))) ->
            Just (Data.University.GraduateTsukuba graduate schoolAndDepartment)

        UniversityGraduate (GraduateSelect (Just graduate) Nothing) ->
            Just (Data.University.GraduateNotTsukuba graduate)

        _ ->
            Nothing


type Emission
    = EmissionChangeSelectedIndex { id : String, index : Int }


emission : Model -> List Emission
emission model =
    case model of
        UniversitySchool schoolSelect ->
            schoolEmission schoolSelect

        UniversityGraduate (GraduateSelect graduate schoolSelect) ->
            [ EmissionChangeSelectedIndex
                { id = graduateSelectId
                , index =
                    case graduate of
                        Just g ->
                            Data.University.graduateToIndex g + 1

                        Nothing ->
                            0
                }
            ]
                ++ (case schoolSelect of
                        Just s ->
                            schoolEmission s

                        Nothing ->
                            []
                   )


schoolEmission : SchoolSelect -> List Emission
schoolEmission schoolSelect =
    case schoolSelect of
        SchoolNone ->
            [ EmissionChangeSelectedIndex
                { id = schoolSelectId
                , index = 0
                }
            ]

        SchoolSelectSchool school ->
            [ EmissionChangeSelectedIndex
                { id = schoolSelectId
                , index = Data.University.schoolToIndex school + 1
                }
            , EmissionChangeSelectedIndex
                { id = departmentSelectId
                , index = 0
                }
            ]

        SchoolSelectSchoolAndDepartment schoolAndDepartment ->
            [ EmissionChangeSelectedIndex
                { id = schoolSelectId
                , index = Data.University.schoolToIndex (Data.University.schoolFromDepartment schoolAndDepartment) + 1
                }
            , EmissionChangeSelectedIndex
                { id = departmentSelectId
                , index = Data.University.departmentToIndexInSchool schoolAndDepartment + 1
                }
            ]



{- ====================================
                   View
   ====================================
-}


{-| 研究科学群学類入力フォーム
-}
view : Model -> List ( String, Html.Html Model )
view universitySelect =
    [ ( "schoolOrGraduate", schoolOrGraduateView universitySelect )
    ]
        ++ (case universitySelect of
                UniversitySchool schoolSelect ->
                    schoolView schoolSelect
                        |> List.map (Tuple.mapSecond (Html.map UniversitySchool))

                UniversityGraduate graduateSelect ->
                    graduateView graduateSelect
                        |> List.map (Tuple.mapSecond (Html.map UniversityGraduate))
           )


{-| 研究科に所属しているかしていないか?
-}
schoolOrGraduateView : Model -> Html.Html Model
schoolOrGraduateView university =
    let
        leftSelect =
            case university of
                UniversitySchool _ ->
                    True

                UniversityGraduate _ ->
                    False
    in
    Html.div
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
                    ++ (case university of
                            UniversitySchool _ ->
                                []

                            UniversityGraduate _ ->
                                [ Html.Events.onClick (UniversitySchool SchoolNone) ]
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
                    ++ (case university of
                            UniversitySchool _ ->
                                [ Html.Events.onClick
                                    (UniversityGraduate
                                        (GraduateSelect
                                            Nothing
                                            (Just SchoolNone)
                                        )
                                    )
                                ]

                            UniversityGraduate _ ->
                                []
                       )
                )
                [ Html.text "院生" ]
            ]
        ]


{-| 研究科に所属していない人のフォーム
-}
schoolView : SchoolSelect -> List ( String, Html.Html SchoolSelect )
schoolView schoolSelect =
    let
        schoolForm =
            ( "selectSchool"
            , selectSchoolView (schoolSelectGetSchool schoolSelect)
                |> Html.map
                    (\m ->
                        case m of
                            Just school ->
                                case Data.University.schoolToOnlyOneDepartment school of
                                    Just schoolAndDepartment ->
                                        SchoolSelectSchoolAndDepartment schoolAndDepartment

                                    Nothing ->
                                        SchoolSelectSchool school

                            Nothing ->
                                SchoolNone
                    )
            )

        departmentSelectForm school =
            case selectDepartmentView school (schoolSelectGetDepartment schoolSelect) of
                Just v ->
                    Just
                        ( "s=" ++ Data.University.schoolToIdString school
                        , v
                            |> Html.map
                                (\m ->
                                    case m of
                                        Just z ->
                                            SchoolSelectSchoolAndDepartment z

                                        Nothing ->
                                            SchoolSelectSchool school
                                )
                        )

                Nothing ->
                    Nothing
    in
    case schoolSelect of
        SchoolNone ->
            [ schoolForm ]

        SchoolSelectSchool school ->
            case departmentSelectForm school of
                Just departV ->
                    [ schoolForm, departV ]

                Nothing ->
                    [ schoolForm ]

        SchoolSelectSchoolAndDepartment department ->
            case departmentSelectForm (Data.University.schoolFromDepartment department) of
                Just departV ->
                    [ schoolForm, departV ]

                Nothing ->
                    [ schoolForm ]


{-| 研究科に所属している人のフォーム
-}
graduateView : GraduateSelect -> List ( String, Html.Html GraduateSelect )
graduateView (GraduateSelect graduateSelect schoolSelect) =
    [ ( "selectGraduate"
      , selectGraduateView graduateSelect
            |> Html.map (\g -> GraduateSelect g schoolSelect)
      )
    , ( "tsukubaUniversitySchoolOrNo"
      , graduateYesNoTsukubaView (schoolSelect /= Nothing)
            |> Html.map
                (always
                    (GraduateSelect graduateSelect
                        (case schoolSelect of
                            Just _ ->
                                Nothing

                            Nothing ->
                                Just SchoolNone
                        )
                    )
                )
      )
    ]
        ++ (case schoolSelect of
                Just school ->
                    schoolView school
                        |> List.map (Tuple.mapSecond (Html.map (\s -> GraduateSelect graduateSelect (Just s))))

                Nothing ->
                    []
           )


selectGraduateView : Maybe Data.University.Graduate -> Html.Html (Maybe Data.University.Graduate)
selectGraduateView graduateMaybe =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.class "form-label"
            , Html.Attributes.for graduateSelectId
            ]
            [ Html.text "研究科" ]
        , Html.select
            [ Html.Attributes.class "form-menu"
            , Html.Attributes.id graduateSelectId
            , Html.Events.on "change" selectGraduateDecoder
            ]
            ([ Html.option [] [ Html.text "--選択してください--" ] ]
                ++ (Data.University.graduateAllValue
                        |> List.map
                            (\s ->
                                Html.option [] [ Html.text (Data.University.graduateToJapaneseString s) ]
                            )
                   )
            )
        ]


graduateSelectId : String
graduateSelectId =
    "signUp-selectGraduate"


selectGraduateDecoder : Json.Decode.Decoder (Maybe Data.University.Graduate)
selectGraduateDecoder =
    Json.Decode.at
        [ "target", "selectedIndex" ]
        Json.Decode.int
        |> Json.Decode.map (\index -> Data.University.graduateAllValue |> Array.fromList |> Array.get (index - 1))


{-| 筑波大学に所属していたかしていなかったか
Boolは左(筑波大学所属していた)を選択しているか
-}
graduateYesNoTsukubaView : Bool -> Html.Html ()
graduateYesNoTsukubaView leftSelect =
    Html.div
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
                            [ Html.Events.onClick () ]
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
                            [ Html.Events.onClick () ]

                        else
                            []
                       )
                )
                [ Html.text "筑波大学に所属していなかった" ]
            ]
        ]


{-| 学群の選択
-}
selectSchoolView : Maybe Data.University.School -> Html.Html (Maybe Data.University.School)
selectSchoolView schoolMaybe =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.class "form-label"
            , Html.Attributes.for schoolSelectId
            ]
            [ Html.text "学群" ]
        , Html.select
            [ Html.Attributes.class "form-menu"
            , Html.Attributes.id schoolSelectId
            , Html.Events.on "change" selectSchoolDecoder
            ]
            ([ Html.option [] [ Html.text "--選択してください--" ] ]
                ++ (Data.University.schoolAll
                        |> List.map
                            (\s ->
                                Html.option [] [ Html.text (Data.University.schoolToJapaneseString s) ]
                            )
                   )
            )
        ]


schoolSelectId : String
schoolSelectId =
    "signUp-selectSchool"


selectSchoolDecoder : Json.Decode.Decoder (Maybe Data.University.School)
selectSchoolDecoder =
    Json.Decode.at
        [ "target", "selectedIndex" ]
        Json.Decode.int
        |> Json.Decode.map (\index -> Data.University.schoolAll |> Array.fromList |> Array.get (index - 1))


{-| 学類の選択
-}
selectDepartmentView : Data.University.School -> Maybe Data.University.SchoolAndDepartment -> Maybe (Html.Html (Maybe Data.University.SchoolAndDepartment))
selectDepartmentView school departmentMaybe =
    case Data.University.schoolToDepartmentList school of
        [] ->
            Nothing

        departmentList ->
            Just
                (Html.div
                    []
                    [ Html.label
                        [ Html.Attributes.class "form-label"
                        , Html.Attributes.for departmentSelectId
                        ]
                        [ Html.text "学類" ]
                    , Html.select
                        [ Html.Attributes.class "form-menu"
                        , Html.Attributes.id departmentSelectId
                        , Html.Events.on "change" (selectDepartmentDecoder school)
                        ]
                        ([ Html.option [] [ Html.text "--選択してください--" ] ]
                            ++ (departmentList
                                    |> List.map
                                        (\s ->
                                            Html.option [] [ Html.text (Data.University.departmentToJapaneseString s |> Maybe.withDefault "?") ]
                                        )
                               )
                        )
                    ]
                )


departmentSelectId : String
departmentSelectId =
    "signUp-selectDepartment"


selectDepartmentDecoder : Data.University.School -> Json.Decode.Decoder (Maybe Data.University.SchoolAndDepartment)
selectDepartmentDecoder school =
    Json.Decode.at
        [ "target", "selectedIndex" ]
        Json.Decode.int
        |> Json.Decode.map
            (\index -> Data.University.schoolToDepartmentList school |> Array.fromList |> Array.get (index - 1))
