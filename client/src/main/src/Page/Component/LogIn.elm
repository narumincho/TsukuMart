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
import Html.Attributes
import Html.Events
import Html.Styled
import Html.Styled.Attributes
import Html.Styled.Events
import Icon
import Page.Style


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
        [ Html.Attributes.class "logIn" ]
        [ Html.Styled.div
            [ Html.Styled.Attributes.css
                [ Page.Style.displayGridAndGap 24
                , Css.padding (Css.px 24)
                ]
            ]
            ([ Html.Styled.div
                []
                [ Html.Styled.text "ログイン/新規登録するためには以下のどれかのアカウントが必要です" ]
             ]
                ++ (case waitLogInUrl of
                        Just service ->
                            [ Html.Styled.div []
                                [ Html.Styled.text
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
            |> Html.Styled.toUnstyled
        ]


serviceLogInButtonListView : MouseState -> List (Html.Styled.Html Msg)
serviceLogInButtonListView mouseState =
    [ logInButtonNoLine mouseState Icon.google Data.SocialLoginService.Google
    , logInButtonNoLine mouseState Icon.gitHub Data.SocialLoginService.GitHub
    , logInButtonNoLine mouseState Icon.twitter Data.SocialLoginService.Twitter
    , logInButtonLine mouseState
    ]


logInButtonLine : MouseState -> Html.Styled.Html Msg
logInButtonLine mouseState =
    Html.Styled.button
        [ Html.Styled.Events.onClick (LogInOrSignUpRequest Data.SocialLoginService.Line)
        , Html.Styled.Events.onMouseEnter (MouseEnterLogInButton Data.SocialLoginService.Line)
        , Html.Styled.Events.onMouseLeave MouseLeave
        , Html.Styled.Events.onMouseDown (MouseDownLogInButton Data.SocialLoginService.Line)
        , Html.Styled.Events.onMouseUp MouseUp
        , Html.Styled.Attributes.css
            [ Css.backgroundColor
                (case mouseState of
                    MouseStateEnter Data.SocialLoginService.Line ->
                        Css.hex "#00e000"

                    MouseStateDown Data.SocialLoginService.Line ->
                        Css.hex "#00b300"

                    _ ->
                        Css.hex "#00c300"
                )
            , Css.borderRadius (Css.px 4)
            , Css.border2 Css.zero Css.none
            , Css.color (Css.rgb 255 255 255)
            , Css.displayFlex
            , Css.alignItems Css.center
            , Css.padding Css.zero
            , Css.cursor Css.pointer
            ]
        ]
        [ Html.Styled.img
            [ Html.Styled.Attributes.src "/assets/line_icon120.png"
            , Html.Styled.Attributes.css
                [ Css.width (Css.px 44)
                , Css.height (Css.px 44)
                , Css.borderRight3
                    (Css.px 1)
                    Css.solid
                    (case mouseState of
                        MouseStateEnter Data.SocialLoginService.Line ->
                            Css.hex "#00c900"

                        MouseStateDown Data.SocialLoginService.Line ->
                            Css.hex "#009800"

                        _ ->
                            Css.hex "#00b300"
                    )
                , Css.padding (Css.px 4)
                ]
            ]
            []
        , logInButtonText "LINEでログイン"
        ]


logInButtonNoLine : MouseState -> Html.Styled.Html Msg -> Data.SocialLoginService.SocialLoginService -> Html.Styled.Html Msg
logInButtonNoLine mouseSate icon service =
    Html.Styled.button
        [ Html.Styled.Events.onClick (LogInOrSignUpRequest service)
        , Html.Styled.Events.onMouseEnter (MouseEnterLogInButton service)
        , Html.Styled.Events.onMouseLeave MouseLeave
        , Html.Styled.Events.onMouseDown (MouseDownLogInButton service)
        , Html.Styled.Events.onMouseUp MouseUp
        , Html.Styled.Attributes.css
            [ Css.backgroundColor
                (case mouseSate of
                    MouseStateDown s ->
                        if s == service then
                            Css.rgb 204 204 204

                        else
                            Css.rgb 221 221 221

                    MouseStateEnter s ->
                        if s == service then
                            Css.rgb 238 238 238

                        else
                            Css.rgb 221 221 221

                    MouseStateNone ->
                        Css.rgb 221 221 221
                )
            , Css.borderRadius (Css.px 4)
            , Css.border2 Css.zero Css.none
            , Css.color (Css.rgb 17 17 17)
            , Css.displayFlex
            , Css.alignItems Css.center
            , Css.padding Css.zero
            , Css.cursor Css.pointer
            ]
        ]
        [ icon
        , logInButtonText (Data.SocialLoginService.serviceName service ++ "でログイン")
        ]


logInButtonText : String -> Html.Styled.Html msg
logInButtonText text =
    Html.Styled.div
        [ Html.Styled.Attributes.css
            [ Css.flexGrow (Css.int 1)
            , Css.fontWeight Css.bold
            ]
        ]
        [ Html.Styled.text text ]
