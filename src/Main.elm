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
import Page.GoodsList
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
        , menuState : Maybe BasicParts.MenuState -- メニューの開閉
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
    | PageGoods Page.Goods.Model
    | PageProfile Page.Profile.Model
    | PageSiteMapXml


type HomePage
    = HomePageRecent
    | HomePageRecommend
    | HomePageFree


type LikeAndHistory
    = Like
    | History


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
    | GetGoodsResponse (Result () Data.Goods.Goods)
    | LogInPageMsg Page.LogIn.Msg
    | ExhibitionMsg Page.Exhibition.Msg
    | SignUpMsg Page.SignUp.Msg
    | ProfilePageMsg Page.Profile.Msg
    | GoodsPageMsg Page.Goods.Msg


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
        initModel =
            Model
                { page = PageHome HomePageRecommend
                , menuState = Just BasicParts.MenuNotOpenedYet
                , message = Nothing
                , logInState = Data.LogInState.LogInStateNone
                , key = key
                , goodsList = []
                }

        ( model, cmd ) =
            urlChange url initModel
    in
    ( model
    , Cmd.batch [ Api.getAllGoods GetAllGoodsResponse, cmd ]
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
                            | menuState = Just BasicParts.MenuOpen
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
                            | menuState = Just BasicParts.MenuClose
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
                { rec | menuState = Just BasicParts.MenuNotOpenedYet }
            , Cmd.none
            )

        UrlChange url ->
            urlChange url (Model rec)

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

        GetGoodsResponse result ->
            case result of
                Ok goods ->
                    case rec.page of
                        PageGoods pageGoodsModel ->
                            let
                                ( newModel, emitMaybe ) =
                                    Page.Goods.update (Page.Goods.GetGoodsResponse goods) pageGoodsModel
                            in
                            ( Model { rec | page = PageGoods newModel }
                            , case emitMaybe of
                                Just emit ->
                                    goodsPageEmitToCmd emit

                                Nothing ->
                                    Cmd.none
                            )

                        _ ->
                            ( Model rec
                            , Cmd.none
                            )

                Err _ ->
                    ( Model
                        { rec | message = Just "商品の取得に失敗しました" }
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

        GoodsPageMsg goodsPageMsg ->
            case rec.page of
                PageGoods goodsModel ->
                    let
                        ( newModel, emitMabye ) =
                            Page.Goods.update goodsPageMsg goodsModel
                    in
                    ( Model { rec | page = PageGoods newModel }
                    , case emitMabye of
                        Just emit ->
                            goodsPageEmitToCmd emit

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


goodsPageEmitToCmd : Page.Goods.Emit -> Cmd Msg
goodsPageEmitToCmd emit =
    case emit of
        Page.Goods.EmitGetGoods { goodsId } ->
            Api.getGoods goodsId GetGoodsResponse



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


urlChange : Url.Url -> Model -> ( Model, Cmd Msg )
urlChange url (Model rec) =
    let
        result =
            Url.Parser.parse (urlParser (Model rec)) url
    in
    case result of
        Just ( newPageMaybe, cmd ) ->
            ( case newPageMaybe of
                Just newPage ->
                    Model
                        { rec
                            | page = newPage
                            , menuState =
                                case rec.menuState of
                                    Just BasicParts.MenuOpen ->
                                        Just BasicParts.MenuClose

                                    _ ->
                                        rec.menuState
                        }

                Nothing ->
                    Model
                        { rec
                            | menuState =
                                case rec.menuState of
                                    Just BasicParts.MenuOpen ->
                                        Just BasicParts.MenuClose

                                    _ ->
                                        rec.menuState
                        }
            , cmd
            )

        Nothing ->
            ( Model
                { rec
                    | message = Just "指定したページが見つからないのでホームに移動しました"
                    , menuState =
                        case rec.menuState of
                            Just BasicParts.MenuOpen ->
                                Just BasicParts.MenuClose

                            _ ->
                                rec.menuState
                }
            , Cmd.none
            )


urlParser : Model -> Url.Parser.Parser (( Maybe Page, Cmd Msg ) -> a) a
urlParser (Model rec) =
    Url.Parser.oneOf
        [ SiteMap.homeParser
            |> Url.Parser.map
                ( Just (PageHome HomePageRecommend)
                , Cmd.none
                )
        , SiteMap.signUpParser
            |> Url.Parser.map
                ( Just (PageSignUp Page.SignUp.initModel)
                , Cmd.none
                )
        , SiteMap.logInParser
            |> Url.Parser.map
                ( Just (PageLogIn Page.LogIn.initModel)
                , Cmd.none
                )
        , SiteMap.likeHistoryParser
            |> Url.Parser.map
                ( Just (PageLikeAndHistory Like)
                , Cmd.none
                )
        , SiteMap.exhibitionGoodsParser
            |> Url.Parser.map
                ( Just PageExhibitionGoodsList
                , Cmd.none
                )
        , SiteMap.purchaseGoodsParser
            |> Url.Parser.map
                ( Just PagePurchaseGoodsList
                , Cmd.none
                )
        , SiteMap.exhibitionParser
            |> Url.Parser.map
                (case rec.page of
                    PageExhibition _ ->
                        ( Nothing, Cmd.none )

                    _ ->
                        ( Just (PageExhibition Page.Exhibition.initModel), Cmd.none )
                )
        , SiteMap.goodsParser
            |> Url.Parser.map
                (\id ->
                    case rec.page of
                        PageGoods _ ->
                            ( Nothing, Cmd.none )

                        _ ->
                            let
                                ( newModel, emitMaybe ) =
                                    case rec.page of
                                        PageHome _ ->
                                            case Data.Goods.searchGoodsFromId id rec.goodsList of
                                                Just goods ->
                                                    Page.Goods.initModelFromGoods goods

                                                Nothing ->
                                                    Page.Goods.initModel id

                                        _ ->
                                            Page.Goods.initModel id
                            in
                            ( Just (PageGoods newModel)
                            , case emitMaybe of
                                Just emit ->
                                    goodsPageEmitToCmd emit

                                Nothing ->
                                    Cmd.none
                            )
                )
        , SiteMap.profileParser
            |> Url.Parser.map
                ( Just (PageProfile Page.Profile.initModel)
                , Cmd.none
                )
        , SiteMap.siteMapParser
            |> Url.Parser.map
                ( Just PageSiteMapXml
                , Cmd.none
                )
        ]



{- ============================ View ============================= -}


{-| 見た目を決める
-}
view : Model -> { title : String, body : List (Html.Html Msg) }
view (Model { page, menuState, message, logInState, goodsList }) =
    let
        isWideScreen =
            menuState == Nothing

        ( title, mainView ) =
            mainViewAndMainTab goodsList logInState page isWideScreen
    in
    { title =
        if title == "" then
            "つくマート"

        else
            title ++ " | つくマート"
    , body =
        [ BasicParts.header isWideScreen
            |> Html.map basicPartsHeaderMsgToMsg
        , BasicParts.menuView logInState menuState
            |> Html.map basicPartMenuMsgToMsg
        ]
            ++ mainView
            ++ (case message of
                    Just m ->
                        [ Html.Keyed.node "div" [] [ ( m, messageView m ) ] ]

                    Nothing ->
                        []
               )
    }


mainViewAndMainTab : List Data.Goods.Goods -> Data.LogInState.LogInState -> Page -> Bool -> ( String, List (Html.Html Msg) )
mainViewAndMainTab goodsList logInState page isWideScreenMode =
    let
        ( title, tabData, mainView ) =
            titleAndTabDataAndMainView goodsList logInState isWideScreenMode page
    in
    ( title
    , [ Tab.view isWideScreenMode tabData
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
    )


basicPartsHeaderMsgToMsg : BasicParts.HeaderMsg -> Msg
basicPartsHeaderMsgToMsg msg =
    case msg of
        BasicParts.OpenMenu ->
            OpenMenu


basicPartMenuMsgToMsg : BasicParts.MenuMsg -> Msg
basicPartMenuMsgToMsg msg =
    case msg of
        BasicParts.CloseMenu ->
            CloseMenu


titleAndTabDataAndMainView : List Data.Goods.Goods -> Data.LogInState.LogInState -> Bool -> Page -> ( String, Tab.Tab Page, List (Html.Html Msg) )
titleAndTabDataAndMainView goodsList logInState isWideScreenMode page =
    case page of
        PageHome subPage ->
            homeView goodsList isWideScreenMode subPage
                |> mapPageData PageHome identity

        PageExhibition subPage ->
            Page.Exhibition.view logInState subPage
                |> mapPageData never ExhibitionMsg

        PageLikeAndHistory subPage ->
            likeAndHistoryView goodsList isWideScreenMode subPage
                |> mapPageData PageLikeAndHistory identity

        PagePurchaseGoodsList ->
            ( "購入した商品"
            , Tab.Single "購入した商品"
            , [ Page.GoodsList.goodsListView isWideScreenMode goodsList ]
            )

        PageExhibitionGoodsList ->
            ( "出品した商品"
            , Tab.Single "出品した商品"
            , [ Page.GoodsList.goodsListView isWideScreenMode goodsList ]
            )

        PageSignUp signUpPageModel ->
            Page.SignUp.view signUpPageModel
                |> mapPageData never SignUpMsg

        PageLogIn logInPageModel ->
            Page.LogIn.view logInPageModel
                |> mapPageData never LogInPageMsg

        PageGoods goods ->
            Page.Goods.view isWideScreenMode goods
                |> mapPageData never GoodsPageMsg

        PageProfile profileModel ->
            Page.Profile.view
                (case logInState of
                    Data.LogInState.LogInStateOk { profile } ->
                        Just profile

                    Data.LogInState.LogInStateNone ->
                        Nothing
                )
                profileModel
                |> mapPageData never ProfilePageMsg

        PageSiteMapXml ->
            siteMapXmlView
                |> mapPageData never identity


mapPageData : (a -> b) -> (c -> d) -> ( String, Tab.Tab a, List (Html.Html c) ) -> ( String, Tab.Tab b, List (Html.Html d) )
mapPageData tabF msgF ( title, tab, htmlList ) =
    ( title, tab |> Tab.map tabF, htmlList |> List.map (Html.map msgF) )


messageView : String -> Html.Html msg
messageView message =
    Html.div
        [ Html.Attributes.class "message"
        ]
        [ Html.text message ]


homeView : List Data.Goods.Goods -> Bool -> HomePage -> ( String, Tab.Tab HomePage, List (Html.Html Msg) )
homeView goodsList isWideScreenMode subPage =
    ( ""
    , Tab.Multi
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
    , [ Page.GoodsList.goodsListView isWideScreenMode goodsList, exhibitButton ]
    )


likeAndHistoryView : List Data.Goods.Goods -> Bool -> LikeAndHistory -> ( String, Tab.Tab LikeAndHistory, List (Html.Html Msg) )
likeAndHistoryView goodsList isWideScreenMode likeAndHistory =
    ( "いいね・閲覧した商品"
    , Tab.Multi
        [ ( Like, "いいね" )
        , ( History, "閲覧履歴" )
        ]
        (case likeAndHistory of
            Like ->
                0

            History ->
                1
        )
    , [ Page.GoodsList.goodsListView isWideScreenMode goodsList ]
    )


exhibitButton : Html.Html Msg
exhibitButton =
    Html.a
        [ Html.Attributes.class "exhibitionButton"
        , Html.Attributes.href SiteMap.exhibitionUrl
        ]
        [ Html.text "出品" ]


siteMapXmlView : ( String, Tab.Tab Never, List (Html.Html msg) )
siteMapXmlView =
    ( "sitemap.xml"
    , Tab.Single "sitemap.xml"
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
