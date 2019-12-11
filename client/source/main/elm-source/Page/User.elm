module Page.User exposing
    ( Cmd(..)
    , Model
    , Msg(..)
    , getUser
    , initialModel
    , update
    , view
    )

import Api
import BasicParts
import Component.University
import Css
import Data.ImageId
import Data.LogInState as LogInState
import Data.University
import Data.User as User
import Html
import Html.Attributes
import Html.Events
import Html.Keyed
import Html.Styled
import Html.Styled.Attributes
import Html.Styled.Events
import Icon
import PageLocation
import Style


type Model
    = LoadingWithUserId User.Id
    | LoadingWithUserIdAndName User.WithName
    | Normal User.WithProfile
    | Edit EditModel


type alias EditModel =
    { displayName : String
    , introduction : String
    , university : Component.University.Model
    , before : User.WithProfile
    }


type Cmd
    = CmdGetUserProfile User.Id
    | CmdChangeProfile Api.Token Api.ProfileUpdateData
    | CmdReplaceElementText { id : String, text : String }
    | CmdByUniversity Component.University.Cmd
    | CmdLogOut
    | CmdAddLogMessage String
    | CmdJumpToLineNotifySetting Api.Token


type Msg
    = MsgToEditMode
    | MsgInputDisplayName String
    | MsgInputIntroduction String
    | MsgByUniversity Component.University.Msg
    | MsgBackToViewMode
    | MsgChangeProfile Api.Token Api.ProfileUpdateData
    | MsgChangeProfileResponse (Result String User.WithProfile)
    | MsgLogOut
    | MsgUserProfileResponse (Result String User.WithProfile)
    | MsgToLineNotifySetting Api.Token


{-| 外部ページから飛んで来たときはユーザーIDだけを頼りにしてユーザーページを作らなければならない
-}
initialModel : LogInState.LogInState -> User.Id -> ( Model, List Cmd )
initialModel logInState userId =
    case logInState of
        LogInState.Ok { userWithName } ->
            if User.withNameGetId userWithName == userId then
                ( LoadingWithUserIdAndName userWithName
                , [ CmdGetUserProfile userId ]
                )

            else
                ( LoadingWithUserId userId
                , [ CmdGetUserProfile userId ]
                )

        _ ->
            ( LoadingWithUserId userId
            , [ CmdGetUserProfile userId ]
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


update : Msg -> Model -> ( Model, List Cmd )
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
                            Component.University.update
                                componentMsg
                                r.university
                    in
                    ( Edit { r | university = componentModel }
                    , componentEmittions |> List.map CmdByUniversity
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
            , [ CmdChangeProfile token profile ]
            )

        MsgChangeProfileResponse result ->
            case result of
                Ok profile ->
                    ( Normal profile
                    , [ CmdAddLogMessage "ユーザー情報を更新しました" ]
                    )

                _ ->
                    ( model
                    , [ CmdAddLogMessage "ユーザー情報を更新に失敗しました" ]
                    )

        MsgLogOut ->
            ( model
            , [ CmdLogOut ]
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
                    , [ CmdAddLogMessage ("ユーザー情報の取得に失敗しました " ++ string) ]
                    )

        MsgToLineNotifySetting token ->
            ( model
            , [ CmdJumpToLineNotifySetting token ]
            )


toEditMode : User.WithProfile -> ( Model, List Cmd )
toEditMode userWithProfile =
    let
        displayName =
            User.withProfileGetDisplayName userWithProfile

        introduction =
            User.withProfileGetIntroduction userWithProfile

        ( universityModel, universityCmds ) =
            Component.University.initModelFromUniversity
                (User.withProfileGetUniversity userWithProfile)
    in
    ( Edit
        { displayName = displayName
        , introduction = introduction
        , university = universityModel
        , before = userWithProfile
        }
    , [ CmdReplaceElementText { id = nickNameEditorId, text = displayName }
      , CmdReplaceElementText { id = introductionEditorId, text = introduction }
      ]
        ++ (universityCmds |> List.map CmdByUniversity)
    )



{- ====== View ====== -}


view :
    LogInState.LogInState
    -> Bool
    -> Model
    ->
        { title : Maybe String
        , tab : BasicParts.Tab Msg
        , html : List (Html.Styled.Html Msg)
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
        [ Style.container
            (case ( logInState, model ) of
                ( LogInState.Ok { userWithName, token }, Normal normalUser ) ->
                    if User.withNameGetId userWithName == User.withProfileGetId normalUser then
                        normalMyProfileView token isWideScreen normalUser

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
                    [ Html.Styled.text "自分以外のプロフィールは編集できない" ]
            )
        ]
    , bottomNavigation = Just BasicParts.User
    }


loadingWithUserIdView : User.Id -> List (Html.Styled.Html msg)
loadingWithUserIdView userId =
    [ Html.Styled.text ("ユーザーID" ++ User.idToString userId ++ "のプロフィールを読み込み中")
    , Icon.loading { size = 48, color = Css.rgb 0 0 0 }
    ]


loadingWithUserIdAndNameView : Bool -> User.WithName -> List (Html.Styled.Html msg)
loadingWithUserIdAndNameView isWideScreen userWithName =
    imageAndDisplayNameView
        isWideScreen
        (User.withNameGetImageId userWithName)
        (User.withNameGetDisplayName userWithName)
        ++ [ Html.Styled.text (User.withNameGetDisplayName userWithName ++ "さんの紹介文、学群学類を読み込み中")
           , Icon.loading { size = 48, color = Css.rgb 0 0 0 }
           ]


normalView : Bool -> User.WithProfile -> List (Html.Styled.Html Msg)
normalView isWideScreen user =
    userView isWideScreen user
        ++ [ userDataLink (User.withProfileGetId user) ]


normalMyProfileView : Api.Token -> Bool -> User.WithProfile -> List (Html.Styled.Html Msg)
normalMyProfileView token isWideScreen user =
    userView isWideScreen user
        ++ [ userPrivateDataLink (User.withProfileGetId user)
           , lineNotifySettingButton token
           , toEditButton
           , logOutButton
           ]


{-| ユーザーの情報表示
-}
userView : Bool -> User.WithProfile -> List (Html.Styled.Html msg)
userView isWideScreen userWithProfile =
    imageAndDisplayNameView
        isWideScreen
        (User.withProfileGetImageId userWithProfile)
        (User.withProfileGetDisplayName userWithProfile)
        ++ introductionView (User.withProfileGetIntroduction userWithProfile)
        :: universityView (User.withProfileGetUniversity userWithProfile)
        ++ [ Html.Styled.text ("ユーザーID " ++ (userWithProfile |> User.withProfileGetId |> User.idToString))
           ]


imageAndDisplayNameView : Bool -> Data.ImageId.ImageId -> String -> List (Html.Styled.Html msg)
imageAndDisplayNameView isWideScreen imageId displayName =
    if isWideScreen then
        [ Html.Styled.div
            [ Html.Styled.Attributes.css
                [ Css.displayFlex
                , Css.justifyContent Css.center
                ]
            ]
            [ Style.userImage 200 imageId
            , Html.Styled.div
                [ Html.Styled.Attributes.css
                    [ Css.flexGrow (Css.int 1)
                    , Css.fontSize (Css.rem 1.5)
                    ]
                ]
                [ Html.Styled.text displayName ]
            ]
        ]

    else
        [ Html.Styled.div
            [ Html.Styled.Attributes.css
                [ Css.displayFlex
                , Css.justifyContent Css.center
                ]
            ]
            [ Style.userImage 200 imageId ]
        , Html.Styled.div
            [ Html.Styled.Attributes.css
                [ Css.fontSize (Css.rem 1.5) ]
            ]
            [ Html.Styled.text displayName ]
        ]


introductionView : String -> Html.Styled.Html msg
introductionView =
    String.lines
        >> List.map Html.Styled.text
        >> List.intersperse (Html.Styled.br [] [])
        >> Html.Styled.div []
        >> Style.titleAndContentStyle "紹介文"


universityView : Data.University.University -> List (Html.Styled.Html msg)
universityView university =
    let
        { graduate, school, department } =
            Data.University.universityToJapaneseString university
    in
    (case graduate of
        Just g ->
            [ Style.titleAndContentStyle
                "研究科"
                (Html.Styled.div
                    []
                    [ Html.Styled.text g ]
                )
            ]

        Nothing ->
            []
    )
        ++ (case school of
                Just s ->
                    [ Style.titleAndContentStyle "学群"
                        (Html.Styled.div
                            []
                            [ Html.Styled.text s ]
                        )
                    ]

                Nothing ->
                    []
           )
        ++ (case department of
                Just d ->
                    [ Style.titleAndContentStyle "学類"
                        (Html.Styled.div
                            []
                            [ Html.Styled.text d ]
                        )
                    ]

                Nothing ->
                    []
           )


userDataLink : User.Id -> Html.Styled.Html msg
userDataLink userId =
    dataLinkContainer
        [ ( PageLocation.SoldProducts userId, "出品した商品" ) ]


userPrivateDataLink : User.Id -> Html.Styled.Html msg
userPrivateDataLink userId =
    dataLinkContainer
        [ ( PageLocation.LikedProducts, "いいねした商品" )
        , ( PageLocation.History, "閲覧した商品" )
        , ( PageLocation.SoldProducts userId, "出品した商品" )
        , ( PageLocation.BoughtProducts, "購入した商品" )
        , ( PageLocation.TradingProducts, "進行中の取引" )
        , ( PageLocation.TradedProducts, "過去にした取引" )
        , ( PageLocation.CommentedProducts, "コメントをした商品" )
        ]


dataLinkContainer : List ( PageLocation.PageLocation, String ) -> Html.Styled.Html msg
dataLinkContainer data =
    Html.Styled.div
        [ Html.Styled.Attributes.css
            [ Style.displayGridAndGap 8
            , Css.padding4 Css.zero Css.zero (Css.px 48) Css.zero
            ]
        ]
        (data |> List.map (\( link, text ) -> userDataLinkItem link text))


userDataLinkItem : PageLocation.PageLocation -> String -> Html.Styled.Html msg
userDataLinkItem link text =
    Html.Styled.a
        [ Html.Styled.Attributes.href (PageLocation.toUrlAsString link)
        , Html.Styled.Attributes.css
            [ Css.textDecoration Css.none
            , Css.color (Css.rgb 0 0 0)
            , Css.backgroundColor (Css.rgb 153 153 153)
            , Css.padding (Css.px 16)
            , Css.fontSize (Css.rem 1.5)
            , Css.textAlign Css.center
            ]
        ]
        [ Html.Styled.text text ]


lineNotifySettingButton : Api.Token -> Html.Styled.Html Msg
lineNotifySettingButton token =
    Html.Styled.button
        [ Html.Styled.Attributes.class "mainButton"
        , Html.Styled.Events.onClick (MsgToLineNotifySetting token)
        ]
        [ Html.Styled.text "LINE Notifyで通知を有効にする"
        ]


toEditButton : Html.Styled.Html Msg
toEditButton =
    Html.Styled.button
        [ Html.Styled.Attributes.class "mainButton"
        , Html.Styled.Events.onClick MsgToEditMode
        ]
        [ Icon.edit (Css.batch [ Css.width (Css.px 32), Css.height (Css.px 32) ])
        , Html.Styled.text "編集する"
        ]


logOutButton : Html.Styled.Html Msg
logOutButton =
    Html.Styled.button
        [ Html.Styled.Attributes.class "subButton"
        , Html.Styled.Events.onClick MsgLogOut
        ]
        [ Html.Styled.text "ログアウトする" ]


{-| 編集モードでの表示
-}
editView : Api.Token -> EditModel -> List (Html.Styled.Html Msg)
editView access editModel =
    [ Html.Keyed.node "div"
        [ Html.Attributes.class "form" ]
        ([ ( "nickNameEditor", displayNameEditor editModel.displayName )
         , ( "introductionEditor", introductionEditor editModel.introduction )
         ]
            ++ (Component.University.view editModel.university
                    |> List.map (Tuple.mapSecond (Html.Styled.toUnstyled >> Html.map MsgByUniversity))
               )
            ++ [ ( "button", editButton access editModel )
               ]
        )
        |> Html.Styled.fromUnstyled
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
introductionEditor _ =
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
            (Html.Attributes.class "profile-editOkButton"
                :: (case editModelToProfileUpdateData editModel of
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
        Component.University.getUniversity university
            |> Maybe.map
                (\univ ->
                    { displayName = displayName
                    , introduction = introduction
                    , image = Nothing
                    , university = univ
                    }
                )

    else
        Nothing
