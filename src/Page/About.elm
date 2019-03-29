module Page.About exposing (Model, aboutModel, privacyPolicyModel, view)

import Html
import Html.Attributes
import SiteMap
import Tab


type Model
    = About
    | PrivacyPolicy


aboutModel : Model
aboutModel =
    About


privacyPolicyModel : Model
privacyPolicyModel =
    PrivacyPolicy


view : Model -> ( String, Tab.Tab msg, List (Html.Html msg) )
view model =
    case model of
        About ->
            ( "つくマートについて"
            , Tab.none
            , [ Html.div
                    [ Html.Attributes.class "container" ]
                    [ Html.div []
                        [ Html.text "つくマートについて" ]
                    , Html.a
                        [ Html.Attributes.href SiteMap.aboutPrivacyPolicyUrl
                        , Html.Attributes.class "mainButton"
                        ]
                        [ Html.text "プライバシーポリシー" ]
                    ]
              ]
            )

        PrivacyPolicy ->
            ( "プライバシーポリシー"
            , Tab.none
            , [ Html.div
                    [ Html.Attributes.class "container" ]
                    [ Html.text "プライバシーポリシー" ]
              ]
            )
