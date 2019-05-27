module Page.Component.LogInOrSignUp exposing
    ( Emit(..)
    , Model
    , Msg(..)
    , initModel
    , update
    , view
    )

import Data.EmailAddress
import Data.SocialLoginService
import Data.StudentId
import Html
import Html.Attributes as A
import Html.Events
import Svg
import Svg.Attributes


type Model
    = Model
        { mouseState : MouseState
        , waitLogInUrl : Maybe Data.SocialLoginService.SocialLoginService -- ログインするためURLを取得中かどうか
        }


type MouseState
    = MouseStateNone
    | MouseStateEnter Data.SocialLoginService.SocialLoginService
    | MouseStateDown Data.SocialLoginService.SocialLoginService


type Emit
    = EmitLogInOrSignUp Data.SocialLoginService.SocialLoginService


type Msg
    = LogInOrSignUpRequest Data.SocialLoginService.SocialLoginService
    | MouseEnterLogInButton Data.SocialLoginService.SocialLoginService
    | MouseLeave
    | MouseDownLogInButton Data.SocialLoginService.SocialLoginService
    | MouseUp

initModel : Model
initModel =
    Model
        { mouseState = MouseStateNone
        , waitLogInUrl = Nothing
        }


update : Msg -> Model -> ( Model, List Emit )
update msg (Model r) =
    case msg of
        LogInOrSignUpRequest service ->
            ( Model { r | waitLogInUrl = Just service }
            , [ EmitLogInOrSignUp service ]
            )

        MouseEnterLogInButton service ->
            ( Model
                { r | mouseState = MouseStateEnter service }
            , []
            )

        MouseLeave ->
            ( Model
                { r | mouseState = MouseStateNone }
            , []
            )

        MouseDownLogInButton service ->
            ( Model
                { r | mouseState = MouseStateDown service }
            , []
            )

        MouseUp ->
            ( Model
                { r
                    | mouseState =
                        case r.mouseState of
                            MouseStateNone ->
                                MouseStateNone

                            MouseStateEnter element ->
                                MouseStateEnter element

                            MouseStateDown element ->
                                MouseStateEnter element
                }
            , []
            )



{- =================================
               View
   =================================
-}


view : Model -> Html.Html Msg
view (Model { mouseState, waitLogInUrl }) =
    Html.div
        [ A.class "logIn" ]
        [ Html.div
            [ A.class "logIn-group" ]
            ([ Html.div
                []
                [ Html.text "ログイン/新規登録するためには以下のどれかのアカウントが必要です" ]
             ]
                ++ (case waitLogInUrl of
                        Just service ->
                            [ Html.div []
                                [ Html.text
                                    (Data.SocialLoginService.serviceName service)
                                ]
                            ]

                        Nothing ->
                            serviceLogInButtonListView mouseState
                   )
            )
        ]


serviceLogInButtonListView : MouseState -> List (Html.Html Msg)
serviceLogInButtonListView mouseState =
    [ logInButtonNoLine mouseState googleIcon Data.SocialLoginService.Google
    , logInButtonNoLine mouseState gitHubIcon Data.SocialLoginService.GitHub
    , logInButtonNoLine mouseState twitterIcon Data.SocialLoginService.Twitter
    , Html.button
        [ Html.Events.onClick (LogInOrSignUpRequest Data.SocialLoginService.Line)
        , Html.Events.onMouseEnter (MouseEnterLogInButton Data.SocialLoginService.Line)
        , Html.Events.onMouseLeave MouseLeave
        , Html.Events.onMouseDown (MouseDownLogInButton Data.SocialLoginService.Line)
        , Html.Events.onMouseUp MouseUp
        , A.style "background-color"
            (case mouseState of
                MouseStateEnter Data.SocialLoginService.Line ->
                    "#00e000"

                MouseStateDown Data.SocialLoginService.Line ->
                    "#00b300"

                _ ->
                    "#00c300"
            )
        , A.style "border-radius" "4px"
        , A.style "border" "none"
        , A.style "color" "#FFF"
        , A.style "display" "flex"
        , A.style "align-items" "center"
        , A.style "padding" "0"
        , A.style "cursor" "pointer"
        ]
        [ Html.img
            [ A.src "/assets/line_icon120.png"
            , A.style "width" "44px"
            , A.style "height" "44px"
            , A.style "border-right"
                ("solid 1px "
                    ++ (case mouseState of
                            MouseStateEnter Data.SocialLoginService.Line ->
                                "#00c900"

                            MouseStateDown Data.SocialLoginService.Line ->
                                "#009800"

                            _ ->
                                "#00b300"
                       )
                )
            , A.style "padding" "4px"
            ]
            []
        , logInButtonText "LINEでログイン"
        ]
    ]


logInButtonNoLine : MouseState -> Html.Html Msg -> Data.SocialLoginService.SocialLoginService -> Html.Html Msg
logInButtonNoLine mouseSate icon service =
    Html.button
        [ Html.Events.onClick (LogInOrSignUpRequest service)
        , Html.Events.onMouseEnter (MouseEnterLogInButton service)
        , Html.Events.onMouseLeave MouseLeave
        , Html.Events.onMouseDown (MouseDownLogInButton service)
        , Html.Events.onMouseUp MouseUp
        , A.style "background-color"
            (case mouseSate of
                MouseStateDown s ->
                    if s == service then
                        "#ccc"

                    else
                        "#ddd"

                MouseStateEnter s ->
                    if s == service then
                        "#eee"

                    else
                        "#ddd"

                MouseStateNone ->
                    "#ddd"
            )
        , A.style "border-radius" "4px"
        , A.style "border" "none"
        , A.style "color" "#111"
        , A.style "display" "flex"
        , A.style "align-items" "center"
        , A.style "padding" "0"
        , A.style "cursor" "pointer"
        ]
        [ icon
        , logInButtonText (Data.SocialLoginService.serviceName service ++ "でログイン")
        ]


logInButtonText : String -> Html.Html msg
logInButtonText text =
    Html.div
        [ A.style "flex-grow" "1"
        , A.style "font-weight" "bold"
        ]
        [ Html.text text ]


gitHubIcon : Html.Html msg
gitHubIcon =
    Svg.svg
        [ Svg.Attributes.viewBox "0 0 20 20"
        , Svg.Attributes.style "width:40px;height:40px;padding:6px"
        ]
        [ Svg.path
            [ Svg.Attributes.d
                "M10 0C4.476 0 0 4.477 0 10c0 4.418 2.865 8.166 6.84 9.49.5.09.68-.218.68-.483 0-.237-.007-.866-.012-1.7-2.782.603-3.37-1.34-3.37-1.34-.454-1.157-1.11-1.464-1.11-1.464-.907-.62.07-.608.07-.608 1.003.07 1.53 1.03 1.53 1.03.893 1.53 2.342 1.087 2.912.83.09-.645.35-1.085.634-1.335-2.22-.253-4.555-1.11-4.555-4.943 0-1.09.39-1.984 1.03-2.683-.105-.253-.448-1.27.096-2.647 0 0 .84-.268 2.75 1.026C8.294 4.95 9.15 4.84 10 4.836c.85.004 1.705.115 2.504.337 1.91-1.294 2.747-1.026 2.747-1.026.548 1.377.204 2.394.1 2.647.64.7 1.03 1.592 1.03 2.683 0 3.842-2.34 4.687-4.566 4.935.36.308.678.92.678 1.852 0 1.336-.01 2.415-.01 2.743 0 .267.18.578.687.48C17.14 18.163 20 14.417 20 10c0-5.522-4.478-10-10-10"
            , Svg.Attributes.stroke "none"
            , Svg.Attributes.fill "#000000"
            ]
            []
        ]


googleIcon : Html.Html msg
googleIcon =
    Svg.svg
        [ Svg.Attributes.viewBox "0 0 20 20"
        , Svg.Attributes.style "width:40px;height:40px;padding:6px"
        ]
        [ Svg.path
            [ Svg.Attributes.d "M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"
            , Svg.Attributes.stroke "none"
            , Svg.Attributes.fill "rgb(66,133,244)"
            ]
            []
        , Svg.path
            [ Svg.Attributes.d
                "M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"
            , Svg.Attributes.stroke "none"
            , Svg.Attributes.fill "rgb(52,168,83)"
            ]
            []
        , Svg.path
            [ Svg.Attributes.d
                "M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 0 0 0 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"
            , Svg.Attributes.stroke "none"
            , Svg.Attributes.fill "rgb(251,188,5)"
            ]
            []
        , Svg.path
            [ Svg.Attributes.d
                "M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"
            , Svg.Attributes.stroke "none"
            , Svg.Attributes.fill "rgb(234,67,53)"
            ]
            []
        ]


twitterIcon : Html.Html msg
twitterIcon =
    Svg.svg
        [ Svg.Attributes.viewBox "0 0 20 20"
        , Svg.Attributes.style "width:40px;height:40px;padding:6px"
        ]
        [ Svg.path
            [ Svg.Attributes.d "M20 3.924c-.736.326-1.527.547-2.357.646.848-.508 1.498-1.312 1.804-2.27-.792.47-1.67.812-2.605.996C16.092 2.498 15.027 2 13.847 2 11.58 2 9.743 3.837 9.743 6.103c0 .322.037.635.107.935-3.41-.17-6.434-1.804-8.458-4.287-.352.61-.555 1.314-.555 2.066 0 1.423.724 2.68 1.825 3.415-.672-.02-1.305-.206-1.858-.513v.052c0 1.987 1.414 3.645 3.29 4.022-.344.096-.706.146-1.08.146-.265 0-.522-.026-.772-.074.522 1.63 2.037 2.818 3.833 2.85C4.67 15.81 2.9 16.468.98 16.468c-.332 0-.66-.02-.98-.057 1.816 1.166 3.973 1.846 6.29 1.846 7.547 0 11.674-6.253 11.674-11.675 0-.18-.004-.355-.01-.53.8-.58 1.496-1.3 2.046-2.125"
            , Svg.Attributes.stroke "none"
            , Svg.Attributes.fill "rgb(85,172,238)"
            ]
            []
        ]
