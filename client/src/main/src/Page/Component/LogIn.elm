module Page.Component.LogIn exposing
    ( Emission(..)
    , Model
    , Msg(..)
    , initModel
    , update
    , view
    )

import Css
import Data.SocialLoginService
import Html
import Html.Attributes as A
import Html.Events
import Icon


type Model
    = Model
        { mouseState : MouseState
        , waitLogInUrl : Maybe Data.SocialLoginService.SocialLoginService -- ログインするためURLを取得中かどうか
        }


type MouseState
    = MouseStateNone
    | MouseStateEnter Data.SocialLoginService.SocialLoginService
    | MouseStateDown Data.SocialLoginService.SocialLoginService


type Emission
    = EmissionLogInOrSignUp Data.SocialLoginService.SocialLoginService


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


update : Msg -> Model -> ( Model, List Emission )
update msg (Model r) =
    case msg of
        LogInOrSignUpRequest service ->
            ( Model { r | waitLogInUrl = Just service }
            , [ EmissionLogInOrSignUp service ]
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
                                    (Data.SocialLoginService.serviceName service
                                        ++ "のログイン画面へのURLを取得中"
                                    )
                                ]
                            , Icon.loading { size = 64, color = Css.rgb 0 0 0 }
                            ]

                        Nothing ->
                            serviceLogInButtonListView mouseState
                   )
            )
        ]


serviceLogInButtonListView : MouseState -> List (Html.Html Msg)
serviceLogInButtonListView mouseState =
    [ logInButtonNoLine mouseState Icon.google Data.SocialLoginService.Google
    , logInButtonNoLine mouseState Icon.gitHub Data.SocialLoginService.GitHub
    , logInButtonNoLine mouseState Icon.twitter Data.SocialLoginService.Twitter
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
