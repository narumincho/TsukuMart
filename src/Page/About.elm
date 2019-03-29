module Page.About exposing (view)

import Html
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
            , [ Html.text "つくマートについて" ]
            )

        PrivacyPolicy ->
            ( "プライバシーポリシー"
            , Tab.none
            , [ Html.text "プライバシーポリシー" ]
            )
