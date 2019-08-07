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
import Page.Component.GraduateSelect as GraduateSelect
import Page.Component.SchoolSelect as SchoolSelect
import Page.Style


type Model
    = School SchoolSelect.Model
    | GraduateTsukuba
        { graduate : GraduateSelect.Model
        , school : SchoolSelect.Model
        }
    | GraduateNoTsukuba GraduateSelect.Model


type Msg
    = SwitchGraduate
    | SwitchSchool
    | SwitchGraduateTsukuba
    | SwitchGraduateNoTsukuba
    | MsgByGraduate GraduateSelect.Msg
    | MsgBySchool SchoolSelect.Msg


type Cmd
    = CmdChangeSelectedIndex { id : String, index : Int }
    | CmdBySchoolSelect SchoolSelect.Cmd
    | CmdByGraduateSelect GraduateSelect.Cmd


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

                ( graduateModel, graduateCmd ) =
                    GraduateSelect.initSelected graduate
            in
            ( GraduateTsukuba
                { graduate = graduateModel
                , school = schoolModel
                }
            , (graduateCmd |> List.map CmdByGraduateSelect)
                ++ (schoolCmd |> List.map CmdBySchoolSelect)
            )

        University.GraduateNoTsukuba graduate ->
            let
                ( graduateModel, graduateCmd ) =
                    GraduateSelect.initSelected graduate
            in
            ( GraduateNoTsukuba graduateModel
            , graduateCmd |> List.map CmdByGraduateSelect
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
            case ( GraduateSelect.getGraduate graduate, SchoolSelect.getDepartment school ) of
                ( Just g, Just department ) ->
                    Just (University.GraduateTsukuba g department)

                ( _, _ ) ->
                    Nothing

        GraduateNoTsukuba graduate ->
            GraduateSelect.getGraduate graduate
                |> Maybe.map University.GraduateNoTsukuba


update : Msg -> Model -> ( Model, List Cmd )
update msg model =
    case ( msg, model ) of
        ( SwitchGraduate, School schoolSelect ) ->
            let
                ( graduateModel, graduateCmd ) =
                    GraduateSelect.initNone
            in
            ( GraduateTsukuba
                { school = schoolSelect
                , graduate = graduateModel
                }
            , graduateCmd |> List.map CmdByGraduateSelect
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

        ( MsgByGraduate graduateMsg, GraduateTsukuba rec ) ->
            ( GraduateTsukuba
                { rec
                    | graduate =
                        GraduateSelect.update graduateMsg rec.graduate
                }
            , []
            )

        ( MsgByGraduate graduateMsg, GraduateNoTsukuba graduateModel ) ->
            ( GraduateNoTsukuba (GraduateSelect.update graduateMsg graduateModel)
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


graduateTsukubaView : GraduateSelect.Model -> SchoolSelect.Model -> List ( String, Html.Styled.Html Msg )
graduateTsukubaView graduateSelect schoolSelect =
    [ GraduateSelect.view graduateSelect |> Tuple.mapSecond (Html.Styled.map MsgByGraduate)
    , graduateYesNoTsukubaView Page.Style.Left
    ]
        ++ (SchoolSelect.view schoolSelect |> List.map (Tuple.mapSecond (Html.Styled.map MsgBySchool)))


graduateNoTsukubaView : GraduateSelect.Model -> List ( String, Html.Styled.Html Msg )
graduateNoTsukubaView graduateSelect =
    [ GraduateSelect.view graduateSelect |> Tuple.mapSecond (Html.Styled.map MsgByGraduate)
    , graduateYesNoTsukubaView Page.Style.Right
    ]


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
