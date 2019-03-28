module Page.Profile exposing
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
import Page.Component.LogInOrSignUp as LogInOrSignUp
import Page.Component.University as CompUniversity
import Svg
import Svg.Attributes
import Tab


type Model
    = Model
        { mode : Mode
        , logInOrSignUpModel : LogInOrSignUp.Model
        }


type Mode
    = EditMode EditModel
    | ViewMode


type alias EditModel =
    { nickName : String
    , introduction : String
    , universitySelect : CompUniversity.Model
    }


type Emit
    = EmitLogInOrSignUp LogInOrSignUp.Emit
    | EmitGetProfile { access : Api.Token, refresh : Api.Token }
    | EmitChangeProfile Api.Token User.Profile
    | EmitReplaceText { id : String, text : String }
    | EmitUniversity CompUniversity.Emit


type Msg
    = MsgLogInOrSignUp LogInOrSignUp.Msg
    | MsgToEditMode
    | MsgInputNickName String
    | MsgInputIntroduction String
    | MsgInputUniversity CompUniversity.Model
    | MsgBackToViewMode
    | MsgChangeProfile Api.Token User.Profile
    | MsgChangeProfileResponse


initModel : LogInState.LogInState -> ( Model, List Emit )
initModel logInState =
    ( Model
        { mode = ViewMode
        , logInOrSignUpModel = LogInOrSignUp.initModel
        }
    , case logInState of
        LogInState.LogInStateOk { access, refresh } ->
            [ EmitGetProfile { access = access, refresh = refresh } ]

        LogInState.LogInStateNone ->
            []
    )



{- ====== Update ====== -}


update : LogInState.LogInState -> Msg -> Model -> ( Model, List Emit )
update logInState msg (Model rec) =
    case msg of
        MsgLogInOrSignUp logInOrSignUpMsg ->
            let
                ( newModel, emitMaybe ) =
                    LogInOrSignUp.update logInOrSignUpMsg rec.logInOrSignUpModel
            in
            ( Model { rec | logInOrSignUpModel = newModel }
            , emitMaybe |> List.map EmitLogInOrSignUp
            )

        MsgToEditMode ->
            toEditMode logInState (Model rec)

        MsgInputNickName nickName ->
            ( case rec.mode of
                EditMode r ->
                    Model { rec | mode = EditMode { r | nickName = String.trim nickName } }

                ViewMode ->
                    Model rec
            , []
            )

        MsgInputIntroduction introduction ->
            ( case rec.mode of
                EditMode r ->
                    Model { rec | mode = EditMode { r | introduction = introduction } }

                ViewMode ->
                    Model rec
            , []
            )

        MsgInputUniversity select ->
            ( case rec.mode of
                EditMode r ->
                    Model { rec | mode = EditMode { r | universitySelect = select } }

                ViewMode ->
                    Model rec
            , CompUniversity.emit select |> List.map EmitUniversity
            )

        MsgBackToViewMode ->
            ( Model { rec | mode = ViewMode }
            , []
            )

        MsgChangeProfile token profile ->
            ( Model rec
            , [ EmitChangeProfile token profile ]
            )

        MsgChangeProfileResponse ->
            ( Model { rec | mode = ViewMode }
            , []
            )


toEditMode : LogInState.LogInState -> Model -> ( Model, List Emit )
toEditMode logInState (Model rec) =
    case logInState of
        LogInState.LogInStateOk { user } ->
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
            ( Model
                { rec
                    | mode =
                        EditMode
                            { nickName = nickName
                            , introduction = introduction
                            , universitySelect = universitySelect
                            }
                }
            , [ EmitReplaceText { id = nickNameEditorId, text = nickName }
              , EmitReplaceText { id = introductionEditorId, text = introduction }
              ]
                ++ (CompUniversity.emit universitySelect |> List.map EmitUniversity)
            )

        LogInState.LogInStateNone ->
            ( Model rec
            , []
            )



{- ====== View ====== -}


view : LogInState.LogInState -> Model -> ( String, Tab.Tab Msg, List (Html.Html Msg) )
view logInState (Model { logInOrSignUpModel, mode }) =
    ( "プロフィール"
    , Tab.single "プロフィール"
    , [ Html.div
            [ Html.Attributes.class "container" ]
            (case logInState of
                LogInState.LogInStateOk { access, user } ->
                    case mode of
                        EditMode editModel ->
                            userEditView access editModel (User.getProfile user)

                        ViewMode ->
                            userView user

                LogInState.LogInStateNone ->
                    [ LogInOrSignUp.view logInOrSignUpModel
                        |> Html.map MsgLogInOrSignUp
                    ]
            )
      ]
    )


userView : User.User -> List (Html.Html Msg)
userView user =
    let
        profile =
            User.getProfile user
    in
    [ Html.div
        [ Html.Attributes.class "profile" ]
        ([ nickNameView (User.profileGetNickName profile)
         , introductionView (User.profileGetIntroduction profile)
         ]
            ++ universityView (User.profileGetUniversity profile)
            ++ [ Html.text ("ユーザーID " ++ (user |> User.getUserId |> User.userIdToString)) ]
            ++ [ toEditButton ]
        )
    ]


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
        [ editIcon
        , Html.text "編集する"
        ]


editIcon : Html.Html msg
editIcon =
    Svg.svg
        [ Svg.Attributes.viewBox "0 0 24 24"
        , Svg.Attributes.class "profile-editIcon"
        ]
        [ Svg.path [ Svg.Attributes.d "M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" ] [] ]


{-| 編集モードでの表示
-}
userEditView : Api.Token -> EditModel -> User.Profile -> List (Html.Html Msg)
userEditView access editModel profile =
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
