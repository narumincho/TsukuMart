module Page.About exposing (Model, aboutModel, privacyPolicyModel, view)

import BasicParts
import Html.Styled
import Html.Styled.Attributes
import Page.Style
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
        , html : List (Html.Styled.Html msg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view model =
    case model of
        About ->
            { title = "つくマートについて"
            , tab = BasicParts.tabNone
            , html =
                [ Page.Style.container
                    [ Html.Styled.text "つくマートについて"
                    , Html.Styled.a
                        [ Html.Styled.Attributes.href PageLocation.aboutPrivacyPolicyUrl
                        , Html.Styled.Attributes.class "mainButton"
                        ]
                        [ Html.Styled.text "プライバシーポリシー" ]
                    ]
                ]
            , bottomNavigation = Nothing
            }

        PrivacyPolicy ->
            { title = "プライバシーポリシー"
            , tab = BasicParts.tabNone
            , html =
                [ Page.Style.container
                    [ Html.Styled.text "プライバシーポリシー" ]
                ]
            , bottomNavigation = Nothing
            }
