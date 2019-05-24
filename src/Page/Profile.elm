module Page.Profile exposing (Model(..), initFromUserId, userView, view)

import Data.University
import Data.User as User
import Html
import Html.Attributes
import Tab


type Model
    = LoadingWithId User.UserId
    | LoadingWithIdAndName
        { userId : User.UserId
        , userName : String
        }
    | Normal { user : User.User }


initFromUserId : User.UserId -> Model
initFromUserId =
    LoadingWithId


view : Model -> ( String, Tab.Tab msg, List (Html.Html msg) )
view model =
    case model of
        LoadingWithId id ->
            ( "ID=" ++ User.userIdToString id ++ "のユーザー情報読み込み中"
            , Tab.single "プロフィールを読み込み中"
            , [ Html.div
                    [ Html.Attributes.class "profile" ]
                    [ Html.text "読み込み中" ]
              ]
            )

        LoadingWithIdAndName { userName } ->
            ( userName ++ "さんのユーザー情報を読み込み中"
            , Tab.single (userName ++ "さんのユーザー情報を読み込み中")
            , [ Html.div
                    [ Html.Attributes.class "profile" ]
                    [ Html.text "読み込み中" ]
              ]
            )

        Normal { user } ->
            ( ""
            , Tab.none
            , [ Html.div
                    [ Html.Attributes.class "profile" ]
                    (userView user)
              ]
            )


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
