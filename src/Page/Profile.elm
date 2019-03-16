module Page.Profile exposing (Model, initModel, view)

import Data.Profile as Profile
import Data.University
import Html
import Tab


type Model
    = Model


initModel : Model
initModel =
    Model


view : Maybe Profile.Profile -> Model -> ( Tab.Tab Never, List (Html.Html msg) )
view profileMaybe model =
    ( Tab.Single "プロフィール"
    , case profileMaybe of
        Just profile ->
            [ Html.div [] [ Html.text ("表示名:" ++ Profile.getNickName profile) ]
            , Html.div [] [ Html.text ("紹介文:" ++ Profile.getIntroduction profile) ]
            , Html.div []
                [ Html.text
                    (case Data.University.universityToJapaneseString (Profile.getUniversity profile) of
                        { graduate, school, department } ->
                            (graduate
                                |> Maybe.map (\g -> "研究科:" ++ g)
                                |> Maybe.withDefault ""
                            )
                                ++ (school
                                        |> Maybe.map (\s -> "学群:" ++ s)
                                        |> Maybe.withDefault ""
                                   )
                                ++ (department
                                        |> Maybe.map (\d -> "学類:" ++ d)
                                        |> Maybe.withDefault ""
                                   )
                    )
                ]
            ]

        Nothing ->
            [ Html.text "プロフィールがまだ読み込まれていません" ]
    )
