port module Main exposing (main)

import Api
import Browser
import Browser.Navigation
import Goods
import Html
import Html.Attributes
import Html.Events
import Html.Keyed
import Json.Decode
import Page.LogIn
import Page.SignUp
import School
import SiteMap
import Svg
import Svg.Attributes
import Tab
import Url
import Url.Parser



{-
   ローカルホストで動作を試す
   npmにあるlocal-web-server( https://www.npmjs.com/package/local-web-server )を使います。コマンド名がwsだけど使っているのはws( https://www.npmjs.com/package/ws )ではない。
   Windows PowerSellを起動して

   Set-Location D:/tsukumart/hosting_root | ws --spa index.html

   を入力する

   ブラウザのアドレスバーに http://127.0.0.1:8000 を入力するとページを見ることができる。

    https://tsukumart-demo.firebaseapp.com/ で出力結果を見ることができるが、APIのサーバーとドメインが違うせいで通信できない
-}


port toWideScreenMode : (() -> msg) -> Sub msg


port toNarrowScreenMode : (() -> msg) -> Sub msg


port receiveImageDataUrl : (String -> msg) -> Sub msg


port receiveImageDataUrlMulti : (List String -> msg) -> Sub msg


port exhibitionImageChange : String -> Cmd msg


port studentImageChange : String -> Cmd msg


type Model
    = Model
        { page : Page -- 開いているページ
        , menuState : Maybe MenuState -- メニューの開閉など
        , message : Maybe String -- ちょっとしたことがあったら表示するもの
        , logInState : LogInState
        , key : Browser.Navigation.Key
        }


type Page
    = PageHome HomePage
    | PageSignUp Page.SignUp.Model
    | PageLogIn ( Page.LogIn.Model, Maybe Page )
    | PageLikeAndHistory LikeAndHistory
    | PageExhibitionGoodsList
    | PagePurchaseGoodsList
    | PageExhibition ExhibitionPage
    | PageGoods Goods.Goods
    | PageSiteMapXml


type ExhibitionPage
    = ExhibitionPage { title : String, description : String, price : Maybe Int, image : List String }


type HomePage
    = HomePageRecent
    | HomePageRecommend
    | HomePageFree


type LikeAndHistory
    = Like
    | History


type MenuState
    = MenuNotOpenedYet
    | MenuClose
    | MenuOpen


type LogInState
    = LogInStateOk
        { access : Api.Token
        , refresh : Api.Token
        , profile : Maybe Api.UserProfile
        }
    | LogInStateNone


type Msg
    = ChangePage Page
    | OpenMenu
    | CloseMenu
    | ToWideScreenMode
    | ToNarrowScreenMode
    | UrlChange Url.Url
    | UrlRequest Browser.UrlRequest
    | SignUp Api.SignUpRequest
    | LogIn Api.LogInRequest
    | SignUpResponse (Result Api.SignUpResponseError Api.SignUpResponseOk)
    | SignUpConfirmResponse (Result Api.SignUpConfirmResponseError Api.SignUpConfirmResponseOk)
    | LogInResponse (Result Api.LogInResponseError Api.LogInResponseOk)
    | InputStudentIdOrEmailAddress String
    | InputStudentImage String
    | InputExhibitionImage String
    | InputNickName String
    | ReceiveImageDataUrl String
    | ReceiveImageDataUrlMulti (List String)
    | InputPassword String
    | SendConfirmToken String
    | DeleteAllUser
    | DeleteAllUserResponse (Result () ())
    | GetUserProfileResponse (Result () Api.UserProfile)


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , update = update
        , view = view
        , subscriptions = subscription
        , onUrlRequest = UrlRequest
        , onUrlChange = UrlChange
        }


init : () -> Url.Url -> Browser.Navigation.Key -> ( Model, Cmd Msg )
init _ url key =
    let
        ( page, messageMaybe ) =
            urlToPage url Nothing
    in
    ( Model
        { page = page
        , menuState = Just MenuNotOpenedYet
        , message = messageMaybe
        , logInState = LogInStateNone
        , key = key
        }
    , Cmd.none
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg (Model rec) =
    case msg of
        ChangePage page ->
            ( Model
                { rec
                    | page = page
                }
            , Cmd.none
            )

        OpenMenu ->
            ( case rec.menuState of
                Just _ ->
                    Model
                        { rec
                            | menuState = Just MenuOpen
                        }

                Nothing ->
                    Model rec
            , Cmd.none
            )

        CloseMenu ->
            ( case rec.menuState of
                Just _ ->
                    Model
                        { rec
                            | menuState = Just MenuClose
                        }

                Nothing ->
                    Model rec
            , Cmd.none
            )

        ToWideScreenMode ->
            ( Model
                { rec | menuState = Nothing }
            , Cmd.none
            )

        ToNarrowScreenMode ->
            ( Model
                { rec | menuState = Just MenuNotOpenedYet }
            , Cmd.none
            )

        UrlChange url ->
            let
                ( newPage, messageMaybe ) =
                    urlToPage url (Just rec.page)
            in
            ( Model
                { rec
                    | page = newPage
                    , message = messageMaybe
                    , menuState =
                        case rec.menuState of
                            Just MenuOpen ->
                                Just MenuClose

                            _ ->
                                rec.menuState
                }
            , Cmd.none
            )

        UrlRequest urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    ( update (UrlChange url) (Model rec) |> Tuple.first
                    , Browser.Navigation.pushUrl rec.key (Url.toString url)
                    )

                Browser.External string ->
                    ( Model rec
                    , Browser.Navigation.load string
                    )

        SignUp signUpData ->
            ( Model
                { rec
                    | page = PageSignUp (Page.SignUp.sentSignUpDataInitModel signUpData.emailAddress)
                }
            , Api.signUp signUpData SignUpResponse
            )

        SignUpResponse response ->
            ( case rec.page of
                PageSignUp singUpPageModel ->
                    Model
                        { rec | page = PageSignUp (Page.SignUp.update (Page.SignUp.SignUpResponse response) singUpPageModel) }

                _ ->
                    Model rec
            , Cmd.none
            )

        LogIn logInData ->
            ( case rec.page of
                PageLogIn ( logInPageModel, nextPage ) ->
                    Model
                        { rec
                            | page = PageLogIn ( logInPageModel |> Page.LogIn.update Page.LogIn.SendLogIn, nextPage )
                        }

                _ ->
                    Model rec
            , Api.logIn logInData LogInResponse
            )

        LogInResponse logInResponse ->
            case logInResponse of
                Ok (Api.LogInResponseOk { access, refresh }) ->
                    ( let
                        pageMaybe =
                            case rec.page of
                                PageLogIn ( _, Just p ) ->
                                    Just p

                                PageLogIn ( _, Nothing ) ->
                                    Just (PageHome HomePageRecommend)

                                _ ->
                                    Nothing
                      in
                      case pageMaybe of
                        Just newPage ->
                            Model
                                { rec
                                    | message = Just "ログインしました"
                                    , logInState = LogInStateOk { access = access, refresh = refresh, profile = Nothing }
                                    , page = newPage
                                }

                        Nothing ->
                            Model
                                { rec
                                    | message = Just "ログインしました"
                                    , logInState = LogInStateOk { access = access, refresh = refresh, profile = Nothing }
                                }
                    , Api.getUserProfile access GetUserProfileResponse
                    )

                Err logInResponseError ->
                    ( case rec.page of
                        PageLogIn ( logInPageModel, nextPage ) ->
                            Model
                                { rec
                                    | message = Just (Api.logInResponseErrorToString logInResponseError)
                                    , page = PageLogIn ( logInPageModel |> Page.LogIn.update Page.LogIn.StopSendLogIn, nextPage )
                                }

                        _ ->
                            Model
                                { rec
                                    | message = Just (Api.logInResponseErrorToString logInResponseError)
                                }
                    , Cmd.none
                    )

        SendConfirmToken token ->
            ( Model { rec | page = PageSignUp Page.SignUp.sentConfirmTokenInitModel }
            , Api.signUpConfirm { confirmToken = token } SignUpConfirmResponse
            )

        SignUpConfirmResponse response ->
            ( case response of
                Ok _ ->
                    Model
                        { rec
                            | message = Just "新規登録完了"
                            , page = PageHome HomePageRecommend
                        }

                Err e ->
                    Model
                        { rec
                            | page = PageSignUp (Page.SignUp.sentConfirmTokenModel e)
                        }
            , Cmd.none
            )

        InputStudentIdOrEmailAddress string ->
            ( case rec.page of
                PageSignUp signUpModel ->
                    Model
                        { rec
                            | page =
                                PageSignUp
                                    (Page.SignUp.update
                                        (Page.SignUp.InputStudentIdOrEmailAddress string)
                                        signUpModel
                                    )
                        }

                PageLogIn ( logInModel, pageMaybe ) ->
                    Model
                        { rec
                            | page =
                                PageLogIn
                                    ( Page.LogIn.update
                                        (Page.LogIn.InputStudentIdOrEmailAddress string)
                                        logInModel
                                    , pageMaybe
                                    )
                        }

                _ ->
                    Model rec
            , Cmd.none
            )

        InputStudentImage idString ->
            ( Model rec
            , studentImageChange idString
            )

        InputExhibitionImage idString ->
            ( Model rec
            , exhibitionImageChange idString
            )

        InputNickName string ->
            ( case rec.page of
                PageSignUp signUpModel ->
                    Model
                        { rec | page = PageSignUp (signUpModel |> Page.SignUp.update (Page.SignUp.InputNickName string)) }

                _ ->
                    Model rec
            , Cmd.none
            )

        ReceiveImageDataUrl urlString ->
            ( case rec.page of
                PageSignUp signUpModel ->
                    Model
                        { rec
                            | page =
                                PageSignUp
                                    (Page.SignUp.update
                                        (Page.SignUp.ReceiveImageDataUrl urlString)
                                        signUpModel
                                    )
                        }

                PageExhibition (ExhibitionPage r) ->
                    Model
                        { rec
                            | page =
                                PageExhibition
                                    (ExhibitionPage { r | image = [ urlString ] })
                        }

                _ ->
                    Model rec
            , Cmd.none
            )

        ReceiveImageDataUrlMulti urlStringList ->
            ( case rec.page of
                PageExhibition (ExhibitionPage r) ->
                    Model
                        { rec
                            | page =
                                PageExhibition
                                    (ExhibitionPage { r | image = urlStringList })
                        }

                _ ->
                    Model rec
            , Cmd.none
            )

        InputPassword string ->
            ( case rec.page of
                PageSignUp signUpModel ->
                    Model
                        { rec
                            | page =
                                PageSignUp
                                    (Page.SignUp.update
                                        (Page.SignUp.InputPassword string)
                                        signUpModel
                                    )
                        }

                PageLogIn ( logInModel, pageMaybe ) ->
                    Model
                        { rec
                            | page =
                                PageLogIn
                                    ( Page.LogIn.update
                                        (Page.LogIn.InputPassword string)
                                        logInModel
                                    , pageMaybe
                                    )
                        }

                _ ->
                    Model rec
            , Cmd.none
            )

        DeleteAllUser ->
            ( Model rec
            , Api.debugDeleteAllUser DeleteAllUserResponse
            )

        DeleteAllUserResponse response ->
            case rec.page of
                PageSignUp signUpModel ->
                    ( Model
                        { rec | page = PageSignUp (Page.SignUp.update (Page.SignUp.DeleteUserAll response) signUpModel) }
                    , Cmd.none
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        GetUserProfileResponse response ->
            case ( response, rec.logInState ) of
                ( Ok profile, LogInStateOk r ) ->
                    ( Model { rec | logInState = LogInStateOk { r | profile = Just profile } }, Cmd.none )

                ( _, _ ) ->
                    ( Model rec, Cmd.none )


urlToPage : Url.Url -> Maybe Page -> ( Page, Maybe String )
urlToPage url beforePageMaybe =
    Url.Parser.parse (urlParser beforePageMaybe) url
        |> Maybe.map (\page -> ( page, Nothing ))
        |> Maybe.withDefault ( PageHome HomePageRecommend, Just "指定したページが見つからないのでホームに移動しました" )


urlParser : Maybe Page -> Url.Parser.Parser (Page -> a) a
urlParser beforePageMaybe =
    Url.Parser.oneOf
        [ SiteMap.homeParser
            |> Url.Parser.map (PageHome HomePageRecommend)
        , SiteMap.signUpParser
            |> Url.Parser.map (PageSignUp Page.SignUp.initModel)
        , SiteMap.logInParser
            |> Url.Parser.map (PageLogIn ( Page.LogIn.initModel, beforePageMaybe ))
        , SiteMap.likeHistoryParser
            |> Url.Parser.map (PageLikeAndHistory Like)
        , SiteMap.exhibitionGoodsParser
            |> Url.Parser.map PageExhibitionGoodsList
        , SiteMap.purchaseGoodsParser
            |> Url.Parser.map PagePurchaseGoodsList
        , SiteMap.exhibitionParser
            |> Url.Parser.map
                (PageExhibition (ExhibitionPage { title = "", description = "", price = Nothing, image = [] }))
        , SiteMap.goodsParser
            |> Url.Parser.map (\_ -> PageGoods Goods.none)
        , SiteMap.siteMapParser
            |> Url.Parser.map PageSiteMapXml
        ]


{-| 見た目を決める
-}
view : Model -> { title : String, body : List (Html.Html Msg) }
view (Model { page, menuState, message, logInState }) =
    let
        isWideScreen =
            menuState == Nothing
    in
    { title = "つくマート"
    , body =
        [ header isWideScreen
        , menuView logInState menuState
        ]
            ++ mainViewAndMainTab page isWideScreen
            ++ (case message of
                    Just m ->
                        [ messageView m ]

                    Nothing ->
                        []
               )
    }



{- Header -}


header : Bool -> Html.Html Msg
header wideMode =
    Html.header
        []
        ((if wideMode then
            []

          else
            [ menuButton ]
         )
            ++ [ Html.a
                    [ Html.Attributes.class "h1Link"
                    , Html.Attributes.href SiteMap.homeUrl
                    ]
                    [ Html.h1 [] [ logo ] ]
               , searchButton
               , notificationsButton
               ]
        )


menuButton : Html.Html Msg
menuButton =
    Html.img
        [ Html.Attributes.src "/assets/menu.svg"
        , Html.Attributes.alt "メニュー"
        , headerButton
        , Html.Events.onClick OpenMenu
        ]
        []


logo : Html.Html Msg
logo =
    Svg.svg
        [ Svg.Attributes.class "logo"
        , Svg.Attributes.viewBox "0 0 440.08 114.67"
        ]
        ([ Svg.title [] [ Svg.text "つくマートのロゴ" ]
         ]
            ++ tsukuMartCharacters
            ++ tsukuBird
            ++ logoSubText
        )


tsukuMartCharacters : List (Svg.Svg msg)
tsukuMartCharacters =
    [ Svg.path
        [ Svg.Attributes.d
            "M41.91,75.12c0-5.66,3.52-11.1,10.79-11.1,3.52,0,7.88-.15,12.63-.15,17.44,0,39.47,2.22,39.47,23.18,0,18.9-22.26,28.39-24.78,28.39-2,0-3.6-1.23-3.6-2.76,0-3.21,7.27-5.43,7.27-13,0-7.12-8-13.31-19.82-13.31-2.68,0-8.72.84-10.4.84C45.89,87.21,41.91,81.09,41.91,75.12Z"
        , Svg.Attributes.transform "translate(-40.84 -16.87)"
        , tsukuMartFontColor
        ]
        []
    , Svg.path
        [ Svg.Attributes.d "M117.81,88.83c0-6.34,7.47-4.15,19.24-27.25A12.81,12.81,0,0,1,149,54.19c7.32,0,14.79,5.43,14.79,12.45,0,3.24-1.51,6.79-5.44,10.34-5.2,4.68-11.47,10.79-13.73,12.45s-1.81,4.3-.68,6c9.58,13.73,12.45,15.77,12.45,19.09,0,2.57-2.11,4.15-4.68,4.15-6.94,0-9.05-9.73-31.39-25.28A5.55,5.55,0,0,1,117.81,88.83Z"
        , Svg.Attributes.transform "translate(-40.84 -16.87)"
        , tsukuMartFontColor
        ]
        []
    , Svg.path
        [ Svg.Attributes.d "M221.66,100.25a79.24,79.24,0,0,1,6.36,7.94c1.18,1.73,2.6,5.27-.47,5.27a8.49,8.49,0,0,1-3.54-1.18c-8.09-4.49-19.18-7-23.82-7.71s-5.73-3.06-2.9-6a27.75,27.75,0,0,0,6.13-8.73c1.41-3.3,3.85-3.3,6.37-1.1,1.33,1.18,3.61,3.23,6.28,5.82,1.42-3.38,2.21-6.45,2.44-6.92,1.1-2.67-4.48-2.12-6.84-2.12a135,135,0,0,0-17.37,1.1C189.5,87.36,183,90.19,183,83c0-3.06-1.26-9.27-3.07-11.55-2.75-3.46-1.57-8.57,4.25-8.57a10.87,10.87,0,0,1,2.12.15c6.21,1,44.42,1.42,52,.48,5.9-.71,10.06,3.45,6.45,7.62a53,53,0,0,0-5.27,7.39A90.93,90.93,0,0,1,221.66,100.25Z"
        , Svg.Attributes.transform "translate(-40.84 -16.87)"
        , tsukuMartFontColor
        ]
        []
    , Svg.path
        [ Svg.Attributes.d "M257.82,89.71a26.73,26.73,0,0,0-.71-6.6c-.95-3.69-.87-7.47,4-7.47a12.21,12.21,0,0,1,2.2.24c5.66.86,28.69,1.26,37.26.47,7.78-.87,4.09,8.41,4.09,14,0,1.81.39,3,.39,4.56,0,3.38-3.06,4.8-5.89,4.4-9.52-1.18-24.61-2-35.62-.47-3.3.47-6-1.1-6-4.79C257.58,92.62,257.82,91.13,257.82,89.71Z"
        , Svg.Attributes.transform "translate(-40.84 -16.87)"
        , tsukuMartFontColor
        ]
        []
    , Svg.path
        [ Svg.Attributes.d "M345.07,65c-.94,1.41-1.8,6.29-2.59,12.34,6.6.55,14.07.71,19.89-.55,3.77-.71,7.15-.08,7.15,3.3A8,8,0,0,1,369,83a25.75,25.75,0,0,0-1.81,8.73c0,3.53-1.88,4.87-5.5,3.85a43.92,43.92,0,0,0-8.41-.55c-3.62,0-7.94.16-12.26.31-.16,3-.24,5.9-.24,8.42s.08,4.87.24,6.52c.15,1.34,1.57,2.75,1.57,4.48,0,2.83-3.93,3.38-8.33,3.38-4,0-7.79-.31-7.79-3.54a29.62,29.62,0,0,0,.24-3.93c-.94-10.53-5.5-44-6.92-46.38A10.23,10.23,0,0,1,318,59.53c0-4.64,7.86-2.83,11.79-2.83,3.15,0,6.45-.16,11.64-.16C348.3,56.54,347.75,60.94,345.07,65Z"
        , Svg.Attributes.transform "translate(-40.84 -16.87)"
        , tsukuMartFontColor
        ]
        []
    ]


tsukuMartFontColor : Svg.Attribute msg
tsukuMartFontColor =
    Svg.Attributes.fill "#fff4d8"


tsukuBird : List (Svg.Svg msg)
tsukuBird =
    [ tsukuBirdShadow
    , Svg.image
        [ Svg.Attributes.xlinkHref "/assets/logoBird.png"
        , Svg.Attributes.width "370"
        , Svg.Attributes.height "320"
        , Svg.Attributes.transform "translate(307.49) scale(0.36)"
        ]
        []
    ]


tsukuBirdShadow : Svg.Svg msg
tsukuBirdShadow =
    Svg.ellipse
        [ Svg.Attributes.cx "383.22"
        , Svg.Attributes.cy "93.55"
        , Svg.Attributes.rx "39.04"
        , Svg.Attributes.ry "18.08"
        , Svg.Attributes.fill "#999"
        ]
        []


logoSubText : List (Svg.Svg msg)
logoSubText =
    [ Svg.path
        [ Svg.Attributes.d "M45.47,34.08a9.23,9.23,0,0,1,.8,1.56.62.62,0,0,1,0,.18.5.5,0,0,1-.42.46l-.24,0a.49.49,0,0,1-.51-.34,9.9,9.9,0,0,0-.89-1.89h-.88A13.18,13.18,0,0,1,42,35.85a.76.76,0,0,1-.54.28.65.65,0,0,1-.41-.16.61.61,0,0,1-.21-.44.53.53,0,0,1,.18-.41,9.3,9.3,0,0,0,2.16-3.36.52.52,0,0,1,.51-.34l.26,0c.29.1.42.24.42.46a.65.65,0,0,1-.07.29c-.11.27-.22.55-.35.83h3.73c.28,0,.47.18.47.53a.46.46,0,0,1-.47.52Zm-3.77,4.1c-.29,0-.45-.25-.45-.57s.16-.55.45-.55h4.88c.29,0,.45.22.45.55s-.16.57-.45.57H44.69v4.43c.56-.19,1.09-.39,1.55-.58a.57.57,0,0,1,.27-.07.45.45,0,0,1,.43.3.67.67,0,0,1,0,.24.65.65,0,0,1-.43.62,34.44,34.44,0,0,1-4.91,1.61h-.18a.54.54,0,0,1-.55-.48,1,1,0,0,1,0-.22.48.48,0,0,1,.43-.52A20.06,20.06,0,0,0,43.47,43V38.18Zm11.85,6.29c0,.32.13.39.5.39s.57-.12.67-.43a5.5,5.5,0,0,0,.18-1.51c0-.34.23-.48.54-.48h0A.48.48,0,0,1,56,43a7.18,7.18,0,0,1-.29,2c-.23.68-.6,1-1.75,1-1.32,0-1.6-.27-1.6-1.18V37.89c0-.33-.14-.43-.48-.43H49.42c-.32,0-.48.1-.48.43,0,4.72-.67,6.64-2.51,8.28a.88.88,0,0,1-.55.23.61.61,0,0,1-.44-.19.68.68,0,0,1-.21-.48.52.52,0,0,1,.23-.42c1.87-1.56,2.29-3.18,2.29-7.62,0-.93.42-1.3,1.35-1.3h3.1c.94,0,1.35.37,1.35,1.3ZM49.78,34.1a8.8,8.8,0,0,1-1.09,1.59.67.67,0,0,1-.5.28.64.64,0,0,1-.39-.15.5.5,0,0,1-.21-.4.71.71,0,0,1,.17-.43,8.45,8.45,0,0,0,1.73-3.18.5.5,0,0,1,.52-.39l.24,0a.52.52,0,0,1,.37.73,7.71,7.71,0,0,1-.32.86h4.89c.29,0,.47.17.47.52s-.18.54-.47.54H52.4a7.5,7.5,0,0,1,.68,1.36.61.61,0,0,1,0,.17.47.47,0,0,1-.42.45.82.82,0,0,1-.21,0,.59.59,0,0,1-.56-.37,8.78,8.78,0,0,0-.76-1.64ZM50,38.94a.67.67,0,0,1,.52.33,14.25,14.25,0,0,1,1.33,2.65.77.77,0,0,1,.07.32.59.59,0,0,1-.36.54.67.67,0,0,1-.28.08.55.55,0,0,1-.49-.42,15.31,15.31,0,0,0-1.28-2.64.54.54,0,0,1-.11-.32.5.5,0,0,1,.31-.46A.6.6,0,0,1,50,38.94Z"
        , Svg.Attributes.transform "translate(-40.84 -16.87)"
        , logoSubTextFontColor
        ]
        []
    , Svg.path
        [ Svg.Attributes.d "M60.47,41.18a.7.7,0,0,1,0,.25A24.41,24.41,0,0,1,58.16,46a.63.63,0,0,1-.52.27.72.72,0,0,1-.42-.13.55.55,0,0,1-.29-.5.65.65,0,0,1,.11-.36A20,20,0,0,0,59.23,41a.56.56,0,0,1,.54-.39.71.71,0,0,1,.7.61ZM60.32,38a.59.59,0,0,1-.14.37.63.63,0,0,1-.49.24.69.69,0,0,1-.46-.18,16.21,16.21,0,0,0-2-1.59.52.52,0,0,1-.23-.44.73.73,0,0,1,.13-.39.69.69,0,0,1,.5-.26.64.64,0,0,1,.33.1,14,14,0,0,1,2.16,1.64A.74.74,0,0,1,60.32,38ZM61,34a.57.57,0,0,1-.16.41.64.64,0,0,1-.47.23.71.71,0,0,1-.52-.25A13.88,13.88,0,0,0,58,32.83a.51.51,0,0,1-.23-.42A.69.69,0,0,1,57.9,32a.76.76,0,0,1,.52-.25.67.67,0,0,1,.36.12,12.26,12.26,0,0,1,2,1.69A.64.64,0,0,1,61,34Zm2.1,4.73c-.2,3.48-.81,5.59-1.82,7.23a.66.66,0,0,1-.54.35.78.78,0,0,1-.36-.1.54.54,0,0,1-.3-.49.67.67,0,0,1,.13-.39c1.26-2,1.7-4.22,1.7-9.07V34.91a1.29,1.29,0,0,1,1.46-1.46H66V31.86c0-.31.22-.47.6-.47s.6.16.6.47v1.59h3.46c.78,0,1.2.39,1.2,1a1.55,1.55,0,0,1-.1.54,6.33,6.33,0,0,1-1,1.76.71.71,0,0,1-.56.3.6.6,0,0,1-.35-.11.53.53,0,0,1-.25-.42.63.63,0,0,1,.13-.36,6.22,6.22,0,0,0,.78-1.22.27.27,0,0,0,0-.16c0-.11-.09-.16-.31-.16h-3v3.07h2.52a1,1,0,0,1,1.1,1,1.82,1.82,0,0,1-.14.66,12,12,0,0,1-2.62,3.77,12.69,12.69,0,0,0,3.59,2,.61.61,0,0,1,.41.57.86.86,0,0,1,0,.27.66.66,0,0,1-.59.41.68.68,0,0,1-.29-.07,13.35,13.35,0,0,1-4-2.35,14.08,14.08,0,0,1-4,2.39.69.69,0,0,1-.31.06.6.6,0,0,1-.54-.37.7.7,0,0,1-.05-.25.61.61,0,0,1,.44-.56,14,14,0,0,0,3.64-2.07,13.4,13.4,0,0,1-2.63-4.34Zm3-1.1V34.59H63.72c-.44,0-.6.13-.6.63v1.22c0,.42,0,.83,0,1.22Zm-1.11,1.1a10.4,10.4,0,0,0,2.31,3.59,8.91,8.91,0,0,0,2.23-3.15.74.74,0,0,0,0-.23c0-.14-.08-.21-.26-.21Z"
        , Svg.Attributes.transform "translate(-40.84 -16.87)"
        , logoSubTextFontColor
        ]
        []
    , Svg.path
        [ Svg.Attributes.d "M81.31,36.59a12.32,12.32,0,0,0,2.54,5,12.09,12.09,0,0,0,4.09,3.17.58.58,0,0,1,.38.55.87.87,0,0,1-.13.44.67.67,0,0,1-.59.34.85.85,0,0,1-.4-.1,13.17,13.17,0,0,1-4.33-3.55,12.81,12.81,0,0,1-2.14-4.16,11.82,11.82,0,0,1-1.16,3,11.28,11.28,0,0,1-5.23,4.8,1.07,1.07,0,0,1-.32.08.66.66,0,0,1-.6-.41.68.68,0,0,1-.1-.36.59.59,0,0,1,.36-.53,9.6,9.6,0,0,0,4.82-4.28,10.87,10.87,0,0,0,1.25-4H74c-.32,0-.5-.3-.5-.65s.18-.62.5-.62h5.88c.07-.91.1-2,.1-3.15,0-.39.28-.56.67-.56s.65.2.65.56c0,1.13,0,2.17-.12,3.15h6.44c.32,0,.5.27.5.62s-.18.65-.5.65Z"
        , Svg.Attributes.transform "translate(-40.84 -16.87)"
        , logoSubTextFontColor
        ]
        []
    , Svg.path
        [ Svg.Attributes.d "M103.91,44.68c.3,0,.47.24.47.6s-.17.58-.47.58H90.13c-.29,0-.45-.24-.45-.58s.16-.6.45-.6h6.39V40.57H92.21c-.29,0-.48-.25-.48-.59s.19-.58.48-.58h4.31V36h-3.8a15.92,15.92,0,0,1-1.89,3,.64.64,0,0,1-.47.24.67.67,0,0,1-.47-.19.57.57,0,0,1-.23-.44.81.81,0,0,1,.18-.46,15,15,0,0,0,2.84-5.63.53.53,0,0,1,.54-.41l.23,0a.59.59,0,0,1,.5.54.3.3,0,0,1,0,.16,16.39,16.39,0,0,1-.7,1.95h3.3V32c0-.31.28-.5.65-.5s.67.19.67.5v2.86h5.47c.29,0,.46.23.46.59s-.17.58-.46.58H97.84v3.4h4.61c.29,0,.47.24.47.58s-.18.59-.47.59H97.84v4.11Z"
        , Svg.Attributes.transform "translate(-40.84 -16.87)"
        , logoSubTextFontColor
        ]
        []
    , Svg.path
        [ Svg.Attributes.d "M109,40.57c-.92,0-1.36-.38-1.36-1.27v-3c0-.89.44-1.27,1.36-1.27h3.82V33.94h-6.11c-.27,0-.45-.2-.45-.54s.18-.52.45-.52h6.11v-1c0-.28.25-.46.6-.46s.59.18.59.46v1h6.43c.28,0,.46.18.46.52s-.18.54-.46.54h-6.43V35h4.14c.91,0,1.35.38,1.35,1.29v3c0,.89-.44,1.27-1.35,1.27h-.61v1h2.92c.28,0,.44.21.44.52s-.16.56-.44.56h-2.92v2.45c0,.94-.54,1.35-1.78,1.35a9,9,0,0,1-1.56-.15.49.49,0,0,1-.47-.53.56.56,0,0,1,0-.17.48.48,0,0,1,.5-.45h.18a5.69,5.69,0,0,0,1.19.13c.58,0,.71-.09.71-.52V42.7h-9.65c-.28,0-.44-.23-.44-.56s.16-.52.44-.52h9.65v-1Zm.41-4.62c-.37,0-.57.13-.57.51v.79h4V36Zm-.57,2.21v.94c0,.39.2.51.57.51h3.41V38.16Zm3.58,6.6a.59.59,0,0,1,.14.37.54.54,0,0,1-.21.43.7.7,0,0,1-.45.17.58.58,0,0,1-.43-.17,13.28,13.28,0,0,0-1.72-1.6.4.4,0,0,1-.19-.34.54.54,0,0,1,.19-.39.72.72,0,0,1,.46-.18.74.74,0,0,1,.42.15A15.33,15.33,0,0,1,112.46,44.76Zm5.88-7.51v-.79c0-.38-.2-.51-.57-.51h-3.72v1.3Zm-.57,2.36c.37,0,.57-.12.57-.51v-.94h-4.29v1.45Z"
        , Svg.Attributes.transform "translate(-40.84 -16.87)"
        , logoSubTextFontColor
        ]
        []
    , Svg.path
        [ Svg.Attributes.d "M124.87,41.1A11.46,11.46,0,0,1,123.5,46a.61.61,0,0,1-.55.34.76.76,0,0,1-.36-.1.65.65,0,0,1-.37-.56.56.56,0,0,1,.1-.33c1.2-1.79,1.41-4.32,1.44-8.37,0-1,0-2.16,0-3.52,0-1,.48-1.4,1.45-1.4H135c1,0,1.45.4,1.45,1.4V44.76c0,1-.62,1.53-1.94,1.53a11.21,11.21,0,0,1-2-.17.51.51,0,0,1-.47-.53.46.46,0,0,1,0-.2.5.5,0,0,1,.49-.45h.16a8.09,8.09,0,0,0,1.61.18c.75,0,.89-.13.89-.66V41.1h-4.74v4.44c0,.29-.26.45-.64.45s-.6-.16-.6-.45V41.1Zm.16-4a1.1,1.1,0,0,0,0,.25c0,.91,0,1.77-.06,2.57h4.27V37.15ZM129.22,36V33.25h-3.64c-.36,0-.52.1-.52.49,0,.85,0,1.59,0,2.29Zm6-2.29c0-.39-.14-.49-.5-.49h-4.24V36h4.74Zm0,3.41h-4.74V40h4.74Z"
        , Svg.Attributes.transform "translate(-40.84 -16.87)"
        , logoSubTextFontColor
        ]
        []
    , Svg.path
        [ Svg.Attributes.d "M146.93,34c-1.66.18-3.36.31-5.05.36h0a.55.55,0,0,1-.6-.59.53.53,0,0,1,.53-.6,39.31,39.31,0,0,0,10.35-1.43.8.8,0,0,1,.31-.07.54.54,0,0,1,.54.41,1,1,0,0,1,0,.28.58.58,0,0,1-.47.57,36.9,36.9,0,0,1-4.34.89v2.62h5.26c.28,0,.46.24.46.58a.51.51,0,0,1-.46.57H148.2v2.44h6a.52.52,0,0,1,.47.58c0,.33-.19.6-.47.6h-6v3.38c0,1.21-.52,1.66-2.18,1.66a9.73,9.73,0,0,1-2-.19.57.57,0,0,1-.46-.61.36.36,0,0,1,0-.14.5.5,0,0,1,.52-.49.44.44,0,0,1,.16,0,10.05,10.05,0,0,0,1.68.18c.84,0,1-.12,1-.67V41.23h-6.34a.52.52,0,0,1-.47-.58c0-.34.18-.6.47-.6h6.34V37.61h-5.57c-.3,0-.46-.24-.46-.57s.16-.58.46-.58h5.57Z"
        , Svg.Attributes.transform "translate(-40.84 -16.87)"
        , logoSubTextFontColor
        ]
        []
    , Svg.path
        [ Svg.Attributes.d "M159.29,41.18a1.29,1.29,0,0,1,0,.25,21.92,21.92,0,0,1-1.92,4.63.65.65,0,0,1-.55.31.73.73,0,0,1-.36-.1.58.58,0,0,1-.32-.52.74.74,0,0,1,.1-.37A19.32,19.32,0,0,0,158.07,41a.55.55,0,0,1,.54-.42.91.91,0,0,1,.23,0A.53.53,0,0,1,159.29,41.18ZM159.5,38a.54.54,0,0,1-.14.37.62.62,0,0,1-.51.25.66.66,0,0,1-.43-.18,14.59,14.59,0,0,0-2-1.5.48.48,0,0,1-.22-.44.75.75,0,0,1,.13-.39.66.66,0,0,1,.5-.24.76.76,0,0,1,.33.08,13,13,0,0,1,2.14,1.55A.62.62,0,0,1,159.5,38Zm.44-4.45a.73.73,0,0,1,.2.48.57.57,0,0,1-.16.41.6.6,0,0,1-.46.21.75.75,0,0,1-.52-.23,13.47,13.47,0,0,0-1.85-1.59.57.57,0,0,1-.21-.45.65.65,0,0,1,.13-.39.68.68,0,0,1,.52-.25.57.57,0,0,1,.35.12A13.39,13.39,0,0,1,159.94,33.55Zm10.76-.83c.29,0,.44.24.44.55s-.15.59-.44.59h-8.35c-.41,0-.57.14-.57.58,0,1.8-.05,4.32-.23,6.11a14.86,14.86,0,0,1-1.48,5.38.75.75,0,0,1-.63.39.8.8,0,0,1-.26,0,.62.62,0,0,1-.34-.55.61.61,0,0,1,.1-.34,12.91,12.91,0,0,0,1.41-5c.18-1.85.23-4.19.23-6.21A1.27,1.27,0,0,1,162,32.72h3.06v-.86c0-.33.24-.49.61-.49s.62.16.62.49v.86Zm-8.21,8.5c-.29,0-.43-.21-.43-.52s.14-.52.43-.52h6.2c.71,0,1.08.39,1.08.87a1.28,1.28,0,0,1-.26.74A10,10,0,0,1,167.35,44a12.42,12.42,0,0,0,3.42,1.31.53.53,0,0,1,.47.54.44.44,0,0,1,0,.16.52.52,0,0,1-.55.46,1.29,1.29,0,0,1-.25,0,14,14,0,0,1-4.06-1.77,14.48,14.48,0,0,1-4.47,1.76h-.16a.55.55,0,0,1-.58-.4.33.33,0,0,1,0-.18.53.53,0,0,1,.46-.54,12.84,12.84,0,0,0,3.85-1.35,9.7,9.7,0,0,1-2.16-2.69ZM169,38c0,.84-.4,1.17-1.23,1.17h-2.71c-.85,0-1.26-.33-1.26-1.17v-1.4h-1.3c-.24,0-.4-.21-.4-.5s.16-.51.4-.51h1.3v-.91c0-.29.25-.45.56-.45s.55.16.55.45v.91h3v-.91c0-.29.19-.45.55-.45s.55.16.55.45v.91h1.55c.29,0,.42.18.42.51s-.13.5-.42.5H169Zm-4.55,3.25a7.07,7.07,0,0,0,1.95,2.09,9.14,9.14,0,0,0,1.87-1.69.41.41,0,0,0,.12-.24c0-.1-.08-.16-.25-.16Zm.46-4.65v1.2c0,.29.15.39.44.39h2.11c.29,0,.44-.08.44-.39v-1.2Z"
        , Svg.Attributes.transform "translate(-40.84 -16.87)"
        , logoSubTextFontColor
        ]
        []
    , Svg.path
        [ Svg.Attributes.d "M176.94,32.83v.05c-.08,2.39-.21,5.27-.21,7.87,0,1.52.19,2.37.71,2.87a3.46,3.46,0,0,0,2.47.68,4.75,4.75,0,0,0,3.48-1.39,7.78,7.78,0,0,0,1.72-3.24.66.66,0,0,1,.62-.55.8.8,0,0,1,.26.05.68.68,0,0,1,.5.67.71.71,0,0,1-.05.27,8.84,8.84,0,0,1-2.16,3.9,6.14,6.14,0,0,1-4.4,1.72,4.73,4.73,0,0,1-3.46-1.12c-.75-.73-1.09-1.78-1.09-3.85,0-2.52.08-5.52.19-7.91a.66.66,0,0,1,.7-.68h0A.62.62,0,0,1,176.94,32.83Z"
        , Svg.Attributes.transform "translate(-40.84 -16.87)"
        , logoSubTextFontColor
        ]
        []
    , Svg.path
        [ Svg.Attributes.d "M200.46,33.22a1.82,1.82,0,0,1,1.56.59,1.75,1.75,0,0,1,.34,1.17,3.64,3.64,0,0,1,0,.45c-.7,4.94-4.11,8.65-9.5,10a1,1,0,0,1-.3.05.59.59,0,0,1-.61-.46,1.17,1.17,0,0,1,0-.26.7.7,0,0,1,.52-.68c4.68-1.23,7.87-4.31,8.4-8.68a1,1,0,0,0,0-.24c0-.42-.21-.54-.71-.54h-9.48c-.37,0-.58-.29-.58-.7a.6.6,0,0,1,.58-.68Z"
        , Svg.Attributes.transform "translate(-40.84 -16.87)"
        , logoSubTextFontColor
        ]
        []
    , Svg.path
        [ Svg.Attributes.d "M208.41,40.08a.66.66,0,0,1-.74.67.65.65,0,0,1-.73-.65V33a.66.66,0,0,1,.73-.66c.44,0,.74.22.74.65ZM215,33a.65.65,0,0,1,.7-.68c.44,0,.77.22.77.65v5.29c0,2.44-.62,4.15-2,5.37a9.68,9.68,0,0,1-5,2.08h-.12a.71.71,0,0,1-.73-.57,1.15,1.15,0,0,1,0-.18.62.62,0,0,1,.58-.64,8.2,8.2,0,0,0,4.29-1.78c1.06-1,1.51-2.36,1.51-4.47Z"
        , Svg.Attributes.transform "translate(-40.84 -16.87)"
        , logoSubTextFontColor
        ]
        []
    , Svg.path
        [ Svg.Attributes.d "M222.12,39.82a.61.61,0,0,1-.64-.7.65.65,0,0,1,.65-.73h12.34a.65.65,0,0,1,.65.73.61.61,0,0,1-.64.7Z"
        , Svg.Attributes.transform "translate(-40.84 -16.87)"
        , logoSubTextFontColor
        ]
        []
    , Svg.path
        [ Svg.Attributes.d "M238.4,34.94c-.35,0-.56-.3-.56-.68a.63.63,0,0,1,.56-.7h11a1.67,1.67,0,0,1,1.43.6,1.41,1.41,0,0,1,.28.86,2.36,2.36,0,0,1-.33,1.15,17,17,0,0,1-5.6,5.67,27.46,27.46,0,0,1,1.9,2.38.67.67,0,0,1,.13.42.86.86,0,0,1-.36.67.76.76,0,0,1-.4.13.78.78,0,0,1-.64-.38,38.65,38.65,0,0,0-5.6-6.4.63.63,0,0,1-.25-.47.62.62,0,0,1,.28-.49.63.63,0,0,1,.44-.18.86.86,0,0,1,.52.21,35.2,35.2,0,0,1,3.08,3,14.49,14.49,0,0,0,5-5,1,1,0,0,0,.15-.45c0-.26-.2-.39-.61-.39Z"
        , Svg.Attributes.transform "translate(-40.84 -16.87)"
        , logoSubTextFontColor
        ]
        []
    , Svg.path
        [ Svg.Attributes.d "M254.61,39.82a.61.61,0,0,1-.64-.7.65.65,0,0,1,.65-.73H267a.65.65,0,0,1,.65.73c0,.44-.23.7-.63.7Z"
        , Svg.Attributes.transform "translate(-40.84 -16.87)"
        , logoSubTextFontColor
        ]
        []
    , Svg.path
        [ Svg.Attributes.d "M280.2,36.1c-.15,4.81-2.37,8.2-6.62,9.73a1.25,1.25,0,0,1-.32.05.65.65,0,0,1-.62-.39.83.83,0,0,1-.08-.32.67.67,0,0,1,.49-.64c3.54-1.31,5.56-4,5.74-8.43h-4.93a11.61,11.61,0,0,1-2.73,3.25.8.8,0,0,1-.5.19.66.66,0,0,1-.47-.21.71.71,0,0,1-.21-.5.7.7,0,0,1,.27-.55,12.16,12.16,0,0,0,3.3-4.72,8.71,8.71,0,0,0,.45-1.22.65.65,0,0,1,.61-.48l.21,0a.63.63,0,0,1,.53.6.92.92,0,0,1,0,.16,14.11,14.11,0,0,1-.88,2.16h9a.56.56,0,0,1,.62.64c0,.4-.19.65-.6.65Z"
        , Svg.Attributes.transform "translate(-40.84 -16.87)"
        , logoSubTextFontColor
        ]
        []
    , Svg.path
        [ Svg.Attributes.d "M288.82,36.11a.58.58,0,0,1,.54.35,22,22,0,0,1,1.35,3.36c0,.1,0,.16,0,.24a.55.55,0,0,1-.45.54.91.91,0,0,1-.26,0,.56.56,0,0,1-.57-.41,22.2,22.2,0,0,0-1.3-3.3.38.38,0,0,1-.07-.22.59.59,0,0,1,.42-.54A.73.73,0,0,1,288.82,36.11Zm9.57.31v.12a11.85,11.85,0,0,1-2,5.83,9.46,9.46,0,0,1-5.46,3.45h-.18a.57.57,0,0,1-.58-.44,1,1,0,0,1,0-.24.54.54,0,0,1,.45-.54,8.45,8.45,0,0,0,4.78-3,11.28,11.28,0,0,0,1.75-5.26.55.55,0,0,1,.61-.5h.08C298.18,35.87,298.39,36.07,298.39,36.42Zm-6.15-1a.62.62,0,0,1,.55.36,17.56,17.56,0,0,1,1.27,3.32.86.86,0,0,1,0,.16.57.57,0,0,1-.44.55,1.18,1.18,0,0,1-.27,0,.53.53,0,0,1-.56-.37,19.17,19.17,0,0,0-1.21-3.22.44.44,0,0,1-.07-.24.6.6,0,0,1,.42-.52A.66.66,0,0,1,292.24,35.46Z"
        , Svg.Attributes.transform "translate(-40.84 -16.87)"
        , logoSubTextFontColor
        ]
        []
    , Svg.path
        [ Svg.Attributes.d "M307.18,45.3c0,.43-.31.61-.71.61s-.72-.18-.72-.61V32.67c0-.44.28-.62.72-.62s.71.18.71.64v4.17a48.46,48.46,0,0,1,7.93,2.91.71.71,0,0,1,.44.68.94.94,0,0,1-.06.36.7.7,0,0,1-.65.47.81.81,0,0,1-.34-.08,44.76,44.76,0,0,0-7.32-2.89Z"
        , Svg.Attributes.transform "translate(-40.84 -16.87)"
        , logoSubTextFontColor
        ]
        []
    , Svg.path
        [ Svg.Attributes.d "M321.72,32.72a.6.6,0,0,1,.68-.62.64.64,0,0,1,.72.62V35.3h5.31V32.72a.59.59,0,0,1,.67-.62.63.63,0,0,1,.71.62V35.3h2.49a.57.57,0,0,1,.62.64.58.58,0,0,1-.6.65h-2.51v1.73A8.1,8.1,0,0,1,328.63,43a7.37,7.37,0,0,1-4.81,2.86.82.82,0,0,1-.21,0,.59.59,0,0,1-.64-.51,1,1,0,0,1,0-.17c0-.33.21-.54.58-.61a6.24,6.24,0,0,0,3.93-2.37,7.07,7.07,0,0,0,1-4.14V36.59h-5.31v4c0,.41-.31.62-.72.62s-.68-.21-.68-.62v-4h-2.5a.58.58,0,0,1-.6-.65.56.56,0,0,1,.62-.62h2.48Z"
        , Svg.Attributes.transform "translate(-40.84 -16.87)"
        , logoSubTextFontColor
        ]
        []
    , Svg.path
        [ Svg.Attributes.d "M335.84,39.82c-.41,0-.63-.26-.63-.7a.64.64,0,0,1,.65-.73h12.33a.65.65,0,0,1,.65.73c0,.44-.23.7-.63.7Z"
        , Svg.Attributes.transform "translate(-40.84 -16.87)"
        , logoSubTextFontColor
        ]
        []
    , Svg.path
        [ Svg.Attributes.d "M354.47,41.75c0,2.1.36,2.23,3.56,2.23a29.87,29.87,0,0,0,5-.42.68.68,0,0,1,.2,0,.59.59,0,0,1,.61.59v.11a.67.67,0,0,1-.6.7,32.55,32.55,0,0,1-5.51.39c-3.94,0-4.63-.6-4.63-3.67V33.17c0-.44.31-.61.7-.61s.7.17.7.61v4.41A22.33,22.33,0,0,0,362.11,35a.79.79,0,0,1,.41-.11.71.71,0,0,1,.6.36.76.76,0,0,1,.11.4.67.67,0,0,1-.34.59,23.62,23.62,0,0,1-8.42,2.71Zm8-9.93a.53.53,0,0,1,.42.18,10.81,10.81,0,0,1,1.4,1.82.83.83,0,0,1,.11.43.5.5,0,0,1-.53.45.44.44,0,0,1-.43-.28,11.24,11.24,0,0,0-1.28-1.77.57.57,0,0,1-.16-.39A.48.48,0,0,1,362.52,31.82Zm1.93-.84a.61.61,0,0,1,.44.19A9.71,9.71,0,0,1,366.22,33a.8.8,0,0,1,.1.4.49.49,0,0,1-.5.46.47.47,0,0,1-.43-.26,10.21,10.21,0,0,0-1.21-1.73.48.48,0,0,1-.2-.42A.49.49,0,0,1,364.45,31Z"
        , Svg.Attributes.transform "translate(-40.84 -16.87)"
        , logoSubTextFontColor
        ]
        []
    , Svg.path
        [ Svg.Attributes.d "M369.4,34.59c-.39,0-.6-.28-.6-.72a.59.59,0,0,1,.6-.65l8.28-.08a1.41,1.41,0,0,1,1.65,1.46,3,3,0,0,1-.18.95,15.14,15.14,0,0,1-2.58,4.22,28.82,28.82,0,0,1,4.52,4,.94.94,0,0,1,.23.57.81.81,0,0,1-.22.52.74.74,0,0,1-.56.24.77.77,0,0,1-.59-.26,27.33,27.33,0,0,0-4.29-4.1,18.12,18.12,0,0,1-6.87,4.51,1.36,1.36,0,0,1-.39.08.6.6,0,0,1-.61-.41.82.82,0,0,1,0-.28.73.73,0,0,1,.48-.69A18.31,18.31,0,0,0,374,40.49a13.86,13.86,0,0,0,3.68-5.29,1.53,1.53,0,0,0,.08-.35c0-.25-.18-.36-.59-.36Z"
        , Svg.Attributes.transform "translate(-40.84 -16.87)"
        , logoSubTextFontColor
        ]
        []
    ]


logoSubTextFontColor : Svg.Attribute msg
logoSubTextFontColor =
    Svg.Attributes.fill "#ffe2a6"


searchButton : Html.Html Msg
searchButton =
    Html.img
        [ Html.Attributes.src "/assets/search.svg"
        , Html.Attributes.alt "探す"
        , headerButton
        ]
        []


notificationsButton : Html.Html Msg
notificationsButton =
    Html.img
        [ Html.Attributes.src "/assets/notifications.svg"
        , Html.Attributes.alt "通知"
        , headerButton
        ]
        []


headerButton : Html.Attribute Msg
headerButton =
    Html.Attributes.class "headerButton"



{- Menu -}


menuView : LogInState -> Maybe MenuState -> Html.Html Msg
menuView logInState menuStateMaybe =
    case menuStateMaybe of
        Just menuState ->
            Html.Keyed.node "div"
                [ Html.Attributes.class "menu" ]
                (case menuState of
                    MenuNotOpenedYet ->
                        []

                    MenuOpen ->
                        [ ( "os"
                          , Html.div
                                [ Html.Attributes.class "menu-shadow menu-shadow-appear"
                                , Html.Events.onClick CloseMenu
                                ]
                                []
                          )
                        , ( "om"
                          , Html.div
                                [ Html.Attributes.class "menu-list menu-list-open" ]
                                (menuMain logInState)
                          )
                        ]

                    MenuClose ->
                        [ ( "cs"
                          , Html.div
                                [ Html.Attributes.class "menu-shadow menu-shadow-disappear" ]
                                []
                          )
                        , ( "cm"
                          , Html.div
                                [ Html.Attributes.class "menu-list menu-list-close" ]
                                (menuMain logInState)
                          )
                        ]
                )

        Nothing ->
            Html.div
                [ Html.Attributes.class "menu-wide" ]
                (menuMain logInState)


menuMain : LogInState -> List (Html.Html Msg)
menuMain logInState =
    [ Html.div
        [ Html.Attributes.class "menu-account"
        ]
        (menuAccount logInState)
    , Html.a
        [ Html.Attributes.class "menu-item"
        , Html.Attributes.href SiteMap.homeUrl
        ]
        [ Html.text "ホーム" ]
    , Html.a
        [ Html.Attributes.class "menu-item"
        , Html.Attributes.href SiteMap.likeHistoryUrl
        ]
        [ Html.text "いいね・閲覧した商品" ]
    , Html.a
        [ Html.Attributes.class "menu-item"
        , Html.Attributes.href SiteMap.exhibitionGoodsUrl
        ]
        [ Html.text "出品した商品" ]
    , Html.a
        [ Html.Attributes.class "menu-item"
        , Html.Attributes.href SiteMap.purchaseGoodsUrl
        ]
        [ Html.text "購入した商品" ]
    ]


menuAccount : LogInState -> List (Html.Html msg)
menuAccount logInState =
    case logInState of
        LogInStateOk { profile } ->
            [ Html.div [ Html.Attributes.class "menu-noLogin" ] [ Html.text "ログイン済み" ]
            , Html.div []
                (case profile of
                    Just (Api.UserProfile { introduction, department }) ->
                        [ Html.div [] [ Html.text ("紹介文:" ++ introduction) ]
                        , Html.div [] [ Html.text ("学群:" ++ (School.departmentToSchool department |> School.schoolToJapaneseString)) ]
                        ]
                            ++ (case School.departmentToJapaneseString department of
                                    Just departmentText ->
                                        [ Html.div [] [ Html.text ("学類:" ++ departmentText) ] ]

                                    Nothing ->
                                        []
                               )

                    Nothing ->
                        []
                )
            ]

        LogInStateNone ->
            [ Html.div [ Html.Attributes.class "menu-noLogin" ] [ Html.text "ログインしていません" ]
            , Html.div [ Html.Attributes.class "menu-logInsignUpButtonContainer" ]
                [ Html.a
                    [ Html.Attributes.class "menu-logInButton"
                    , Html.Attributes.href SiteMap.logInUrl
                    ]
                    [ Html.text "ログイン" ]
                , Html.a
                    [ Html.Attributes.class "menu-signUpButton"
                    , Html.Attributes.href SiteMap.signUpUrl
                    ]
                    [ Html.text "新規登録" ]
                ]
            ]


mainViewAndMainTab : Page -> Bool -> List (Html.Html Msg)
mainViewAndMainTab page isWideScreenMode =
    let
        ( tabData, mainView ) =
            case page of
                PageHome subPage ->
                    homeView isWideScreenMode subPage
                        |> Tuple.mapFirst (Tab.map PageHome)

                PageExhibition subPage ->
                    exhibitionView subPage
                        |> Tuple.mapFirst (Tab.map never)

                PageLikeAndHistory subPage ->
                    likeAndHistoryView isWideScreenMode subPage
                        |> Tuple.mapFirst (Tab.map PageLikeAndHistory)

                PagePurchaseGoodsList ->
                    ( Tab.Single "購入した商品"
                    , [ itemList isWideScreenMode ]
                    )

                PageExhibitionGoodsList ->
                    ( Tab.Single "出品した商品"
                    , [ itemList isWideScreenMode ]
                    )

                PageSignUp signUpPageModel ->
                    Page.SignUp.view signUpPageModel
                        |> (\( t, v ) -> ( t |> Tab.map never, v |> List.map (Html.map signUpPageEmitToMsg) ))

                PageLogIn ( logInPageModel, pageMaybe ) ->
                    ( Tab.Single "ログイン"
                    , Page.LogIn.view logInPageModel
                        |> List.map (Html.map (logInPageEmitToMsg pageMaybe))
                    )

                PageGoods goods ->
                    ( Tab.None, goodsView goods )

                PageSiteMapXml ->
                    siteMapXmlView
                        |> Tuple.mapFirst (Tab.map never)
    in
    [ Tab.view isWideScreenMode tabData
        |> Html.map ChangePage
    , Html.div
        (case tabData of
            Tab.None ->
                [ Html.Attributes.classList
                    [ ( "mainView-noMainTab", True ), ( "mainView-wide-noMainTab", isWideScreenMode ) ]
                ]

            _ ->
                [ Html.Attributes.classList
                    [ ( "mainView", True ), ( "mainView-wide", isWideScreenMode ) ]
                ]
        )
        mainView
    ]


messageView : String -> Html.Html msg
messageView message =
    Html.div
        [ Html.Attributes.class "message"
        ]
        [ Html.text message ]


signUpPageEmitToMsg : Page.SignUp.Emit -> Msg
signUpPageEmitToMsg emit =
    case emit of
        Page.SignUp.EmitChangePage model ->
            ChangePage (PageSignUp model)

        Page.SignUp.EmitInputStudentIdOrEmailAddress string ->
            InputStudentIdOrEmailAddress string

        Page.SignUp.EmitInputStudentImage string ->
            InputExhibitionImage string

        Page.SignUp.EmitInputPassword string ->
            InputPassword string

        Page.SignUp.EmitSignUp record ->
            SignUp record

        Page.SignUp.EmitSendConfirmToken token ->
            SendConfirmToken token

        Page.SignUp.EmitDeleteUserAll ->
            DeleteAllUser

        Page.SignUp.EmitInputNickName string ->
            InputNickName string


logInPageEmitToMsg : Maybe Page -> Page.LogIn.Emit -> Msg
logInPageEmitToMsg pageMaybe emit =
    case emit of
        Page.LogIn.EmitChangePage model ->
            ChangePage (PageLogIn ( model, pageMaybe ))

        Page.LogIn.EmitInputStudentIdOrEmailAddress string ->
            InputStudentIdOrEmailAddress string

        Page.LogIn.EmitInputPassword string ->
            InputPassword string

        Page.LogIn.EmitLogIn record ->
            LogIn record


homeView : Bool -> HomePage -> ( Tab.Tab HomePage, List (Html.Html Msg) )
homeView isWideScreenMode subPage =
    ( Tab.Multi
        [ ( HomePageRecent, "新着" )
        , ( HomePageRecommend, "おすすめ" )
        , ( HomePageFree, "0円" )
        ]
        (case subPage of
            HomePageRecent ->
                0

            HomePageRecommend ->
                1

            HomePageFree ->
                2
        )
    , [ itemList isWideScreenMode, exhibitButton ]
    )


likeAndHistoryView : Bool -> LikeAndHistory -> ( Tab.Tab LikeAndHistory, List (Html.Html Msg) )
likeAndHistoryView isWideScreenMode likeAndHistory =
    ( Tab.Multi
        [ ( Like, "いいね" )
        , ( History, "閲覧履歴" )
        ]
        (case likeAndHistory of
            Like ->
                0

            History ->
                1
        )
    , [ itemList isWideScreenMode ]
    )


{-| 商品の一覧 中身は適当
-}
itemList : Bool -> Html.Html Msg
itemList isWideMode =
    Html.div
        [ Html.Attributes.style "display" "grid"
        , Html.Attributes.style "grid-template-columns"
            (if isWideMode then
                "33.3% 33.4% 33.3%"

             else
                "50% 50%"
            )
        ]
        ([ { title = "冷蔵庫", price = 300, like = 1 }
         , { title = "洗濯機", price = 100, like = 5 }
         , { title = "時計", price = 10, like = 99 }
         , { title = "掃除機", price = 100, like = 5 }
         , { title = "自転車", price = 200, like = 9 }
         , { title = "マンガ", price = 10, like = 99 }
         , { title = "ゲーム", price = 10, like = 99 }
         , { title = "絵本", price = 100, like = 5 }
         , { title = "棚", price = 1000, like = 2 }
         , { title = "いす", price = 1000, like = 2 }
         , { title = "バッテリー", price = 300, like = 20 }
         , { title = "教科書", price = 20, like = 10 }
         ]
            |> List.map item
        )


item : { title : String, price : Int, like : Int } -> Html.Html Msg
item { title, price, like } =
    Html.a
        [ Html.Attributes.class "item"
        , Html.Attributes.href (SiteMap.goodsUrl "id")
        ]
        [ itemImage
        , Html.div [ Html.Attributes.class "itemTitle" ] [ Html.text title ]
        , Html.div [ Html.Attributes.class "itemPrice" ] [ Html.text (priceToString price) ]
        , Html.div [] [ Html.text ("いいね" ++ String.fromInt like) ]
        ]


priceToString : Int -> String
priceToString price =
    ((if price < 1000 then
        ( price, [] )

      else if price < 1000000 then
        ( price // 1000, [ price |> modBy 1000 ] )

      else
        ( price // 1000000, [ price // 1000 |> modBy 1000, price |> modBy 1000 ] )
     )
        |> Tuple.mapFirst String.fromInt
        |> Tuple.mapSecond (List.map (String.fromInt >> String.padLeft 3 '0'))
        |> (\( a, b ) -> a :: b)
        |> String.join ","
    )
        ++ "円"


itemImage : Html.Html Msg
itemImage =
    Html.img
        [ Html.Attributes.class "itemImage"
        , Html.Attributes.src "/assets/itemDummy.png"
        ]
        []


goodsView : Goods.Goods -> List (Html.Html Msg)
goodsView goods =
    [ Html.div
        [ Html.Attributes.class "goodsContainer" ]
        [ Html.div
            [ Html.Attributes.class "goods" ]
            [ goodsViewImage (Goods.getImage goods)
            , goodsViewName (Goods.getName goods)
            , goodsViewLike (Goods.getLike goods)
            , goodsViewDescription (Goods.getDescription goods)
            , goodsViewPriceAndBuyButton (Goods.getPrice goods)
            , goodsViewCondition (Goods.getCondition goods)
            , goodsViewLocation (Goods.getLocation goods)
            , Html.div []
                [ Html.text
                    (if Goods.getComplete goods then
                        "売却済み"

                     else
                        "まだ売れていない"
                    )
                ]
            ]
        ]
    ]


goodsViewImage : String -> Html.Html msg
goodsViewImage dataUrl =
    Html.img
        [ Html.Attributes.class "goods-image"
        , Html.Attributes.src dataUrl
        ]
        []


goodsViewName : String -> Html.Html msg
goodsViewName name =
    Html.div
        [ Html.Attributes.class "goods-name" ]
        [ Html.text name ]


goodsViewLike : Int -> Html.Html msg
goodsViewLike likeCount =
    Html.div
        []
        [ Html.text (String.fromInt likeCount) ]


goodsViewDescription : String -> Html.Html msg
goodsViewDescription description =
    Html.div
        [ Html.Attributes.class "goods-description" ]
        [ Html.div [ Html.Attributes.class "goods-description-label" ] [ Html.text "商品の説明" ]
        , Html.div [] [ Html.text description ]
        ]


goodsViewPriceAndBuyButton : Int -> Html.Html msg
goodsViewPriceAndBuyButton price =
    Html.div
        [ Html.Attributes.class "goods-priceAndBuyButton" ]
        [ Html.div [] [ Html.text (priceToString price) ]
        , Html.button [] [ Html.text "購入手続きへ" ]
        ]


goodsViewCondition : Goods.Condition -> Html.Html msg
goodsViewCondition condition =
    Html.div []
        [ Html.text
            ("商品の状態"
                ++ (case condition of
                        Goods.New ->
                            "新品・未使用"

                        Goods.LikeNew ->
                            "ほぼ未使用"

                        Goods.VeryGood ->
                            "目立った傷や汚れなし"

                        Goods.Good ->
                            "多少の傷や汚れあり"

                        Goods.Acceptable ->
                            "目立つ傷や汚れあり"

                        Goods.Junk ->
                            "状態が悪い・ジャンク"
                   )
            )
        ]


goodsViewLocation : Goods.Location -> Html.Html msg
goodsViewLocation location =
    Html.div [ Html.Attributes.class "goods-location" ]
        [ Html.div [ Html.Attributes.class "goods-location-label" ] [ Html.text "取引場所" ]
        , Html.div [] [ Html.text location ]
        ]


exhibitButton : Html.Html Msg
exhibitButton =
    Html.a
        [ Html.Attributes.class "exhibitButton"
        , Html.Attributes.href SiteMap.exhibitionUrl
        ]
        [ Html.text "出品" ]


exhibitionView : ExhibitionPage -> ( Tab.Tab Never, List (Html.Html Msg) )
exhibitionView (ExhibitionPage { title, description, price, image }) =
    ( Tab.Single "商品の情報を入力"
    , [ Html.div
            [ Html.Attributes.class "exhibitionView" ]
            [ exhibitionViewPhoto image
            , exhibitionViewItemTitleAndDescription
            , exhibitionViewItemPrice price
            ]
      ]
    )


exhibitionViewPhoto : List String -> Html.Html Msg
exhibitionViewPhoto imageUrlList =
    Html.div
        [ Html.Attributes.class "exhibitionView-photo" ]
        ([ Html.input
            [ Html.Attributes.class "exhibitionView-photo-input"
            , Html.Attributes.id "exhibitionView-photo-input"
            , Html.Attributes.type_ "file"
            , Html.Attributes.multiple True
            , Html.Attributes.accept "image/png,image/jpeg"
            , Html.Events.on "change" (Json.Decode.succeed (InputExhibitionImage "exhibitionView-photo-input"))
            ]
            []
         ]
            ++ (case imageUrlList of
                    _ :: _ ->
                        imageUrlList
                            |> List.map
                                (\imageUrl ->
                                    Html.img
                                        [ Html.Attributes.src imageUrl
                                        , Html.Attributes.class "exhibitionView-photo-image"
                                        ]
                                        []
                                )

                    [] ->
                        [ Html.img
                            [ Html.Attributes.src "/assets/add_a_photo.svg"
                            , Html.Attributes.class "exhibitionView-photo-icon"
                            ]
                            []
                        ]
               )
        )


exhibitionViewItemTitleAndDescription : Html.Html Msg
exhibitionViewItemTitleAndDescription =
    Html.div
        [ Html.Attributes.class "exhibitionView-itemTitleAndDescription" ]
        [ Html.h2 [] [ Html.text "商品名と説明" ]
        , Html.input
            [ Html.Attributes.placeholder "商品名(40文字まで)"
            , Html.Attributes.class "exhibitionView-itemTitle"
            , Html.Attributes.maxlength 40
            ]
            []
        , Html.textarea
            [ Html.Attributes.placeholder "商品の説明"
            , Html.Attributes.class "exhibitionView-itemDescription"
            ]
            []
        ]


exhibitionViewItemPrice : Maybe Int -> Html.Html Msg
exhibitionViewItemPrice price =
    Html.div
        [ Html.Attributes.class "exhibitionView-itemPrice" ]
        [ Html.text "販売価格 (0～100万円)"
        , Html.div
            [ Html.Attributes.class "exhibitionView-itemPrice-input" ]
            [ Html.input
                ([ Html.Attributes.type_ "number"
                 , Html.Attributes.class "exhibitionView-itemPrice-input-input"
                 ]
                    ++ (case price of
                            Just p ->
                                [ Html.Attributes.value (String.fromInt p) ]

                            Nothing ->
                                []
                       )
                )
                []
            , Html.text "円"
            ]
        ]


siteMapXmlView : ( Tab.Tab Never, List (Html.Html msg) )
siteMapXmlView =
    ( Tab.Single "sitemap.xml"
    , [ Html.div
            [ Html.Attributes.style "white-space" "pre-wrap" ]
            [ Html.text SiteMap.siteMapXml ]
      ]
    )


subscription : Model -> Sub Msg
subscription (Model { menuState }) =
    Sub.batch
        [ receiveImageDataUrl ReceiveImageDataUrl
        , receiveImageDataUrlMulti ReceiveImageDataUrlMulti
        , case menuState of
            Just _ ->
                toWideScreenMode (always ToWideScreenMode)

            Nothing ->
                toNarrowScreenMode (always ToNarrowScreenMode)
        ]
