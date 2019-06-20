port module Main exposing (main)

import Api
import BasicParts
import Browser
import Browser.Navigation
import Data.LogInState
import Data.Product
import Data.User
import Html
import Html.Attributes
import Html.Keyed
import Page.About
import Page.BoughtProducts
import Page.Component.LogIn
import Page.Component.ProductEditor
import Page.Component.ProductList
import Page.Component.University
import Page.Exhibition
import Page.Home
import Page.LikeAndHistory
import Page.LogIn
import Page.Product
import Page.SignUp
import Page.SiteMap
import Page.SoldProducts
import Page.User
import SiteMap
import Tab
import Task
import Time
import Url


port receiveImageFileListAsDataUrlList : (List String -> msg) -> Sub msg


port addInputEventListener : String -> Cmd msg


port addDropEventListener : String -> Cmd msg


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
    | PageSoldProducts Page.SoldProducts.Model
    | PageBoughtProducts Page.BoughtProducts.Model
    | PageExhibition Page.Exhibition.Model
    | PageProduct Page.Product.Model
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
    | SellProductResponse (Result () ())
    | LikeProductResponse Data.Product.Id (Result () ())
    | UnlikeProductResponse Data.Product.Id (Result () ())
    | ChangeProfileResponse (Result () Data.User.WithProfile)
    | BasicPartMenuMsg BasicParts.Msg
    | HomePageMsg Page.Home.Msg
    | LikeAndHistoryPageMsg Page.LikeAndHistory.Msg
    | BoughtProductsPageMsg Page.BoughtProducts.Msg
    | SoldProductsPageMsg Page.SoldProducts.Msg
    | LogInPageMsg Page.LogIn.Msg
    | ExhibitionPageMsg Page.Exhibition.Msg
    | SignUpMsg Page.SignUp.Msg
    | ProfilePageMsg Page.User.Msg
    | ProductPageMsg Page.Product.Msg
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

        SiteMap.IntiSoldProducts ->
            Page.SoldProducts.initModel Nothing logInState
                |> Tuple.mapBoth
                    PageSoldProducts
                    soldProductsPageEmitListToCmd

        SiteMap.InitBoughtProducts ->
            Page.BoughtProducts.initModel Nothing logInState
                |> Tuple.mapBoth
                    PageBoughtProducts
                    boughtProductsPageEmitListToCmd

        SiteMap.InitExhibition ->
            Page.Exhibition.initModel
                |> Tuple.mapBoth
                    PageExhibition
                    exhibitionPageEmitListToCmd

        SiteMap.InitProduct productId ->
            Page.Product.initModel productId
                |> Tuple.mapBoth
                    PageProduct
                    productPageEmitListToCmd

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
                            Page.Home.initModel (getProductId rec.page)
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
                                (Page.Exhibition.MsgByProductEditor
                                    (Page.Component.ProductEditor.InputImageList dataUrlList)
                                )
                                exhibitionPageModel
                    in
                    ( Model { rec | page = PageExhibition newModel }
                    , exhibitionPageEmitListToCmd emitList
                    )

                PageProduct productPageModel ->
                    let
                        ( newModel, emitList ) =
                            Page.Product.update
                                (Page.Product.MsgByProductEditor
                                    (Page.Component.ProductEditor.InputImageList dataUrlList)
                                )
                                productPageModel
                    in
                    ( Model { rec | page = PageProduct newModel }
                    , productPageEmitListToCmd emitList
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

        SellProductResponse response ->
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

        ProductPageMsg productPageMsg ->
            case rec.page of
                PageProduct productPageModel ->
                    let
                        ( newModel, emitList ) =
                            Page.Product.update productPageMsg productPageModel
                    in
                    ( Model { rec | page = PageProduct newModel }
                    , productPageEmitListToCmd emitList
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        LikeProductResponse id response ->
            let
                ( page, cmd ) =
                    likeProduct id response rec.logInState rec.page
            in
            ( Model { rec | page = page }
            , cmd
            )

        UnlikeProductResponse id response ->
            let
                ( page, cmd ) =
                    unlikeProduct id response rec.logInState rec.page
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

        HomePageMsg pageMsg ->
            case rec.page of
                PageHome homePageModel ->
                    let
                        ( newModel, emitList ) =
                            homePageModel
                                |> Page.Home.update pageMsg
                    in
                    ( Model { rec | page = PageHome newModel }
                    , homePageEmitListToCmd emitList
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        LikeAndHistoryPageMsg pageMsg ->
            case rec.page of
                PageLikeAndHistory likeAndHistoryModel ->
                    let
                        ( newModel, emitList ) =
                            likeAndHistoryModel
                                |> Page.LikeAndHistory.update rec.logInState pageMsg
                    in
                    ( Model { rec | page = PageLikeAndHistory newModel }
                    , likeAndHistoryEmitListToCmd emitList
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        BoughtProductsPageMsg pageMsg ->
            case rec.page of
                PageBoughtProducts pageModel ->
                    let
                        ( newModel, emitMaybe ) =
                            pageModel
                                |> Page.BoughtProducts.update pageMsg
                    in
                    ( Model { rec | page = PageBoughtProducts newModel }
                    , boughtProductsPageEmitListToCmd emitMaybe
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        SoldProductsPageMsg pageMsg ->
            case rec.page of
                PageSoldProducts pageModel ->
                    let
                        ( newModel, emitMaybe ) =
                            pageModel
                                |> Page.SoldProducts.update pageMsg
                    in
                    ( Model { rec | page = PageSoldProducts newModel }
                    , soldProductsPageEmitListToCmd emitMaybe
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
                Page.Home.EmitGetRecentProducts ->
                    Api.getRecentProductList (\result -> HomePageMsg (Page.Home.GetRecentProductsResponse result))

                Page.Home.EmitGetRecommendProducts ->
                    Api.getRecommendProductList (\result -> HomePageMsg (Page.Home.GetRecommendProductsResponse result))

                Page.Home.EmitGetFreeProducts ->
                    Api.getFreeProductList (\result -> HomePageMsg (Page.Home.GetFreeProductsResponse result))

                Page.Home.EmitProducts e ->
                    productListEmitToCmd e
        )
        >> Cmd.batch


likeAndHistoryEmitListToCmd : List Page.LikeAndHistory.Emit -> Cmd Msg
likeAndHistoryEmitListToCmd =
    List.map
        (\emit ->
            case emit of
                Page.LikeAndHistory.EmitGetLikedProduts token ->
                    Api.getLikedProducts token (\result -> LikeAndHistoryPageMsg (Page.LikeAndHistory.LikedProdutsResponse result))

                Page.LikeAndHistory.EmitGetHistoryProduts token ->
                    Cmd.none

                Page.LikeAndHistory.EmitLogInOrSignUp e ->
                    logInOrSignUpEmitToCmd e

                Page.LikeAndHistory.EmitByProductList e ->
                    productListEmitToCmd e
        )
        >> Cmd.batch


soldProductsPageEmitListToCmd : List Page.SoldProducts.Emit -> Cmd Msg
soldProductsPageEmitListToCmd =
    List.map
        (\emit ->
            case emit of
                Page.SoldProducts.EmitGetSoldProducts token ->
                    Api.getSoldProductList token
                        (\result ->
                            SoldProductsPageMsg (Page.SoldProducts.GetSoldProductListResponse result)
                        )

                Page.SoldProducts.EmitLogInOrSignUp e ->
                    logInOrSignUpEmitToCmd e

                Page.SoldProducts.EmitByProductList e ->
                    productListEmitToCmd e
        )
        >> Cmd.batch


boughtProductsPageEmitListToCmd : List Page.BoughtProducts.Emit -> Cmd Msg
boughtProductsPageEmitListToCmd =
    List.map
        (\emit ->
            case emit of
                Page.BoughtProducts.EmitGetPurchaseProducts token ->
                    Api.getBoughtProductList token (\result -> BoughtProductsPageMsg (Page.BoughtProducts.GetPurchaseProductsResponse result))

                Page.BoughtProducts.EmitLogInOrSignUp e ->
                    logInOrSignUpEmitToCmd e

                Page.BoughtProducts.EmitByProductList e ->
                    productListEmitToCmd e
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

                Page.Exhibition.EmitSellProducts ( token, request ) ->
                    Api.sellProduct token request SellProductResponse

                Page.Exhibition.EmitByProductsEditor e ->
                    productEditorEmitToCmd e
        )
        >> Cmd.batch


signUpPageEmitListToCmd : List Page.SignUp.Emit -> Cmd Msg
signUpPageEmitListToCmd =
    List.map
        (\emit ->
            case emit of
                Page.SignUp.EmitAddDropEventListener { id } ->
                    addDropEventListener id

                Page.SignUp.EmitAddInputEventListener { id } ->
                    addInputEventListener id

                Page.SignUp.EmitReplaceText { id, text } ->
                    replaceText { id = id, text = text }

                Page.SignUp.EmitSignUp signUpRequest ->
                    Api.sendConfirmEmail signUpRequest (\response -> SignUpConfirmResponse response)

                Page.SignUp.EmitByUniversityComp e ->
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


productPageEmitListToCmd : List Page.Product.Emit -> Cmd Msg
productPageEmitListToCmd =
    List.map
        (\emit ->
            case emit of
                Page.Product.EmitGetProduct { productId } ->
                    Api.getProduct productId (\result -> ProductPageMsg (Page.Product.GetProductResponse result))

                Page.Product.EmitGetCommentList { productId } ->
                    Api.getProductComments productId (\result -> ProductPageMsg (Page.Product.GetCommentListResponse result))

                Page.Product.EmitPostComment token { productId } comment ->
                    Api.postProductComment token productId comment (\result -> ProductPageMsg (Page.Product.PostCommentResponse result))

                Page.Product.EmitLike token id ->
                    Api.likeProduct token id (LikeProductResponse id)

                Page.Product.EmitUnLike token id ->
                    Api.unlikeProduct token id (UnlikeProductResponse id)

                Page.Product.EmitTradeStart token id ->
                    Api.tradeStart token id (\result -> ProductPageMsg (Page.Product.TradeStartResponse result))

                Page.Product.EmitAddLogMessage log ->
                    Task.succeed ()
                        |> Task.perform (always (AddLogMessage log))

                Page.Product.EmitUpdateNowTime ->
                    Task.map2
                        Tuple.pair
                        Time.now
                        Time.here
                        |> Task.attempt GetNowTime

                Page.Product.EmitDelete token productId ->
                    Api.deleteProduct token productId

                Page.Product.EmitByProductEditor e ->
                    productEditorEmitToCmd e

                Page.Product.EmitUpdateProductData token productId requestData ->
                    Api.editProduct token productId requestData (\m -> ProductPageMsg (Page.Product.UpdateProductDataResponse m))
        )
        >> Cmd.batch



{- ===================== Page Component Emit To Msg ======================== -}


logInOrSignUpEmitToCmd : Page.Component.LogIn.Emit -> Cmd Msg
logInOrSignUpEmitToCmd emit =
    case emit of
        Page.Component.LogIn.EmitLogInOrSignUp service ->
            Api.logInOrSignUpUrlRequest service LogInOrSignUpUrlResponse


productListEmitToCmd : Page.Component.ProductList.Emit -> Cmd Msg
productListEmitToCmd emit =
    case emit of
        Page.Component.ProductList.EmitLike token id ->
            Api.likeProduct token id (LikeProductResponse id)

        Page.Component.ProductList.EmitUnlike token id ->
            Api.unlikeProduct token id (UnlikeProductResponse id)

        Page.Component.ProductList.EmitScrollIntoView idString ->
            elementScrollIntoView idString


universityEmitToCmd : Page.Component.University.Emit -> Cmd Msg
universityEmitToCmd emit =
    case emit of
        Page.Component.University.EmitChangeSelectedIndex { id, index } ->
            changeSelectedIndex { id = id, index = index }


productEditorEmitToCmd : Page.Component.ProductEditor.Emit -> Cmd Msg
productEditorEmitToCmd emit =
    case emit of
        Page.Component.ProductEditor.EmitAddInputEventListener { id } ->
            addDropEventListener id

        Page.Component.ProductEditor.EmitAddDropEventListener { id } ->
            addDropEventListener id

        Page.Component.ProductEditor.EmitReplaceText { id, text } ->
            replaceText { id = id, text = text }

        Page.Component.ProductEditor.EmitChangeSelectedIndex { id, index } ->
            changeSelectedIndex { id = id, index = index }


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
            Page.Home.initModel (getProductId rec.page)
                |> Tuple.mapBoth PageHome homePageEmitListToCmd

        SiteMap.LogIn ->
            ( PageLogIn Page.LogIn.initModel
            , Cmd.none
            )

        SiteMap.LikeAndHistory ->
            Page.LikeAndHistory.initModel (getProductId rec.page) rec.logInState
                |> Tuple.mapBoth
                    PageLikeAndHistory
                    likeAndHistoryEmitListToCmd

        SiteMap.SoldProducts ->
            Page.SoldProducts.initModel (getProductId rec.page) rec.logInState
                |> Tuple.mapBoth
                    PageSoldProducts
                    soldProductsPageEmitListToCmd

        SiteMap.BoughtProducts ->
            Page.BoughtProducts.initModel (getProductId rec.page) rec.logInState
                |> Tuple.mapBoth
                    PageBoughtProducts
                    boughtProductsPageEmitListToCmd

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

        SiteMap.Product productId ->
            (case rec.page of
                PageHome pageModel ->
                    case Data.Product.searchFromId productId (Page.Home.getAllProducts pageModel) of
                        Just product ->
                            Page.Product.initModelFromProduct product

                        Nothing ->
                            Page.Product.initModel productId

                _ ->
                    Page.Product.initModel productId
            )
                |> Tuple.mapBoth PageProduct productPageEmitListToCmd

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
Products Listの表示になったときにその商品のところへスクロールできるように
-}
getProductId : Page -> Maybe Data.Product.Id
getProductId page =
    case page of
        PageProduct productModel ->
            Just (Page.Product.getProductId productModel)

        _ ->
            Nothing


{-| 各ページにいいねを押した結果を反映するように通知する
-}
likeProduct : Data.Product.Id -> Result () () -> Data.LogInState.LogInState -> Page -> ( Page, Cmd Msg )
likeProduct productId result logInState page =
    let
        productListMsg =
            Page.Component.ProductList.LikeResponse productId result
    in
    case page of
        PageHome pageMsg ->
            let
                ( newModel, emitList ) =
                    pageMsg |> Page.Home.update (Page.Home.MsgByProductList productListMsg)
            in
            ( PageHome newModel
            , homePageEmitListToCmd emitList
            )

        PageLikeAndHistory pageMsg ->
            let
                ( newModel, emitList ) =
                    pageMsg
                        |> Page.LikeAndHistory.update logInState
                            (Page.LikeAndHistory.MsgByProductList productListMsg)
            in
            ( PageLikeAndHistory newModel
            , likeAndHistoryEmitListToCmd emitList
            )

        PageSoldProducts pageMsg ->
            let
                ( newModel, emitList ) =
                    pageMsg
                        |> Page.SoldProducts.update (Page.SoldProducts.MsgByProductList productListMsg)
            in
            ( PageSoldProducts newModel
            , soldProductsPageEmitListToCmd emitList
            )

        PageBoughtProducts pageMsg ->
            let
                ( newModel, emitList ) =
                    pageMsg
                        |> Page.BoughtProducts.update (Page.BoughtProducts.MsgByProductList productListMsg)
            in
            ( PageBoughtProducts newModel
            , boughtProductsPageEmitListToCmd emitList
            )

        PageProduct pageMsg ->
            let
                ( newModel, emitList ) =
                    pageMsg |> Page.Product.update (Page.Product.LikeResponse result)
            in
            ( PageProduct newModel
            , productPageEmitListToCmd emitList
            )

        _ ->
            ( page
            , Cmd.none
            )


{-| 各ページにいいねを外した結果を反映するように通知する
-}
unlikeProduct : Data.Product.Id -> Result () () -> Data.LogInState.LogInState -> Page -> ( Page, Cmd Msg )
unlikeProduct productId result logInState page =
    let
        productListMsg =
            Page.Component.ProductList.UnlikeResponse productId result
    in
    case page of
        PageHome pageMsg ->
            let
                ( newModel, emitList ) =
                    pageMsg |> Page.Home.update (Page.Home.MsgByProductList productListMsg)
            in
            ( PageHome newModel
            , homePageEmitListToCmd emitList
            )

        PageLikeAndHistory pageMsg ->
            let
                ( newModel, emitList ) =
                    pageMsg
                        |> Page.LikeAndHistory.update logInState
                            (Page.LikeAndHistory.MsgByProductList productListMsg)
            in
            ( PageLikeAndHistory newModel
            , likeAndHistoryEmitListToCmd emitList
            )

        PageSoldProducts pageMsg ->
            let
                ( newModel, emitList ) =
                    pageMsg
                        |> Page.SoldProducts.update (Page.SoldProducts.MsgByProductList productListMsg)
            in
            ( PageSoldProducts newModel
            , soldProductsPageEmitListToCmd emitList
            )

        PageBoughtProducts pageMsg ->
            let
                ( newModel, emitList ) =
                    pageMsg
                        |> Page.BoughtProducts.update (Page.BoughtProducts.MsgByProductList productListMsg)
            in
            ( PageBoughtProducts newModel
            , boughtProductsPageEmitListToCmd emitList
            )

        PageProduct pageMsg ->
            let
                ( newModel, emitList ) =
                    pageMsg |> Page.Product.update (Page.Product.UnlikeResponse result)
            in
            ( PageProduct newModel
            , productPageEmitListToCmd emitList
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
        PageHome pageModel ->
            pageModel
                |> Page.Home.view logInState isWideScreenMode
                |> mapPageData HomePageMsg

        PageExhibition pageModel ->
            pageModel
                |> Page.Exhibition.view logInState
                |> mapPageData ExhibitionPageMsg

        PageLikeAndHistory pageModel ->
            pageModel
                |> Page.LikeAndHistory.view logInState isWideScreenMode
                |> mapPageData LikeAndHistoryPageMsg

        PageBoughtProducts pageModel ->
            pageModel
                |> Page.BoughtProducts.view logInState isWideScreenMode
                |> mapPageData BoughtProductsPageMsg

        PageSoldProducts pageModel ->
            pageModel
                |> Page.SoldProducts.view logInState isWideScreenMode
                |> mapPageData SoldProductsPageMsg

        PageSignUp pageModel ->
            pageModel
                |> Page.SignUp.view
                |> mapPageData SignUpMsg

        PageLogIn pageModel ->
            pageModel
                |> Page.LogIn.view
                |> mapPageData LogInPageMsg

        PageProduct pageModel ->
            pageModel
                |> Page.Product.view logInState isWideScreenMode nowMaybe
                |> mapPageData ProductPageMsg

        PageProfile pageModel ->
            pageModel
                |> Page.User.view logInState
                |> mapPageData ProfilePageMsg

        PageSiteMapXml ->
            Page.SiteMap.view

        PageAbout pageModel ->
            pageModel
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
