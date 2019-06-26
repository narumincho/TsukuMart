module Page.User exposing
    ( Emit(..)
    , Model
    , Msg(..)
    , initModelFromId
    , initModelWithName
    , update
    , view
    )

import Api
import BasicParts
import Data.LogInState as LogInState
import Data.University
import Data.User as User
import Html
import Html.Attributes
import Html.Events
import Html.Keyed
import Icon
import Page.Component.University as CompUniversity
import SiteMap


type Model
    = LoadingWithUserId User.Id
    | LoadingWithUserIdAndName User.WithName
    | Normal User.WithProfile
    | Edit EditModel


type alias EditModel =
    { displayName : String
    , introduction : String
    , universitySelect : CompUniversity.Model
    }


type Emit
    = EmitGetMyProfile { accessToken : Api.Token }
    | EmitGetUserProfile User.Id
    | EmitChangeProfile Api.Token Api.ProfileUpdateData
    | EmitReplaceElementText { id : String, text : String }
    | EmitUniversity CompUniversity.Emit
    | EmitLogOut
    | EmitAddLogMessage String


type Msg
    = MsgToEditMode
    | MsgInputDisplayName String
    | MsgInputIntroduction String
    | MsgInputUniversity CompUniversity.Model
    | MsgBackToViewMode
    | MsgChangeProfile Api.Token Api.ProfileUpdateData
    | MsgChangeProfileResponse (Result () User.WithProfile)
    | MsgLogOut
    | MsgUserProfileResponse (Result String User.WithProfile)


initModelWithName : LogInState.LogInState -> User.WithName -> ( Model, List Emit )
initModelWithName logInState userWithName =
    let
        targetUserId =
            User.withNameGetId userWithName
    in
    case logInState of
        LogInState.Ok { accessToken, userWithProfile } ->
            if User.withProfileGetId userWithProfile == targetUserId then
                ( Normal userWithProfile
                , [ EmitGetMyProfile { accessToken = accessToken } ]
                )

            else
                ( LoadingWithUserIdAndName userWithName
                , [ EmitGetUserProfile targetUserId ]
                )

        _ ->
            ( LoadingWithUserIdAndName userWithName
            , [ EmitGetUserProfile targetUserId ]
            )


{-| 外部ページから飛んで来たときはユーザーIDだけを頼りにしてユーザーページを作らなければならない
-}
initModelFromId : LogInState.LogInState -> User.Id -> ( Model, List Emit )
initModelFromId logInState userId =
    case logInState of
        LogInState.Ok { accessToken, userWithProfile } ->
            if User.withProfileGetId userWithProfile == userId then
                ( Normal userWithProfile
                , [ EmitGetMyProfile { accessToken = accessToken } ]
                )

            else
                ( LoadingWithUserId userId
                , [ EmitGetUserProfile userId ]
                )

        _ ->
            ( LoadingWithUserId userId
            , [ EmitGetUserProfile userId ]
            )



{- ====== Update ====== -}


update : LogInState.LogInState -> Msg -> Model -> ( Model, List Emit )
update logInState msg model =
    case msg of
        MsgToEditMode ->
            case logInState of
                LogInState.Ok { userWithProfile } ->
                    toEditMode userWithProfile

                _ ->
                    ( model
                    , []
                    )

        MsgInputDisplayName nickName ->
            ( case model of
                Edit r ->
                    Edit { r | displayName = String.trim nickName }

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
            ( case logInState of
                LogInState.Ok { userWithProfile } ->
                    Normal userWithProfile

                _ ->
                    model
            , []
            )

        MsgChangeProfile token profile ->
            ( model
            , [ EmitChangeProfile token profile ]
            )

        MsgChangeProfileResponse result ->
            case result of
                Ok profile ->
                    ( Normal profile
                    , [ EmitAddLogMessage "ユーザー情報を更新しました" ]
                    )

                _ ->
                    ( model
                    , [ EmitAddLogMessage "ユーザー情報を更新に失敗しました" ]
                    )

        MsgLogOut ->
            ( model
            , [ EmitLogOut ]
            )

        MsgUserProfileResponse result ->
            case ( model, result ) of
                ( LoadingWithUserId _, Ok profile ) ->
                    ( Normal profile
                    , []
                    )

                ( LoadingWithUserIdAndName _, Ok profile ) ->
                    ( Normal profile
                    , []
                    )

                ( _, Ok _ ) ->
                    ( model
                    , []
                    )

                ( _, Err string ) ->
                    ( model
                    , [ EmitAddLogMessage ("ユーザー情報の取得に失敗しました " ++ string) ]
                    )


toEditMode : User.WithProfile -> ( Model, List Emit )
toEditMode userWithProfile =
    let
        displayName =
            User.withProfileGetDisplayName userWithProfile

        introduction =
            User.withProfileGetIntroduction userWithProfile

        universitySelect =
            CompUniversity.selectFromUniversity (User.withProfileGetUniversity userWithProfile)
    in
    ( Edit
        { displayName = displayName
        , introduction = introduction
        , universitySelect = universitySelect
        }
    , [ EmitReplaceElementText { id = nickNameEditorId, text = displayName }
      , EmitReplaceElementText { id = introductionEditorId, text = introduction }
      ]
        ++ (CompUniversity.emit universitySelect |> List.map EmitUniversity)
    )



{- ====== View ====== -}


view :
    LogInState.LogInState
    -> Model
    -> { title : Maybe String, tab : BasicParts.Tab Msg, html : List (Html.Html Msg) }
view logInState model =
    { title = Just "プロフィール"
    , tab = BasicParts.tabSingle "プロフィール"
    , html =
        [ Html.div
            [ Html.Attributes.class "container" ]
            (case ( logInState, model ) of
                ( LogInState.Ok { userWithProfile }, Normal normalUser ) ->
                    if User.withProfileGetId userWithProfile == User.withProfileGetId normalUser then
                        normalMyProfileView normalUser

                    else
                        normalView normalUser

                ( _, Normal user ) ->
                    normalView user

                ( _, LoadingWithUserId userId ) ->
                    loadingWithUserIdView userId

                ( _, LoadingWithUserIdAndName withName ) ->
                    loadingWithUserIdAndNameView (User.withNameGetDisplayName withName)

                ( LogInState.Ok { accessToken }, Edit editModel ) ->
                    editView accessToken editModel

                ( _, Edit _ ) ->
                    [ Html.text "自分以外のプロフィールは編集できない" ]
            )
        ]
    }


loadingWithUserIdView : User.Id -> List (Html.Html msg)
loadingWithUserIdView userId =
    [ Html.text ("ユーザーID" ++ User.idToString userId ++ "のプロフィールを読み込み中")
    ]


loadingWithUserIdAndNameView : String -> List (Html.Html msg)
loadingWithUserIdAndNameView userName =
    [ Html.text (userName ++ "さんのプロフィーを読み込み中")
    ]


normalView : User.WithProfile -> List (Html.Html Msg)
normalView user =
    [ Html.div
        [ Html.Attributes.class "profile" ]
        (userView user)
    ]


normalMyProfileView : User.WithProfile -> List (Html.Html Msg)
normalMyProfileView user =
    [ Html.div
        [ Html.Attributes.class "profile" ]
        (userView user
            ++ [ toEditButton, logOutButton ]
        )
    ]


{-| ユーザーの情報表示
-}
userView : User.WithProfile -> List (Html.Html msg)
userView userWithProfile =
    [ imageAndDisplayNameView
        (User.withProfileGetImageUrl userWithProfile)
        (User.withProfileGetDisplayName userWithProfile)
    , introductionView (User.withProfileGetIntroduction userWithProfile)
    ]
        ++ universityView (User.withProfileGetUniversity userWithProfile)
        ++ [ Html.text ("ユーザーID " ++ (userWithProfile |> User.withProfileGetId |> User.idToString))
           , userDataLink
           ]


imageAndDisplayNameView : String -> String -> Html.Html msg
imageAndDisplayNameView url displayName =
    Html.div
        [ Html.Attributes.style "display" "flex"
        , Html.Attributes.style "justify-content" "center"
        ]
        [ Html.img
            [ Html.Attributes.style "border-radius" "50%"
            , Html.Attributes.style "width" "50%"
            , Html.Attributes.src url
            ]
            []
        , Html.div
            [ Html.Attributes.style "flex-grow" "1"
            , Html.Attributes.style "font-size" "1.5rem"
            ]
            [ Html.text displayName ]
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


userDataLink : Html.Html msg
userDataLink =
    Html.div
        [ Html.Attributes.style "display" "grid"
        , Html.Attributes.style "gap" "8px"
        , Html.Attributes.style "padding" "0 0 48px 0"
        ]
        [ userDataLinkItem SiteMap.likeHistoryUrl "いいねした商品"
        , userDataLinkItem SiteMap.likeHistoryUrl "閲覧した商品"
        , userDataLinkItem SiteMap.soldProductsUrl "出品した商品"
        , userDataLinkItem SiteMap.boughtProductsUrl "購入した商品"
        , userDataLinkItem "" "取引中の商品"
        , userDataLinkItem "" "コメントをした商品"
        ]


userDataLinkItem : String -> String -> Html.Html msg
userDataLinkItem link text =
    Html.a
        [ Html.Attributes.href link
        , Html.Attributes.style "text-decoration" "none"
        , Html.Attributes.style "color" "black"
        , Html.Attributes.style "background-color" "#999"
        , Html.Attributes.style "padding" "16px"
        , Html.Attributes.style "font-size" "1.5rem"
        , Html.Attributes.style "text-align" "center"
        ]
        [ Html.text text ]


toEditButton : Html.Html Msg
toEditButton =
    Html.button
        [ Html.Attributes.class "mainButton"
        , Html.Events.onClick MsgToEditMode
        ]
        [ Icon.edit
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
editView : Api.Token -> EditModel -> List (Html.Html Msg)
editView access editModel =
    [ Html.Keyed.node "div"
        [ Html.Attributes.class "form" ]
        ([ ( "nickNameEditor", nickNameEditor editModel.displayName )
         , ( "introductionEditor", introductionEditor editModel.introduction )
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
            , Html.Events.onInput MsgInputDisplayName
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
                ++ (case editModelToProfileUpdateData editModel of
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


editModelToProfileUpdateData : EditModel -> Maybe Api.ProfileUpdateData
editModelToProfileUpdateData { displayName, introduction, universitySelect } =
    if 1 <= String.length displayName && String.length displayName <= 50 then
        case CompUniversity.getUniversity universitySelect of
            Just university ->
                Just
                    { displayName = displayName
                    , introduction = introduction
                    , image = ""
                    , university = university
                    }

            Nothing ->
                Nothing

    else
        Nothing
