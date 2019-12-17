module Page.About exposing (Model, aboutModel, privacyPolicyModel, view)

import BasicParts
import Html.Styled
import Html.Styled.Attributes
import PageLocation
import Style


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
        , view : Html.Styled.Html msg
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view model =
    case model of
        About ->
            { title = "つくマートについて"
            , tab = BasicParts.tabNone
            , view =
                Style.mainView
                    [ Style.container
                        [ Html.Styled.text "つくマートについてはまだ書かれていません"
                        , Style.mainButtonLink
                            [ Html.Styled.text "プライバシーポリシー(未完成)" ]
                            (Just PageLocation.AboutPrivacyPolicy)
                        ]
                    ]
            , bottomNavigation = Nothing
            }

        PrivacyPolicy ->
            { title = "プライバシーポリシー"
            , tab = BasicParts.tabNone
            , view =
                Style.mainView
                    [ Style.container
                        [ Html.Styled.text "プライバシーポリシーはまだ書かれていません" ]
                    ]
            , bottomNavigation = Nothing
            }
