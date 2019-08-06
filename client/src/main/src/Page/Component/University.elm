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
import Page.Component.SchoolSelect as SchoolSelect
import Page.Style


type Model
    = School SchoolSelect.Model
    | GraduateTsukuba
        { graduate : Maybe University.Graduate
        , school : SchoolSelect.Model
        }
    | GraduateNoTsukuba (Maybe University.Graduate)


type Msg
    = SwitchGraduate
    | SwitchSchool
    | SwitchGraduateTsukuba
    | SwitchGraduateNoTsukuba
    | SelectGraduate (Maybe Int)
    | MsgBySchool SchoolSelect.Msg


type Cmd
    = CmdChangeSelectedIndex { id : String, index : Int }
    | CmdBySchoolSelect SchoolSelect.Cmd


{-| 何も選択していない状態
-}
initModelNone : ( Model, List Cmd )
initModelNone =
    SchoolSelect.initNone
        |> Tuple.mapBoth School (List.map CmdBySchoolSelect)


{-| 最初から選択している状態
-}
initModelFromUniversity : University.University -> ( Model, List Cmd )
initModelFromUniversity university =
    case university of
        University.GraduateTsukuba graduate schoolAndDepartment ->
            let
                ( schoolModel, schoolCmd ) =
                    SchoolSelect.initSelected schoolAndDepartment
            in
            ( GraduateTsukuba
                { graduate = Just graduate
                , school = schoolModel
                }
            , [ CmdChangeSelectedIndex
                    { id = graduateSelectId, index = University.graduateToIndex graduate + 1 }
              ]
                ++ (schoolCmd |> List.map CmdBySchoolSelect)
            )

        University.GraduateNoTsukuba graduate ->
            ( GraduateNoTsukuba (Just graduate)
            , [ CmdChangeSelectedIndex
                    { id = graduateSelectId, index = University.graduateToIndex graduate + 1 }
              ]
            )

        University.NotGraduate schoolAndDepartment ->
            let
                ( schoolModel, schoolCmd ) =
                    SchoolSelect.initSelected schoolAndDepartment
            in
            ( School schoolModel
            , schoolCmd |> List.map CmdBySchoolSelect
            )


{-| 学群学類研究科の情報を取得する
-}
getUniversity : Model -> Maybe University.University
getUniversity universitySelect =
    case universitySelect of
        School schoolSelect ->
            SchoolSelect.getDepartment schoolSelect
                |> Maybe.map University.NotGraduate

        GraduateTsukuba { graduate, school } ->
            case ( graduate, SchoolSelect.getDepartment school ) of
                ( Just g, Just department ) ->
                    Just (University.GraduateTsukuba g department)

                ( _, _ ) ->
                    Nothing

        GraduateNoTsukuba (Just graduate) ->
            Just (University.GraduateNoTsukuba graduate)

        GraduateNoTsukuba Nothing ->
            Nothing


update : Msg -> Model -> ( Model, List Cmd )
update msg model =
    case ( msg, model ) of
        ( SwitchGraduate, School schoolSelect ) ->
            ( GraduateTsukuba
                { school = schoolSelect
                , graduate = Nothing
                }
            , []
            )

        ( SwitchSchool, GraduateTsukuba { school } ) ->
            ( School school
            , []
            )

        ( SwitchSchool, GraduateNoTsukuba _ ) ->
            SchoolSelect.initNone
                |> Tuple.mapBoth School (List.map CmdBySchoolSelect)

        ( SwitchGraduateTsukuba, GraduateNoTsukuba graduate ) ->
            let
                ( schoolSelectModel, schoolSelectCmd ) =
                    SchoolSelect.initNone
            in
            ( GraduateTsukuba
                { school = schoolSelectModel
                , graduate = graduate
                }
            , schoolSelectCmd |> List.map CmdBySchoolSelect
            )

        ( SwitchGraduateNoTsukuba, GraduateTsukuba { graduate } ) ->
            ( GraduateNoTsukuba
                graduate
            , []
            )

        ( SelectGraduate index, GraduateTsukuba rec ) ->
            ( GraduateTsukuba
                { rec
                    | graduate =
                        index
                            |> Maybe.andThen University.graduateFromIndex
                }
            , []
            )

        ( SelectGraduate index, GraduateNoTsukuba _ ) ->
            ( GraduateNoTsukuba (index |> Maybe.andThen University.graduateFromIndex)
            , []
            )

        ( MsgBySchool schoolMsg, School school ) ->
            ( School (SchoolSelect.update schoolMsg school)
            , []
            )

        ( MsgBySchool schoolMsg, GraduateTsukuba rec ) ->
            ( GraduateTsukuba
                { rec
                    | school = SchoolSelect.update schoolMsg rec.school
                }
            , []
            )

        ( _, _ ) ->
            ( model, [] )



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
                :: (SchoolSelect.view schoolSelect
                        |> List.map
                            (Tuple.mapSecond
                                (Html.Styled.map MsgBySchool)
                            )
                   )

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


graduateTsukubaView : Maybe University.Graduate -> SchoolSelect.Model -> List ( String, Html.Styled.Html Msg )
graduateTsukubaView graduateSelect schoolSelect =
    [ graduateSelectView graduateSelect
    , graduateYesNoTsukubaView Page.Style.Left
    ]
        ++ (SchoolSelect.view schoolSelect |> List.map (Tuple.mapSecond (Html.Styled.map MsgBySchool)))


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
