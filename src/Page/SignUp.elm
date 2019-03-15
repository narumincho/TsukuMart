module Page.SignUp exposing (Emit(..), Model, Msg(..), initModel, sentSignUpDataModel, update, view)

{-| Sign Up 新規登録画面
-}

import Api
import Array
import EmailAddress
import Html
import Html.Attributes
import Html.Events
import Html.Keyed
import Json.Decode
import Password
import SAddress
import School
import StudentId
import Tab


type Model
    = Normal
        -- 新規登録入力フォーム
        { sAddressAndPassword : SAddressAndPassword
        , university : UniversitySelect
        }
    | SentSingUpData EmailAddress.EmailAddress (Maybe (Result Api.SignUpResponseError Api.SignUpResponseOk))
    | SentConfirmTokenError (Maybe Api.SignUpResponseError)
    | DeletedAllUser Bool


type UniversitySelect
    = UniversitySchool SchoolSelect
    | UniversityGraduate GraduateSelect


type SchoolSelect
    = UniversitySchoolNone
    | UniversitySchoolSelectSchool School.School
    | UniversitySchoolSelectSchoolAndDepartment School.SchoolAndDepartment


type GraduateSelect
    = UniversityGraduateSelect (Maybe School.Graduate) (Maybe SchoolSelect)


type SAddressAndPassword
    = StudentHasSAddress
        { studentIdOrTsukubaEmailAddress : AnalysisStudentIdOrSAddressResult
        , password : Result Password.Error Password.Password
        }
    | NewStudent
        { emailAddress : Maybe EmailAddress.EmailAddress
        , imageUrl : Maybe String
        , password : Result Password.Error Password.Password
        }


{-| ここから発生するイベント
-}
type Emit
    = EmitChangePage Model
    | EmitInputStudentIdOrEmailAddress String
    | EmitInputStudentImage String
    | EmitInputPassword String
    | EmitSignUp Api.SignUpRequest
    | EmitSendConfirmToken String
    | EmitDeleteUserAll


type Msg
    = InputStudentIdOrEmailAddress String
    | ReceiveImageDataUrl String
    | InputPassword String
    | DeleteUserAll (Result () ())
    | SignUpResponse (Result Api.SignUpResponseError Api.SignUpResponseOk)


{-| すべて空白の新規登録画面を表示するためのModel
-}
initModel : Model
initModel =
    Normal
        { sAddressAndPassword =
            StudentHasSAddress
                { studentIdOrTsukubaEmailAddress = analysisStudentIdOrSAddress ""
                , password = Password.passwordFromString ""
                }
        , university = UniversitySchool UniversitySchoolNone
        }


{-| 新規登録データを送った画面を表示するためのModel
-}
sentSignUpDataModel : EmailAddress.EmailAddress -> Model
sentSignUpDataModel emailAddress =
    SentSingUpData emailAddress Nothing


update : Msg -> Model -> Model
update msg model =
    case model of
        Normal { sAddressAndPassword, university } ->
            case msg of
                InputStudentIdOrEmailAddress string ->
                    case sAddressAndPassword of
                        StudentHasSAddress r ->
                            Normal
                                { sAddressAndPassword =
                                    StudentHasSAddress
                                        { r
                                            | studentIdOrTsukubaEmailAddress =
                                                analysisStudentIdOrSAddress string
                                        }
                                , university = university
                                }

                        NewStudent r ->
                            Normal
                                { sAddressAndPassword =
                                    NewStudent
                                        { r
                                            | emailAddress = analysisEmailAddress string
                                        }
                                , university = university
                                }

                ReceiveImageDataUrl dataUrlString ->
                    case sAddressAndPassword of
                        NewStudent r ->
                            Normal
                                { sAddressAndPassword =
                                    NewStudent
                                        { r | imageUrl = Just dataUrlString }
                                , university = university
                                }

                        _ ->
                            Normal
                                { sAddressAndPassword = sAddressAndPassword
                                , university = university
                                }

                InputPassword string ->
                    Normal
                        { sAddressAndPassword =
                            case sAddressAndPassword of
                                NewStudent r ->
                                    NewStudent
                                        { r | password = Password.passwordFromString string }

                                StudentHasSAddress r ->
                                    StudentHasSAddress
                                        { r | password = Password.passwordFromString string }
                        , university = university
                        }

                DeleteUserAll response ->
                    DeletedAllUser
                        (case response of
                            Ok () ->
                                True

                            Err () ->
                                False
                        )

                _ ->
                    model

        DeletedAllUser _ ->
            model

        SentSingUpData emailAddress _ ->
            case msg of
                SignUpResponse response ->
                    SentSingUpData emailAddress (Just response)

                _ ->
                    model

        SentConfirmTokenError maybe ->
            model


{-| 新規登録画面の表示
-}
view : Model -> ( Tab.Tab Never, List (Html.Html Emit) )
view userSignUpPage =
    ( Tab.Single "新規登録"
    , [ Html.div
            [ Html.Attributes.class "signUpContainer" ]
            (case userSignUpPage of
                Normal { sAddressAndPassword, university } ->
                    normalView sAddressAndPassword university

                DeletedAllUser result ->
                    [ Html.text
                        ("すべてのユーザーの削除処理を"
                            ++ (if result then
                                    "成功した"

                                else
                                    "失敗した"
                               )
                        )
                    ]

                SentSingUpData emailAddress maybe ->
                    sendSignUpEmailView emailAddress maybe

                SentConfirmTokenError maybe ->
                    []
            )
      ]
    )


normalView : SAddressAndPassword -> UniversitySelect -> List (Html.Html Emit)
normalView sAddressAndPassword university =
    [ Html.Keyed.node "form"
        [ Html.Attributes.class "signUp" ]
        ([ ( "s_or_nos"
           , sAddressView sAddressAndPassword
                |> Html.map (\s -> EmitChangePage (Normal { sAddressAndPassword = s, university = university }))
           )
         ]
            ++ (case sAddressAndPassword of
                    StudentHasSAddress { studentIdOrTsukubaEmailAddress, password } ->
                        studentHasSAddressFormList studentIdOrTsukubaEmailAddress password

                    NewStudent { emailAddress, imageUrl, password } ->
                        newStudentForm emailAddress imageUrl password
               )
            ++ (signUpUniversityView university
                    |> List.map
                        (Tuple.mapSecond
                            (Html.map
                                (\s ->
                                    EmitChangePage (Normal { sAddressAndPassword = sAddressAndPassword, university = s })
                                )
                            )
                        )
               )
            ++ [ ( "submit", signUpSubmitButton (getSignUpRequest sAddressAndPassword university) ) ]
            ++ [ ( "deleteAllUser"
                 , Html.button
                    [ Html.Events.preventDefaultOn "click"
                        (Json.Decode.succeed ( EmitDeleteUserAll, True ))
                    ]
                    [ Html.text "すべてのユーザーを削除" ]
                 )
               ]
        )
    ]


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
                                    { emailAddress = [] |> EmailAddress.fromCharList
                                    , imageUrl = Nothing
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


studentHasSAddressFormList : AnalysisStudentIdOrSAddressResult -> Result Password.Error Password.Password -> List ( String, Html.Html Emit )
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
                , Html.Events.onInput EmitInputStudentIdOrEmailAddress
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
                                ++ StudentId.toStringWith20 studentId
                                ++ " "
                                ++ (studentId
                                        |> SAddress.fromStundetId
                                        |> EmailAddress.fromSAddress
                                        |> EmailAddress.toString
                                   )
                                ++ "にメールを送信します"

                        APartStudentId partStudentId ->
                            "学籍番号 "
                                ++ StudentId.partStudentIdToStringWith20 partStudentId

                        ASAddress sAddress ->
                            "筑波大学のメールアドレス " ++ SAddress.toEmailAddressString sAddress

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
    case StudentId.fromCharList charList of
        Just studentId ->
            AStudentId studentId

        Nothing ->
            case StudentId.partStudentIdFromCharList charList of
                Just partStudentId ->
                    APartStudentId partStudentId

                Nothing ->
                    case SAddress.fromCharList charList of
                        Just sAddress ->
                            ASAddress sAddress

                        Nothing ->
                            case EmailAddress.fromCharList charList of
                                Just _ ->
                                    AEmailButIsNotTsukuba

                                Nothing ->
                                    ANone


type AnalysisStudentIdOrSAddressResult
    = ANone
    | AStudentId StudentId.StudentId
    | ASAddress SAddress.SAddress
    | APartStudentId StudentId.PartStudentId
    | AEmailButIsNotTsukuba


analysisEmailAddress : String -> Maybe EmailAddress.EmailAddress
analysisEmailAddress string =
    string
        |> String.trim
        |> String.toList
        |> EmailAddress.fromCharList


newStudentForm : Maybe EmailAddress.EmailAddress -> Maybe String -> Result Password.Error Password.Password -> List ( String, Html.Html Emit )
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
                , Html.Events.onInput EmitInputStudentIdOrEmailAddress
                ]
                []
            , Html.div
                [ Html.Attributes.class "signUp-description" ]
                [ Html.text
                    (case emailAddress of
                        Just address ->
                            EmailAddress.toString address
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
                , Html.Events.on "change" (Json.Decode.succeed (EmitInputStudentImage "signUpImage"))
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
passwordForm : Result Password.Error Password.Password -> Html.Html Emit
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
            , Html.Events.onInput EmitInputPassword
            ]
            []
        , Html.div
            [ Html.Attributes.class "signUp-description" ]
            [ Html.text
                (case passwordResult of
                    Ok password ->
                        Password.toString password

                    Err error ->
                        Password.errorMessage error
                )
            ]
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
                                case School.schoolToOnlyOneDepartment school of
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
                        ( "s=" ++ School.schoolToIdString school
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
            case departmentSelectView (School.departmentToSchool department) of
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


signUpUniversityViewSelectGraduate : Html.Html (Maybe School.Graduate)
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
                ++ (School.graduateAllValue
                        |> List.map
                            (\s ->
                                Html.option [] [ Html.text (School.graduateToJapaneseString s) ]
                            )
                   )
            )
        ]


selectGraduateDecoder : Json.Decode.Decoder (Maybe School.Graduate)
selectGraduateDecoder =
    Json.Decode.at
        [ "target", "selectedIndex" ]
        Json.Decode.int
        |> Json.Decode.map (\index -> School.graduateAllValue |> Array.fromList |> Array.get (index - 1))


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
signUpUniversityViewSelectSchool : Html.Html (Maybe School.School)
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
                ++ (School.schoolAllValue
                        |> List.map
                            (\s ->
                                Html.option [] [ Html.text (School.schoolToJapaneseString s) ]
                            )
                   )
            )
        ]


selectSchoolDecoder : Json.Decode.Decoder (Maybe School.School)
selectSchoolDecoder =
    Json.Decode.at
        [ "target", "selectedIndex" ]
        Json.Decode.int
        |> Json.Decode.map (\index -> School.schoolAllValue |> Array.fromList |> Array.get (index - 1))


{-| 学類の選択
-}
signUpUniversityViewSelectDepartment : School.School -> Maybe (Html.Html (Maybe School.SchoolAndDepartment))
signUpUniversityViewSelectDepartment school =
    case School.departmentAllValue school of
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
                                            Html.option [] [ Html.text (School.departmentToJapaneseString s |> Maybe.withDefault "?") ]
                                        )
                               )
                        )
                    ]
                )


selectDepartmentDecoder : School.School -> Json.Decode.Decoder (Maybe School.SchoolAndDepartment)
selectDepartmentDecoder school =
    Json.Decode.at
        [ "target", "selectedIndex" ]
        Json.Decode.int
        |> Json.Decode.map
            (\index -> School.departmentAllValue school |> Array.fromList |> Array.get (index - 1))


signUpSubmitButton : Maybe Api.SignUpRequest -> Html.Html Emit
signUpSubmitButton signUpRequestMaybe =
    Html.div
        []
        [ Html.button
            ([ Html.Attributes.class "signUp-signUpButton"
             , Html.Attributes.disabled (signUpRequestMaybe == Nothing)
             ]
                ++ (case signUpRequestMaybe of
                        Just signUpRequest ->
                            [ Html.Events.stopPropagationOn "click"
                                (Json.Decode.succeed ( EmitSignUp signUpRequest, True ))
                            ]

                        Nothing ->
                            []
                   )
            )
            [ Html.text "新規登録" ]
        ]


{-| 画面の情報から新規登録できる情報を入力しているかと、新規登録に必要なデータを取りだす
-}
getSignUpRequest : SAddressAndPassword -> UniversitySelect -> Maybe Api.SignUpRequest
getSignUpRequest sAddressAndPassword university =
    case ( getSignUpRequestEmailAddressAndPasswordAndImage sAddressAndPassword, getSignUpRequestUniversity university ) of
        ( Just { emailAddress, password, image }, Just universityData ) ->
            Just
                { emailAddress = emailAddress
                , pass = password
                , image = image
                , university = universityData
                }

        ( _, _ ) ->
            Nothing


getSignUpRequestEmailAddressAndPasswordAndImage : SAddressAndPassword -> Maybe { emailAddress : EmailAddress.EmailAddress, password : Password.Password, image : Maybe String }
getSignUpRequestEmailAddressAndPasswordAndImage sAddressAndPassword =
    case sAddressAndPassword of
        StudentHasSAddress { studentIdOrTsukubaEmailAddress, password } ->
            case ( studentIdOrTsukubaEmailAddress, password ) of
                ( AStudentId studentId, Ok pass ) ->
                    Just
                        { emailAddress = EmailAddress.fromSAddress (SAddress.fromStundetId studentId)
                        , password = pass
                        , image = Nothing
                        }

                ( ASAddress sAddress, Ok pass ) ->
                    Just
                        { emailAddress = EmailAddress.fromSAddress sAddress
                        , password = pass
                        , image = Nothing
                        }

                _ ->
                    Nothing

        NewStudent { emailAddress, password, imageUrl } ->
            case ( emailAddress, password, imageUrl ) of
                ( Just address, Ok pass, Just image ) ->
                    Just
                        { emailAddress = address
                        , password = pass
                        , image = Just image
                        }

                ( _, _, _ ) ->
                    Nothing


getSignUpRequestUniversity : UniversitySelect -> Maybe Api.UniversityData
getSignUpRequestUniversity universitySelect =
    case universitySelect of
        UniversitySchool (UniversitySchoolSelectSchoolAndDepartment schoolAndDepartment) ->
            Just (Api.UniversitySchool schoolAndDepartment)

        UniversityGraduate (UniversityGraduateSelect (Just graduate) (Just (UniversitySchoolSelectSchoolAndDepartment schoolAndDepartment))) ->
            Just (Api.UniversityGraduateFromTsukuba graduate schoolAndDepartment)

        UniversityGraduate (UniversityGraduateSelect (Just graduate) Nothing) ->
            Just (Api.UniversityGraduateFromNotTsukuba graduate)

        _ ->
            Nothing


{-| 新規登録のボタンを押した後の画面
-}
sendSignUpEmailView : EmailAddress.EmailAddress -> Maybe (Result Api.SignUpResponseError Api.SignUpResponseOk) -> List (Html.Html Emit)
sendSignUpEmailView emailAddress signUpResultMaybe =
    case signUpResultMaybe of
        Just signUpResult ->
            signUpResultToString emailAddress signUpResult

        Nothing ->
            [ Html.text "新規登録の情報を送信中" ]


signUpResultToString : EmailAddress.EmailAddress -> Result Api.SignUpResponseError Api.SignUpResponseOk -> List (Html.Html Emit)
signUpResultToString emailAddress signUpResult =
    case signUpResult of
        Ok (Api.SignUpResponseOk token) ->
            [ Html.text
                ("送信完了。"
                    ++ EmailAddress.toString emailAddress
                    ++ "にメールを送信しました。届いたメールのリンクをクリックして認証をしてください"
                    ++ "token = \""
                    ++ token
                    ++ "\""
                )
            , Html.div
                [ Html.Events.onClick (EmitSendConfirmToken token)
                , Html.Attributes.style "border" "solid 2px black"
                ]
                [ Html.text "confirm_tokenを送信" ]
            ]

        Err Api.SignUpErrorAlreadySignUp ->
            [ Html.text "すでにあなたは登録されています" ]

        Err Api.SignUpErrorBadUrl ->
            [ Html.text "正しいURLが指定されなかった" ]

        Err Api.SignUpErrorTimeout ->
            [ Html.text "タイムアウトエラー。回線が混雑しています" ]

        Err Api.SignUpErrorNetworkError ->
            [ Html.text "ネットワークエラー。接続が切れている可能性があります" ]

        Err Api.SignUpInvalidData ->
            [ Html.text "不正なリクエストをした疑いがあります" ]

        Err Api.SignUpError ->
            [ Html.text "サーバーの回答を理解することができませんでした" ]
