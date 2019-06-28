module Page.User exposing
    ( Emission(..)
    , Model
    , Msg(..)
    , initModelFromId
    , initModelWithName
    , update
    , view
    , getUser)

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
    , before : User.WithProfile
    }


type Emission
    = EmissionGetUserProfile User.Id
    | EmissionChangeProfile Api.Token Api.ProfileUpdateData
    | EmissionReplaceElementText { id : String, text : String }
    | EmissionUniversity CompUniversity.Emission
    | EmissionLogOut
    | EmissionAddLogMessage String


type Msg
    = MsgToEditMode
    | MsgInputDisplayName String
    | MsgInputIntroduction String
    | MsgInputUniversity CompUniversity.Model
    | MsgBackToViewMode
    | MsgChangeProfile Api.Token Api.ProfileUpdateData
    | MsgChangeProfileResponse (Result String User.WithProfile)
    | MsgLogOut
    | MsgUserProfileResponse (Result String User.WithProfile)


initModelWithName : User.WithName -> ( Model, List Emission )
initModelWithName userWithNameInit =
    ( LoadingWithUserIdAndName userWithNameInit
    , [ EmissionGetUserProfile (User.withNameGetId userWithNameInit) ]
    )


{-| 外部ページから飛んで来たときはユーザーIDだけを頼りにしてユーザーページを作らなければならない
-}
initModelFromId : LogInState.LogInState -> User.Id -> ( Model, List Emission )
initModelFromId logInState userId =
    case logInState of
        LogInState.Ok { userWithName } ->
            if User.withNameGetId userWithName == userId then
                ( LoadingWithUserIdAndName userWithName
                , [ EmissionGetUserProfile userId ]
                )

            else
                ( LoadingWithUserId userId
                , [ EmissionGetUserProfile userId ]
                )

        _ ->
            ( LoadingWithUserId userId
            , [ EmissionGetUserProfile userId ]
            )


getUser : Model -> List User.WithName
getUser model =
    case model of
        LoadingWithUserId _ ->
            []

        LoadingWithUserIdAndName withName ->
            [ withName ]

        Normal withProfile ->
            [ User.withProfileToWithName withProfile ]

        Edit { before } ->
            [ User.withProfileToWithName before ]



{- ====== Update ====== -}


update : Msg -> Model -> ( Model, List Emission )
update msg model =
    case msg of
        MsgToEditMode ->
            case model of
                Normal userWithProfile ->
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
            , CompUniversity.emission select |> List.map EmissionUniversity
            )

        MsgBackToViewMode ->
            ( case model of
                Edit { before } ->
                    Normal before

                _ ->
                    model
            , []
            )

        MsgChangeProfile token profile ->
            ( model
            , [ EmissionChangeProfile token profile ]
            )

        MsgChangeProfileResponse result ->
            case result of
                Ok profile ->
                    ( Normal profile
                    , [ EmissionAddLogMessage "ユーザー情報を更新しました" ]
                    )

                _ ->
                    ( model
                    , [ EmissionAddLogMessage "ユーザー情報を更新に失敗しました" ]
                    )

        MsgLogOut ->
            ( model
            , [ EmissionLogOut ]
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
                    , [ EmissionAddLogMessage ("ユーザー情報の取得に失敗しました " ++ string) ]
                    )


toEditMode : User.WithProfile -> ( Model, List Emission )
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
        , before = userWithProfile
        }
    , [ EmissionReplaceElementText { id = nickNameEditorId, text = displayName }
      , EmissionReplaceElementText { id = introductionEditorId, text = introduction }
      ]
        ++ (CompUniversity.emission universitySelect |> List.map EmissionUniversity)
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
                ( LogInState.Ok { userWithName }, Normal normalUser ) ->
                    if User.withNameGetId userWithName == User.withProfileGetId normalUser then
                        normalMyProfileView normalUser

                    else
                        normalView normalUser

                ( _, Normal user ) ->
                    normalView user

                ( _, LoadingWithUserId userId ) ->
                    loadingWithUserIdView userId

                ( _, LoadingWithUserIdAndName withName ) ->
                    loadingWithUserIdAndNameView withName

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


loadingWithUserIdAndNameView : User.WithName -> List (Html.Html msg)
loadingWithUserIdAndNameView userWithName =
    [ imageAndDisplayNameView
        (User.withNameGetImageUrl userWithName)
        (User.withNameGetDisplayName userWithName)
    , Html.text (User.withNameGetDisplayName userWithName ++ "さんの紹介文、学群学類を読み込み中")
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
        [ userDataLinkItem SiteMap.likedProductsUrl "いいねした商品"
        , userDataLinkItem SiteMap.historyUrl "閲覧した商品"
        , userDataLinkItem SiteMap.soldProductsUrl "出品した商品"
        , userDataLinkItem SiteMap.boughtProductsUrl "購入した商品"
        , userDataLinkItem SiteMap.tradingProductsUrl "取引中の商品"
        , userDataLinkItem SiteMap.tradedProductsUrl "取引した商品"
        , userDataLinkItem SiteMap.commentedProductsUrl "コメントをした商品"
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
                    , image = Nothing
                    , university = university
                    }

            Nothing ->
                Nothing

    else
        Nothing
