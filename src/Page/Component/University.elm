module Page.Component.University exposing (Select, getUniversity, initSelect, view)

import Array
import Data.University
import Html
import Html.Attributes
import Html.Events
import Json.Decode


type Select
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
initSelect : Select
initSelect =
    UniversitySchool SchoolNone


{-| 学群学類研究科の情報を取得する
-}
getUniversity : Select -> Maybe Data.University.University
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



{- ====================================
                   View
   ====================================
-}


{-| 研究科学群学類入力フォーム
-}
view : Select -> List ( String, Html.Html Select )
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
schoolOrGraduateView : Select -> Html.Html Select
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
            , selectSchoolView
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
            case selectDepartmentView school of
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
      , selectGraduateView
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


selectGraduateView : Html.Html (Maybe Data.University.Graduate)
selectGraduateView =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.class "form-label"
            , Html.Attributes.for "signUp-selectGraduate"
            ]
            [ Html.text "研究科" ]
        , Html.select
            [ Html.Attributes.class "form-menu"
            , Html.Attributes.id "signUp-selectGraduate"
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
selectSchoolView : Html.Html (Maybe Data.University.School)
selectSchoolView =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.class "form-label"
            , Html.Attributes.for "signUp-selectSchool"
            ]
            [ Html.text "学群" ]
        , Html.select
            [ Html.Attributes.class "form-menu"
            , Html.Attributes.id "signUp-selectSchool"
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


selectSchoolDecoder : Json.Decode.Decoder (Maybe Data.University.School)
selectSchoolDecoder =
    Json.Decode.at
        [ "target", "selectedIndex" ]
        Json.Decode.int
        |> Json.Decode.map (\index -> Data.University.schoolAll |> Array.fromList |> Array.get (index - 1))


{-| 学類の選択
-}
selectDepartmentView : Data.University.School -> Maybe (Html.Html (Maybe Data.University.SchoolAndDepartment))
selectDepartmentView school =
    case Data.University.schoolToDepartmentList school of
        [] ->
            Nothing

        departmentList ->
            Just
                (Html.div
                    []
                    [ Html.label
                        [ Html.Attributes.class "form-label"
                        , Html.Attributes.for "signUp-selectDepartment"
                        ]
                        [ Html.text "学類" ]
                    , Html.select
                        [ Html.Attributes.class "form-menu"
                        , Html.Attributes.id "signUp-selectDepartment"
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


selectDepartmentDecoder : Data.University.School -> Json.Decode.Decoder (Maybe Data.University.SchoolAndDepartment)
selectDepartmentDecoder school =
    Json.Decode.at
        [ "target", "selectedIndex" ]
        Json.Decode.int
        |> Json.Decode.map
            (\index -> Data.University.schoolToDepartmentList school |> Array.fromList |> Array.get (index - 1))
