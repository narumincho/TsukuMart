port module Main exposing (main)

import Api
import BasicParts
import Browser
import Browser.Navigation
import Data.Goods
import Data.LogInState
import Data.User
import File
import Html
import Html.Attributes
import Html.Events
import Html.Keyed
import Json.Decode
import Page.Component.LogInOrSignUp
import Page.Exhibition
import Page.Goods
import Page.LogIn
import Page.Profile
import Page.SignUp
import SiteMap
import Tab
import Url
import Url.Parser



{-
   Windows PowerSellを起動して入力する

   # Elmのコンパイル
   Set-Location D:/tsukumart ; elm make src/Main.elm --output main.js --optimize ; uglifyjs main.js -o hosting_root/main.js ; Remove-Item main.js

   # CSSのコンパイル
   Set-Location D:/tsukumart ; cleancss style.css -o hosting_root/style.css

   # デモ用のサーバーにデータを送信

   Set-Location D:/tsukumart ; firebase deploy --project tsukumart-demo

   # すべて一度に
   Set-Location D:/tsukumart ; elm make src/Main.elm --output main.js --optimize ; uglifyjs main.js -o hosting_root/main.js ; Remove-Item main.js ; cleancss style.css -o hosting_root/style.css ; firebase deploy --project tsukumart-demo

   ブラウザのアドレスバーに https://tsukumart-demo.firebaseapp.com/ を入力すると出力結果を見ることができる
-}


port receiveImageFileAndBlobUrl : (Json.Decode.Value -> msg) -> Sub msg


port exhibitionImageChange : String -> Cmd msg


port toWideScreenMode : (() -> msg) -> Sub msg


port toNarrowScreenMode : (() -> msg) -> Sub msg


port receiveImageDataUrl : (String -> msg) -> Sub msg


port studentImageChange : String -> Cmd msg


type Model
    = Model
        { page : Page -- 開いているページ
        , menuState : Maybe MenuState -- メニューの開閉など
        , message : Maybe String -- ちょっとしたことがあったら表示するもの
        , logInState : Data.LogInState.LogInState
        , key : Browser.Navigation.Key
        , goodsList : List Data.Goods.Goods
        }


type Page
    = PageHome HomePage
    | PageSignUp Page.SignUp.Model
    | PageLogIn Page.LogIn.Model
    | PageLikeAndHistory LikeAndHistory
    | PageExhibitionGoodsList
    | PagePurchaseGoodsList
    | PageExhibition Page.Exhibition.Model
    | PageGoods Data.Goods.Goods
    | PageProfile Page.Profile.Model
    | PageSiteMapXml


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


type Msg
    = ChangePage Page
    | OpenMenu
    | CloseMenu
    | ToWideScreenMode
    | ToNarrowScreenMode
    | UrlChange Url.Url
    | UrlRequest Browser.UrlRequest
    | SignUpResponse (Result Api.SignUpResponseError Api.SignUpResponseOk)
    | SignUpConfirmResponse (Result Api.SignUpConfirmResponseError Api.SignUpConfirmResponseOk)
    | LogInResponse (Result Api.LogInResponseError Api.LogInResponseOk)
    | ReceiveImageDataUrl String
    | ReceiveImageFileAndBlobUrl Json.Decode.Value
    | DeleteAllUserResponse (Result () ())
    | GetUserProfileResponse { access : Api.Token, refresh : Api.Token } (Result () Data.User.User)
    | SellGoodsResponse (Result Api.SellGoodsResponseError ())
    | GetAllGoodsResponse (Result () (List Data.Goods.Goods))
    | LogInPageMsg Page.LogIn.Msg
    | ExhibitionMsg Page.Exhibition.Msg
    | SignUpMsg Page.SignUp.Msg
    | ProfilePageMsg Page.Profile.Msg


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
            urlToPage (PageHome HomePageRecommend) url
    in
    ( Model
        { page = page |> Maybe.withDefault (PageHome HomePageRecommend)
        , menuState = Just MenuNotOpenedYet
        , message = messageMaybe
        , logInState = Data.LogInState.LogInStateNone
        , key = key
        , goodsList = []
        }
    , Api.getAllGoods GetAllGoodsResponse
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
                ( newPageMaybe, messageMaybe ) =
                    urlToPage rec.page url
            in
            ( case newPageMaybe of
                Just newPage ->
                    Model
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

                Nothing ->
                    Model
                        { rec
                            | message = messageMaybe
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

        SignUpResponse response ->
            case rec.page of
                PageSignUp singUpPageModel ->
                    let
                        ( newModel, emitMaybe ) =
                            Page.SignUp.update
                                (Page.SignUp.SignUpResponse response)
                                singUpPageModel
                    in
                    ( Model { rec | page = PageSignUp newModel }
                    , case emitMaybe of
                        Just emit ->
                            signUpPageEmitToCmd emit

                        Nothing ->
                            Cmd.none
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        LogInResponse logInResponse ->
            case logInResponse of
                Ok (Api.LogInResponseOk { access, refresh }) ->
                    ( case rec.page of
                        PageLogIn logInPageModel ->
                            Model
                                { rec
                                    | message = Just "ログインしました"
                                    , page = PageLogIn (logInPageModel |> Page.LogIn.update (Page.LogIn.Msg Page.Component.LogInOrSignUp.StopSendLogInConnection) |> Tuple.first)
                                }

                        PageExhibition exhibitionModel ->
                            Model
                                { rec
                                    | message = Just "ログインしました"
                                    , page = PageExhibition (exhibitionModel |> Page.Exhibition.update rec.logInState (Page.Exhibition.LogInOrSignUpMsg Page.Component.LogInOrSignUp.StopSendLogInConnection) |> Tuple.first)
                                }

                        _ ->
                            Model
                                { rec
                                    | message = Just "ログインしました"
                                }
                    , Api.getMyProfile access (GetUserProfileResponse { access = access, refresh = refresh })
                    )

                Err logInResponseError ->
                    ( case rec.page of
                        PageLogIn logInPageModel ->
                            Model
                                { rec
                                    | message = Just (Api.logInResponseErrorToString logInResponseError)
                                    , page = PageLogIn (logInPageModel |> Page.LogIn.update (Page.LogIn.Msg Page.Component.LogInOrSignUp.StopSendLogInConnection) |> Tuple.first)
                                }

                        PageExhibition exhibitionModel ->
                            Model
                                { rec
                                    | message = Just (Api.logInResponseErrorToString logInResponseError)
                                    , page = PageExhibition (exhibitionModel |> Page.Exhibition.update rec.logInState (Page.Exhibition.LogInOrSignUpMsg Page.Component.LogInOrSignUp.StopSendLogInConnection) |> Tuple.first)
                                }

                        _ ->
                            Model
                                { rec
                                    | message = Just (Api.logInResponseErrorToString logInResponseError)
                                }
                    , Cmd.none
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

        ReceiveImageDataUrl urlString ->
            case rec.page of
                PageSignUp signUpModel ->
                    let
                        ( newModel, emitMaybe ) =
                            Page.SignUp.update
                                (Page.SignUp.ReceiveImageDataUrl urlString)
                                signUpModel
                    in
                    ( Model { rec | page = PageSignUp newModel }
                    , case emitMaybe of
                        Just emit ->
                            signUpPageEmitToCmd emit

                        Nothing ->
                            Cmd.none
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        ReceiveImageFileAndBlobUrl value ->
            case rec.page of
                PageExhibition exhibitionPageModel ->
                    case Json.Decode.decodeValue receiveImageFileAndBlobUrlDecoder value of
                        Ok data ->
                            let
                                ( newModel, emitMaybe ) =
                                    Page.Exhibition.update
                                        rec.logInState
                                        (Page.Exhibition.InputImageList data)
                                        exhibitionPageModel
                            in
                            ( Model { rec | page = PageExhibition newModel }
                            , case emitMaybe of
                                Just emit ->
                                    exhibitionPageEmitToCmd rec.key emit

                                Nothing ->
                                    Cmd.none
                            )

                        Err _ ->
                            ( Model rec
                            , Cmd.none
                            )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        LogInPageMsg logInPageMsg ->
            case rec.page of
                PageLogIn logInModel ->
                    let
                        ( newModel, emitMaybe ) =
                            Page.LogIn.update
                                logInPageMsg
                                logInModel
                    in
                    ( Model { rec | page = PageLogIn newModel }
                    , case emitMaybe of
                        Just emit ->
                            logInPageEmitToCmd emit

                        Nothing ->
                            Cmd.none
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        DeleteAllUserResponse response ->
            case rec.page of
                PageSignUp signUpModel ->
                    let
                        ( newModel, emitMaybe ) =
                            Page.SignUp.update (Page.SignUp.DeleteUserAllResponse response) signUpModel
                    in
                    ( Model { rec | page = PageSignUp newModel }
                    , case emitMaybe of
                        Just emit ->
                            signUpPageEmitToCmd emit

                        Nothing ->
                            Cmd.none
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        GetUserProfileResponse { access, refresh } response ->
            ( case response of
                Ok profile ->
                    Model
                        { rec
                            | logInState =
                                Data.LogInState.LogInStateOk { access = access, refresh = refresh, profile = profile }
                        }

                Err () ->
                    Model { rec | message = Just "プロフィール情報の取得に失敗しました" }
            , Cmd.none
            )

        SellGoodsResponse response ->
            ( case response of
                Ok () ->
                    Model
                        { rec | message = Just "出品しました" }

                Err _ ->
                    Model { rec | message = Just "出品できませんでした" }
            , Cmd.none
            )

        GetAllGoodsResponse result ->
            ( case result of
                Ok goodsList ->
                    Model
                        { rec | goodsList = goodsList }

                Err _ ->
                    Model rec
            , Cmd.none
            )

        ExhibitionMsg exhibitionMsg ->
            case rec.page of
                PageExhibition exhibitionPageModel ->
                    let
                        ( newModel, emitMaybe ) =
                            Page.Exhibition.update rec.logInState exhibitionMsg exhibitionPageModel
                    in
                    ( Model { rec | page = PageExhibition newModel }
                    , case emitMaybe of
                        Just emit ->
                            exhibitionPageEmitToCmd rec.key emit

                        Nothing ->
                            Cmd.none
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        SignUpMsg signUpMsg ->
            case rec.page of
                PageSignUp signUpPageModel ->
                    let
                        ( newModel, emitMaybe ) =
                            Page.SignUp.update signUpMsg signUpPageModel
                    in
                    ( Model { rec | page = PageSignUp newModel }
                    , case emitMaybe of
                        Just emit ->
                            signUpPageEmitToCmd emit

                        Nothing ->
                            Cmd.none
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        ProfilePageMsg profileMsg ->
            case rec.page of
                PageProfile profileModel ->
                    let
                        ( newModel, emitMaybe ) =
                            Page.Profile.update profileMsg profileModel
                    in
                    ( Model
                        { rec
                            | page = PageProfile newModel
                        }
                    , case emitMaybe of
                        Just emit ->
                            profilePageEmitToCmd emit

                        Nothing ->
                            Cmd.none
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )



{- ===================== Page Emit To Msg ======================== -}


logInPageEmitToCmd : Page.LogIn.Emit -> Cmd Msg
logInPageEmitToCmd emit =
    case emit of
        Page.LogIn.LogInOrSignUpEmit e ->
            logInOrSignUpEmitToCmd e


exhibitionPageEmitToCmd : Browser.Navigation.Key -> Page.Exhibition.Emit -> Cmd Msg
exhibitionPageEmitToCmd key emit =
    case emit of
        Page.Exhibition.EmitLogInOrSignUp e ->
            logInOrSignUpEmitToCmd e

        Page.Exhibition.EmitSellGoods ( token, request ) ->
            Api.sellGoods token request SellGoodsResponse

        Page.Exhibition.EmitCatchImageList string ->
            exhibitionImageChange string

        Page.Exhibition.EmitHistoryPushExhibitionUrl ->
            Browser.Navigation.pushUrl key SiteMap.exhibitionUrl


signUpPageEmitToCmd : Page.SignUp.Emit -> Cmd Msg
signUpPageEmitToCmd emit =
    case emit of
        Page.SignUp.EmitCatchStudentImage idString ->
            studentImageChange idString

        Page.SignUp.EmitSignUp signUpRequest ->
            Api.signUp signUpRequest SignUpResponse

        Page.SignUp.EmitSendConfirmToken token ->
            Api.signUpConfirm { confirmToken = token } SignUpConfirmResponse

        Page.SignUp.EmitDeleteUserAll ->
            Api.debugDeleteAllUser DeleteAllUserResponse


profilePageEmitToCmd : Page.Profile.Emit -> Cmd Msg
profilePageEmitToCmd emit =
    case emit of
        Page.Profile.EmitLogInOrSignUp e ->
            logInOrSignUpEmitToCmd e



{- ===================== Page Component Emit To Msg ======================== -}


logInOrSignUpEmitToCmd : Page.Component.LogInOrSignUp.Emit -> Cmd Msg
logInOrSignUpEmitToCmd emit =
    case emit of
        Page.Component.LogInOrSignUp.EmitLogIn logInRequest ->
            Api.logIn logInRequest LogInResponse


receiveImageFileAndBlobUrlDecoder : Json.Decode.Decoder (List { file : File.File, blobUrl : String })
receiveImageFileAndBlobUrlDecoder =
    Json.Decode.list
        (Json.Decode.map2
            (\file blob ->
                { file = file
                , blobUrl = blob
                }
            )
            (Json.Decode.field "file" File.decoder)
            (Json.Decode.field "blobUrl" Json.Decode.string)
        )


urlToPage : Page -> Url.Url -> ( Maybe Page, Maybe String )
urlToPage beforePage url =
    Url.Parser.parse urlParser url
        |> Maybe.map
            (\page ->
                case page of
                    PageExhibition _ ->
                        case beforePage of
                            PageExhibition _ ->
                                ( Nothing, Nothing )

                            _ ->
                                ( Just page, Nothing )

                    _ ->
                        ( Just page, Nothing )
            )
        |> Maybe.withDefault ( Just (PageHome HomePageRecommend), Just "指定したページが見つからないのでホームに移動しました" )


urlParser : Url.Parser.Parser (Page -> a) a
urlParser =
    Url.Parser.oneOf
        [ SiteMap.homeParser
            |> Url.Parser.map (PageHome HomePageRecommend)
        , SiteMap.signUpParser
            |> Url.Parser.map (PageSignUp Page.SignUp.initModel)
        , SiteMap.logInParser
            |> Url.Parser.map (PageLogIn Page.LogIn.initModel)
        , SiteMap.likeHistoryParser
            |> Url.Parser.map (PageLikeAndHistory Like)
        , SiteMap.exhibitionGoodsParser
            |> Url.Parser.map PageExhibitionGoodsList
        , SiteMap.purchaseGoodsParser
            |> Url.Parser.map PagePurchaseGoodsList
        , SiteMap.exhibitionParser
            |> Url.Parser.map (PageExhibition Page.Exhibition.initModel)
        , SiteMap.goodsParser
            |> Url.Parser.map (\_ -> PageGoods Data.Goods.none)
        , SiteMap.profileParser
            |> Url.Parser.map (PageProfile Page.Profile.initModel)
        , SiteMap.siteMapParser
            |> Url.Parser.map PageSiteMapXml
        ]


{-| 見た目を決める
-}
view : Model -> { title : String, body : List (Html.Html Msg) }
view (Model { page, menuState, message, logInState, goodsList }) =
    let
        isWideScreen =
            menuState == Nothing
    in
    { title =
        title page
    , body =
        [ BasicParts.header isWideScreen
            |> Html.map basicPartsHeaderMsgToMsg
        , menuView logInState menuState
        ]
            ++ mainViewAndMainTab goodsList logInState page isWideScreen
            ++ (case message of
                    Just m ->
                        [ messageView m ]

                    Nothing ->
                        []
               )
    }


basicPartsHeaderMsgToMsg : BasicParts.Msg -> Msg
basicPartsHeaderMsgToMsg msg =
    case msg of
        BasicParts.OpenMenu ->
            OpenMenu


title : Page -> String
title page =
    (case page of
        PageHome homePage ->
            ""

        PageSignUp model ->
            "新規登録 | "

        PageLogIn _ ->
            "ログイン | "

        PageLikeAndHistory _ ->
            "いいね・閲覧した商品 | "

        PageExhibitionGoodsList ->
            "出品した商品 | "

        PagePurchaseGoodsList ->
            "購入した商品 | "

        PageExhibition _ ->
            "出品 | "

        PageGoods goods ->
            Data.Goods.getName goods ++ " | "

        PageProfile _ ->
            "ユーザーページ | "

        PageSiteMapXml ->
            "sitemap.xml | "
    )
        ++ "つくマート"



{- Header -}
{- Menu -}


menuView : Data.LogInState.LogInState -> Maybe MenuState -> Html.Html Msg
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


menuMain : Data.LogInState.LogInState -> List (Html.Html Msg)
menuMain logInState =
    [ menuAccount logInState
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


menuAccount : Data.LogInState.LogInState -> Html.Html msg
menuAccount logInState =
    case logInState of
        Data.LogInState.LogInStateOk { profile } ->
            Html.a
                [ Html.Attributes.class "menu-account"
                , Html.Attributes.class "menu-account-a"
                , Html.Attributes.href SiteMap.profileUrl
                ]
                [ Html.img
                    [ Html.Attributes.class "menu-account-a-icon"
                    , Html.Attributes.src "/assets/account_image.png"
                    ]
                    []
                , Html.span
                    [ Html.Attributes.class "menu-account-a-name" ]
                    [ Html.text (Data.User.getNickName profile) ]
                ]

        Data.LogInState.LogInStateNone ->
            Html.div
                [ Html.Attributes.class "menu-account" ]
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


mainViewAndMainTab : List Data.Goods.Goods -> Data.LogInState.LogInState -> Page -> Bool -> List (Html.Html Msg)
mainViewAndMainTab goodsList logInState page isWideScreenMode =
    let
        ( tabData, mainView ) =
            tabDataAndMainView goodsList logInState isWideScreenMode page
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


tabDataAndMainView : List Data.Goods.Goods -> Data.LogInState.LogInState -> Bool -> Page -> ( Tab.Tab Page, List (Html.Html Msg) )
tabDataAndMainView goodsList logInState isWideScreenMode page =
    case page of
        PageHome subPage ->
            homeView goodsList isWideScreenMode subPage
                |> Tuple.mapFirst (Tab.map PageHome)

        PageExhibition subPage ->
            Page.Exhibition.view logInState subPage
                |> Tuple.mapBoth (Tab.map never) (List.map (Html.map ExhibitionMsg))

        PageLikeAndHistory subPage ->
            likeAndHistoryView goodsList isWideScreenMode subPage
                |> Tuple.mapFirst (Tab.map PageLikeAndHistory)

        PagePurchaseGoodsList ->
            ( Tab.Single "購入した商品"
            , [ Page.Goods.goodsListView isWideScreenMode goodsList ]
            )

        PageExhibitionGoodsList ->
            ( Tab.Single "出品した商品"
            , [ Page.Goods.goodsListView isWideScreenMode goodsList ]
            )

        PageSignUp signUpPageModel ->
            Page.SignUp.view signUpPageModel
                |> Tuple.mapBoth (Tab.map never) (List.map (Html.map SignUpMsg))

        PageLogIn logInPageModel ->
            Page.LogIn.view logInPageModel
                |> Tuple.mapBoth (Tab.map never) (List.map (Html.map LogInPageMsg))

        PageGoods goods ->
            ( Tab.None, Page.Goods.goodsView isWideScreenMode goods )

        PageProfile profileModel ->
            Page.Profile.view
                (case logInState of
                    Data.LogInState.LogInStateOk { profile } ->
                        Just profile

                    Data.LogInState.LogInStateNone ->
                        Nothing
                )
                profileModel
                |> Tuple.mapBoth (Tab.map never) (List.map (Html.map ProfilePageMsg))

        PageSiteMapXml ->
            siteMapXmlView
                |> Tuple.mapFirst (Tab.map never)


messageView : String -> Html.Html msg
messageView message =
    Html.div
        [ Html.Attributes.class "message"
        ]
        [ Html.text message ]


homeView : List Data.Goods.Goods -> Bool -> HomePage -> ( Tab.Tab HomePage, List (Html.Html Msg) )
homeView goodsList isWideScreenMode subPage =
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
    , [ Page.Goods.goodsListView isWideScreenMode goodsList, exhibitButton ]
    )


likeAndHistoryView : List Data.Goods.Goods -> Bool -> LikeAndHistory -> ( Tab.Tab LikeAndHistory, List (Html.Html Msg) )
likeAndHistoryView goodsList isWideScreenMode likeAndHistory =
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
    , [ Page.Goods.goodsListView isWideScreenMode goodsList ]
    )


exhibitButton : Html.Html Msg
exhibitButton =
    Html.a
        [ Html.Attributes.class "exhibitionButton"
        , Html.Attributes.href SiteMap.exhibitionUrl
        ]
        [ Html.text "出品" ]


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
        , receiveImageFileAndBlobUrl ReceiveImageFileAndBlobUrl
        , case menuState of
            Just _ ->
                toWideScreenMode (always ToWideScreenMode)

            Nothing ->
                toNarrowScreenMode (always ToNarrowScreenMode)
        ]
