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
import Html.Keyed
import Json.Decode
import Page.Component.GoodList
import Page.Component.LogInOrSignUp
import Page.Exhibition
import Page.ExhibitionGoodList
import Page.Good
import Page.Home
import Page.LikeAndHistory
import Page.LogIn
import Page.Profile
import Page.PurchaseGoodList
import Page.SignUp
import SiteMap
import Tab
import Task
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


port elementScrollIntoView : String -> Cmd msg


port inputOrTextAreaReplaceText : { id : String, text : String } -> Cmd msg


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
    | GetUserDataResponse { access : Api.Token, refresh : Api.Token } (Result () Data.User.User)
    | SellGoodResponse (Result Api.SellGoodsResponseError ())
    | GetRecentGoodListResponse (Result () (List Data.Good.Good))
    | GetRecommendGoodListResponse (Result () (List Data.Good.Good))
    | GetFreeGoodListResponse (Result () (List Data.Good.Good))
    | GetLikeGoodListResponse (Result () (List Data.Good.Good))
    | GetHistoryGoodListResponse (Result () (List Data.Good.Good))
    | GetExhibitionGoodListResponse (Result () (List Data.Good.Good))
    | GetPurchaseGoodListResponse (Result () (List Data.Good.Good))
    | GetGoodResponse (Result () Data.Good.Good)
    | LikeGoodResponse Data.User.UserId Data.Good.GoodId (Result () ())
    | UnlikeGoodResponse Data.User.UserId Data.Good.GoodId (Result () ())
    | ChangeProfileResponse (Result () Data.User.Profile)
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
        ( newModel, _ ) =
            Page.Home.initModel Nothing

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
    , Cmd.batch [ cmd ]
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
            ( Model rec
            , case urlRequest of
                Browser.Internal url ->
                    Browser.Navigation.pushUrl rec.key (Url.toString url)

                Browser.External urlString ->
                    Browser.Navigation.load urlString
            )

        SignUpResponse response ->
            case rec.page of
                PageSignUp singUpPageModel ->
                    let
                        ( newModel, emitList ) =
                            Page.SignUp.update
                                (Page.SignUp.SignUpResponse response)
                                singUpPageModel
                    in
                    ( Model { rec | page = PageSignUp newModel }
                    , signUpPageEmitListToCmd emitList
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        LogInResponse logInResponse ->
            case logInResponse of
                Ok (Api.LogInResponseOk { access, refresh }) ->
                    let
                        ( newPage, cmd ) =
                            case rec.page of
                                PageLogIn logInPageModel ->
                                    logInPageModel
                                        |> Page.LogIn.update (Page.LogIn.Msg Page.Component.LogInOrSignUp.LogInSuccess)
                                        |> Tuple.mapBoth PageLogIn (logInPageEmitListToCmd rec.key)

                                PageExhibition exhibitionPageModel ->
                                    exhibitionPageModel
                                        |> Page.Exhibition.update rec.logInState
                                            (Page.Exhibition.LogInOrSignUpMsg Page.Component.LogInOrSignUp.LogInSuccess)
                                        |> Tuple.mapBoth PageExhibition (exhibitionPageEmitListToCmd rec.key)

                                PageLikeAndHistory likeAndHistoryModel ->
                                    likeAndHistoryModel
                                        |> Page.LikeAndHistory.update rec.logInState
                                            (Page.LikeAndHistory.LogInOrSignUpMsg Page.Component.LogInOrSignUp.LogInSuccess)
                                        |> Tuple.mapBoth PageLikeAndHistory likeAndHistoryEmitListToCmd

                                PagePurchaseGoodList purchaseGoodListModel ->
                                    purchaseGoodListModel
                                        |> Page.PurchaseGoodList.update
                                            (Page.PurchaseGoodList.LogInOrSignUpMsg Page.Component.LogInOrSignUp.LogInSuccess)
                                        |> Tuple.mapBoth PagePurchaseGoodList purchaseGoodListPageEmitListToCmd

                                PageExhibitionGoodList exhibitonGoodListModel ->
                                    exhibitonGoodListModel
                                        |> Page.ExhibitionGoodList.update
                                            (Page.ExhibitionGoodList.LogInOrSignUpMsg Page.Component.LogInOrSignUp.LogInSuccess)
                                        |> Tuple.mapBoth PageExhibitionGoodList exhibitionGoodListPageEmitListToCmd

                                _ ->
                                    ( rec.page, Cmd.none )
                    in
                    ( Model
                        { rec
                            | message = Just "ログインしました"
                            , page = newPage
                        }
                    , Cmd.batch
                        [ cmd
                        , Api.getMyProfile access (GetUserDataResponse { access = access, refresh = refresh })
                        ]
                    )

                Err logInResponseError ->
                    let
                        ( newPage, cmd ) =
                            case rec.page of
                                PageLogIn logInPageModel ->
                                    logInPageModel
                                        |> Page.LogIn.update (Page.LogIn.Msg Page.Component.LogInOrSignUp.LogInFailure)
                                        |> Tuple.mapBoth PageLogIn (logInPageEmitListToCmd rec.key)

                                PageExhibition exhibitionPageModel ->
                                    exhibitionPageModel
                                        |> Page.Exhibition.update rec.logInState
                                            (Page.Exhibition.LogInOrSignUpMsg Page.Component.LogInOrSignUp.LogInFailure)
                                        |> Tuple.mapBoth PageExhibition (exhibitionPageEmitListToCmd rec.key)

                                _ ->
                                    ( rec.page, Cmd.none )
                    in
                    ( Model
                        { rec
                            | message = Just (Api.logInResponseErrorToString logInResponseError)
                            , page = newPage
                        }
                    , cmd
                    )

        SignUpConfirmResponse response ->
            case response of
                Ok _ ->
                    let
                        ( newModel, emitList ) =
                            Page.Home.initModel (getGoodId rec.page)
                    in
                    ( Model
                        { rec
                            | message = Just "新規登録完了"
                            , page = PageHome newModel
                        }
                    , Cmd.batch
                        [ Browser.Navigation.pushUrl rec.key SiteMap.homeUrl
                        , homePageEmitListToCmd emitList
                        ]
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
                        ( newModel, emitList ) =
                            Page.SignUp.update
                                (Page.SignUp.ReceiveImageDataUrl urlString)
                                signUpModel
                    in
                    ( Model { rec | page = PageSignUp newModel }
                    , signUpPageEmitListToCmd emitList
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
                                ( newModel, emitList ) =
                                    Page.Exhibition.update
                                        rec.logInState
                                        (Page.Exhibition.InputImageList data)
                                        exhibitionPageModel
                            in
                            ( Model { rec | page = PageExhibition newModel }
                            , exhibitionPageEmitListToCmd rec.key emitList
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
                        ( newModel, emitList ) =
                            Page.LogIn.update
                                logInPageMsg
                                logInModel
                    in
                    ( Model { rec | page = PageLogIn newModel }
                    , logInPageEmitListToCmd rec.key emitList
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        GetUserDataResponse { access, refresh } response ->
            ( case response of
                Ok user ->
                    Model
                        { rec
                            | logInState =
                                Data.LogInState.LogInStateOk { access = access, refresh = refresh, user = user }
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
                                |> Page.Home.update (Page.Home.GetRecentGoodListResponse result)
                    in
                    ( Model { rec | page = PageHome newModel }
                    , homePageEmitListToCmd emitList
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
                            homeModel
                                |> Page.Home.update (Page.Home.GetRecommendGoodListResponse result)
                    in
                    ( Model { rec | page = PageHome newModel }
                    , homePageEmitListToCmd emitList
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
                    , homePageEmitListToCmd emitList
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
                    , likeAndHistoryEmitListToCmd emitList
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
                    , likeAndHistoryEmitListToCmd emitList
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
                    , exhibitionGoodListPageEmitListToCmd emitMaybe
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
                    , purchaseGoodListPageEmitListToCmd emitMaybe
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
                                ( newModel, emitList ) =
                                    Page.Good.update (Page.Good.GetGoodsResponse goods) pageGoodsModel
                            in
                            ( Model { rec | page = PageGoods newModel }
                            , goodsPageEmitListToCmd emitList
                            )

                        _ ->
                            ( Model rec
                            , Cmd.none
                            )

                Err _ ->
                    ( Model
                        { rec | message = Just "商品情報の取得に失敗しました" }
                    , Cmd.none
                    )

        ExhibitionPageMsg exhibitionMsg ->
            case rec.page of
                PageExhibition exhibitionPageModel ->
                    let
                        ( newModel, emitList ) =
                            Page.Exhibition.update rec.logInState exhibitionMsg exhibitionPageModel
                    in
                    ( Model { rec | page = PageExhibition newModel }
                    , exhibitionPageEmitListToCmd rec.key emitList
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        SignUpMsg signUpMsg ->
            case rec.page of
                PageSignUp signUpPageModel ->
                    let
                        ( newModel, emitList ) =
                            Page.SignUp.update signUpMsg signUpPageModel
                    in
                    ( Model { rec | page = PageSignUp newModel }
                    , signUpPageEmitListToCmd emitList
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        ProfilePageMsg profileMsg ->
            case rec.page of
                PageProfile profileModel ->
                    let
                        ( newModel, emitList ) =
                            Page.Profile.update rec.logInState profileMsg profileModel
                    in
                    ( Model
                        { rec
                            | page = PageProfile newModel
                        }
                    , profilePageEmitListToCmd emitList
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        GoodsPageMsg goodsPageMsg ->
            case rec.page of
                PageGoods goodsModel ->
                    let
                        ( newModel, emitList ) =
                            Page.Good.update goodsPageMsg goodsModel
                    in
                    ( Model { rec | page = PageGoods newModel }
                    , goodsPageEmitListToCmd emitList
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        LikeGoodResponse userId id response ->
            let
                ( page, cmd ) =
                    likeGood userId id response rec.logInState rec.page
            in
            ( Model { rec | page = page }
            , cmd
            )

        UnlikeGoodResponse userId id response ->
            let
                ( page, cmd ) =
                    unlikeGood userId id response rec.logInState rec.page
            in
            ( Model { rec | page = page }
            , cmd
            )

        ChangeProfileResponse response ->
            case response of
                Ok newProfile ->
                    case rec.page of
                        PageProfile profileModel ->
                            let
                                ( newModel, emitList ) =
                                    profileModel
                                        |> Page.Profile.update rec.logInState Page.Profile.MsgChangeProfileResponse
                            in
                            ( Model
                                { rec
                                    | logInState =
                                        case rec.logInState of
                                            Data.LogInState.LogInStateOk r ->
                                                Data.LogInState.LogInStateOk
                                                    { r | user = r.user |> Data.User.setProfile newProfile }

                                            Data.LogInState.LogInStateNone ->
                                                Data.LogInState.LogInStateNone
                                    , page = PageProfile newModel
                                }
                            , profilePageEmitListToCmd emitList
                            )

                        _ ->
                            ( Model rec
                            , Cmd.none
                            )

                Err () ->
                    ( Model
                        { rec | message = Just "プロフィール更新に失敗しました" }
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
                    , homePageEmitListToCmd emitList
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
                    , likeAndHistoryEmitListToCmd emitList
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
                    , purchaseGoodListPageEmitListToCmd emitMaybe
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
                    , exhibitionGoodListPageEmitListToCmd emitMaybe
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )



{- ===================== Page Emit To Msg ======================== -}


homePageEmitListToCmd : List Page.Home.Emit -> Cmd Msg
homePageEmitListToCmd =
    List.map
        (\emit ->
            case emit of
                Page.Home.EmitGetRecentGoodList ->
                    Api.getRecentGoods GetRecentGoodListResponse

                Page.Home.EmitGetRecommendGoodList ->
                    Api.getRecommendGoods GetRecommendGoodListResponse

                Page.Home.EmitGetFreeGoodList ->
                    Api.getFreeGoods GetFreeGoodListResponse

                Page.Home.EmitGoodList e ->
                    goodsListEmitToMsg e
        )
        >> Cmd.batch


likeAndHistoryEmitListToCmd : List Page.LikeAndHistory.Emit -> Cmd Msg
likeAndHistoryEmitListToCmd =
    List.map
        (\emit ->
            case emit of
                Page.LikeAndHistory.EmitGetLikeGoodList token ->
                    Api.getLikeGoodList token GetLikeGoodListResponse

                Page.LikeAndHistory.EmitGetHistoryGoodList token ->
                    Cmd.none

                Page.LikeAndHistory.EmitLogInOrSignUp e ->
                    logInOrSignUpEmitToCmd e

                Page.LikeAndHistory.EmitGoodList e ->
                    goodsListEmitToMsg e
        )
        >> Cmd.batch


exhibitionGoodListPageEmitListToCmd : List Page.ExhibitionGoodList.Emit -> Cmd Msg
exhibitionGoodListPageEmitListToCmd =
    List.map
        (\emit ->
            case emit of
                Page.ExhibitionGoodList.EmitGetExhibitionGood token ->
                    Api.getExhibitionGoodList token GetExhibitionGoodListResponse

                Page.ExhibitionGoodList.EmitLogInOrSignUp e ->
                    logInOrSignUpEmitToCmd e

                Page.ExhibitionGoodList.EmitGoodList e ->
                    goodsListEmitToMsg e
        )
        >> Cmd.batch


purchaseGoodListPageEmitListToCmd : List Page.PurchaseGoodList.Emit -> Cmd Msg
purchaseGoodListPageEmitListToCmd =
    List.map
        (\emit ->
            case emit of
                Page.PurchaseGoodList.EmitGetPurchaseGoodList token ->
                    Api.getPurchaseGoodList token GetPurchaseGoodListResponse

                Page.PurchaseGoodList.EmitLogInOrSignUp e ->
                    logInOrSignUpEmitToCmd e

                Page.PurchaseGoodList.EmitGoodList e ->
                    goodsListEmitToMsg e
        )
        >> Cmd.batch


logInPageEmitListToCmd : Browser.Navigation.Key -> List Page.LogIn.Emit -> Cmd Msg
logInPageEmitListToCmd key =
    List.map
        (\emit ->
            case emit of
                Page.LogIn.LogInOrSignUpEmit e ->
                    logInOrSignUpEmitToCmd e

                Page.LogIn.EmitPageToHome ->
                    Browser.Navigation.pushUrl key SiteMap.homeUrl
        )
        >> Cmd.batch


exhibitionPageEmitListToCmd : Browser.Navigation.Key -> List Page.Exhibition.Emit -> Cmd Msg
exhibitionPageEmitListToCmd key =
    List.map
        (\emit ->
            case emit of
                Page.Exhibition.EmitLogInOrSignUp e ->
                    logInOrSignUpEmitToCmd e

                Page.Exhibition.EmitSellGoods ( token, request ) ->
                    Api.sellGoods token request SellGoodResponse

                Page.Exhibition.EmitCatchImageList string ->
                    exhibitionImageChange string

                Page.Exhibition.EmitHistoryPushExhibitionUrl ->
                    Browser.Navigation.pushUrl key SiteMap.exhibitionUrl
        )
        >> Cmd.batch


signUpPageEmitListToCmd : List Page.SignUp.Emit -> Cmd Msg
signUpPageEmitListToCmd =
    List.map
        (\emit ->
            case emit of
                Page.SignUp.EmitCatchStudentImage idString ->
                    studentImageChange idString

                Page.SignUp.EmitSignUp signUpRequest ->
                    Api.signUp signUpRequest SignUpResponse

                Page.SignUp.EmitSendConfirmToken token ->
                    Api.signUpConfirm { confirmToken = token } SignUpConfirmResponse
        )
        >> Cmd.batch


profilePageEmitListToCmd : List Page.Profile.Emit -> Cmd Msg
profilePageEmitListToCmd =
    List.map
        (\emit ->
            case emit of
                Page.Profile.EmitLogInOrSignUp e ->
                    logInOrSignUpEmitToCmd e

                Page.Profile.EmitChangeProfile token profile ->
                    Api.updateProfile token profile ChangeProfileResponse

                Page.Profile.EmitReplaceText { id, text } ->
                    inputOrTextAreaReplaceText
                        { id = id, text = text }
        )
        >> Cmd.batch


goodsPageEmitListToCmd : List Page.Good.Emit -> Cmd Msg
goodsPageEmitListToCmd =
    List.map
        (\emit ->
            case emit of
                Page.Good.EmitGetGoods { goodId } ->
                    Api.getGood goodId GetGoodResponse

                Page.Good.EmitLikeGood userId token id ->
                    Api.likeGoods token id (LikeGoodResponse userId id)

                Page.Good.EmitUnLikeGood userId token id ->
                    Api.unlikeGoods token id (UnlikeGoodResponse userId id)
        )
        >> Cmd.batch



{- ===================== Page Component Emit To Msg ======================== -}


logInOrSignUpEmitToCmd : Page.Component.LogInOrSignUp.Emit -> Cmd Msg
logInOrSignUpEmitToCmd emit =
    case emit of
        Page.Component.LogInOrSignUp.EmitLogIn logInRequest ->
            Api.logIn logInRequest LogInResponse


goodsListEmitToMsg : Page.Component.GoodList.Emit -> Cmd Msg
goodsListEmitToMsg emit =
    case emit of
        Page.Component.GoodList.EmitLikeGood userId token id ->
            Api.likeGoods token id (LikeGoodResponse userId id)

        Page.Component.GoodList.EmitUnlikeGood userId token id ->
            Api.unlikeGoods token id (UnlikeGoodResponse userId id)

        Page.Component.GoodList.EmitScrollIntoView idString ->
            elementScrollIntoView idString


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
    case Url.Parser.parse (urlParser (Model rec)) url of
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
                (Page.Home.initModel (getGoodId rec.page)
                    |> Tuple.mapBoth
                        (\m -> Just (PageHome m))
                        homePageEmitListToCmd
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
                (Page.LikeAndHistory.initModel (getGoodId rec.page) rec.logInState
                    |> Tuple.mapBoth
                        (\m -> Just (PageLikeAndHistory m))
                        likeAndHistoryEmitListToCmd
                )
        , SiteMap.exhibitionGoodsParser
            |> Url.Parser.map
                (Page.ExhibitionGoodList.initModel (getGoodId rec.page) rec.logInState
                    |> Tuple.mapBoth
                        (\m -> Just (PageExhibitionGoodList m))
                        exhibitionGoodListPageEmitListToCmd
                )
        , SiteMap.purchaseGoodsParser
            |> Url.Parser.map
                (Page.PurchaseGoodList.initModel (getGoodId rec.page) rec.logInState
                    |> Tuple.mapBoth
                        (\m -> Just (PagePurchaseGoodList m))
                        purchaseGoodListPageEmitListToCmd
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
                            ( Nothing
                            , Task.perform (always ToWideScreenMode)
                                (Task.succeed ())
                            )

                        _ ->
                            let
                                ( newModel, emitList ) =
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
                            , goodsPageEmitListToCmd emitList
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


{-| 指定したページにあるメインの商品ID
GoodListの表示になったときにその商品のところへスクロールできるように
-}
getGoodId : Page -> Maybe Data.Good.GoodId
getGoodId page =
    case page of
        PageGoods goodModel ->
            Just (Page.Good.getGoodId goodModel)

        _ ->
            Nothing


{-| 各ページにいいねを押した結果を反映するように通知する
-}
likeGood : Data.User.UserId -> Data.Good.GoodId -> Result () () -> Data.LogInState.LogInState -> Page -> ( Page, Cmd Msg )
likeGood userId goodId result logInState page =
    let
        goodListMsg =
            Page.Component.GoodList.LikeGoodResponse userId goodId result
    in
    case page of
        PageHome homeModel ->
            let
                ( newModel, emitList ) =
                    homeModel |> Page.Home.update (Page.Home.GoodListMsg goodListMsg)
            in
            ( PageHome newModel
            , homePageEmitListToCmd emitList
            )

        PageLikeAndHistory likeAndHistoryModel ->
            let
                ( newModel, emitList ) =
                    likeAndHistoryModel
                        |> Page.LikeAndHistory.update logInState
                            (Page.LikeAndHistory.GoodListMsg goodListMsg)
            in
            ( PageLikeAndHistory newModel
            , likeAndHistoryEmitListToCmd emitList
            )

        PageExhibitionGoodList exhibitionGoodListModel ->
            let
                ( newModel, emitList ) =
                    exhibitionGoodListModel
                        |> Page.ExhibitionGoodList.update (Page.ExhibitionGoodList.GoodListMsg goodListMsg)
            in
            ( PageExhibitionGoodList newModel
            , exhibitionGoodListPageEmitListToCmd emitList
            )

        PagePurchaseGoodList purchaseGoodListModel ->
            let
                ( newModel, emitList ) =
                    purchaseGoodListModel
                        |> Page.PurchaseGoodList.update (Page.PurchaseGoodList.GoodListMsg goodListMsg)
            in
            ( PagePurchaseGoodList newModel
            , purchaseGoodListPageEmitListToCmd emitList
            )

        PageGoods goodModel ->
            let
                ( newModel, emitList ) =
                    goodModel |> Page.Good.update (Page.Good.LikeGoodResponse userId result)
            in
            ( PageGoods newModel
            , goodsPageEmitListToCmd emitList
            )

        _ ->
            ( page
            , Cmd.none
            )


{-| 各ページにいいねを外した結果を反映するように通知する
-}
unlikeGood : Data.User.UserId -> Data.Good.GoodId -> Result () () -> Data.LogInState.LogInState -> Page -> ( Page, Cmd Msg )
unlikeGood userId goodId result logInState page =
    let
        goodListMsg =
            Page.Component.GoodList.UnlikeGoodResponse userId goodId result
    in
    case page of
        PageHome homeModel ->
            let
                ( newModel, emitList ) =
                    homeModel |> Page.Home.update (Page.Home.GoodListMsg goodListMsg)
            in
            ( PageHome newModel
            , homePageEmitListToCmd emitList
            )

        PageLikeAndHistory likeAndHistoryModel ->
            let
                ( newModel, emitList ) =
                    likeAndHistoryModel
                        |> Page.LikeAndHistory.update logInState
                            (Page.LikeAndHistory.GoodListMsg goodListMsg)
            in
            ( PageLikeAndHistory newModel
            , likeAndHistoryEmitListToCmd emitList
            )

        PageExhibitionGoodList exhibitionGoodListModel ->
            let
                ( newModel, emitList ) =
                    exhibitionGoodListModel
                        |> Page.ExhibitionGoodList.update (Page.ExhibitionGoodList.GoodListMsg goodListMsg)
            in
            ( PageExhibitionGoodList newModel
            , exhibitionGoodListPageEmitListToCmd emitList
            )

        PagePurchaseGoodList purchaseGoodListModel ->
            let
                ( newModel, emitList ) =
                    purchaseGoodListModel
                        |> Page.PurchaseGoodList.update (Page.PurchaseGoodList.GoodListMsg goodListMsg)
            in
            ( PagePurchaseGoodList newModel
            , purchaseGoodListPageEmitListToCmd emitList
            )

        PageGoods goodModel ->
            let
                ( newModel, emitList ) =
                    goodModel |> Page.Good.update (Page.Good.UnlikeGoodResponse userId result)
            in
            ( PageGoods newModel
            , goodsPageEmitListToCmd emitList
            )

        _ ->
            ( page
            , Cmd.none
            )



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
                |> Page.Good.view logInState isWideScreenMode
                |> mapPageData GoodsPageMsg

        PageProfile profileModel ->
            profileModel
                |> Page.Profile.view logInState
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
