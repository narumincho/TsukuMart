module Page.MyProfile exposing
    ( Emit(..)
    , Model
    , Msg(..)
    , initModel
    , update
    , view
    )

import Api
import Data.LogInState as LogInState
import Data.University
import Data.User as User
import Html
import Html.Attributes
import Html.Events
import Html.Keyed
import Icon
import Page.Component.University as CompUniversity
import Tab


type Model
    = LoadingWithUserId User.UserId
    | LoadingWithUserIdAndName
        { id : User.UserId
        , name : String
        }
    | Normal
    | Edit EditModel


type alias EditModel =
    { nickName : String
    , introduction : String
    , universitySelect : CompUniversity.Model
    }


type Emit
    = EmitGetMyProfile { access : Api.Token, refresh : Api.Token }
    | EmitGetUserProfile User.UserId
    | EmitChangeProfile Api.Token User.Profile
    | EmitReplaceElementText { id : String, text : String }
    | EmitUniversity CompUniversity.Emit
    | EmitLogOut


type Msg
    = MsgToEditMode
    | MsgInputNickName String
    | MsgInputIntroduction String
    | MsgInputUniversity CompUniversity.Model
    | MsgBackToViewMode
    | MsgChangeProfile Api.Token User.Profile
    | MsgChangeProfileResponse
    | MsgLogOut
    | MsgUserProfileResponse (Result () User.User)


initModel : LogInState.LogInState -> User.UserId -> Maybe String -> ( Model, List Emit )
initModel logInState userId userNameMaybe =
    case logInState of
        LogInState.LogInStateOk { access, refresh, user } ->
            if User.getUserId user == userId then
                ( Normal
                , [ EmitGetMyProfile { access = access, refresh = refresh } ]
                )

            else
                initModelNoMyProfile userId userNameMaybe

        LogInState.LogInStateNone ->
            initModelNoMyProfile userId userNameMaybe


initModelNoMyProfile : User.UserId -> Maybe String -> ( Model, List Emit )
initModelNoMyProfile userId userNameMaybe =
    case userNameMaybe of
        Just userName ->
            ( LoadingWithUserIdAndName
                { id = userId
                , name = userName
                }
            , [ EmitGetUserProfile userId ]
            )

        Nothing ->
            ( LoadingWithUserId userId
            , [ EmitGetUserProfile userId ]
            )



{- ====== Update ====== -}


update : LogInState.LogInState -> Msg -> Model -> ( Model, List Emit )
update logInState msg model =
    case msg of
        MsgToEditMode ->
            case logInState of
                LogInState.LogInStateOk { user } ->
                    toEditMode user

                LogInState.LogInStateNone ->
                    ( model
                    , []
                    )

        MsgInputNickName nickName ->
            ( case model of
                Edit r ->
                    Edit { r | nickName = String.trim nickName }

                _ ->
                    model
            , []
            )

        MsgInputIntroduction introduction ->
            ( case model of
                Edit r ->
                    Edit { r | introduction = introduction }

                _ ->
                    model
            , []
            )

        MsgInputUniversity select ->
            ( case model of
                Edit r ->
                    Edit { r | universitySelect = select }

                _ ->
                    model
            , CompUniversity.emit select |> List.map EmitUniversity
            )

        MsgBackToViewMode ->
            ( Normal
            , []
            )

        MsgChangeProfile token profile ->
            ( model
            , [ EmitChangeProfile token profile ]
            )

        MsgChangeProfileResponse ->
            ( Normal
            , []
            )

        MsgLogOut ->
            ( model
            , [ EmitLogOut ]
            )
        MsgUserProfileResponse result ->
            case result of
                Ok profile ->
                    ( Normal
                    , []
                    )
                Err () ->
                    ( Normal
                    , []
                    )


toEditMode : User.User -> ( Model, List Emit )
toEditMode user =
    let
        profile =
            User.getProfile user

        nickName =
            User.profileGetNickName profile

        introduction =
            User.profileGetIntroduction profile

        universitySelect =
            CompUniversity.selectFromUniversity (User.profileGetUniversity profile)
    in
    ( Edit
        { nickName = nickName
        , introduction = introduction
        , universitySelect = universitySelect
        }
    , [ EmitReplaceElementText { id = nickNameEditorId, text = nickName }
      , EmitReplaceElementText { id = introductionEditorId, text = introduction }
      ]
        ++ (CompUniversity.emit universitySelect |> List.map EmitUniversity)
    )



{- ====== View ====== -}


view : LogInState.LogInState -> Model -> ( String, Tab.Tab Msg, List (Html.Html Msg) )
view logInState model =
    ( "プロフィール"
    , Tab.single "プロフィール"
    , [ Html.div
            [ Html.Attributes.class "container" ]
            (case ( logInState, model ) of
                ( LogInState.LogInStateOk { access, user }, Normal ) ->
                    viewView user

                ( LogInState.LogInStateNone, Normal ) ->
                    [ Html.text "自分以外のプロフィールは準備中" ]

                ( _, LoadingWithUserId userId ) ->
                    loadingWithUserIdView userId

                ( _, LoadingWithUserIdAndName { name } ) ->
                    loadingWithUserIdAndNameView name

                ( LogInState.LogInStateOk { access, user }, Edit editModel ) ->
                    editView access editModel (User.getProfile user)

                ( LogInState.LogInStateNone, Edit _ ) ->
                    [ Html.text "自分以外のプロフィールが編集できない" ]
            )
      ]
    )


loadingWithUserIdView : User.UserId -> List (Html.Html msg)
loadingWithUserIdView userId =
    [ Html.text ("ユーザーID" ++ User.userIdToString userId ++ "のプロフィールを読み込み中")
    ]


loadingWithUserIdAndNameView : String -> List (Html.Html msg)
loadingWithUserIdAndNameView userName =
    [ Html.text (userName ++ "さんのプロフィーを読み込み中")
    ]


viewView : User.User -> List (Html.Html Msg)
viewView user =
    [ Html.div
        [ Html.Attributes.class "profile" ]
        (userView user
            ++ [ toEditButton, logOutButton ]
        )
    ]


{-| ユーザーの情報表示
-}
userView : User.User -> List (Html.Html msg)
userView user =
    let
        profile =
            User.getProfile user
    in
    [ nickNameView (User.profileGetNickName profile)
    , introductionView (User.profileGetIntroduction profile)
    ]
        ++ universityView (User.profileGetUniversity profile)
        ++ [ Html.text ("ユーザーID " ++ (user |> User.getUserId |> User.userIdToString)) ]


nickNameView : String -> Html.Html msg
nickNameView nickName =
    Html.div
        []
        [ Html.div [ Html.Attributes.class "profile-title" ] [ Html.text "表示名" ]
        , Html.div [] [ Html.text nickName ]
        ]


introductionView : String -> Html.Html msg
introductionView introduction =
    Html.div
        []
        [ Html.div
            [ Html.Attributes.class "profile-title" ]
            [ Html.text "紹介文" ]
        , Html.div []
            (introduction |> String.lines |> List.map Html.text |> List.intersperse (Html.br [] []))
        ]


universityView : Data.University.University -> List (Html.Html msg)
universityView university =
    let
        { graduate, school, department } =
            Data.University.universityToJapaneseString university
    in
    (case graduate of
        Just g ->
            [ Html.div
                [ Html.Attributes.class "profile-title" ]
                [ Html.text "研究科" ]
            , Html.div
                []
                [ Html.text g ]
            ]

        Nothing ->
            []
    )
        ++ (case school of
                Just s ->
                    [ Html.div
                        [ Html.Attributes.class "profile-title" ]
                        [ Html.text "学群" ]
                    , Html.div
                        []
                        [ Html.text s ]
                    ]

                Nothing ->
                    []
           )
        ++ (case department of
                Just d ->
                    [ Html.div
                        [ Html.Attributes.class "profile-title" ]
                        [ Html.text "学類" ]
                    , Html.div
                        []
                        [ Html.text d ]
                    ]

                Nothing ->
                    []
           )


toEditButton : Html.Html Msg
toEditButton =
    Html.button
        [ Html.Attributes.class "mainButton"
        , Html.Events.onClick MsgToEditMode
        ]
        [ Icon.editIcon
        , Html.text "編集する"
        ]


logOutButton : Html.Html Msg
logOutButton =
    Html.button
        [ Html.Attributes.class "subButton"
        , Html.Events.onClick MsgLogOut
        ]
        [ Html.text "ログアウトする" ]


{-| 編集モードでの表示
-}
editView : Api.Token -> EditModel -> User.Profile -> List (Html.Html Msg)
editView access editModel profile =
    [ Html.Keyed.node "div"
        [ Html.Attributes.class "form" ]
        ([ ( "nickNameEditor", nickNameEditor (User.profileGetNickName profile) )
         , ( "introductionEditor", introductionEditor (User.profileGetIntroduction profile) )
         ]
            ++ (CompUniversity.view editModel.universitySelect |> List.map (Tuple.mapSecond (Html.map MsgInputUniversity)))
            ++ [ ( "button", editButton access editModel )
               ]
        )
    ]


nickNameEditor : String -> Html.Html Msg
nickNameEditor nickName =
    Html.div
        []
        ([ Html.label
            [ Html.Attributes.class "form-label"
            , Html.Attributes.for nickNameEditorId
            ]
            [ Html.text "表示名" ]
         , Html.input
            [ Html.Attributes.attribute "autocomplete" "nickname"
            , Html.Attributes.id nickNameEditorId
            , Html.Attributes.class "form-input"
            , Html.Events.onInput MsgInputNickName
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


nickNameEditorId : String
nickNameEditorId =
    "nickname-editor"


introductionEditor : String -> Html.Html Msg
introductionEditor introduction =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.class "form-label"
            , Html.Attributes.for introductionEditorId
            ]
            [ Html.text "紹介文" ]
        , Html.textarea
            [ Html.Attributes.attribute "autocomplete" "nickname"
            , Html.Attributes.id introductionEditorId
            , Html.Attributes.class "form-textarea"
            , Html.Events.onInput MsgInputIntroduction
            ]
            []
        ]


introductionEditorId : String
introductionEditorId =
    "introduction-editor"


editButton : Api.Token -> EditModel -> Html.Html Msg
editButton token editModel =
    Html.div
        [ Html.Attributes.class "profile-editButtonArea" ]
        [ Html.button
            [ Html.Attributes.class "profile-editCancelButton"
            , Html.Events.onClick MsgBackToViewMode
            ]
            [ Html.text "キャンセル" ]
        , Html.button
            ([ Html.Attributes.class "profile-editOkButton" ]
                ++ (case editModelToProfile editModel of
                        Just profile ->
                            [ Html.Events.onClick (MsgChangeProfile token profile)
                            , Html.Attributes.disabled False
                            ]

                        Nothing ->
                            [ Html.Attributes.disabled True ]
                   )
            )
            [ Html.text "変更する" ]
        ]


editModelToProfile : EditModel -> Maybe User.Profile
editModelToProfile { nickName, introduction, universitySelect } =
    if 1 <= String.length nickName && String.length nickName <= 50 then
        case CompUniversity.getUniversity universitySelect of
            Just university ->
                Just
                    (User.makeProfile
                        { nickName = nickName
                        , introduction = introduction
                        , university = university
                        }
                    )

            Nothing ->
                Nothing

    else
        Nothing
