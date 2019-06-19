port module Main exposing (main)

import Api
import BasicParts
import Browser
import Browser.Navigation
import Data.Good
import Data.LogInState
import Data.User
import Html
import Html.Attributes
import Html.Keyed
import Page.About
import Page.Component.GoodEditor
import Page.Component.GoodList
import Page.Component.LogInOrSignUp
import Page.Component.University
import Page.Exhibition
import Page.ExhibitionGoodList
import Page.Good
import Page.Home
import Page.LikeAndHistory
import Page.LogIn
import Page.PurchaseGoodList
import Page.SignUp
import Page.SiteMap
import Page.User
import SiteMap
import Tab
import Task
import Time
import Url


port receiveImageFileListAsDataUrlList : (List String -> msg) -> Sub msg


port requestReceiveImageList : String -> Cmd msg


port addEventListenerDrop : String -> Cmd msg


port toWideScreenMode : (() -> msg) -> Sub msg


port toNarrowScreenMode : (() -> msg) -> Sub msg


port saveRefreshTokenToLocalStorage : String -> Cmd msg


port deleteRefreshTokenAndAllFromLocalStorage : () -> Cmd msg


port elementScrollIntoView : String -> Cmd msg


port replaceText : { id : String, text : String } -> Cmd msg


port changeSelectedIndex : { id : String, index : Int } -> Cmd msg


type Model
    = Model
        { page : Page -- 開いているページ
        , menuState : Maybe BasicParts.MenuModel -- メニューの開閉
        , message : Maybe String -- ちょっとしたことがあったら表示するもの
        , logInState : Data.LogInState.LogInState
        , notificationVisible : Bool
        , key : Browser.Navigation.Key
        , now : Maybe ( Time.Posix, Time.Zone )
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
    | PageProfile Page.User.Model
    | PageAbout Page.About.Model
    | PageSiteMapXml


type Msg
    = ToWideScreenMode
    | ToNarrowScreenMode
    | UrlChange Url.Url
    | UrlRequest Browser.UrlRequest
    | AddLogMessage String
    | LogInResponse (Result String { accessToken : Api.Token, refreshToken : Api.Token })
    | LogOut
    | SignUpConfirmResponse (Result String ())
    | ReceiveImageListAsDataUrlList (List String)
    | GetMyProfileResponse (Result String Data.User.WithProfile)
    | SellGoodResponse (Result () ())
    | LikeGoodResponse Data.User.UserId Data.Good.GoodId (Result () ())
    | UnlikeGoodResponse Data.User.UserId Data.Good.GoodId (Result () ())
    | ChangeProfileResponse (Result () Data.User.WithProfile)
    | BasicPartMenuMsg BasicParts.Msg
    | HomePageMsg Page.Home.Msg
    | LikeAndHistoryPageMsg Page.LikeAndHistory.Msg
    | PurchaseGoodListPageMsg Page.PurchaseGoodList.Msg
    | ExhibitionGoodListPageMsg Page.ExhibitionGoodList.Msg
    | LogInPageMsg Page.LogIn.Msg
    | ExhibitionPageMsg Page.Exhibition.Msg
    | SignUpMsg Page.SignUp.Msg
    | ProfilePageMsg Page.User.Msg
    | GoodsPageMsg Page.Good.Msg
    | GetNowTime (Result () ( Time.Posix, Time.Zone ))
    | LogInOrSignUpUrlResponse (Result String Url.Url)


main : Program { refreshToken : Maybe String } Model Msg
main =
    Browser.application
        { init = init
        , update = update
        , view = view
        , subscriptions = subscription
        , onUrlRequest = UrlRequest
        , onUrlChange = UrlChange
        }


init : { refreshToken : Maybe String } -> Url.Url -> Browser.Navigation.Key -> ( Model, Cmd Msg )
init { refreshToken } url key =
    let
        ( page, message, cmd ) =
            urlParserInit Data.LogInState.None key url
                |> urlParserResultToModel
    in
    ( Model
        { page = page
        , menuState = BasicParts.initMenuModel
        , message = message
        , logInState = Data.LogInState.None
        , notificationVisible = False
        , key = key
        , now = Nothing
        }
    , Cmd.batch
        ((case refreshToken of
            Just refreshTokenString ->
                [ Api.tokenRefresh { refresh = Api.tokenFromString refreshTokenString } LogInResponse
                ]

            Nothing ->
                []
         )
            ++ [ cmd
               , Task.map2
                    Tuple.pair
                    Time.now
                    Time.here
                    |> Task.attempt GetNowTime
               ]
        )
    )


urlParserInit : Data.LogInState.LogInState -> Browser.Navigation.Key -> Url.Url -> Maybe ( Page, Cmd Msg )
urlParserInit logInState key url =
    let
        ( accessTokenAndRefreshToken, page ) =
            SiteMap.urlParserInit url
    in
    case page of
        Just p ->
            urlParserInitResultToPageAndCmd logInState p
                |> Tuple.mapSecond
                    (\c -> Cmd.batch [ c, logInResponseCmd accessTokenAndRefreshToken key url ])
                |> Just

        Nothing ->
            Nothing


urlParserInitResultToPageAndCmd : Data.LogInState.LogInState -> SiteMap.UrlParserInitResult -> ( Page, Cmd Msg )
urlParserInitResultToPageAndCmd logInState page =
    case page of
        SiteMap.InitHome ->
            Page.Home.initModel Nothing
                |> Tuple.mapBoth PageHome homePageEmitListToCmd

        SiteMap.InitSignUp { name, imageUrl, sendEmailToken } ->
            Page.SignUp.initModel
                { name = name
                , imageUrl = imageUrl
                , sendEmailToken = sendEmailToken
                }
                |> Tuple.mapBoth PageSignUp signUpPageEmitListToCmd

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

        SiteMap.InitUser userId ->
            Page.User.initModelFromId logInState userId
                |> Tuple.mapBoth
                    PageProfile
                    profilePageEmitListToCmd

        SiteMap.InitSiteMap ->
            ( PageSiteMapXml, Cmd.none )

        SiteMap.InitAbout ->
            ( PageAbout Page.About.aboutModel, Cmd.none )

        SiteMap.InitAboutPrivacyPolicy ->
            ( PageAbout Page.About.privacyPolicyModel, Cmd.none )


logInResponseCmd : Maybe { accessToken : Api.Token, refreshToken : Api.Token } -> Browser.Navigation.Key -> Url.Url -> Cmd Msg
logInResponseCmd accessTokenAndRefreshToken key url =
    case accessTokenAndRefreshToken of
        Just { accessToken, refreshToken } ->
            Cmd.batch
                [ Task.perform
                    (always
                        (LogInResponse
                            (Ok
                                { accessToken = accessToken
                                , refreshToken = refreshToken
                                }
                            )
                        )
                    )
                    (Task.succeed ())
                , Browser.Navigation.replaceUrl key (Url.toString { url | query = Nothing })
                ]

        Nothing ->
            Cmd.none


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

        LogOut ->
            ( Model
                { rec
                    | logInState = Data.LogInState.None
                    , message = Just "ログアウトしました"
                }
            , Cmd.none
            )

        LogInResponse result ->
            case result of
                Ok accessTokenAndRefreshToken ->
                    ( Model
                        { rec
                            | message = Just "ログインしました"
                            , logInState =
                                Data.LogInState.LoadingProfile accessTokenAndRefreshToken
                        }
                    , Cmd.batch
                        [ Api.getMyProfile accessTokenAndRefreshToken.accessToken GetMyProfileResponse
                        , saveRefreshTokenToLocalStorage
                            (Api.tokenToString accessTokenAndRefreshToken.refreshToken)
                        ]
                    )

                Err string ->
                    ( Model
                        { rec | message = Just ("ログインに失敗しました" ++ string) }
                    , Cmd.none
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
                    ( Model rec
                    , Cmd.none
                    )

        ReceiveImageListAsDataUrlList dataUrlList ->
            case rec.page of
                PageSignUp signUpModel ->
                    let
                        ( newModel, emitList ) =
                            Page.SignUp.update
                                (Page.SignUp.ReceiveImageDataUrl dataUrlList)
                                signUpModel
                    in
                    ( Model { rec | page = PageSignUp newModel }
                    , signUpPageEmitListToCmd emitList
                    )

                PageExhibition exhibitionPageModel ->
                    let
                        ( newModel, emitList ) =
                            Page.Exhibition.update
                                rec.logInState
                                (Page.Exhibition.GoodEditorMsg
                                    (Page.Component.GoodEditor.InputImageList dataUrlList)
                                )
                                exhibitionPageModel
                    in
                    ( Model { rec | page = PageExhibition newModel }
                    , exhibitionPageEmitListToCmd emitList
                    )

                PageGoods goodPageModel ->
                    let
                        ( newModel, emitList ) =
                            Page.Good.update
                                (Page.Good.GoodEditorMsg
                                    (Page.Component.GoodEditor.InputImageList dataUrlList)
                                )
                                goodPageModel
                    in
                    ( Model { rec | page = PageGoods newModel }
                    , goodsPageEmitListToCmd emitList
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

        GetMyProfileResponse response ->
            ( case response of
                Ok userWithProfile ->
                    Model
                        { rec
                            | logInState =
                                rec.logInState
                                    |> Data.LogInState.addUserWithProfile userWithProfile
                        }

                Err string ->
                    Model { rec | message = Just ("プロフィール情報の取得に失敗しました" ++ string) }
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
                            Page.User.update rec.logInState profileMsg profileModel
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
                                        |> Page.User.update rec.logInState (Page.User.MsgChangeProfileResponse response)
                            in
                            ( Model
                                { rec
                                    | logInState =
                                        rec.logInState
                                            |> Data.LogInState.addUserWithProfile newProfile
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

        GetNowTime result ->
            case result of
                Ok posixAndZone ->
                    ( Model
                        { rec | now = Just posixAndZone }
                    , Cmd.none
                    )

                Err () ->
                    ( Model
                        { rec | message = Just "時間の取得に失敗しました" }
                    , Cmd.none
                    )

        LogInOrSignUpUrlResponse result ->
            case result of
                Ok url ->
                    ( Model rec
                    , Browser.Navigation.load (Url.toString url)
                    )

                Err string ->
                    ( Model
                        { rec | message = Just ("ログイン用のURL取得に失敗" ++ string) }
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
                    goodsListEmitToCmd e
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

                -- TODO
                Page.LikeAndHistory.EmitLogInOrSignUp e ->
                    logInOrSignUpEmitToCmd e

                Page.LikeAndHistory.EmitGoodList e ->
                    goodsListEmitToCmd e
        )
        >> Cmd.batch


exhibitionGoodListPageEmitListToCmd : List Page.ExhibitionGoodList.Emit -> Cmd Msg
exhibitionGoodListPageEmitListToCmd =
    List.map
        (\emit ->
            case emit of
                Page.ExhibitionGoodList.EmitGetExhibitionGood token ->
                    Api.getExhibitionGoodList token
                        (\result ->
                            ExhibitionGoodListPageMsg (Page.ExhibitionGoodList.GetExhibitionGoodResponse result)
                        )

                Page.ExhibitionGoodList.EmitLogInOrSignUp e ->
                    logInOrSignUpEmitToCmd e

                Page.ExhibitionGoodList.EmitGoodList e ->
                    goodsListEmitToCmd e
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
                    goodsListEmitToCmd e
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

                Page.Exhibition.EmitGoodEditor e ->
                    goodEditorEmitToCmd e
        )
        >> Cmd.batch


signUpPageEmitListToCmd : List Page.SignUp.Emit -> Cmd Msg
signUpPageEmitListToCmd =
    List.map
        (\emit ->
            case emit of
                Page.SignUp.EmitReplaceText { id, text } ->
                    replaceText { id = id, text = text }

                Page.SignUp.EmitAccountImage idString ->
                    requestReceiveImageList idString

                Page.SignUp.EmitSignUp signUpRequest ->
                    Api.sendConfirmEmail signUpRequest (\response -> SignUpConfirmResponse response)

                Page.SignUp.EmitUniversity e ->
                    universityEmitToCmd e
        )
        >> Cmd.batch


profilePageEmitListToCmd : List Page.User.Emit -> Cmd Msg
profilePageEmitListToCmd =
    List.map
        (\emit ->
            case emit of
                Page.User.EmitGetMyProfile { accessToken } ->
                    Api.getMyProfile accessToken GetMyProfileResponse

                Page.User.EmitChangeProfile token profile ->
                    Api.updateProfile token profile ChangeProfileResponse

                Page.User.EmitReplaceElementText { id, text } ->
                    replaceText
                        { id = id, text = text }

                Page.User.EmitUniversity e ->
                    universityEmitToCmd e

                Page.User.EmitLogOut ->
                    Cmd.batch
                        [ deleteRefreshTokenAndAllFromLocalStorage ()
                        , Task.perform (always LogOut) (Task.succeed ())
                        ]

                Page.User.EmitGetUserProfile userId ->
                    Api.getUserProfile userId (\e -> ProfilePageMsg (Page.User.MsgUserProfileResponse e))

                Page.User.EmitAddLogMessage log ->
                    Task.succeed ()
                        |> Task.perform (always (AddLogMessage log))
        )
        >> Cmd.batch


goodsPageEmitListToCmd : List Page.Good.Emit -> Cmd Msg
goodsPageEmitListToCmd =
    List.map
        (\emit ->
            case emit of
                Page.Good.EmitGetGoods { goodId } ->
                    Api.getGood goodId (\result -> GoodsPageMsg (Page.Good.GetGoodsResponse result))

                Page.Good.EmitGetGoodComment { goodId } ->
                    Api.getGoodsComment goodId (\result -> GoodsPageMsg (Page.Good.GetGoodsCommentResponse result))

                Page.Good.EmitPostGoodComment token { goodId } comment ->
                    Api.postGoodsComment token goodId comment (\result -> GoodsPageMsg (Page.Good.PostGoodsCommentResponse result))

                Page.Good.EmitLikeGood userId token id ->
                    Api.likeGoods token id (LikeGoodResponse userId id)

                Page.Good.EmitUnLikeGood userId token id ->
                    Api.unlikeGoods token id (UnlikeGoodResponse userId id)

                Page.Good.EmitTradeStart token id ->
                    Api.tradeStart token id (\result -> GoodsPageMsg (Page.Good.TradeStartResponse result))

                Page.Good.EmitAddLogMessage log ->
                    Task.succeed ()
                        |> Task.perform (always (AddLogMessage log))

                Page.Good.EmitUpdateNowTime ->
                    Task.map2
                        Tuple.pair
                        Time.now
                        Time.here
                        |> Task.attempt GetNowTime

                Page.Good.EmitDeleteGood token goodId ->
                    Api.deleteGoods token goodId

                Page.Good.EmitGoodEditor e ->
                    goodEditorEmitToCmd e

                Page.Good.EmitUpdateGoodData token goodId requestData ->
                    Api.updateGood token goodId requestData (\m -> GoodsPageMsg (Page.Good.GoodUpdateResponse m))
        )
        >> Cmd.batch



{- ===================== Page Component Emit To Msg ======================== -}


logInOrSignUpEmitToCmd : Page.Component.LogInOrSignUp.Emit -> Cmd Msg
logInOrSignUpEmitToCmd emit =
    case emit of
        Page.Component.LogInOrSignUp.EmitLogInOrSignUp service ->
            Api.logInOrSignUpUrlRequest service LogInOrSignUpUrlResponse


goodsListEmitToCmd : Page.Component.GoodList.Emit -> Cmd Msg
goodsListEmitToCmd emit =
    case emit of
        Page.Component.GoodList.EmitLikeGood userId token id ->
            Api.likeGoods token id (LikeGoodResponse userId id)

        Page.Component.GoodList.EmitUnlikeGood userId token id ->
            Api.unlikeGoods token id (UnlikeGoodResponse userId id)

        Page.Component.GoodList.EmitScrollIntoView idString ->
            elementScrollIntoView idString


universityEmitToCmd : Page.Component.University.Emit -> Cmd Msg
universityEmitToCmd emit =
    case emit of
        Page.Component.University.EmitChangeSelectedIndex { id, index } ->
            changeSelectedIndex { id = id, index = index }


goodEditorEmitToCmd : Page.Component.GoodEditor.Emit -> Cmd Msg
goodEditorEmitToCmd emit =
    case emit of
        Page.Component.GoodEditor.EmitAddEventListenerDrop idString ->
            addEventListenerDrop idString

        Page.Component.GoodEditor.EmitReplaceText { id, text } ->
            replaceText { id = id, text = text }

        Page.Component.GoodEditor.EmitChangeSelectedIndex { id, index } ->
            changeSelectedIndex { id = id, index = index }

        Page.Component.GoodEditor.EmitCatchImageList idString ->
            requestReceiveImageList idString


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

        SiteMap.User userId ->
            Page.User.initModelFromId rec.logInState userId
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
view (Model { page, menuState, message, logInState, now }) =
    let
        isWideScreen =
            menuState == Nothing

        ( title, mainView ) =
            mainViewAndMainTab logInState page isWideScreen now
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


mainViewAndMainTab : Data.LogInState.LogInState -> Page -> Bool -> Maybe ( Time.Posix, Time.Zone ) -> ( String, List (Html.Html Msg) )
mainViewAndMainTab logInState page isWideScreenMode nowMaybe =
    let
        { title, tab, html } =
            titleAndTabDataAndMainView logInState isWideScreenMode nowMaybe page
    in
    ( title
    , [ Tab.view isWideScreenMode tab
      , Html.div
            (if Tab.isNone tab then
                [ Html.Attributes.classList
                    [ ( "mainView-noMainTab", True ), ( "mainView-wide-noMainTab", isWideScreenMode ) ]
                ]

             else
                [ Html.Attributes.classList
                    [ ( "mainView", True ), ( "mainView-wide", isWideScreenMode ) ]
                ]
            )
            html
      ]
    )


titleAndTabDataAndMainView :
    Data.LogInState.LogInState
    -> Bool
    -> Maybe ( Time.Posix, Time.Zone )
    -> Page
    ->
        { title : String
        , tab : Tab.Tab Msg
        , html : List (Html.Html Msg)
        }
titleAndTabDataAndMainView logInState isWideScreenMode nowMaybe page =
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
                |> Page.Good.view logInState isWideScreenMode nowMaybe
                |> mapPageData GoodsPageMsg

        PageProfile profileModel ->
            profileModel
                |> Page.User.view logInState
                |> mapPageData ProfilePageMsg

        PageSiteMapXml ->
            Page.SiteMap.view

        PageAbout aboutModel ->
            aboutModel
                |> Page.About.view


mapPageData :
    (eachPageMsg -> Msg)
    -> { title : Maybe String, tab : Tab.Tab eachPageMsg, html : List (Html.Html eachPageMsg) }
    -> { title : String, tab : Tab.Tab Msg, html : List (Html.Html Msg) }
mapPageData f { title, tab, html } =
    { title =
        case title of
            Just titleText ->
                titleText ++ "| つくマート"

            Nothing ->
                "つくマート"
    , tab = tab |> Tab.map f
    , html = html |> List.map (Html.map f)
    }


messageView : String -> Html.Html msg
messageView message =
    Html.div
        [ Html.Attributes.class "message"
        ]
        [ Html.text message ]


subscription : Model -> Sub Msg
subscription (Model { menuState }) =
    Sub.batch
        [ receiveImageFileListAsDataUrlList ReceiveImageListAsDataUrlList
        , case menuState of
            Just _ ->
                toWideScreenMode (always ToWideScreenMode)

            Nothing ->
                toNarrowScreenMode (always ToNarrowScreenMode)
        ]
