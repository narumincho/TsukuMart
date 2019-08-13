module Page.Component.LogIn exposing
    ( Cmd(..)
    , Model
    , Msg(..)
    , initModel
    , update
    , view
    )

import Css
import Data.SocialLoginService
import Html.Styled
import Html.Styled.Attributes
import Html.Styled.Events
import Icon
import Page.Style


type Model
    = Model (Maybe Data.SocialLoginService.SocialLoginService)


type Cmd
    = CmdLogInOrSignUp Data.SocialLoginService.SocialLoginService


type Msg
    = LogInOrSignUpRequest Data.SocialLoginService.SocialLoginService


initModel : Model
initModel =
    Model Nothing


update : Msg -> Model -> ( Model, List Cmd )
update msg _ =
    case msg of
        LogInOrSignUpRequest service ->
            ( Model (Just service)
            , [ CmdLogInOrSignUp service ]
            )



{- =================================
               View
   =================================
-}


view : Model -> Html.Styled.Html Msg
view (Model waitLogInUrl) =
    Html.Styled.div
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
                        serviceLogInButtonListView
               )
        )


serviceLogInButtonListView : List (Html.Styled.Html Msg)
serviceLogInButtonListView =
    [ logInButtonLine ]


logInButtonLine : Html.Styled.Html Msg
logInButtonLine =
    Html.Styled.button
        [ Html.Styled.Events.onClick (LogInOrSignUpRequest Data.SocialLoginService.Line)
        , Html.Styled.Attributes.css
            [ Css.backgroundColor (Css.hex "#00c300")
            , Css.borderRadius (Css.px 4)
            , Css.border2 Css.zero Css.none
            , Css.color (Css.rgb 255 255 255)
            , Css.displayFlex
            , Css.alignItems Css.center
            , Css.padding Css.zero
            , Css.cursor Css.pointer
            , Css.hover
                [ Css.backgroundColor (Css.hex "#00e000") ]
            , Css.active
                [ Css.backgroundColor (Css.hex "#00b300") ]
            ]
        ]
        [ Html.Styled.img
            [ Html.Styled.Attributes.src "/assets/line_icon120.png"
            , Html.Styled.Attributes.css
                [ Css.display Css.block
                , Css.width (Css.px 44)
                , Css.height (Css.px 44)
                , Css.borderRight3 (Css.px 1) Css.solid (Css.hex "#00b300")
                , Css.padding (Css.px 4)
                , Css.hover
                    [ Css.borderRightColor (Css.hex "#00c900") ]
                , Css.hover
                    [ Css.borderRightColor (Css.hex "#009800") ]
                ]
            ]
            []
        , logInButtonText "LINEでログイン"
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
