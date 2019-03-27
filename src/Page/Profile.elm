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
import Page.Component.LogInOrSignUp as LogInOrSignUp
import Svg
import Svg.Attributes
import Tab


type Model
    = Model
        { mode : Mode
        , logInOrSignUpModel : LogInOrSignUp.Model
        }


type Mode
    = EditMode
    | ViewMode


type Emit
    = EmitLogInOrSignUp LogInOrSignUp.Emit
    | EmitChangeProfile Api.Token User.Profile


type Msg
    = MsgLogInOrSignUp LogInOrSignUp.Msg
    | MsgToEditMode
    | MsgBackToViewMode
    | MsgChangeProfile Api.Token User.Profile
    | MsgChangeProfileResponse


initModel : Model
initModel =
    Model
        { mode = ViewMode
        , logInOrSignUpModel = LogInOrSignUp.initModel
        }



{- ====== Update ====== -}


update : Msg -> Model -> ( Model, List Emit )
update msg (Model rec) =
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
            ( Model { rec | mode = EditMode }
            , []
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
                        EditMode ->
                            userEditView access (User.getProfile user)

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
            ++ [ editButton ]
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
        , Html.div [] [ Html.text introduction ]
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


editButton : Html.Html Msg
editButton =
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
userEditView : Api.Token -> User.Profile -> List (Html.Html Msg)
userEditView access profile =
    [ Html.div
        [ Html.Attributes.class "form" ]
        [ Html.text "編集モード"
        , nickNameEditor (User.profileGetNickName profile)
        , introductionEditor (User.profileGetIntroduction profile)
        , Html.text "学群学類コンポーネントをここに置く"
        , Html.div [] [ Html.text "やめる 保存する" ]
        ]
    ]


nickNameEditor : String -> Html.Html Msg
nickNameEditor name =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.class "form-label"
            , Html.Attributes.for "nickname-editor"
            ]
            [ Html.text "表示名" ]
        , Html.input
            [ Html.Attributes.attribute "autocomplete" "nickname"
            , Html.Attributes.id "nickname-editor"
            , Html.Attributes.class "form-input"
            ]
            []
        ]


introductionEditor : String -> Html.Html Msg
introductionEditor introduction =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.class "form-label"
            , Html.Attributes.for "introduction-editor"
            ]
            [ Html.text "紹介文" ]
        , Html.textarea
            [ Html.Attributes.attribute "autocomplete" "nickname"
            , Html.Attributes.id "introduction-editor"
            , Html.Attributes.class "form-textarea"
            ]
            []
        ]
