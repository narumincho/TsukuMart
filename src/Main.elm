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
import Page.About
import Page.Component.GoodList
import Page.Component.LogInOrSignUp
import Page.Component.University
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


port changeSelectedIndex : { id : String, index : Int } -> Cmd msg


port addEventListenerDrop : String -> Cmd msg


type Model
    = Model
        { page : Page -- 開いているページ
        , menuState : Maybe BasicParts.MenuModel -- メニューの開閉
        , message : Maybe String -- ちょっとしたことがあったら表示するもの
        , logInState : Data.LogInState.LogInState
        , notificationVisible : Bool
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
    | PageAbout Page.About.Model
    | PageSiteMapXml


type Msg
    = ToWideScreenMode
    | ToNarrowScreenMode
    | UrlChange Url.Url
    | UrlRequest Browser.UrlRequest
    | AddLogMessage String
    | SignUpConfirmResponse (Result Api.SignUpConfirmResponseError Api.SignUpConfirmResponseOk)
    | LogInResponse (Result Api.LogInResponseError Api.LogInResponseOk)
    | ReceiveImageDataUrl String
    | ReceiveImageFileAndBlobUrl Json.Decode.Value
    | GetUserDataResponse { access : Api.Token, refresh : Api.Token } (Result () Data.User.User)
    | SellGoodResponse (Result Api.SellGoodsResponseError ())
    | LikeGoodResponse Data.User.UserId Data.Good.GoodId (Result () ())
    | UnlikeGoodResponse Data.User.UserId Data.Good.GoodId (Result () ())
    | ChangeProfileResponse (Result () Data.User.Profile)
    | BasicPartMenuMsg BasicParts.Msg
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
        ( page, message, cmd ) =
            urlParserInit Data.LogInState.LogInStateNone url
                |> urlParserResultToModel
    in
    ( Model
        { page = page
        , menuState = BasicParts.initMenuModel
        , message = message
        , logInState = Data.LogInState.LogInStateNone
        , notificationVisible = False
        , key = key
        }
    , cmd
    )


urlParserInit : Data.LogInState.LogInState -> Url.Url -> Maybe ( Page, Cmd Msg )
urlParserInit logInState url =
    SiteMap.urlParserInit url
        |> Maybe.map (urlParserInitResultToPageAndCmd logInState)


urlParserInitResultToPageAndCmd : Data.LogInState.LogInState -> SiteMap.UrlParserInitResult -> ( Page, Cmd Msg )
urlParserInitResultToPageAndCmd logInState page =
    case page of
        SiteMap.InitHome ->
            Page.Home.initModel Nothing
                |> Tuple.mapBoth PageHome homePageEmitListToCmd

        SiteMap.InitSignUp ->
            ( PageSignUp Page.SignUp.initModel
            , Cmd.none
            )

        SiteMap.InitLogIn ->
            ( PageLogIn Page.LogIn.initModel
            , Cmd.none
            )

        SiteMap.InitLikeAndHistory ->
            Page.LikeAndHistory.initModel Nothing logInState
                |> Tuple.mapBoth
                    PageLikeAndHistory
                    likeAndHistoryEmitListToCmd

        SiteMap.IntiExhibitionGood ->
            Page.ExhibitionGoodList.initModel Nothing logInState
                |> Tuple.mapBoth
                    PageExhibitionGoodList
                    exhibitionGoodListPageEmitListToCmd

        SiteMap.InitPurchaseGood ->
            Page.PurchaseGoodList.initModel Nothing logInState
                |> Tuple.mapBoth
                    PagePurchaseGoodList
                    purchaseGoodListPageEmitListToCmd

        SiteMap.InitExhibition ->
            Page.Exhibition.initModel
                |> Tuple.mapBoth
                    PageExhibition
                    exhibitionPageEmitListToCmd

        SiteMap.InitGood goodId ->
            Page.Good.initModel goodId
                |> Tuple.mapBoth
                    PageGoods
                    goodsPageEmitListToCmd

        SiteMap.InitProfile ->
            Page.Profile.initModel logInState
                |> Tuple.mapBoth
                    PageProfile
                    profilePageEmitListToCmd

        SiteMap.InitSiteMap ->
            ( PageSiteMapXml, Cmd.none )

        SiteMap.InitAbout ->
            ( PageAbout Page.About.aboutModel, Cmd.none )

        SiteMap.InitAboutPrivacyPolicy ->
            ( PageAbout Page.About.privacyPolicyModel, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg (Model rec) =
    case msg of
        ToWideScreenMode ->
            ( Model
                { rec | menuState = Nothing }
            , Cmd.none
            )

        ToNarrowScreenMode ->
            ( Model
                { rec | menuState = BasicParts.narrowScreenModeInit }
            , Cmd.none
            )

        UrlChange url ->
            let
                ( page, message, cmd ) =
                    urlParser (Model rec) url
                        |> urlParserResultToModel
            in
            ( Model
                { rec
                    | page = page
                    , message = message
                    , menuState = rec.menuState |> BasicParts.menuUpdate BasicParts.closeMenu
                }
            , cmd
            )

        UrlRequest urlRequest ->
            ( Model rec
            , case urlRequest of
                Browser.Internal url ->
                    Browser.Navigation.pushUrl rec.key (Url.toString url)

                Browser.External urlString ->
                    Browser.Navigation.load urlString
            )

        AddLogMessage logMessage ->
            ( Model
                { rec | message = Just logMessage }
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
                                        |> Tuple.mapBoth PageExhibition exhibitionPageEmitListToCmd

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

                                PageExhibitionGoodList exhibitionGoodListModel ->
                                    exhibitionGoodListModel
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
                                        |> Tuple.mapBoth PageExhibition exhibitionPageEmitListToCmd

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
                            , exhibitionPageEmitListToCmd emitList
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
            , Cmd.none
            )

        BasicPartMenuMsg m ->
            ( Model { rec | menuState = rec.menuState |> BasicParts.menuUpdate m }
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
                    , exhibitionPageEmitListToCmd emitList
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
                    Api.getRecentGoods (\result -> HomePageMsg (Page.Home.GetRecentGoodListResponse result))

                Page.Home.EmitGetRecommendGoodList ->
                    Api.getRecommendGoods (\result -> HomePageMsg (Page.Home.GetRecommendGoodListResponse result))

                Page.Home.EmitGetFreeGoodList ->
                    Api.getFreeGoods (\result -> HomePageMsg (Page.Home.GetFreeGoodListResponse result))

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
                    Api.getLikeGoodList token (\result -> LikeAndHistoryPageMsg (Page.LikeAndHistory.LikeGoodListResponse result))

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
                    Api.getExhibitionGoodList token (\result -> ExhibitionGoodListPageMsg (Page.ExhibitionGoodList.GetExhibitionGoodResponse result))

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
                    Api.getPurchaseGoodList token (\result -> PurchaseGoodListPageMsg (Page.PurchaseGoodList.GetPurchaseGoodResponse result))

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


exhibitionPageEmitListToCmd : List Page.Exhibition.Emit -> Cmd Msg
exhibitionPageEmitListToCmd =
    List.map
        (\emit ->
            case emit of
                Page.Exhibition.EmitLogInOrSignUp e ->
                    logInOrSignUpEmitToCmd e

                Page.Exhibition.EmitSellGoods ( token, request ) ->
                    Api.sellGoods token request SellGoodResponse

                Page.Exhibition.EmitCatchImageList idString ->
                    exhibitionImageChange idString

                Page.Exhibition.EmitAddEventListenerDrop idString ->
                    addEventListenerDrop idString

                Page.Exhibition.EmitReplaceText { id, text } ->
                    inputOrTextAreaReplaceText { id = id, text = text }

                Page.Exhibition.EmitChangeSelectedIndex { id, index } ->
                    changeSelectedIndex { id = id, index = index }
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
                    Api.signUp signUpRequest (\response -> SignUpMsg (Page.SignUp.SignUpResponse response))

                Page.SignUp.EmitSendConfirmToken token ->
                    Api.signUpConfirm { confirmToken = token } SignUpConfirmResponse

                Page.SignUp.EmitUniversity e ->
                    universityEmitToMsg e
        )
        >> Cmd.batch


profilePageEmitListToCmd : List Page.Profile.Emit -> Cmd Msg
profilePageEmitListToCmd =
    List.map
        (\emit ->
            case emit of
                Page.Profile.EmitLogInOrSignUp e ->
                    logInOrSignUpEmitToCmd e

                Page.Profile.EmitGetProfile { access, refresh } ->
                    Api.getMyProfile access (GetUserDataResponse { access = access, refresh = refresh })

                Page.Profile.EmitChangeProfile token profile ->
                    Api.updateProfile token profile ChangeProfileResponse

                Page.Profile.EmitReplaceText { id, text } ->
                    inputOrTextAreaReplaceText
                        { id = id, text = text }

                Page.Profile.EmitUniversity e ->
                    universityEmitToMsg e
        )
        >> Cmd.batch


goodsPageEmitListToCmd : List Page.Good.Emit -> Cmd Msg
goodsPageEmitListToCmd =
    List.map
        (\emit ->
            case emit of
                Page.Good.EmitGetGoods { goodId } ->
                    Api.getGood goodId (\result -> GoodsPageMsg (Page.Good.GetGoodsResponse result))

                Page.Good.EmitLikeGood userId token id ->
                    Api.likeGoods token id (LikeGoodResponse userId id)

                Page.Good.EmitUnLikeGood userId token id ->
                    Api.unlikeGoods token id (UnlikeGoodResponse userId id)

                Page.Good.EmitAddLogMessage log ->
                    Task.succeed ()
                        |> Task.perform (always (AddLogMessage log))
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


universityEmitToMsg : Page.Component.University.Emit -> Cmd Msg
universityEmitToMsg emit =
    case emit of
        Page.Component.University.EmitChangeSelectedIndex { id, index } ->
            changeSelectedIndex { id = id, index = index }


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


urlParserResultToModel : Maybe ( Page, Cmd Msg ) -> ( Page, Maybe String, Cmd Msg )
urlParserResultToModel parserResult =
    case parserResult of
        Just ( page, cmd ) ->
            ( page
            , Nothing
            , cmd
            )

        Nothing ->
            let
                ( homeModel, emit ) =
                    Page.Home.initModel Nothing
            in
            ( PageHome homeModel
            , Just "指定したページが見つからないのでホームに移動しました"
            , homePageEmitListToCmd emit
            )


urlParser : Model -> Url.Url -> Maybe ( Page, Cmd Msg )
urlParser model url =
    SiteMap.urlParser url
        |> Maybe.map (urlParserResultToPageAndCmd model)


urlParserResultToPageAndCmd : Model -> SiteMap.UrlParserResult -> ( Page, Cmd Msg )
urlParserResultToPageAndCmd (Model rec) result =
    case result of
        SiteMap.Home ->
            Page.Home.initModel (getGoodId rec.page)
                |> Tuple.mapBoth PageHome homePageEmitListToCmd

        SiteMap.SignUp ->
            ( PageSignUp Page.SignUp.initModel
            , Cmd.none
            )

        SiteMap.LogIn ->
            ( PageLogIn Page.LogIn.initModel
            , Cmd.none
            )

        SiteMap.LikeAndHistory ->
            Page.LikeAndHistory.initModel (getGoodId rec.page) rec.logInState
                |> Tuple.mapBoth
                    PageLikeAndHistory
                    likeAndHistoryEmitListToCmd

        SiteMap.ExhibitionGood ->
            Page.ExhibitionGoodList.initModel (getGoodId rec.page) rec.logInState
                |> Tuple.mapBoth
                    PageExhibitionGoodList
                    exhibitionGoodListPageEmitListToCmd

        SiteMap.PurchaseGood ->
            Page.PurchaseGoodList.initModel (getGoodId rec.page) rec.logInState
                |> Tuple.mapBoth
                    PagePurchaseGoodList
                    purchaseGoodListPageEmitListToCmd

        SiteMap.Exhibition ->
            case rec.page of
                PageExhibition exhibitionModel ->
                    exhibitionModel
                        |> Page.Exhibition.update rec.logInState Page.Exhibition.ToEditPage
                        |> Tuple.mapBoth PageExhibition exhibitionPageEmitListToCmd

                _ ->
                    Page.Exhibition.initModel
                        |> Tuple.mapBoth PageExhibition exhibitionPageEmitListToCmd

        SiteMap.ExhibitionConfirm ->
            case rec.page of
                PageExhibition pageModel ->
                    case Page.Exhibition.toConfirmPageMsgFromModel rec.logInState pageModel of
                        Just msg ->
                            (pageModel |> Page.Exhibition.update rec.logInState msg)
                                |> Tuple.mapBoth
                                    PageExhibition
                                    exhibitionPageEmitListToCmd

                        Nothing ->
                            ( PageExhibition pageModel, Cmd.none )

                _ ->
                    ( rec.page, Cmd.none )

        SiteMap.Good goodId ->
            (case rec.page of
                PageHome pageModel ->
                    case Data.Good.searchGoodsFromId goodId (Page.Home.getGoodAllGoodList pageModel) of
                        Just goods ->
                            Page.Good.initModelFromGoods goods

                        Nothing ->
                            Page.Good.initModel goodId

                _ ->
                    Page.Good.initModel goodId
            )
                |> Tuple.mapBoth PageGoods goodsPageEmitListToCmd

        SiteMap.Profile ->
            Page.Profile.initModel rec.logInState
                |> Tuple.mapBoth
                    PageProfile
                    profilePageEmitListToCmd

        SiteMap.About ->
            ( PageAbout Page.About.aboutModel, Cmd.none )

        SiteMap.AboutPrivacyPolicy ->
            ( PageAbout Page.About.privacyPolicyModel, Cmd.none )

        SiteMap.SiteMap ->
            ( PageSiteMapXml
            , Cmd.none
            )


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
            |> Html.map BasicPartMenuMsg
        , BasicParts.menuView logInState menuState
            |> Html.map BasicPartMenuMsg
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

        PageAbout aboutModel ->
            aboutModel
                |> Page.About.view


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
