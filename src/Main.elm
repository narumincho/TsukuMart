port module Main exposing (main)

import Api
import BasicParts
import Browser
import Browser.Navigation
import Data.Good
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
import Page.ExhibitionGoodList
import Page.Good
import Page.GoodList
import Page.Home
import Page.LikeAndHistory
import Page.LogIn
import Page.Profile
import Page.PurchaseGoodList
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
        }


type Page
    = PageHome Page.Home.Model
    | PageSignUp Page.SignUp.Model
    | PageLogIn Page.LogIn.Model
    | PageLikeAndHistory Page.LikeAndHistory.Model
    | PageExhibitionGoodList Page.ExhibitionGoodList.Model
    | PagePurchaseGoodList Page.PurchaseGoodList.Model
    | PageExhibition Page.Exhibition.Model
    | PageGoods Page.Good.Model
    | PageProfile Page.Profile.Model
    | PageSiteMapXml


type Msg
    = OpenMenu
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
    | SellGoodResponse (Result Api.SellGoodsResponseError ())
    | GetRecentGoodListResponse (Result () (List Data.Good.Good))
    | GetRecommendGoodListResponse (Result () (List Data.Good.Good))
    | GetFreeGoodListResponse (Result () (List Data.Good.Good))
    | GetLikeGoodListResponse (Result () (List Data.Good.Good))
    | GetHistoryGoodListResponse (Result () (List Data.Good.Good))
    | GetExhibitionGoodListResponse (Result () (List Data.Good.Good))
    | GetPurchaseGoodListResponse (Result () (List Data.Good.Good))
    | GetGoodResponse (Result () Data.Good.Good)
    | LikeGood Api.Token Int
    | LikeGoodResponse (Result () ())
    | HomePageMsg Page.Home.Msg
    | LikeAndHistoryPageMsg Page.LikeAndHistory.Msg
    | PurchaseGoodListPageMsg Page.PurchaseGoodList.Msg
    | ExhibitionGoodListPageMsg Page.ExhibitionGoodList.Msg
    | LogInPageMsg Page.LogIn.Msg
    | ExhibitionPageMsg Page.Exhibition.Msg
    | SignUpMsg Page.SignUp.Msg
    | ProfilePageMsg Page.Profile.Msg
    | GoodsPageMsg Page.Good.Msg


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
        ( newModel, emitList ) =
            Page.Home.initModel

        initModel =
            Model
                { page = PageHome newModel
                , menuState = Just BasicParts.MenuNotOpenedYet
                , message = Nothing
                , logInState = Data.LogInState.LogInStateNone
                , key = key
                }

        ( model, cmd ) =
            urlChange url initModel
    in
    ( model
    , Cmd.batch ((emitList |> List.map homePageEmitToCmd) ++ [ cmd ])
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg (Model rec) =
    case msg of
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
            case response of
                Ok _ ->
                    let
                        ( newModel, emitList ) =
                            Page.Home.initModel
                    in
                    ( Model
                        { rec
                            | message = Just "新規登録完了"
                            , page = PageHome newModel
                        }
                    , Cmd.batch
                        (Browser.Navigation.pushUrl rec.key SiteMap.homeUrl
                            :: (emitList |> List.map homePageEmitToCmd)
                        )
                    )

                Err e ->
                    ( Model
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

        SellGoodResponse response ->
            ( case response of
                Ok () ->
                    Model
                        { rec | message = Just "出品しました" }

                Err _ ->
                    Model { rec | message = Just "出品できませんでした" }
            , Api.getRecommendGoods GetRecommendGoodListResponse
            )

        GetRecentGoodListResponse result ->
            case rec.page of
                PageHome homeModel ->
                    let
                        ( newModel, emitList ) =
                            homeModel
                                |> Page.Home.update
                                    (Page.Home.GetRecentGoodListResponse result)
                    in
                    ( Model { rec | page = PageHome newModel }
                    , emitList |> List.map homePageEmitToCmd |> Cmd.batch
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        GetRecommendGoodListResponse result ->
            case rec.page of
                PageHome homeModel ->
                    let
                        ( newModel, emitList ) =
                            homeModel |> Page.Home.update (Page.Home.GetRecentGoodListResponse result)
                    in
                    ( Model { rec | page = PageHome newModel }
                    , emitList |> List.map homePageEmitToCmd |> Cmd.batch
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        GetFreeGoodListResponse result ->
            case rec.page of
                PageHome homeModel ->
                    let
                        ( newModel, emitList ) =
                            homeModel |> Page.Home.update (Page.Home.GetFreeGoodListResponse result)
                    in
                    ( Model { rec | page = PageHome newModel }
                    , emitList |> List.map homePageEmitToCmd |> Cmd.batch
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        GetLikeGoodListResponse result ->
            case rec.page of
                PageLikeAndHistory likeAndHistoryModel ->
                    let
                        ( newModel, emitList ) =
                            likeAndHistoryModel
                                |> Page.LikeAndHistory.update rec.logInState (Page.LikeAndHistory.LikeGoodListResponse result)
                    in
                    ( Model { rec | page = PageLikeAndHistory newModel }
                    , emitList |> List.map likeAndHistoryEmitToCmd |> Cmd.batch
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        GetHistoryGoodListResponse result ->
            case rec.page of
                PageLikeAndHistory likeAndHistoryModel ->
                    let
                        ( newModel, emitList ) =
                            likeAndHistoryModel
                                |> Page.LikeAndHistory.update rec.logInState (Page.LikeAndHistory.HistoryGoodListResponse result)
                    in
                    ( Model { rec | page = PageLikeAndHistory newModel }
                    , emitList |> List.map likeAndHistoryEmitToCmd |> Cmd.batch
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        GetExhibitionGoodListResponse result ->
            case rec.page of
                PageExhibitionGoodList exhibitionGoodListModel ->
                    let
                        ( newModel, emitMaybe ) =
                            exhibitionGoodListModel
                                |> Page.ExhibitionGoodList.update (Page.ExhibitionGoodList.GetExhibitionGoodResponse result)
                    in
                    ( Model { rec | page = PageExhibitionGoodList newModel }
                    , emitMaybe |> Maybe.map exhibitionGoodListPageEmitToCmd |> Maybe.withDefault Cmd.none
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        GetPurchaseGoodListResponse result ->
            case rec.page of
                PagePurchaseGoodList purchaseGoodListModel ->
                    let
                        ( newModel, emitMaybe ) =
                            purchaseGoodListModel
                                |> Page.PurchaseGoodList.update (Page.PurchaseGoodList.GetPurchaseGoodResponse result)
                    in
                    ( Model { rec | page = PagePurchaseGoodList newModel }
                    , emitMaybe |> Maybe.map purchaseGoodListPageEmitToCmd |> Maybe.withDefault Cmd.none
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        GetGoodResponse result ->
            case result of
                Ok goods ->
                    case rec.page of
                        PageGoods pageGoodsModel ->
                            let
                                ( newModel, emitMaybe ) =
                                    Page.Good.update (Page.Good.GetGoodsResponse goods) pageGoodsModel
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

        ExhibitionPageMsg exhibitionMsg ->
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
                            Page.Good.update goodsPageMsg goodsModel
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

        LikeGood token id ->
            ( Model rec
            , Api.likeGoods token id LikeGoodResponse
            )

        LikeGoodResponse response ->
            ( Model rec
            , Cmd.none
            )

        HomePageMsg homePageMsg ->
            case rec.page of
                PageHome homePageModel ->
                    let
                        ( newModel, emitList ) =
                            homePageModel
                                |> Page.Home.update homePageMsg
                    in
                    ( Model { rec | page = PageHome newModel }
                    , emitList |> List.map homePageEmitToCmd |> Cmd.batch
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        LikeAndHistoryPageMsg likeAndHistoryMsg ->
            case rec.page of
                PageLikeAndHistory likeAndHistoryModel ->
                    let
                        ( newModel, emitList ) =
                            likeAndHistoryModel
                                |> Page.LikeAndHistory.update rec.logInState likeAndHistoryMsg
                    in
                    ( Model { rec | page = PageLikeAndHistory newModel }
                    , emitList |> List.map likeAndHistoryEmitToCmd |> Cmd.batch
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        PurchaseGoodListPageMsg purchaseGoodListMsg ->
            case rec.page of
                PagePurchaseGoodList purchaseGoodListModel ->
                    let
                        ( newModel, emitMaybe ) =
                            purchaseGoodListModel
                                |> Page.PurchaseGoodList.update purchaseGoodListMsg
                    in
                    ( Model { rec | page = PagePurchaseGoodList newModel }
                    , emitMaybe |> Maybe.map purchaseGoodListPageEmitToCmd |> Maybe.withDefault Cmd.none
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        ExhibitionGoodListPageMsg exhibitionGoodListMsg ->
            case rec.page of
                PageExhibitionGoodList exhibitionGoodListModel ->
                    let
                        ( newModel, emitMaybe ) =
                            exhibitionGoodListModel
                                |> Page.ExhibitionGoodList.update exhibitionGoodListMsg
                    in
                    ( Model { rec | page = PageExhibitionGoodList newModel }
                    , emitMaybe |> Maybe.map exhibitionGoodListPageEmitToCmd |> Maybe.withDefault Cmd.none
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )



{- ===================== Page Emit To Msg ======================== -}


homePageEmitToCmd : Page.Home.Emit -> Cmd Msg
homePageEmitToCmd emit =
    case emit of
        Page.Home.EmitGetRecentGoodList ->
            Api.getRecentGoods GetRecentGoodListResponse

        Page.Home.EmitGetRecommendGoodList ->
            Api.getRecommendGoods GetRecommendGoodListResponse

        Page.Home.EmitGetFreeGoodList ->
            Api.getFreeGoods GetFreeGoodListResponse


likeAndHistoryEmitToCmd : Page.LikeAndHistory.Emit -> Cmd Msg
likeAndHistoryEmitToCmd emit =
    case emit of
        Page.LikeAndHistory.EmitGetLikeGoodList token ->
            Api.getLikeGoodList token GetLikeGoodListResponse

        Page.LikeAndHistory.EmitGetHistoryGoodList token ->
            Api.getHistoryGoodList token GetHistoryGoodListResponse

        Page.LikeAndHistory.EmitLogInOrSignUp e ->
            logInOrSignUpEmitToCmd e


exhibitionGoodListPageEmitToCmd : Page.ExhibitionGoodList.Emit -> Cmd Msg
exhibitionGoodListPageEmitToCmd emit =
    case emit of
        Page.ExhibitionGoodList.EmitGetExhibitionGood token ->
            Api.getExhibitionGoodList token GetExhibitionGoodListResponse

        Page.ExhibitionGoodList.EmitLogInOrSignUp e ->
            logInOrSignUpEmitToCmd e


purchaseGoodListPageEmitToCmd : Page.PurchaseGoodList.Emit -> Cmd Msg
purchaseGoodListPageEmitToCmd emit =
    case emit of
        Page.PurchaseGoodList.EmitGetPurchaseGoodList token ->
            Api.getPurchaseGoodList token GetPurchaseGoodListResponse

        Page.PurchaseGoodList.EmitLogInOrSignUp e ->
            logInOrSignUpEmitToCmd e


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
            Api.sellGoods token request SellGoodResponse

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


goodsPageEmitToCmd : Page.Good.Emit -> Cmd Msg
goodsPageEmitToCmd emit =
    case emit of
        Page.Good.EmitGetGoods { goodsId } ->
            Api.getGoods goodsId GetGoodResponse



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
                (Page.Home.initModel
                    |> Tuple.mapBoth
                        (\m -> Just (PageHome m))
                        (List.map homePageEmitToCmd >> Cmd.batch)
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
                (Page.LikeAndHistory.initModel rec.logInState
                    |> Tuple.mapBoth
                        (\m -> Just (PageLikeAndHistory m))
                        (List.map likeAndHistoryEmitToCmd >> Cmd.batch)
                )
        , SiteMap.exhibitionGoodsParser
            |> Url.Parser.map
                (Page.ExhibitionGoodList.initModel rec.logInState
                    |> Tuple.mapBoth
                        (\m -> Just (PageExhibitionGoodList m))
                        (Maybe.map exhibitionGoodListPageEmitToCmd >> Maybe.withDefault Cmd.none)
                )
        , SiteMap.purchaseGoodsParser
            |> Url.Parser.map
                (Page.PurchaseGoodList.initModel rec.logInState
                    |> Tuple.mapBoth
                        (\m -> Just (PagePurchaseGoodList m))
                        (Maybe.map purchaseGoodListPageEmitToCmd >> Maybe.withDefault Cmd.none)
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
                                        PageHome pageModel ->
                                            case Data.Good.searchGoodsFromId id (Page.Home.getGoodAllGoodList pageModel) of
                                                Just goods ->
                                                    Page.Good.initModelFromGoods goods

                                                Nothing ->
                                                    Page.Good.initModel id

                                        _ ->
                                            Page.Good.initModel id
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
view (Model { page, menuState, message, logInState }) =
    let
        isWideScreen =
            menuState == Nothing

        ( title, mainView ) =
            mainViewAndMainTab logInState page isWideScreen
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


mainViewAndMainTab : Data.LogInState.LogInState -> Page -> Bool -> ( String, List (Html.Html Msg) )
mainViewAndMainTab logInState page isWideScreenMode =
    let
        ( title, tabData, mainView ) =
            titleAndTabDataAndMainView logInState isWideScreenMode page
    in
    ( title
    , [ Tab.view isWideScreenMode tabData
      , Html.div
            (if Tab.isNone tabData then
                [ Html.Attributes.classList
                    [ ( "mainView-noMainTab", True ), ( "mainView-wide-noMainTab", isWideScreenMode ) ]
                ]

             else
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


titleAndTabDataAndMainView : Data.LogInState.LogInState -> Bool -> Page -> ( String, Tab.Tab Msg, List (Html.Html Msg) )
titleAndTabDataAndMainView logInState isWideScreenMode page =
    case page of
        PageHome homeModel ->
            homeModel
                |> Page.Home.view logInState isWideScreenMode
                |> mapPageData HomePageMsg

        PageExhibition exhibitionModel ->
            exhibitionModel
                |> Page.Exhibition.view logInState
                |> mapPageData ExhibitionPageMsg

        PageLikeAndHistory likeAndHistoryModel ->
            likeAndHistoryModel
                |> Page.LikeAndHistory.view logInState isWideScreenMode
                |> mapPageData LikeAndHistoryPageMsg

        PagePurchaseGoodList purchaseGoodListModel ->
            purchaseGoodListModel
                |> Page.PurchaseGoodList.view logInState isWideScreenMode
                |> mapPageData PurchaseGoodListPageMsg

        PageExhibitionGoodList exhibitionGoodListModel ->
            exhibitionGoodListModel
                |> Page.ExhibitionGoodList.view logInState isWideScreenMode
                |> mapPageData ExhibitionGoodListPageMsg

        PageSignUp signUpPageModel ->
            signUpPageModel
                |> Page.SignUp.view
                |> mapPageData SignUpMsg

        PageLogIn logInPageModel ->
            logInPageModel
                |> Page.LogIn.view
                |> mapPageData LogInPageMsg

        PageGoods goodModel ->
            goodModel
                |> Page.Good.view isWideScreenMode
                |> mapPageData GoodsPageMsg

        PageProfile profileModel ->
            profileModel
                |> Page.Profile.view
                    (case logInState of
                        Data.LogInState.LogInStateOk { profile } ->
                            Just profile

                        Data.LogInState.LogInStateNone ->
                            Nothing
                    )
                |> mapPageData ProfilePageMsg

        PageSiteMapXml ->
            siteMapXmlView


mapPageData : (a -> b) -> ( String, Tab.Tab a, List (Html.Html a) ) -> ( String, Tab.Tab b, List (Html.Html b) )
mapPageData f ( title, tab, htmlList ) =
    ( title, tab |> Tab.map f, htmlList |> List.map (Html.map f) )


messageView : String -> Html.Html msg
messageView message =
    Html.div
        [ Html.Attributes.class "message"
        ]
        [ Html.text message ]


goodsListMsgToMsg : Page.GoodList.Msg -> Msg
goodsListMsgToMsg msg =
    case msg of
        Page.GoodList.LikeGood token id ->
            LikeGood token id


exhibitButton : Html.Html Msg
exhibitButton =
    Html.a
        [ Html.Attributes.class "exhibitionButton"
        , Html.Attributes.href SiteMap.exhibitionUrl
        ]
        [ Html.text "出品" ]


siteMapXmlView : ( String, Tab.Tab msg, List (Html.Html msg) )
siteMapXmlView =
    ( "sitemap.xml"
    , Tab.single "sitemap.xml"
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
