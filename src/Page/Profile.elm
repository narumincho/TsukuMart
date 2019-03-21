module Page.Profile exposing (Model, initModel, view)

import Data.University
import Data.User as Profile
import Html
import Html.Attributes
import Tab


type Model
    = Model


initModel : Model
initModel =
    Model


view : Maybe Profile.User -> Model -> ( Tab.Tab Never, List (Html.Html msg) )
view profileMaybe model =
    ( Tab.Single "プロフィール"
    , [ Html.div
            [ Html.Attributes.class "profile-container" ]
            [ Html.div
                [ Html.Attributes.class "profile" ]
                (case profileMaybe of
                    Just profile ->
                        [ nickNameView (Profile.getNickName profile)
                        , introductionView (Profile.getIntroduction profile)
                        ]
                            ++ universityView (Profile.getUniversity profile)

                    Nothing ->
                        [ Html.text "プロフィールがまだ読み込まれていません" ]
                )
            ]
      ]
    )


nickNameView : String -> Html.Html msg
nickNameView nickName =
    Html.div
        []
        [ Html.text ("表示名:" ++ nickName) ]


introductionView : String -> Html.Html msg
introductionView introduction =
    Html.div
        []
        [ Html.text ("紹介文:" ++ introduction) ]


universityView : Data.University.University -> List (Html.Html msg)
universityView university =
    let
        { graduate, school, department } =
            Data.University.universityToJapaneseString university
    in
    (case graduate of
        Just g ->
            [ Html.div [] [ Html.text ("研究科:" ++ g) ] ]

        Nothing ->
            []
    )
        ++ (case school of
                Just s ->
                    [ Html.div [] [ Html.text ("学群:" ++ s) ] ]

                Nothing ->
                    []
           )
        ++ (case department of
                Just d ->
                    [ Html.div [] [ Html.text ("学類:" ++ d) ] ]

                Nothing ->
                    []
           )
