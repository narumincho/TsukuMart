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
import Page.History
import Page.Home
import Page.LikedProducts
import Page.LogIn
import Page.Notification
import Page.Product
import Page.Search
import Page.SignUp
import Page.SiteMap
import Page.SoldProducts
import Page.User
import SiteMap
import Task
import Time
import Url


port addEventListenerForUserImage : { labelId : String, inputId : String } -> Cmd msg


port receiveUserImage : (String -> msg) -> Sub msg


port addEventListenerForProductImages : { labelId : String, inputId : String } -> Cmd msg


port receiveProductImages : (List String -> msg) -> Sub msg


port toWideScreenMode : (() -> msg) -> Sub msg


port toNarrowScreenMode : (() -> msg) -> Sub msg


port saveRefreshTokenToLocalStorage : String -> Cmd msg


port deleteRefreshTokenAndAllFromLocalStorage : () -> Cmd msg


port elementScrollIntoView : String -> Cmd msg


port replaceText : { id : String, text : String } -> Cmd msg


port changeSelectedIndex : { id : String, index : Int } -> Cmd msg


type Model
    = Model
        { page : PageModel -- 開いているページ
        , wideScreen : Bool
        , message : Maybe String -- ちょっとしたことがあったら表示するもの
        , logInState : Data.LogInState.LogInState
        , notificationVisible : Bool
        , key : Browser.Navigation.Key
        , now : Maybe ( Time.Posix, Time.Zone )
        }


type PageModel
    = PageHome Page.Home.Model
    | PageSignUp Page.SignUp.Model
    | PageLogIn Page.LogIn.Model
    | PageLikedProducts Page.LikedProducts.Model
    | PageHistory Page.History.Model
    | PageSoldProducts Page.SoldProducts.Model
    | PageBoughtProducts Page.BoughtProducts.Model
    | PageExhibition Page.Exhibition.Model
    | PageProduct Page.Product.Model
    | PageUser Page.User.Model
    | PageSearch Page.Search.Model
    | PageNotification Page.Notification.Model
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
    | ReceiveProductImages (List String)
    | ReceiveUserImage String
    | GetMyProfileResponse (Result String Data.User.WithProfile)
    | SellProductResponse (Result () ())
    | LikeProductResponse Data.Product.Id (Result () ())
    | UnlikeProductResponse Data.Product.Id (Result () ())
    | ChangeProfileResponse (Result String Data.User.WithProfile)
    | HistoryBack
    | PageMsg PageMsg
    | GetNowTime (Result () ( Time.Posix, Time.Zone ))
    | LogInOrSignUpUrlResponse (Result String Url.Url)


type PageMsg
    = HomePageMsg Page.Home.Msg
    | LikedProductsPageMsg Page.LikedProducts.Msg
    | HistoryPageMsg Page.History.Msg
    | BoughtProductsPageMsg Page.BoughtProducts.Msg
    | SoldProductsPageMsg Page.SoldProducts.Msg
    | LogInPageMsg Page.LogIn.Msg
    | ExhibitionPageMsg Page.Exhibition.Msg
    | SignUpMsg Page.SignUp.Msg
    | SearchPageMsg Page.Search.Msg
    | NotificationMsg Page.Notification.Msg
    | UserPageMsg Page.User.Msg
    | ProductPageMsg Page.Product.Msg


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
        , wideScreen = False
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


urlParserInit : Data.LogInState.LogInState -> Browser.Navigation.Key -> Url.Url -> Maybe ( PageModel, Cmd Msg )
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


urlParserInitResultToPageAndCmd : Data.LogInState.LogInState -> SiteMap.UrlParserInitResult -> ( PageModel, Cmd Msg )
urlParserInitResultToPageAndCmd logInState page =
    case page of
        SiteMap.InitHome ->
            Page.Home.initModel Nothing
                |> Tuple.mapBoth PageHome homePageEmitListToCmd

        SiteMap.InitSignUp { name, imageId, sendEmailToken } ->
            Page.SignUp.initModel
                { name = name
                , imageId = imageId
                , sendEmailToken = sendEmailToken
                }
                |> Tuple.mapBoth PageSignUp signUpPageEmitListToCmd

        SiteMap.InitLogIn ->
            ( PageLogIn Page.LogIn.initModel
            , Cmd.none
            )

        SiteMap.InitLikedProducts ->
            Page.LikedProducts.initModel Nothing logInState
                |> Tuple.mapBoth PageLikedProducts likedProductsEmitListToCmd

        SiteMap.InitHistory ->
            Page.History.initModel Nothing logInState
                |> Tuple.mapBoth
                    PageHistory
                    historyEmitListToCmd

        SiteMap.IntiSoldProducts ->
            Page.SoldProducts.initModel Nothing logInState
                |> Tuple.mapBoth PageSoldProducts soldProductsPageEmitListToCmd

        SiteMap.InitBoughtProducts ->
            Page.BoughtProducts.initModel Nothing logInState
                |> Tuple.mapBoth PageBoughtProducts boughtProductsPageEmitListToCmd

        SiteMap.InitExhibition ->
            Page.Exhibition.initModel
                |> Tuple.mapBoth PageExhibition exhibitionPageEmitListToCmd

        SiteMap.InitProduct productId ->
            Page.Product.initModel productId
                |> Tuple.mapBoth PageProduct productPageEmitListToCmd

        SiteMap.InitUser userId ->
            Page.User.initModelFromId logInState userId
                |> Tuple.mapBoth PageUser userPageEmitListToCmd

        SiteMap.InitSearch condition ->
            Page.Search.initModel condition
                |> Tuple.mapBoth PageSearch searchPageEmitListToCmd

        SiteMap.InitNotification ->
            Page.Notification.initModel
                |> Tuple.mapBoth PageNotification notificationEmitListToCmd

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
                { rec | wideScreen = True }
            , Cmd.none
            )

        ToNarrowScreenMode ->
            ( Model
                { rec | wideScreen = False }
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

        ReceiveProductImages dataUrlList ->
            case rec.page of
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

        ReceiveUserImage image ->
            case rec.page of
                PageSignUp pageModel ->
                    let
                        ( newModel, emitList ) =
                            Page.SignUp.update
                                (Page.SignUp.ReceiveUserImage image)
                                pageModel
                    in
                    ( Model { rec | page = PageSignUp newModel }
                    , signUpPageEmitListToCmd emitList
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        PageMsg pageMsg ->
            updatePageMsg pageMsg (Model rec)

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
                        PageUser profileModel ->
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
                                    , page = PageUser newModel
                                }
                            , userPageEmitListToCmd emitList
                            )

                        _ ->
                            ( Model rec
                            , Cmd.none
                            )

                Err text ->
                    ( Model
                        { rec | message = Just ("プロフィール更新に失敗しました " ++ text) }
                    , Cmd.none
                    )

        HistoryBack ->
            ( Model rec
            , Browser.Navigation.back rec.key 1
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


updatePageMsg : PageMsg -> Model -> ( Model, Cmd Msg )
updatePageMsg pageMsg (Model rec) =
    (case ( pageMsg, rec.page ) of
        ( HomePageMsg msg, PageHome model ) ->
            model
                |> Page.Home.update msg
                |> mapPageModel PageHome homePageEmitListToCmd

        ( HistoryPageMsg msg, PageHistory model ) ->
            model
                |> Page.History.update msg
                |> mapPageModel PageHistory historyEmitListToCmd

        ( BoughtProductsPageMsg msg, PageBoughtProducts model ) ->
            model
                |> Page.BoughtProducts.update msg
                |> mapPageModel PageBoughtProducts boughtProductsPageEmitListToCmd

        ( SoldProductsPageMsg msg, PageSoldProducts model ) ->
            model
                |> Page.SoldProducts.update msg
                |> mapPageModel PageSoldProducts soldProductsPageEmitListToCmd

        ( LogInPageMsg msg, PageLogIn model ) ->
            model
                |> Page.LogIn.update msg
                |> mapPageModel PageLogIn (logInPageEmitListToCmd rec.key)

        ( ExhibitionPageMsg msg, PageExhibition model ) ->
            model
                |> Page.Exhibition.update rec.logInState msg
                |> mapPageModel PageExhibition exhibitionPageEmitListToCmd

        ( SignUpMsg msg, PageSignUp model ) ->
            model
                |> Page.SignUp.update msg
                |> mapPageModel PageSignUp signUpPageEmitListToCmd

        ( SearchPageMsg msg, PageSearch model ) ->
            model
                |> Page.Search.update msg
                |> mapPageModel PageSearch searchPageEmitListToCmd

        ( NotificationMsg msg, PageNotification model ) ->
            model
                |> Page.Notification.update msg
                |> mapPageModel PageNotification notificationEmitListToCmd

        ( UserPageMsg msg, PageUser model ) ->
            model
                |> Page.User.update rec.logInState msg
                |> mapPageModel PageUser userPageEmitListToCmd

        ( ProductPageMsg msg, PageProduct model ) ->
            model
                |> Page.Product.update msg
                |> mapPageModel PageProduct productPageEmitListToCmd

        ( _, _ ) ->
            \model -> ( model, Cmd.none )
    )
        (Model rec)


mapPageModel :
    (eachPageModel -> PageModel)
    -> (eachPageEmitList -> Cmd Msg)
    -> ( eachPageModel, eachPageEmitList )
    -> Model
    -> ( Model, Cmd Msg )
mapPageModel modelFunc emitListFunc ( eachPageMsg, eachPageEmitList ) (Model rec) =
    ( Model { rec | page = modelFunc eachPageMsg }
    , emitListFunc eachPageEmitList
    )



{- ===================== Page Emit To Msg ======================== -}


homePageEmitListToCmd : List Page.Home.Emit -> Cmd Msg
homePageEmitListToCmd =
    List.map
        (\emit ->
            case emit of
                Page.Home.EmitGetRecentProducts ->
                    Api.getRecentProductList (\result -> PageMsg (HomePageMsg (Page.Home.GetRecentProductsResponse result)))

                Page.Home.EmitGetRecommendProducts ->
                    Api.getRecommendProductList (\result -> PageMsg (HomePageMsg (Page.Home.GetRecommendProductsResponse result)))

                Page.Home.EmitGetFreeProducts ->
                    Api.getFreeProductList (\result -> PageMsg (HomePageMsg (Page.Home.GetFreeProductsResponse result)))

                Page.Home.EmitProducts e ->
                    productListEmitToCmd e
        )
        >> Cmd.batch


likedProductsEmitListToCmd : List Page.LikedProducts.Emit -> Cmd Msg
likedProductsEmitListToCmd =
    List.map
        (\emit ->
            case emit of
                Page.LikedProducts.EmitGetLikedProducts token ->
                    Api.getLikedProducts token (\result -> PageMsg (LikedProductsPageMsg (Page.LikedProducts.GetProductsResponse result)))

                Page.LikedProducts.EmitByLogIn e ->
                    logInEmitToCmd e

                Page.LikedProducts.EmitByProductList e ->
                    productListEmitToCmd e

                Page.LikedProducts.EmitAddLogMessage log ->
                    Task.succeed ()
                        |> Task.perform (always (AddLogMessage log))
        )
        >> Cmd.batch


historyEmitListToCmd : List Page.History.Emit -> Cmd Msg
historyEmitListToCmd =
    List.map
        (\emit ->
            case emit of
                Page.History.EmitGetHistoryProducts token ->
                    Api.getHistoryViewProducts token (\result -> PageMsg (HistoryPageMsg (Page.History.GetProductsResponse result)))

                Page.History.EmitByLogIn e ->
                    logInEmitToCmd e

                Page.History.EmitByProductList e ->
                    productListEmitToCmd e

                Page.History.EmitAddLogMessage log ->
                    Task.succeed ()
                        |> Task.perform (always (AddLogMessage log))
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
                            PageMsg (SoldProductsPageMsg (Page.SoldProducts.GetSoldProductListResponse result))
                        )

                Page.SoldProducts.EmitLogInOrSignUp e ->
                    logInEmitToCmd e

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
                    Api.getBoughtProductList token
                        (\result ->
                            PageMsg
                                (BoughtProductsPageMsg (Page.BoughtProducts.GetProductsResponse result))
                        )

                Page.BoughtProducts.EmitByLogIn e ->
                    logInEmitToCmd e

                Page.BoughtProducts.EmitByProductList e ->
                    productListEmitToCmd e

                Page.BoughtProducts.EmitAddLogMessage log ->
                    Task.succeed ()
                        |> Task.perform (always (AddLogMessage log))
        )
        >> Cmd.batch


logInPageEmitListToCmd : Browser.Navigation.Key -> List Page.LogIn.Emit -> Cmd Msg
logInPageEmitListToCmd key =
    List.map
        (\emit ->
            case emit of
                Page.LogIn.LogInOrSignUpEmit e ->
                    logInEmitToCmd e

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
                    logInEmitToCmd e

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
                Page.SignUp.EmitAddEventListenerForUserImage idRecord ->
                    addEventListenerForUserImage idRecord

                Page.SignUp.EmitReplaceElementText idAndText ->
                    replaceText idAndText

                Page.SignUp.EmitSignUp signUpRequest ->
                    Api.sendConfirmEmail signUpRequest (\response -> SignUpConfirmResponse response)

                Page.SignUp.EmitByUniversityComp e ->
                    universityEmitToCmd e

                Page.SignUp.EmitAddLogMessage log ->
                    Task.succeed ()
                        |> Task.perform (always (AddLogMessage log))
        )
        >> Cmd.batch


searchPageEmitListToCmd : List Page.Search.Emit -> Cmd Msg
searchPageEmitListToCmd =
    List.map
        (\emit ->
            case emit of
                Page.Search.EmitReplaceElementText idAndText ->
                    replaceText idAndText
        )
        >> Cmd.batch


notificationEmitListToCmd : List Page.Notification.Emit -> Cmd Msg
notificationEmitListToCmd =
    List.map
        (\emit ->
            case emit of
                Page.Notification.Emit ->
                    Cmd.none
        )
        >> Cmd.batch


userPageEmitListToCmd : List Page.User.Emit -> Cmd Msg
userPageEmitListToCmd =
    List.map
        (\emit ->
            case emit of
                Page.User.EmitGetMyProfile { accessToken } ->
                    Api.getMyProfile accessToken GetMyProfileResponse

                Page.User.EmitChangeProfile token profile ->
                    Api.updateProfile token profile ChangeProfileResponse

                Page.User.EmitReplaceElementText idAndText ->
                    replaceText idAndText

                Page.User.EmitUniversity e ->
                    universityEmitToCmd e

                Page.User.EmitLogOut ->
                    Cmd.batch
                        [ deleteRefreshTokenAndAllFromLocalStorage ()
                        , Task.perform (always LogOut) (Task.succeed ())
                        ]

                Page.User.EmitGetUserProfile userId ->
                    Api.getUserProfile userId
                        (\e -> PageMsg (UserPageMsg (Page.User.MsgUserProfileResponse e)))

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
                    Api.getProduct productId (\result -> PageMsg (ProductPageMsg (Page.Product.GetProductResponse result)))

                Page.Product.EmitGetCommentList { productId } ->
                    Api.getProductComments productId (\result -> PageMsg (ProductPageMsg (Page.Product.GetCommentListResponse result)))

                Page.Product.EmitPostComment token { productId } comment ->
                    Api.postProductComment token
                        productId
                        comment
                        (\result -> PageMsg (ProductPageMsg (Page.Product.PostCommentResponse result)))

                Page.Product.EmitLike token id ->
                    Api.likeProduct token id (LikeProductResponse id)

                Page.Product.EmitUnLike token id ->
                    Api.unlikeProduct token id (UnlikeProductResponse id)

                Page.Product.EmitTradeStart token id ->
                    Api.tradeStart token id (\result -> PageMsg (ProductPageMsg (Page.Product.TradeStartResponse result)))

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
                    Api.editProduct token
                        productId
                        requestData
                        (\m -> PageMsg (ProductPageMsg (Page.Product.UpdateProductDataResponse m)))
        )
        >> Cmd.batch



{- ===================== Page Component Emit To Msg ======================== -}


logInEmitToCmd : Page.Component.LogIn.Emit -> Cmd Msg
logInEmitToCmd emit =
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
        Page.Component.ProductEditor.EmitAddEventListenerForProductImages record ->
            addEventListenerForProductImages record

        Page.Component.ProductEditor.EmitReplaceText { id, text } ->
            replaceText { id = id, text = text }

        Page.Component.ProductEditor.EmitChangeSelectedIndex { id, index } ->
            changeSelectedIndex { id = id, index = index }


urlParserResultToModel : Maybe ( PageModel, Cmd Msg ) -> ( PageModel, Maybe String, Cmd Msg )
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


urlParser : Model -> Url.Url -> Maybe ( PageModel, Cmd Msg )
urlParser model url =
    SiteMap.urlParser url
        |> Maybe.map (urlParserResultToPageAndCmd model)


urlParserResultToPageAndCmd : Model -> SiteMap.UrlParserResult -> ( PageModel, Cmd Msg )
urlParserResultToPageAndCmd (Model rec) result =
    case result of
        SiteMap.Home ->
            Page.Home.initModel (getProductId rec.page)
                |> Tuple.mapBoth PageHome homePageEmitListToCmd

        SiteMap.LogIn ->
            ( PageLogIn Page.LogIn.initModel
            , Cmd.none
            )

        SiteMap.LikedProducts ->
            Page.LikedProducts.initModel (getProductId rec.page) rec.logInState
                |> Tuple.mapBoth PageLikedProducts likedProductsEmitListToCmd

        SiteMap.History ->
            Page.History.initModel (getProductId rec.page) rec.logInState
                |> Tuple.mapBoth PageHistory historyEmitListToCmd

        SiteMap.SoldProducts ->
            Page.SoldProducts.initModel (getProductId rec.page) rec.logInState
                |> Tuple.mapBoth PageSoldProducts soldProductsPageEmitListToCmd

        SiteMap.BoughtProducts ->
            Page.BoughtProducts.initModel (getProductId rec.page) rec.logInState
                |> Tuple.mapBoth PageBoughtProducts boughtProductsPageEmitListToCmd

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
                    PageUser
                    userPageEmitListToCmd

        SiteMap.Search condition ->
            Page.Search.initModel condition
                |> Tuple.mapBoth
                    PageSearch
                    searchPageEmitListToCmd

        SiteMap.Notification ->
            Page.Notification.initModel
                |> Tuple.mapBoth
                    PageNotification
                    notificationEmitListToCmd

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
getProductId : PageModel -> Maybe Data.Product.Id
getProductId page =
    case page of
        PageProduct productModel ->
            Just (Page.Product.getProductId productModel)

        _ ->
            Nothing


{-| 各ページにいいねを押した結果を反映するように通知する
-}
likeProduct : Data.Product.Id -> Result () () -> Data.LogInState.LogInState -> PageModel -> ( PageModel, Cmd Msg )
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

        PageHistory pageMsg ->
            let
                ( newModel, emitList ) =
                    pageMsg
                        |> Page.History.update (Page.History.MsgByProductList productListMsg)
            in
            ( PageHistory newModel
            , historyEmitListToCmd emitList
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
unlikeProduct : Data.Product.Id -> Result () () -> Data.LogInState.LogInState -> PageModel -> ( PageModel, Cmd Msg )
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

        PageHistory pageMsg ->
            let
                ( newModel, emitList ) =
                    pageMsg
                        |> Page.History.update (Page.History.MsgByProductList productListMsg)
            in
            ( PageHistory newModel
            , historyEmitListToCmd emitList
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
view (Model { page, wideScreen, message, logInState, now }) =
    let
        { title, tab, html } =
            titleAndTabDataAndMainView logInState wideScreen now page
    in
    { title = title
    , body =
        [ BasicParts.header wideScreen
            |> Html.map (always HistoryBack)
        ]
            ++ (if wideScreen then
                    [ BasicParts.menu logInState ]

                else
                    []
               )
            ++ [ BasicParts.tabView wideScreen tab |> Html.map PageMsg
               , Html.div
                    [ Html.Attributes.style "padding"
                        ((if BasicParts.isTabNone tab then
                            "64"

                          else
                            "112"
                         )
                            ++ "px 0 "
                            ++ (if wideScreen then
                                    "0 320px"

                                else
                                    "64px 0"
                               )
                        )
                    , Html.Attributes.style "word-wrap" "break-word"
                    , Html.Attributes.style "overflow-x" "hidden"
                    , Html.Attributes.style "width" "100%"
                    ]
                    html
                    |> Html.map PageMsg
               ]
            ++ (case message of
                    Just m ->
                        [ Html.Keyed.node "div" [] [ ( m, messageView m ) ] ]

                    Nothing ->
                        []
               )
            ++ (if wideScreen then
                    []

                else
                    [ BasicParts.bottomNavigation logInState ]
               )
    }


titleAndTabDataAndMainView :
    Data.LogInState.LogInState
    -> Bool
    -> Maybe ( Time.Posix, Time.Zone )
    -> PageModel
    ->
        { title : String
        , tab : BasicParts.Tab PageMsg
        , html : List (Html.Html PageMsg)
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

        PageLikedProducts model ->
            model
                |> Page.LikedProducts.view logInState isWideScreenMode
                |> mapPageData LikedProductsPageMsg

        PageHistory pageModel ->
            pageModel
                |> Page.History.view logInState isWideScreenMode
                |> mapPageData HistoryPageMsg

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

        PageUser pageModel ->
            pageModel
                |> Page.User.view logInState
                |> mapPageData UserPageMsg

        PageSearch pageModel ->
            pageModel
                |> Page.Search.view
                |> mapPageData SearchPageMsg

        PageNotification pageModel ->
            pageModel
                |> Page.Notification.view
                |> mapPageData NotificationMsg

        PageAbout pageModel ->
            pageModel
                |> Page.About.view

        PageSiteMapXml ->
            Page.SiteMap.view


mapPageData :
    (eachPageMsg -> PageMsg)
    -> { title : Maybe String, tab : BasicParts.Tab eachPageMsg, html : List (Html.Html eachPageMsg) }
    -> { title : String, tab : BasicParts.Tab PageMsg, html : List (Html.Html PageMsg) }
mapPageData f { title, tab, html } =
    { title =
        case title of
            Just titleText ->
                titleText ++ " | つくマート"

            Nothing ->
                "つくマート"
    , tab = tab |> BasicParts.tabMap f
    , html = html |> List.map (Html.map f)
    }


messageView : String -> Html.Html msg
messageView message =
    Html.div
        [ Html.Attributes.class "message" ]
        [ Html.text message ]


subscription : Model -> Sub Msg
subscription (Model { wideScreen }) =
    Sub.batch
        [ receiveProductImages ReceiveProductImages
        , receiveUserImage ReceiveUserImage
        , if wideScreen then
            toNarrowScreenMode (always ToNarrowScreenMode)

          else
            toWideScreenMode (always ToWideScreenMode)
        ]
