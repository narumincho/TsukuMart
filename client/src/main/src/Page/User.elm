module Page.User exposing
    ( Emission(..)
    , Model
    , Msg(..)
    , getUser
    , initModelFromId
    , initModelWithName
    , update
    , view
    )

import Api
import BasicParts
import Css
import Data.LogInState as LogInState
import Data.University
import Data.User as User
import Html
import Html.Attributes
import Html.Events
import Html.Keyed
import Icon
import Page.Component.University as UniversityComponent
import Page.Style
import PageLocation


type Model
    = LoadingWithUserId User.Id
    | LoadingWithUserIdAndName User.WithName
    | Normal User.WithProfile
    | Edit EditModel


type alias EditModel =
    { displayName : String
    , introduction : String
    , university : UniversityComponent.Model
    , before : User.WithProfile
    }


type Emission
    = EmissionGetUserProfile User.Id
    | EmissionChangeProfile Api.Token Api.ProfileUpdateData
    | EmissionReplaceElementText { id : String, text : String }
    | EmissionByUniversity UniversityComponent.Emission
    | EmissionLogOut
    | EmissionAddLogMessage String


type Msg
    = MsgToEditMode
    | MsgInputDisplayName String
    | MsgInputIntroduction String
    | MsgByUniversity UniversityComponent.Msg
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

        MsgByUniversity componentMsg ->
            case model of
                Edit r ->
                    let
                        ( componentModel, componentEmittions ) =
                            UniversityComponent.update
                                componentMsg
                                r.university
                    in
                    ( Edit { r | university = componentModel }
                    , componentEmittions |> List.map EmissionByUniversity
                    )

                _ ->
                    ( model, [] )

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

        ( universityModel, universityEmissions ) =
            UniversityComponent.initModelFromUniversity
                (User.withProfileGetUniversity userWithProfile)
    in
    ( Edit
        { displayName = displayName
        , introduction = introduction
        , university = universityModel
        , before = userWithProfile
        }
    , [ EmissionReplaceElementText { id = nickNameEditorId, text = displayName }
      , EmissionReplaceElementText { id = introductionEditorId, text = introduction }
      ]
        ++ (universityEmissions |> List.map EmissionByUniversity)
    )



{- ====== View ====== -}


view :
    LogInState.LogInState
    -> Bool
    -> Model
    ->
        { title : Maybe String
        , tab : BasicParts.Tab Msg
        , html : List (Html.Html Msg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view logInState isWideScreen model =
    { title =
        Just
            (case model of
                LoadingWithUserId id ->
                    "ID=" ++ User.idToString id ++ "のユーザーページ"

                LoadingWithUserIdAndName withName ->
                    User.withNameGetDisplayName withName ++ "さんのユーザーページ"

                Normal withProfile ->
                    User.withProfileGetDisplayName withProfile ++ "さんのユーザーページ"

                Edit _ ->
                    "プロフィール編集"
            )
    , tab = BasicParts.tabSingle "プロフィール"
    , html =
        [ Html.div
            [ Html.Attributes.class "container" ]
            (case ( logInState, model ) of
                ( LogInState.Ok { userWithName }, Normal normalUser ) ->
                    if User.withNameGetId userWithName == User.withProfileGetId normalUser then
                        normalMyProfileView isWideScreen normalUser

                    else
                        normalView isWideScreen normalUser

                ( _, Normal user ) ->
                    normalView isWideScreen user

                ( _, LoadingWithUserId userId ) ->
                    loadingWithUserIdView userId

                ( _, LoadingWithUserIdAndName withName ) ->
                    loadingWithUserIdAndNameView isWideScreen withName

                ( LogInState.Ok { token }, Edit editModel ) ->
                    editView token editModel

                ( _, Edit _ ) ->
                    [ Html.text "自分以外のプロフィールは編集できない" ]
            )
        ]
    , bottomNavigation = Just BasicParts.User
    }


loadingWithUserIdView : User.Id -> List (Html.Html msg)
loadingWithUserIdView userId =
    [ Html.text ("ユーザーID" ++ User.idToString userId ++ "のプロフィールを読み込み中")
    , Icon.loading { size = 48, color = Css.rgb 0 0 0 }
    ]


loadingWithUserIdAndNameView : Bool -> User.WithName -> List (Html.Html msg)
loadingWithUserIdAndNameView isWideScreen userWithName =
    imageAndDisplayNameView
        isWideScreen
        (User.withNameGetImageUrl userWithName)
        (User.withNameGetDisplayName userWithName)
        ++ [ Html.text (User.withNameGetDisplayName userWithName ++ "さんの紹介文、学群学類を読み込み中")
           , Icon.loading { size = 48, color = Css.rgb 0 0 0 }
           ]


profileContainerStyle : List (Html.Attribute a)
profileContainerStyle =
    [ Html.Attributes.style "display" "grid"
    , Html.Attributes.style "max-width" "40rem"
    , Html.Attributes.style "gap" "16px"
    , Html.Attributes.style "padding" "16px"
    , Html.Attributes.style "box-sizing" "border-box"
    , Html.Attributes.style "width" "100%"
    ]


normalView : Bool -> User.WithProfile -> List (Html.Html Msg)
normalView isWideScreen user =
    [ Html.div
        profileContainerStyle
        (userView isWideScreen user
            ++ [ userDataLink (User.withProfileGetId user) ]
        )
    ]


normalMyProfileView : Bool -> User.WithProfile -> List (Html.Html Msg)
normalMyProfileView isWideScreen user =
    [ Html.div
        profileContainerStyle
        (userView isWideScreen user
            ++ [ userPrivateDataLink (User.withProfileGetId user) ]
            ++ [ toEditButton, logOutButton ]
        )
    ]


{-| ユーザーの情報表示
-}
userView : Bool -> User.WithProfile -> List (Html.Html msg)
userView isWideScreen userWithProfile =
    imageAndDisplayNameView
        isWideScreen
        (User.withProfileGetImageUrl userWithProfile)
        (User.withProfileGetDisplayName userWithProfile)
        ++ [ introductionView (User.withProfileGetIntroduction userWithProfile)
           ]
        ++ universityView (User.withProfileGetUniversity userWithProfile)
        ++ [ Html.text ("ユーザーID " ++ (userWithProfile |> User.withProfileGetId |> User.idToString))
           ]


imageAndDisplayNameView : Bool -> String -> String -> List (Html.Html msg)
imageAndDisplayNameView isWideScreen url displayName =
    if isWideScreen then
        [ Html.div
            [ Html.Attributes.style "display" "flex"
            , Html.Attributes.style "justify-content" "center"
            ]
            [ Html.img
                [ Html.Attributes.style "border-radius" "50%"
                , Html.Attributes.style "width" "200px"
                , Html.Attributes.style "height" "200px"
                , Html.Attributes.style "flex-shrink" "0"
                , Html.Attributes.src url
                ]
                []
            , Html.div
                [ Html.Attributes.style "flex-grow" "1"
                , Html.Attributes.style "font-size" "1.5rem"
                ]
                [ Html.text displayName ]
            ]
        ]

    else
        [ Html.div
            [ Html.Attributes.style "display" "flex"
            , Html.Attributes.style "justify-content" "center"
            ]
            [ Html.img
                [ Html.Attributes.style "border-radius" "50%"
                , Html.Attributes.style "width" "200px"
                , Html.Attributes.style "height" "200px"
                , Html.Attributes.style "flex-shrink" "0"
                , Html.Attributes.src url
                ]
                []
            ]
        , Html.div
            [ Html.Attributes.style "flex-grow" "1"
            , Html.Attributes.style "font-size" "1.5rem"
            ]
            [ Html.text displayName ]
        ]


introductionView : String -> Html.Html msg
introductionView introduction =
    Page.Style.titleAndContent "紹介文"
        (Html.div []
            (introduction
                |> String.lines
                |> List.map Html.text
                |> List.intersperse (Html.br [] [])
            )
        )


universityView : Data.University.University -> List (Html.Html msg)
universityView university =
    let
        { graduate, school, department } =
            Data.University.universityToJapaneseString university
    in
    (case graduate of
        Just g ->
            [ Page.Style.titleAndContent
                "研究科"
                (Html.div
                    []
                    [ Html.text g ]
                )
            ]

        Nothing ->
            []
    )
        ++ (case school of
                Just s ->
                    [ Page.Style.titleAndContent "学群"
                        (Html.div
                            []
                            [ Html.text s ]
                        )
                    ]

                Nothing ->
                    []
           )
        ++ (case department of
                Just d ->
                    [ Page.Style.titleAndContent "学類"
                        (Html.div
                            []
                            [ Html.text d ]
                        )
                    ]

                Nothing ->
                    []
           )


userDataLink : User.Id -> Html.Html msg
userDataLink userId =
    Html.div
        [ Html.Attributes.style "display" "grid"
        , Html.Attributes.style "gap" "8px"
        , Html.Attributes.style "padding" "0 0 48px 0"
        ]
        [ userDataLinkItem (PageLocation.SoldProducts userId) "出品した商品"
        ]


userPrivateDataLink : User.Id -> Html.Html msg
userPrivateDataLink userId =
    Html.div
        [ Html.Attributes.style "display" "grid"
        , Html.Attributes.style "gap" "8px"
        , Html.Attributes.style "padding" "0 0 48px 0"
        ]
        [ userDataLinkItem PageLocation.LikedProducts "いいねした商品"
        , userDataLinkItem PageLocation.History "閲覧した商品"
        , userDataLinkItem (PageLocation.SoldProducts userId) "出品した商品"
        , userDataLinkItem PageLocation.BoughtProducts "購入した商品"
        , userDataLinkItem PageLocation.TradingProducts "進行中の取引"
        , userDataLinkItem PageLocation.TradedProducts "過去にした取引"
        , userDataLinkItem PageLocation.CommentedProducts "コメントをした商品"
        ]


userDataLinkItem : PageLocation.PageLocation -> String -> Html.Html msg
userDataLinkItem link text =
    Html.a
        [ Html.Attributes.href (PageLocation.toUrlAsString link)
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
        [ Icon.edit "width:32px;height:32px"
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
        ([ ( "nickNameEditor", displayNameEditor editModel.displayName )
         , ( "introductionEditor", introductionEditor editModel.introduction )
         ]
            ++ (UniversityComponent.view editModel.university
                    |> List.map (Tuple.mapSecond (Html.map MsgByUniversity))
               )
            ++ [ ( "button", editButton access editModel )
               ]
        )
    ]


displayNameEditor : String -> Html.Html Msg
displayNameEditor displayName =
    Html.div
        []
        ([ Html.label
            [ Html.Attributes.class "form-label"
            , Html.Attributes.for nickNameEditorId
            ]
            [ Html.text "表示名" ]
         , Html.input
            [ Html.Attributes.attribute "autocomplete" "username"
            , Html.Attributes.id nickNameEditorId
            , Html.Attributes.class "form-input"
            , Html.Events.onInput MsgInputDisplayName
            ]
            []
         ]
            ++ (if String.length displayName < 1 then
                    [ Html.text "表示名は 1文字以上である必要があります" ]

                else if 50 < String.length displayName then
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
            [ Html.Attributes.id introductionEditorId
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
editModelToProfileUpdateData { displayName, introduction, university } =
    if 1 <= String.length displayName && String.length displayName <= 50 then
        case UniversityComponent.getUniversity university of
            Just univ ->
                Just
                    { displayName = displayName
                    , introduction = introduction
                    , image = Nothing
                    , university = univ
                    }

            Nothing ->
                Nothing

    else
        Nothing
