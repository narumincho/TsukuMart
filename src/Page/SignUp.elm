module Page.SignUp exposing (Emit(..), Model, Msg(..), initModel, sendSignUpEmailView, update, view)

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


type Model
    = Model
        { sAddressAndPassword : SignUpSAddressAndPassword
        , university : UniversitySelect
        }


type UniversitySelect
    = UniversitySchool SchoolSelect
    | UniversityGraduate GraduateSelect


type SchoolSelect
    = UniversitySchoolNone
    | UniversitySchoolSelectSchool School.School
    | UniversitySchoolSelectSchoolAndDepartment School.SchoolAndDepartment


type GraduateSelect
    = UniversityGraduateSelect (Maybe School.Graduate) (Maybe SchoolSelect)


type SignUpSAddressAndPassword
    = UserSignUpPageStudentHasSAddress
        { studentIdOrTsukubaEmailAddress : AnalysisStudentIdOrSAddressResult
        , password : Result Password.Error Password.Password
        }
    | UserSignUpPageNewStudent
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
    | EmitSignUp { emailAddress : EmailAddress.EmailAddress, pass : Password.Password, image : Maybe String }
    | EmitSendConfirmToken


type Msg
    = InputStudentIdOrEmailAddress String
    | ReceiveImageDataUrl String
    | InputPassword String


initModel : Model
initModel =
    Model
        { sAddressAndPassword =
            UserSignUpPageStudentHasSAddress
                { studentIdOrTsukubaEmailAddress = analysisStudentIdOrSAddress ""
                , password = Password.passwordFromString ""
                }
        , university = UniversitySchool UniversitySchoolNone
        }


update : Msg -> Model -> Model
update msg (Model { sAddressAndPassword, university }) =
    case msg of
        InputStudentIdOrEmailAddress string ->
            case sAddressAndPassword of
                UserSignUpPageStudentHasSAddress r ->
                    Model
                        { sAddressAndPassword =
                            UserSignUpPageStudentHasSAddress
                                { r
                                    | studentIdOrTsukubaEmailAddress =
                                        analysisStudentIdOrSAddress string
                                }
                        , university = university
                        }

                UserSignUpPageNewStudent r ->
                    Model
                        { sAddressAndPassword =
                            UserSignUpPageNewStudent
                                { r
                                    | emailAddress = analysisEmailAddress string
                                }
                        , university = university
                        }

        ReceiveImageDataUrl dataUrlString ->
            case sAddressAndPassword of
                UserSignUpPageNewStudent r ->
                    Model
                        { sAddressAndPassword =
                            UserSignUpPageNewStudent
                                { r | imageUrl = Just dataUrlString }
                        , university = university
                        }

                _ ->
                    Model
                        { sAddressAndPassword = sAddressAndPassword
                        , university = university
                        }

        InputPassword string ->
            Model
                { sAddressAndPassword =
                    case sAddressAndPassword of
                        UserSignUpPageNewStudent r ->
                            UserSignUpPageNewStudent
                                { r | password = Password.passwordFromString string }

                        UserSignUpPageStudentHasSAddress r ->
                            UserSignUpPageStudentHasSAddress
                                { r | password = Password.passwordFromString string }
                , university = university
                }


view : Model -> List (Html.Html Emit)
view userSignUpPage =
    case userSignUpPage of
        Model { sAddressAndPassword, university } ->
            [ Html.div
                [ Html.Attributes.class "signUpContainer" ]
                [ Html.Keyed.node "form"
                    [ Html.Attributes.class "signUp" ]
                    ([ ( "s_or_nos"
                       , sAddressView sAddressAndPassword
                            |> Html.map (\s -> EmitChangePage (Model { sAddressAndPassword = s, university = university }))
                       )
                     ]
                        ++ (case sAddressAndPassword of
                                UserSignUpPageStudentHasSAddress { studentIdOrTsukubaEmailAddress, password } ->
                                    studentHasSAddressFormList studentIdOrTsukubaEmailAddress password

                                UserSignUpPageNewStudent { emailAddress, imageUrl, password } ->
                                    newStudentForm emailAddress imageUrl password
                           )
                        ++ (signUpUniversityView university
                                |> List.map
                                    (Tuple.mapSecond
                                        (Html.map
                                            (\s ->
                                                EmitChangePage (Model { sAddressAndPassword = sAddressAndPassword, university = s })
                                            )
                                        )
                                    )
                           )
                        ++ [ ( "submit", signUpSubmitButton (getSignUpData userSignUpPage) )
                           ]
                    )
                ]
            ]


{-| sアドを持っているか持っていないかを選択するフォーム
-}
sAddressView : SignUpSAddressAndPassword -> Html.Html SignUpSAddressAndPassword
sAddressView userSignUpSAddressAndPassword =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.class "signUp-label" ]
            [ Html.text "sアドを" ]
        , sAddressSelectView userSignUpSAddressAndPassword
        ]


sAddressSelectView : SignUpSAddressAndPassword -> Html.Html SignUpSAddressAndPassword
sAddressSelectView userSignUpSAddressAndPassword =
    let
        leftSelect =
            case userSignUpSAddressAndPassword of
                UserSignUpPageStudentHasSAddress _ ->
                    True

                UserSignUpPageNewStudent _ ->
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
                        UserSignUpPageStudentHasSAddress _ ->
                            []

                        UserSignUpPageNewStudent { password } ->
                            [ Html.Events.onClick
                                (UserSignUpPageStudentHasSAddress
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
                        UserSignUpPageStudentHasSAddress { password } ->
                            [ Html.Events.onClick
                                (UserSignUpPageNewStudent
                                    { emailAddress = [] |> EmailAddress.fromCharList
                                    , imageUrl = Nothing
                                    , password = password
                                    }
                                )
                            ]

                        UserSignUpPageNewStudent _ ->
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
signUpUniversityViewSchool signUpSchoolSchool =
    [ ( "selectSchool"
      , signUpUniversityViewSelectSchool
            |> Html.map
                (\m ->
                    case m of
                        Just z ->
                            UniversitySchoolSelectSchool z

                        Nothing ->
                            UniversitySchoolNone
                )
      )
    ]
        ++ (case signUpSchoolSchool of
                UniversitySchoolNone ->
                    []

                UniversitySchoolSelectSchool school ->
                    signUpUniversityViewSelectDepartment school
                        |> Maybe.map
                            (Html.map
                                (\m ->
                                    case m of
                                        Just z ->
                                            UniversitySchoolSelectSchoolAndDepartment z

                                        Nothing ->
                                            UniversitySchoolSelectSchool school
                                )
                            )
                        |> Maybe.map (\e -> ( "s=" ++ School.schoolToIdString school, e ))
                        |> Maybe.map List.singleton
                        |> Maybe.withDefault []

                UniversitySchoolSelectSchoolAndDepartment department ->
                    let
                        school =
                            School.departmentToSchool department
                    in
                    signUpUniversityViewSelectDepartment school
                        |> Maybe.map
                            (Html.map
                                (\m ->
                                    case m of
                                        Just z ->
                                            UniversitySchoolSelectSchoolAndDepartment z

                                        Nothing ->
                                            UniversitySchoolSelectSchool school
                                )
                            )
                        |> Maybe.map (\e -> ( "s=" ++ School.schoolToIdString school, e ))
                        |> Maybe.map List.singleton
                        |> Maybe.withDefault []
           )


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


signUpSubmitButton : Maybe { emailAddress : EmailAddress.EmailAddress, pass : Password.Password, image : Maybe String } -> Html.Html Emit
signUpSubmitButton signUpDataMaybe =
    Html.div
        []
        [ Html.button
            ([ Html.Attributes.class "signUp-signUpButton"
             , Html.Attributes.disabled (signUpDataMaybe == Nothing)
             ]
                ++ (case signUpDataMaybe of
                        Just signUpData ->
                            [ Html.Events.stopPropagationOn "click"
                                (Json.Decode.succeed ( EmitSignUp signUpData, True ))
                            ]

                        Nothing ->
                            []
                   )
            )
            [ Html.text "新規登録" ]
        ]


{-| 画面の情報から新規登録できる情報を入力しているかと、新規登録に必要なデータを取りだす
-}
getSignUpData : Model -> Maybe { emailAddress : EmailAddress.EmailAddress, pass : Password.Password, image : Maybe String }
getSignUpData (Model { sAddressAndPassword, university }) =
    case sAddressAndPassword of
        UserSignUpPageStudentHasSAddress { studentIdOrTsukubaEmailAddress, password } ->
            case ( studentIdOrTsukubaEmailAddress, password ) of
                ( AStudentId studentId, Ok pass ) ->
                    Just
                        { emailAddress = EmailAddress.fromSAddress (SAddress.fromStundetId studentId)
                        , pass = pass
                        , image = Nothing
                        }

                ( ASAddress sAddress, Ok pass ) ->
                    Just
                        { emailAddress = EmailAddress.fromSAddress sAddress
                        , pass = pass
                        , image = Nothing
                        }

                _ ->
                    Nothing

        UserSignUpPageNewStudent { emailAddress, password, imageUrl } ->
            case ( emailAddress, password, imageUrl ) of
                ( Just address, Ok pass, Just image ) ->
                    Just
                        { emailAddress = address
                        , pass = pass
                        , image = Just image
                        }

                ( _, _, _ ) ->
                    Nothing


sendSignUpEmailView : EmailAddress.EmailAddress -> Maybe (Result Api.SignUpResponseError Api.SignUpResponseOk) -> List (Html.Html Emit)
sendSignUpEmailView emailAddress signUpResultMaybe =
    [ Html.div [ Html.Attributes.class "signUp-resultMsg" ]
        (case signUpResultMaybe of
            Just signUpResult ->
                signUpResultToString emailAddress signUpResult

            Nothing ->
                [ Html.text "新規登録の情報を送信中" ]
        )
    ]


signUpResultToString : EmailAddress.EmailAddress -> Result Api.SignUpResponseError Api.SignUpResponseOk -> List (Html.Html Emit)
signUpResultToString emailAddress signUpResult =
    case signUpResult of
        Ok (Api.SignUpResponseOk (Api.ConfirmToken token)) ->
            [ Html.text
                ("送信完了。"
                    ++ EmailAddress.toString emailAddress
                    ++ "にメールを送信しました。届いたメールのリンクをクリックして認証をしてください"
                    ++ "token = \""
                    ++ token
                    ++ "\""
                )
            , Html.div
                [ Html.Events.onClick EmitSendConfirmToken
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

        Err Api.SignUpError ->
            [ Html.text "サーバーの回答を理解することができませんでした" ]