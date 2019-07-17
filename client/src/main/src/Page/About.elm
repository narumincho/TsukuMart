module Page.About exposing (Model, aboutModel, privacyPolicyModel, view)

import BasicParts
import Html
import Html.Attributes
import PageLocation


type Model
    = About
    | PrivacyPolicy


aboutModel : Model
aboutModel =
    About


privacyPolicyModel : Model
privacyPolicyModel =
    PrivacyPolicy


view :
    Model
    ->
        { title : String
        , tab : BasicParts.Tab msg
        , html : List (Html.Html msg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view model =
    case model of
        About ->
            { title = "つくマートについて"
            , tab = BasicParts.tabNone
            , html =
                [ Html.div
                    [ Html.Attributes.class "container" ]
                    [ Html.div []
                        [ Html.text "つくマートについて"
                        , Html.a
                            [ Html.Attributes.href PageLocation.aboutPrivacyPolicyUrl
                            , Html.Attributes.class "mainButton"
                            ]
                            [ Html.text "プライバシーポリシー" ]
                        ]
                    ]
                ]
            , bottomNavigation = Nothing
            }

        PrivacyPolicy ->
            { title = "プライバシーポリシー"
            , tab = BasicParts.tabNone
            , html =
                [ Html.div
                    [ Html.Attributes.class "container" ]
                    [ Html.text "プライバシーポリシー" ]
                ]
            , bottomNavigation = Nothing
            }
