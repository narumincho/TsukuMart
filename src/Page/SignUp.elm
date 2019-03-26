module Page.SignUp exposing
    ( Emit(..)
    , Model
    , Msg(..)
    , initModel
    , sentConfirmTokenModel
    , update
    , view
    )

{-| Sign Up 新規登録画面
-}

import Api
import Array
import Data.EmailAddress
import Data.Password
import Data.SAddress
import Data.StudentId
import Data.University
import Html
import Html.Attributes
import Html.Events
import Html.Keyed
import Json.Decode
import Tab


type Model
    = Normal
        -- 新規登録入力フォーム
        { sAddressAndPassword : SAddressAndPassword
        , university : UniversitySelect
        , nickName : String
        }
    | SentSingUpData Data.EmailAddress.EmailAddress (Maybe (Result Api.SignUpResponseError Api.SignUpResponseOk))
    | SentConfirmTokenError (Maybe Api.SignUpConfirmResponseError)


type UniversitySelect
    = UniversitySchool SchoolSelect
    | UniversityGraduate GraduateSelect


type SchoolSelect
    = UniversitySchoolNone
    | UniversitySchoolSelectSchool Data.University.School
    | UniversitySchoolSelectSchoolAndDepartment Data.University.SchoolAndDepartment


type GraduateSelect
    = UniversityGraduateSelect (Maybe Data.University.Graduate) (Maybe SchoolSelect)


type SAddressAndPassword
    = StudentHasSAddress
        { studentIdOrTsukubaEmailAddress : AnalysisStudentIdOrSAddressResult
        , password : Result Data.Password.Error Data.Password.Password
        }
    | NewStudent
        { emailAddress : Maybe Data.EmailAddress.EmailAddress
        , imageDataUrl : Maybe String
        , password : Result Data.Password.Error Data.Password.Password
        }


{-| ここから発生するイベント
-}
type Emit
    = EmitCatchStudentImage String
    | EmitSignUp Api.SignUpRequest
    | EmitSendConfirmToken String


type Msg
    = InputStudentIdOrEmailAddress String
    | CatchStudentImage String
    | ReceiveImageDataUrl String
    | InputSAddressAndPassword SAddressAndPassword
    | InputUniversity UniversitySelect
    | InputPassword String
    | InputNickName String
    | SignUp Api.SignUpRequest
    | SignUpResponse (Result Api.SignUpResponseError Api.SignUpResponseOk)
    | SendConfirmToken Api.Token


{-| すべて空白の新規登録画面を表示するためのModel
-}
initModel : Model
initModel =
    Normal
        { sAddressAndPassword =
            StudentHasSAddress
                { studentIdOrTsukubaEmailAddress = analysisStudentIdOrSAddress ""
                , password = Data.Password.passwordFromString ""
                }
        , university = UniversitySchool UniversitySchoolNone
        , nickName = ""
        }


sentConfirmTokenModel : Api.SignUpConfirmResponseError -> Model
sentConfirmTokenModel signUpResponseError =
    SentConfirmTokenError (Just signUpResponseError)


update : Msg -> Model -> ( Model, List Emit )
update msg model =
    case msg of
        InputStudentIdOrEmailAddress string ->
            ( case model of
                Normal rec ->
                    Normal { rec | sAddressAndPassword = inputStudentIdOrEmailAddress string rec.sAddressAndPassword }

                _ ->
                    model
            , []
            )

        CatchStudentImage idString ->
            ( model
            , [ EmitCatchStudentImage idString ]
            )

        ReceiveImageDataUrl dataUrl ->
            ( case model of
                Normal rec ->
                    Normal { rec | sAddressAndPassword = receiveImageDataUrl dataUrl rec.sAddressAndPassword }

                _ ->
                    model
            , []
            )

        InputSAddressAndPassword sAddressAndPassword ->
            ( case model of
                Normal rec ->
                    Normal { rec | sAddressAndPassword = sAddressAndPassword }

                _ ->
                    model
            , []
            )

        InputUniversity universitySelect ->
            ( case model of
                Normal rec ->
                    Normal { rec | university = universitySelect }

                _ ->
                    model
            , []
            )

        InputPassword string ->
            ( case model of
                Normal rec ->
                    Normal
                        { rec
                            | sAddressAndPassword =
                                case rec.sAddressAndPassword of
                                    NewStudent r ->
                                        NewStudent
                                            { r | password = Data.Password.passwordFromString string }

                                    StudentHasSAddress r ->
                                        StudentHasSAddress
                                            { r | password = Data.Password.passwordFromString string }
                        }

                _ ->
                    model
            , []
            )

        InputNickName string ->
            ( case model of
                Normal rec ->
                    Normal
                        { rec
                            | nickName = String.trim string
                        }

                _ ->
                    model
            , []
            )

        SignUp signUpRequest ->
            ( SentSingUpData signUpRequest.emailAddress Nothing
            , [ EmitSignUp signUpRequest ]
            )

        SignUpResponse result ->
            ( case model of
                SentSingUpData emailAddress _ ->
                    SentSingUpData emailAddress (Just result)

                _ ->
                    model
            , []
            )

        SendConfirmToken token ->
            ( SentConfirmTokenError Nothing
            , [ EmitSendConfirmToken token ]
            )


inputStudentIdOrEmailAddress : String -> SAddressAndPassword -> SAddressAndPassword
inputStudentIdOrEmailAddress string sAddressAndPassword =
    case sAddressAndPassword of
        StudentHasSAddress r ->
            StudentHasSAddress
                { r
                    | studentIdOrTsukubaEmailAddress =
                        analysisStudentIdOrSAddress string
                }

        NewStudent r ->
            NewStudent
                { r
                    | emailAddress = analysisEmailAddress string
                }


receiveImageDataUrl : String -> SAddressAndPassword -> SAddressAndPassword
receiveImageDataUrl string sAddressAndPassword =
    case sAddressAndPassword of
        StudentHasSAddress _ ->
            sAddressAndPassword

        NewStudent rec ->
            NewStudent
                { rec | imageDataUrl = Just string }



{- =====================================================
                       View 表示
   =====================================================
-}


{-| 新規登録画面の表示
-}
view : Model -> ( String, Tab.Tab Msg, List (Html.Html Msg) )
view userSignUpPage =
    let
        ( tabText, mainView ) =
            case userSignUpPage of
                Normal { sAddressAndPassword, university, nickName } ->
                    ( "新規登録", normalView sAddressAndPassword university nickName )

                SentSingUpData emailAddress maybe ->
                    ( "新規登録情報の送信", sentSingUpDataView emailAddress maybe )

                SentConfirmTokenError signUpConfirmResponseErrorMaybe ->
                    ( "認証トークンの送信", sentConfirmTokenView signUpConfirmResponseErrorMaybe )
    in
    ( "新規登録"
    , Tab.single tabText
    , [ Html.div
            [ Html.Attributes.class "container" ]
            [ mainView ]
      ]
    )


normalView : SAddressAndPassword -> UniversitySelect -> String -> Html.Html Msg
normalView sAddressAndPassword university nickName =
    Html.Keyed.node "form"
        [ Html.Attributes.class "signUp" ]
        ([ ( "s_or_nos"
           , sAddressView sAddressAndPassword
                |> Html.map InputSAddressAndPassword
           )
         ]
            ++ (case sAddressAndPassword of
                    StudentHasSAddress { studentIdOrTsukubaEmailAddress, password } ->
                        studentHasSAddressFormList studentIdOrTsukubaEmailAddress password

                    NewStudent { emailAddress, imageDataUrl, password } ->
                        newStudentForm emailAddress imageDataUrl password
               )
            ++ nickNameForm nickName
            ++ (signUpUniversityView university
                    |> List.map (Tuple.mapSecond (Html.map InputUniversity))
               )
            ++ [ ( "submit", signUpSubmitButton (getSignUpRequest sAddressAndPassword university nickName) ) ]
        )


{-| sアドを持っているか持っていないかを選択するフォーム
-}
sAddressView : SAddressAndPassword -> Html.Html SAddressAndPassword
sAddressView userSignUpSAddressAndPassword =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.class "signUp-label" ]
            [ Html.text "sアドを" ]
        , sAddressSelectView userSignUpSAddressAndPassword
        ]


sAddressSelectView : SAddressAndPassword -> Html.Html SAddressAndPassword
sAddressSelectView userSignUpSAddressAndPassword =
    let
        leftSelect =
            case userSignUpSAddressAndPassword of
                StudentHasSAddress _ ->
                    True

                NewStudent _ ->
                    False
    in
    Html.div
        [ Html.Attributes.class "signUp-select" ]
        [ Html.div
            ([ Html.Attributes.classList
                [ ( "signUp-select-item", not leftSelect )
                , ( "signUp-select-itemSelect", leftSelect )
                ]
             , Html.Attributes.style "border-radius" ".4rem 0 0 .4rem"
             ]
                ++ (case userSignUpSAddressAndPassword of
                        StudentHasSAddress _ ->
                            []

                        NewStudent { password } ->
                            [ Html.Events.onClick
                                (StudentHasSAddress
                                    { studentIdOrTsukubaEmailAddress = analysisStudentIdOrSAddress ""
                                    , password = password
                                    }
                                )
                            ]
                   )
            )
            [ Html.text "持っている" ]
        , Html.div
            ([ Html.Attributes.classList
                [ ( "signUp-select-item", leftSelect )
                , ( "signUp-select-itemSelect", not leftSelect )
                ]
             , Html.Attributes.style "border-radius" "0 .4rem .4rem 0"
             ]
                ++ (case userSignUpSAddressAndPassword of
                        StudentHasSAddress { password } ->
                            [ Html.Events.onClick
                                (NewStudent
                                    { emailAddress = [] |> Data.EmailAddress.fromCharList
                                    , imageDataUrl = Nothing
                                    , password = password
                                    }
                                )
                            ]

                        NewStudent _ ->
                            []
                   )
            )
            [ Html.text "持っていない" ]
        ]


studentHasSAddressFormList : AnalysisStudentIdOrSAddressResult -> Result Data.Password.Error Data.Password.Password -> List ( String, Html.Html Msg )
studentHasSAddressFormList analysisStudentIdOrEmailAddressResult password =
    [ ( "sAddressFrom"
      , Html.div
            []
            [ Html.label
                [ Html.Attributes.class "signUp-label"
                , Html.Attributes.for "signUpStudentIdOrTsukubaEmail"
                ]
                [ Html.text "学籍番号か ～@～.tsukuba.ac.jpのメールアドレス" ]
            , Html.input
                [ Html.Attributes.class "signUp-input"
                , Html.Attributes.id "signUpStudentIdOrTsukubaEmail"
                , Html.Attributes.attribute "autocomplete" "username"
                , Html.Events.onInput InputStudentIdOrEmailAddress
                ]
                []
            , Html.div
                [ Html.Attributes.class "signUp-description" ]
                [ Html.text
                    (case analysisStudentIdOrEmailAddressResult of
                        ANone ->
                            "学籍番号は20から始まる9桁の数字、筑波大学のメールアドレスはs1234567@s.tsukuba.ac.jpのような形のメールアドレス"

                        AStudentId studentId ->
                            "学籍番号 "
                                ++ Data.StudentId.toStringWith20 studentId
                                ++ " "
                                ++ (studentId
                                        |> Data.SAddress.fromStundetId
                                        |> Data.EmailAddress.fromSAddress
                                        |> Data.EmailAddress.toString
                                   )
                                ++ "にメールを送信します"

                        APartStudentId partStudentId ->
                            "学籍番号 "
                                ++ Data.StudentId.partStudentIdToStringWith20 partStudentId

                        ASAddress sAddress ->
                            "筑波大学のメールアドレス " ++ Data.SAddress.toEmailAddressString sAddress

                        AEmailButIsNotTsukuba ->
                            "筑波大学のメールアドレスではありません"
                    )
                ]
            ]
      )
    , ( "sAddressPassword", passwordForm password )
    ]


{-| 新規登録画面のsアドを持っているひとの入力の解析
-}
analysisStudentIdOrSAddress : String -> AnalysisStudentIdOrSAddressResult
analysisStudentIdOrSAddress string =
    let
        charList =
            String.toList (String.trim string)
    in
    case Data.StudentId.fromCharList charList of
        Just studentId ->
            AStudentId studentId

        Nothing ->
            case Data.StudentId.partStudentIdFromCharList charList of
                Just partStudentId ->
                    APartStudentId partStudentId

                Nothing ->
                    case Data.SAddress.fromCharList charList of
                        Just sAddress ->
                            ASAddress sAddress

                        Nothing ->
                            case Data.EmailAddress.fromCharList charList of
                                Just _ ->
                                    AEmailButIsNotTsukuba

                                Nothing ->
                                    ANone


type AnalysisStudentIdOrSAddressResult
    = ANone
    | AStudentId Data.StudentId.StudentId
    | ASAddress Data.SAddress.SAddress
    | APartStudentId Data.StudentId.PartStudentId
    | AEmailButIsNotTsukuba


analysisEmailAddress : String -> Maybe Data.EmailAddress.EmailAddress
analysisEmailAddress string =
    string
        |> String.trim
        |> String.toList
        |> Data.EmailAddress.fromCharList


newStudentForm : Maybe Data.EmailAddress.EmailAddress -> Maybe String -> Result Data.Password.Error Data.Password.Password -> List ( String, Html.Html Msg )
newStudentForm emailAddress imageUrlMaybe password =
    [ ( "addressForm"
      , Html.div
            []
            [ Html.label
                [ Html.Attributes.class "signUp-label"
                , Html.Attributes.for "signUpEmail"
                ]
                [ Html.text "登録用メールアドレス" ]
            , Html.input
                [ Html.Attributes.class "signUp-input"
                , Html.Attributes.type_ "email"
                , Html.Attributes.id "signUpEmail"
                , Html.Attributes.attribute "autocomplete" "email"
                , Html.Events.onInput InputStudentIdOrEmailAddress
                ]
                []
            , Html.div
                [ Html.Attributes.class "signUp-description" ]
                [ Html.text
                    (case emailAddress of
                        Just address ->
                            Data.EmailAddress.toString address
                                ++ "に登録メールを送信します"

                        Nothing ->
                            "メールアドレスを入力してください"
                    )
                ]
            ]
      )
    , ( "passwordEmail", passwordForm password )
    , ( "cardImage"
      , Html.div
            []
            [ Html.label
                [ Html.Attributes.class "signUp-label"
                , Html.Attributes.for "signUpImage"
                ]
                [ Html.text "学生証の写真" ]
            , Html.input
                [ Html.Attributes.type_ "file"
                , Html.Attributes.accept "image/png, image/jpeg"
                , Html.Attributes.class "signUp-input"
                , Html.Attributes.id "signUpImage"
                , Html.Attributes.attribute "autocomplete" "studentIdImage"
                , Html.Events.on "change" (Json.Decode.succeed (CatchStudentImage "signUpImage"))
                ]
                []
            , Html.img
                ([ Html.Attributes.class "signUp-image"
                 ]
                    ++ (case imageUrlMaybe of
                            Just imageUrl ->
                                [ Html.Attributes.src imageUrl ]

                            Nothing ->
                                []
                       )
                )
                []
            ]
      )
    ]


{-| 新規登録のパスワード入力フォーム
-}
passwordForm : Result Data.Password.Error Data.Password.Password -> Html.Html Msg
passwordForm passwordResult =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.class "signUp-label"
            , Html.Attributes.for "password"
            ]
            [ Html.text "パスワード" ]
        , Html.input
            [ Html.Attributes.class "signUp-input"
            , Html.Attributes.id "password"
            , Html.Attributes.type_ "password"
            , Html.Attributes.minlength 9
            , Html.Attributes.maxlength 50
            , Html.Attributes.attribute "autocomplete" "new-password"
            , Html.Events.onInput InputPassword
            ]
            []
        , Html.div
            [ Html.Attributes.class "signUp-description" ]
            [ Html.text
                (case passwordResult of
                    Ok password ->
                        Data.Password.toString password

                    Err error ->
                        Data.Password.errorMessage error
                )
            ]
        ]


{-| 表示名フォーム
-}
nickNameForm : String -> List ( String, Html.Html Msg )
nickNameForm nickName =
    [ ( "nickNameForm"
      , Html.div
            []
            ([ Html.label
                [ Html.Attributes.class "signUp-label"
                , Html.Attributes.for "nickNameForm"
                ]
                [ Html.text "表示名" ]
             , Html.input
                [ Html.Attributes.class "signUp-input"
                , Html.Attributes.id "nickNameForm"
                , Html.Attributes.attribute "autocomplete" "nickname"
                , Html.Events.onInput InputNickName
                ]
                []
             ]
                ++ (if String.length nickName < 1 then
                        [ Html.text "表示名は 1文字以上である必要があります" ]

                    else if 50 < String.length nickName then
                        [ Html.text "表示名は 50文字以内である必要があります" ]

                    else
                        []
                   )
            )
      )
    ]


{-| 新規登録の研究科学群学類入力フォーム
-}
signUpUniversityView : UniversitySelect -> List ( String, Html.Html UniversitySelect )
signUpUniversityView signUpSchool =
    [ ( "schoolOrGraduate", signUpUniversityViewSchoolOrGraduate signUpSchool )
    ]
        ++ (case signUpSchool of
                UniversitySchool schoolSelect ->
                    signUpUniversityViewSchool schoolSelect
                        |> List.map (Tuple.mapSecond (Html.map UniversitySchool))

                UniversityGraduate graduateSelect ->
                    signUpUniversityViewGraduate graduateSelect
                        |> List.map (Tuple.mapSecond (Html.map UniversityGraduate))
           )


{-| 研究科に所属しているかしていないか?
-}
signUpUniversityViewSchoolOrGraduate : UniversitySelect -> Html.Html UniversitySelect
signUpUniversityViewSchoolOrGraduate university =
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
            [ Html.Attributes.class "signUp-label" ]
            [ Html.text "所属" ]
        , Html.div
            [ Html.Attributes.class "signUp-select" ]
            [ Html.div
                ([ Html.Attributes.classList
                    [ ( "signUp-select-item", not leftSelect )
                    , ( "signUp-select-itemSelect", leftSelect )
                    ]
                 , Html.Attributes.style "border-radius" ".4rem 0 0 .4rem"
                 ]
                    ++ (case university of
                            UniversitySchool _ ->
                                []

                            UniversityGraduate _ ->
                                [ Html.Events.onClick (UniversitySchool UniversitySchoolNone) ]
                       )
                )
                [ Html.text "学群生" ]
            , Html.div
                ([ Html.Attributes.classList
                    [ ( "signUp-select-item", leftSelect )
                    , ( "signUp-select-itemSelect", not leftSelect )
                    ]
                 , Html.Attributes.style "border-radius" "0 .4rem .4rem 0"
                 ]
                    ++ (case university of
                            UniversitySchool _ ->
                                [ Html.Events.onClick
                                    (UniversityGraduate
                                        (UniversityGraduateSelect
                                            Nothing
                                            (Just UniversitySchoolNone)
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
signUpUniversityViewSchool : SchoolSelect -> List ( String, Html.Html SchoolSelect )
signUpUniversityViewSchool schoolSelect =
    let
        schoolView =
            ( "selectSchool"
            , signUpUniversityViewSelectSchool
                |> Html.map
                    (\m ->
                        case m of
                            Just school ->
                                case Data.University.schoolToOnlyOneDepartment school of
                                    Just schoolAndDepartment ->
                                        UniversitySchoolSelectSchoolAndDepartment schoolAndDepartment

                                    Nothing ->
                                        UniversitySchoolSelectSchool school

                            Nothing ->
                                UniversitySchoolNone
                    )
            )

        departmentSelectView school =
            case signUpUniversityViewSelectDepartment school of
                Just v ->
                    Just
                        ( "s=" ++ Data.University.schoolToIdString school
                        , v
                            |> Html.map
                                (\m ->
                                    case m of
                                        Just z ->
                                            UniversitySchoolSelectSchoolAndDepartment z

                                        Nothing ->
                                            UniversitySchoolSelectSchool school
                                )
                        )

                Nothing ->
                    Nothing
    in
    case schoolSelect of
        UniversitySchoolNone ->
            [ schoolView ]

        UniversitySchoolSelectSchool school ->
            case departmentSelectView school of
                Just departV ->
                    [ schoolView, departV ]

                Nothing ->
                    [ schoolView ]

        UniversitySchoolSelectSchoolAndDepartment department ->
            case departmentSelectView (Data.University.schoolFromDepartment department) of
                Just departV ->
                    [ schoolView, departV ]

                Nothing ->
                    [ schoolView ]


{-| 研究科に所属している人のフォーム
-}
signUpUniversityViewGraduate : GraduateSelect -> List ( String, Html.Html GraduateSelect )
signUpUniversityViewGraduate univAndGraduateSelect =
    let
        (UniversityGraduateSelect graduateSelect schoolSelect) =
            univAndGraduateSelect
    in
    [ ( "selectGraduate"
      , signUpUniversityViewSelectGraduate
            |> Html.map (\g -> UniversityGraduateSelect g schoolSelect)
      )
    , ( "tsukubaUniversitySchoolOrNo"
      , signUpUniversityViewGraduateYesNoTsukuba (schoolSelect /= Nothing)
            |> Html.map
                (always
                    (UniversityGraduateSelect graduateSelect
                        (case schoolSelect of
                            Just _ ->
                                Nothing

                            Nothing ->
                                Just UniversitySchoolNone
                        )
                    )
                )
      )
    ]
        ++ (case schoolSelect of
                Just school ->
                    signUpUniversityViewSchool school
                        |> List.map (Tuple.mapSecond (Html.map (\s -> UniversityGraduateSelect graduateSelect (Just s))))

                Nothing ->
                    []
           )


signUpUniversityViewSelectGraduate : Html.Html (Maybe Data.University.Graduate)
signUpUniversityViewSelectGraduate =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.class "signUp-label"
            , Html.Attributes.for "signUp-selectGraduate"
            ]
            [ Html.text "研究科" ]
        , Html.select
            [ Html.Attributes.class "signUp-menu"
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
signUpUniversityViewGraduateYesNoTsukuba : Bool -> Html.Html ()
signUpUniversityViewGraduateYesNoTsukuba leftSelect =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.class "signUp-label" ]
            [ Html.text "院進前の所属" ]
        , Html.div
            [ Html.Attributes.class "signUp-select" ]
            [ Html.div
                ([ Html.Attributes.classList
                    [ ( "signUp-select-item", not leftSelect )
                    , ( "signUp-select-itemSelect", leftSelect )
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
                    [ ( "signUp-select-item", leftSelect )
                    , ( "signUp-select-itemSelect", not leftSelect )
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
signUpUniversityViewSelectSchool : Html.Html (Maybe Data.University.School)
signUpUniversityViewSelectSchool =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.class "signUp-label"
            , Html.Attributes.for "signUp-selectSchool"
            ]
            [ Html.text "学群" ]
        , Html.select
            [ Html.Attributes.class "signUp-menu"
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
signUpUniversityViewSelectDepartment : Data.University.School -> Maybe (Html.Html (Maybe Data.University.SchoolAndDepartment))
signUpUniversityViewSelectDepartment school =
    case Data.University.schoolToDepartmentList school of
        [] ->
            Nothing

        departmentList ->
            Just
                (Html.div
                    []
                    [ Html.label
                        [ Html.Attributes.class "signUp-label"
                        , Html.Attributes.for "signUp-selectDepartment"
                        ]
                        [ Html.text "学類" ]
                    , Html.select
                        [ Html.Attributes.class "signUp-menu"
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


signUpSubmitButton : Maybe Api.SignUpRequest -> Html.Html Msg
signUpSubmitButton signUpRequestMaybe =
    Html.div
        []
        [ Html.button
            ([ Html.Attributes.class "mainButton"
             , Html.Attributes.disabled (signUpRequestMaybe == Nothing)
             ]
                ++ (case signUpRequestMaybe of
                        Just signUpRequest ->
                            [ Html.Events.stopPropagationOn "click"
                                (Json.Decode.succeed ( SignUp signUpRequest, True ))
                            ]

                        Nothing ->
                            []
                   )
            )
            [ Html.text "新規登録" ]
        ]


{-| 画面の情報から新規登録できる情報を入力しているかと、新規登録に必要なデータを取りだす
-}
getSignUpRequest : SAddressAndPassword -> UniversitySelect -> String -> Maybe Api.SignUpRequest
getSignUpRequest sAddressAndPassword university nickName =
    case ( getSignUpRequestEmailAddressAndPasswordAndImage sAddressAndPassword, getSignUpRequestUniversity university ) of
        ( Just { emailAddress, password, image }, Just universityData ) ->
            if 1 <= String.length nickName && String.length nickName <= 50 then
                Just
                    { emailAddress = emailAddress
                    , pass = password
                    , image = image
                    , university = universityData
                    , nickName = nickName
                    }

            else
                Nothing

        ( _, _ ) ->
            Nothing


getSignUpRequestEmailAddressAndPasswordAndImage : SAddressAndPassword -> Maybe { emailAddress : Data.EmailAddress.EmailAddress, password : Data.Password.Password, image : Maybe String }
getSignUpRequestEmailAddressAndPasswordAndImage sAddressAndPassword =
    case sAddressAndPassword of
        StudentHasSAddress { studentIdOrTsukubaEmailAddress, password } ->
            case ( studentIdOrTsukubaEmailAddress, password ) of
                ( AStudentId studentId, Ok pass ) ->
                    Just
                        { emailAddress = Data.EmailAddress.fromSAddress (Data.SAddress.fromStundetId studentId)
                        , password = pass
                        , image = Nothing
                        }

                ( ASAddress sAddress, Ok pass ) ->
                    Just
                        { emailAddress = Data.EmailAddress.fromSAddress sAddress
                        , password = pass
                        , image = Nothing
                        }

                _ ->
                    Nothing

        NewStudent { emailAddress, password, imageDataUrl } ->
            case ( emailAddress, password, imageDataUrl ) of
                ( Just address, Ok pass, Just image ) ->
                    Just
                        { emailAddress = address
                        , password = pass
                        , image = Just image
                        }

                ( _, _, _ ) ->
                    Nothing


getSignUpRequestUniversity : UniversitySelect -> Maybe Data.University.University
getSignUpRequestUniversity universitySelect =
    case universitySelect of
        UniversitySchool (UniversitySchoolSelectSchoolAndDepartment schoolAndDepartment) ->
            Just (Data.University.NotGraduate schoolAndDepartment)

        UniversityGraduate (UniversityGraduateSelect (Just graduate) (Just (UniversitySchoolSelectSchoolAndDepartment schoolAndDepartment))) ->
            Just (Data.University.GraduateTsukuba graduate schoolAndDepartment)

        UniversityGraduate (UniversityGraduateSelect (Just graduate) Nothing) ->
            Just (Data.University.GraduateNotTsukuba graduate)

        _ ->
            Nothing


{-| 新規登録のボタンを押した後の画面
-}
sentSingUpDataView : Data.EmailAddress.EmailAddress -> Maybe (Result Api.SignUpResponseError Api.SignUpResponseOk) -> Html.Html Msg
sentSingUpDataView emailAddress signUpResultMaybe =
    case signUpResultMaybe of
        Just signUpResult ->
            signUpResultToString emailAddress signUpResult

        Nothing ->
            Html.div [] [ Html.text "新規登録の情報を送信中" ]


signUpResultToString : Data.EmailAddress.EmailAddress -> Result Api.SignUpResponseError Api.SignUpResponseOk -> Html.Html Msg
signUpResultToString emailAddress signUpResult =
    case signUpResult of
        Ok (Api.SignUpResponseOk token) ->
            Html.div [ Html.Attributes.class "signUp" ]
                [ Html.text
                    ("送信完了。"
                        ++ Data.EmailAddress.toString emailAddress
                        ++ "にメールを送信しました。届いたメールのリンクをクリックして認証をしてください"
                        ++ "token = \""
                        ++ token
                        ++ "\""
                    )
                , Html.div
                    [ Html.Events.onClick (SendConfirmToken token)
                    , Html.Attributes.style "border" "solid 2px black"
                    , Html.Attributes.style "padding" "4px"
                    ]
                    [ Html.text "confirm_tokenを送信" ]
                ]

        Err Api.SignUpErrorAlreadySignUp ->
            Html.div [] [ Html.text "すでにあなたは登録されています" ]

        Err Api.SignUpErrorBadUrl ->
            Html.div [] [ Html.text "正しいURLが指定されなかった" ]

        Err Api.SignUpErrorTimeout ->
            Html.div [] [ Html.text "タイムアウトエラー。回線が混雑しています" ]

        Err Api.SignUpErrorNetworkError ->
            Html.div [] [ Html.text "ネットワークエラー。接続が切れている可能性があります" ]

        Err Api.SignUpInvalidData ->
            Html.div [] [ Html.text "不正なリクエストをした疑いがあります" ]

        Err Api.SignUpError ->
            Html.div [] [ Html.text "サーバーの回答を理解することができませんでした" ]


sentConfirmTokenView : Maybe Api.SignUpConfirmResponseError -> Html.Html Msg
sentConfirmTokenView signUpResponseErrorMaybe =
    Html.text
        (case signUpResponseErrorMaybe of
            Just Api.SignUpConfirmResponseErrorAlreadyConfirmed ->
                "すでにこの認証トークンは送られています"

            Just Api.SignUpConfirmResponseError ->
                "認証トークン送信に予期せぬエラーが発生しました"

            Nothing ->
                "認証トークン送信中……"
        )
