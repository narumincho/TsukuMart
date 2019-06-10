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


view : Model -> { title : String, tab : Tab.Tab msg, html : List (Html.Html msg) }
view model =
    case model of
        About ->
            { title = "つくマートについて"
            , tab = Tab.none
            , html =
                [ Html.div
                    [ Html.Attributes.class "container" ]
                    [ Html.div []
                        [ Html.text "つくマートについて"
                        , Html.a
                            [ Html.Attributes.href SiteMap.aboutPrivacyPolicyUrl
                            , Html.Attributes.class "mainButton"
                            ]
                            [ Html.text "プライバシーポリシー" ]
                        ]
                    ]
                ]
            }

        PrivacyPolicy ->
            { title = "プライバシーポリシー"
            , tab = Tab.none
            , html =
                [ Html.div
                    [ Html.Attributes.class "container" ]
                    [ Html.text "プライバシーポリシー" ]
                ]
            }
