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
import Page.CommentedProducts
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
import Page.TradedProducts
import Page.TradingProducts
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
    | PageTradingProducts Page.TradingProducts.Model
    | PageTradedProducts Page.TradedProducts.Model
    | PageCommentedProducts Page.CommentedProducts.Model
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
    | GetMyProfileAndLikedProductIdsResponse (Result String ( Data.User.WithName, List Data.Product.Id ))
    | SellProductResponse (Result String Data.Product.ProductDetail)
    | LikeProductResponse Data.Product.Id (Result String Int)
    | UnlikeProductResponse Data.Product.Id (Result String Int)
    | ChangeProfileResponse (Result String Data.User.WithProfile)
    | HistoryBack
    | PageMsg PageMsg
    | GetNowTime (Result () ( Time.Posix, Time.Zone ))
    | LogInOrSignUpUrlResponse (Result String Url.Url)


type PageMsg
    = HomePageMsg Page.Home.Msg
    | LikedProductsPageMsg Page.LikedProducts.Msg
    | HistoryPageMsg Page.History.Msg
    | SoldProductsPageMsg Page.SoldProducts.Msg
    | BoughtProductsPageMsg Page.BoughtProducts.Msg
    | TradingProductsPageMsg Page.TradingProducts.Msg
    | TradedProductsPageMsg Page.TradedProducts.Msg
    | CommentedProductsPageMsg Page.CommentedProducts.Msg
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
        ( accessTokenAndRefreshTokenByUrl, page ) =
            SiteMap.urlParserInit url

        ( newPage, cmd ) =
            urlParserInit Data.LogInState.None key page
                |> urlParserResultToModel
    in
    ( Model
        { page = newPage
        , wideScreen = False
        , message = Nothing
        , logInState = Data.LogInState.None
        , notificationVisible = False
        , key = key
        , now = Nothing
        }
    , Cmd.batch
        ((case ( accessTokenAndRefreshTokenByUrl, refreshToken ) of
            ( Just accessTokenAndRefreshToken, _ ) ->
                [ logInResponseCmd accessTokenAndRefreshToken key url
                , Task.succeed () |> Task.perform (always (AddLogMessage "ログイン中"))
                ]

            ( Nothing, Just refreshTokenString ) ->
                [ Api.tokenRefresh
                    { refresh = Api.tokenFromString refreshTokenString }
                    LogInResponse
                , Task.succeed () |> Task.perform (always (AddLogMessage "ログイン中"))
                ]

            ( Nothing, Nothing ) ->
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


urlParserInit : Data.LogInState.LogInState -> Browser.Navigation.Key -> Maybe SiteMap.UrlParserInitResult -> Maybe ( PageModel, Cmd Msg )
urlParserInit logInState key page =
    case page of
        Just p ->
            urlParserInitResultToPageAndCmd logInState p
                |> Just

        Nothing ->
            Nothing


urlParserInitResultToPageAndCmd : Data.LogInState.LogInState -> SiteMap.UrlParserInitResult -> ( PageModel, Cmd Msg )
urlParserInitResultToPageAndCmd logInState page =
    case page of
        SiteMap.InitHome ->
            Page.Home.initModel Nothing
                |> Tuple.mapBoth PageHome homePageEmissionListToCmd

        SiteMap.InitSignUp { name, imageId, sendEmailToken } ->
            Page.SignUp.initModel
                { name = name
                , imageId = imageId
                , sendEmailToken = sendEmailToken
                }
                |> Tuple.mapBoth PageSignUp signUpPageEmissionListToCmd

        SiteMap.InitLogIn ->
            ( PageLogIn Page.LogIn.initModel
            , Cmd.none
            )

        SiteMap.InitLikedProducts ->
            Page.LikedProducts.initModel Nothing logInState
                |> Tuple.mapBoth PageLikedProducts likedProductsEmissionListToCmd

        SiteMap.InitHistory ->
            Page.History.initModel Nothing logInState
                |> Tuple.mapBoth
                    PageHistory
                    historyEmissionListToCmd

        SiteMap.InitSoldProducts userId ->
            Page.SoldProducts.initModel userId Nothing
                |> Tuple.mapBoth PageSoldProducts soldProductsPageEmissionListToCmd

        SiteMap.InitBoughtProducts ->
            Page.BoughtProducts.initModel Nothing logInState
                |> Tuple.mapBoth PageBoughtProducts boughtProductsPageEmissionListToCmd

        SiteMap.InitTradingProducts ->
            Page.TradingProducts.initModel Nothing logInState
                |> Tuple.mapBoth PageTradingProducts tradingProductsEmissionListToCmd

        SiteMap.InitTradedProducts ->
            Page.TradedProducts.initModel Nothing logInState
                |> Tuple.mapBoth PageTradedProducts tradedProductsEmissionListToCmd

        SiteMap.InitCommentedProducts ->
            Page.CommentedProducts.initModel Nothing logInState
                |> Tuple.mapBoth PageCommentedProducts commentedProductsEmissionListToCmd

        SiteMap.InitExhibition ->
            Page.Exhibition.initModel
                |> Tuple.mapBoth PageExhibition exhibitionPageEmissionListToCmd

        SiteMap.InitProduct productId ->
            Page.Product.initModel productId
                |> Tuple.mapBoth PageProduct productPageEmissionListToCmd

        SiteMap.InitUser userId ->
            Page.User.initModelFromId logInState userId
                |> Tuple.mapBoth PageUser userPageEmissionListToCmd

        SiteMap.InitSearch condition ->
            Page.Search.initModel condition
                |> Tuple.mapBoth PageSearch searchPageEmissionListToCmd

        SiteMap.InitNotification ->
            Page.Notification.initModel
                |> Tuple.mapBoth PageNotification notificationEmissionListToCmd

        SiteMap.InitSiteMap ->
            ( PageSiteMapXml, Cmd.none )

        SiteMap.InitAbout ->
            ( PageAbout Page.About.aboutModel, Cmd.none )

        SiteMap.InitAboutPrivacyPolicy ->
            ( PageAbout Page.About.privacyPolicyModel, Cmd.none )


logInResponseCmd : { accessToken : Api.Token, refreshToken : Api.Token } -> Browser.Navigation.Key -> Url.Url -> Cmd Msg
logInResponseCmd { accessToken, refreshToken } key url =
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
                ( page, cmd ) =
                    urlParser (Model rec) url
                        |> urlParserResultToModel
            in
            ( Model { rec | page = page }
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
                        [ Api.getMyNameAndLikedProductsId accessTokenAndRefreshToken.accessToken GetMyProfileAndLikedProductIdsResponse
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
                        ( newModel, emissionList ) =
                            Page.Home.initModel (getProductId rec.page)
                    in
                    ( Model
                        { rec
                            | message = Just "新規登録完了"
                            , page = PageHome newModel
                        }
                    , Cmd.batch
                        [ Browser.Navigation.pushUrl rec.key SiteMap.homeUrl
                        , homePageEmissionListToCmd emissionList
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
                        ( newModel, emissionList ) =
                            Page.Exhibition.update
                                rec.logInState
                                (Page.Exhibition.MsgByProductEditor
                                    (Page.Component.ProductEditor.InputImageList dataUrlList)
                                )
                                exhibitionPageModel
                    in
                    ( Model { rec | page = PageExhibition newModel }
                    , exhibitionPageEmissionListToCmd emissionList
                    )

                PageProduct productPageModel ->
                    let
                        ( newModel, emissionList ) =
                            Page.Product.update
                                (Page.Product.MsgByProductEditor
                                    (Page.Component.ProductEditor.InputImageList dataUrlList)
                                )
                                productPageModel
                    in
                    ( Model { rec | page = PageProduct newModel }
                    , productPageEmissionListToCmd emissionList
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        ReceiveUserImage image ->
            case rec.page of
                PageSignUp pageModel ->
                    let
                        ( newModel, emissionList ) =
                            Page.SignUp.update
                                (Page.SignUp.ReceiveUserImage image)
                                pageModel
                    in
                    ( Model { rec | page = PageSignUp newModel }
                    , signUpPageEmissionListToCmd emissionList
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        PageMsg pageMsg ->
            updatePageMsg pageMsg (Model rec)

        GetMyProfileAndLikedProductIdsResponse response ->
            ( case response of
                Ok userWithProfile ->
                    Model
                        { rec
                            | logInState =
                                rec.logInState
                                    |> Data.LogInState.addUserWithNameAndLikedProductIds userWithProfile
                        }

                Err string ->
                    Model { rec | message = Just ("プロフィール情報の取得に失敗しました" ++ string) }
            , Cmd.none
            )

        SellProductResponse response ->
            ( case response of
                Ok productDetail ->
                    Model
                        { rec | message = Just "出品しました" }

                Err errorMessage ->
                    Model { rec | message = Just ("出品できませんでした " ++ errorMessage) }
            , Cmd.none
            )

        LikeProductResponse id response ->
            let
                ( page, cmd ) =
                    updateLikedCountInEachPageProduct id response rec.page
            in
            ( Model
                { rec
                    | page = page
                    , logInState = Data.LogInState.likeProduct id rec.logInState
                }
            , cmd
            )

        UnlikeProductResponse id response ->
            let
                ( page, cmd ) =
                    updateLikedCountInEachPageProduct id response rec.page
            in
            ( Model
                { rec
                    | page = page
                    , logInState = Data.LogInState.unlikeProduct id rec.logInState
                }
            , cmd
            )

        ChangeProfileResponse response ->
            case response of
                Ok newProfile ->
                    case rec.page of
                        PageUser profileModel ->
                            let
                                ( newModel, emissionList ) =
                                    profileModel
                                        |> Page.User.update (Page.User.MsgChangeProfileResponse response)
                            in
                            ( Model
                                { rec
                                    | logInState =
                                        rec.logInState
                                            |> Data.LogInState.updateWithName
                                                (Data.User.withProfileToWithName newProfile)
                                    , page = PageUser newModel
                                }
                            , userPageEmissionListToCmd emissionList
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
                |> mapPageModel PageHome homePageEmissionListToCmd

        ( LikedProductsPageMsg msg, PageLikedProducts model ) ->
            model
                |> Page.LikedProducts.update msg
                |> mapPageModel PageLikedProducts likedProductsEmissionListToCmd

        ( HistoryPageMsg msg, PageHistory model ) ->
            model
                |> Page.History.update msg
                |> mapPageModel PageHistory historyEmissionListToCmd

        ( BoughtProductsPageMsg msg, PageBoughtProducts model ) ->
            model
                |> Page.BoughtProducts.update msg
                |> mapPageModel PageBoughtProducts boughtProductsPageEmissionListToCmd

        ( SoldProductsPageMsg msg, PageSoldProducts model ) ->
            model
                |> Page.SoldProducts.update msg
                |> mapPageModel PageSoldProducts soldProductsPageEmissionListToCmd

        ( LogInPageMsg msg, PageLogIn model ) ->
            model
                |> Page.LogIn.update msg
                |> mapPageModel PageLogIn (logInPageEmissionListToCmd rec.key)

        ( ExhibitionPageMsg msg, PageExhibition model ) ->
            model
                |> Page.Exhibition.update rec.logInState msg
                |> mapPageModel PageExhibition exhibitionPageEmissionListToCmd

        ( SignUpMsg msg, PageSignUp model ) ->
            model
                |> Page.SignUp.update msg
                |> mapPageModel PageSignUp signUpPageEmissionListToCmd

        ( SearchPageMsg msg, PageSearch model ) ->
            model
                |> Page.Search.update msg
                |> mapPageModel PageSearch searchPageEmissionListToCmd

        ( NotificationMsg msg, PageNotification model ) ->
            model
                |> Page.Notification.update msg
                |> mapPageModel PageNotification notificationEmissionListToCmd

        ( UserPageMsg msg, PageUser model ) ->
            model
                |> Page.User.update msg
                |> mapPageModel PageUser userPageEmissionListToCmd

        ( ProductPageMsg msg, PageProduct model ) ->
            model
                |> Page.Product.update msg
                |> mapPageModel PageProduct productPageEmissionListToCmd

        ( _, _ ) ->
            \model -> ( model, Cmd.none )
    )
        (Model rec)


mapPageModel :
    (eachPageModel -> PageModel)
    -> (eachPageEmissionList -> Cmd Msg)
    -> ( eachPageModel, eachPageEmissionList )
    -> Model
    -> ( Model, Cmd Msg )
mapPageModel modelFunc emissionListFunc ( eachPageMsg, eachPageEmissionList ) (Model rec) =
    ( Model { rec | page = modelFunc eachPageMsg }
    , emissionListFunc eachPageEmissionList
    )



{- ===================== Page Emission To Msg ======================== -}


homePageEmissionListToCmd : List Page.Home.Emission -> Cmd Msg
homePageEmissionListToCmd =
    List.map
        (\emission ->
            case emission of
                Page.Home.EmissionGetRecentProducts ->
                    Api.getRecentProductList (\result -> PageMsg (HomePageMsg (Page.Home.GetRecentProductsResponse result)))

                Page.Home.EmissionGetRecommendProducts ->
                    Api.getRecommendProductList (\result -> PageMsg (HomePageMsg (Page.Home.GetRecommendProductsResponse result)))

                Page.Home.EmissionGetFreeProducts ->
                    Api.getFreeProductList (\result -> PageMsg (HomePageMsg (Page.Home.GetFreeProductsResponse result)))

                Page.Home.EmissionProducts e ->
                    productListEmissionToCmd e

                Page.Home.EmissionAddLogMessage log ->
                    Task.succeed ()
                        |> Task.perform (always (AddLogMessage log))
        )
        >> Cmd.batch


likedProductsEmissionListToCmd : List Page.LikedProducts.Emission -> Cmd Msg
likedProductsEmissionListToCmd =
    List.map
        (\emission ->
            case emission of
                Page.LikedProducts.EmissionGetLikedProducts token ->
                    Api.getLikedProducts token
                        (\result ->
                            PageMsg
                                (LikedProductsPageMsg (Page.LikedProducts.GetProductsResponse result))
                        )

                Page.LikedProducts.EmissionByLogIn e ->
                    logInEmissionToCmd e

                Page.LikedProducts.EmissionByProductList e ->
                    productListEmissionToCmd e

                Page.LikedProducts.EmissionAddLogMessage log ->
                    Task.succeed ()
                        |> Task.perform (always (AddLogMessage log))
        )
        >> Cmd.batch


historyEmissionListToCmd : List Page.History.Emission -> Cmd Msg
historyEmissionListToCmd =
    List.map
        (\emission ->
            case emission of
                Page.History.EmissionGetHistoryProducts token ->
                    Api.getHistoryViewProducts token (\result -> PageMsg (HistoryPageMsg (Page.History.GetProductsResponse result)))

                Page.History.EmissionByLogIn e ->
                    logInEmissionToCmd e

                Page.History.EmissionByProductList e ->
                    productListEmissionToCmd e

                Page.History.EmissionAddLogMessage log ->
                    Task.succeed ()
                        |> Task.perform (always (AddLogMessage log))
        )
        >> Cmd.batch


soldProductsPageEmissionListToCmd : List Page.SoldProducts.Emission -> Cmd Msg
soldProductsPageEmissionListToCmd =
    List.map
        (\emission ->
            case emission of
                Page.SoldProducts.EmissionGetSoldProducts userId ->
                    Api.getSoldProductList userId
                        (\result ->
                            PageMsg (SoldProductsPageMsg (Page.SoldProducts.GetSoldProductListResponse result))
                        )

                Page.SoldProducts.EmissionByProductList e ->
                    productListEmissionToCmd e

                Page.SoldProducts.EmissionAddLogMessage log ->
                    Task.succeed ()
                        |> Task.perform (always (AddLogMessage log))
        )
        >> Cmd.batch


boughtProductsPageEmissionListToCmd : List Page.BoughtProducts.Emission -> Cmd Msg
boughtProductsPageEmissionListToCmd =
    List.map
        (\emission ->
            case emission of
                Page.BoughtProducts.EmissionGetPurchaseProducts token ->
                    Api.getBoughtProductList token
                        (\result ->
                            PageMsg
                                (BoughtProductsPageMsg (Page.BoughtProducts.GetProductsResponse result))
                        )

                Page.BoughtProducts.EmissionByLogIn e ->
                    logInEmissionToCmd e

                Page.BoughtProducts.EmissionByProductList e ->
                    productListEmissionToCmd e

                Page.BoughtProducts.EmissionAddLogMessage log ->
                    Task.succeed ()
                        |> Task.perform (always (AddLogMessage log))
        )
        >> Cmd.batch


tradingProductsEmissionListToCmd : List Page.TradingProducts.Emission -> Cmd Msg
tradingProductsEmissionListToCmd =
    List.map
        (\emission ->
            case emission of
                Page.TradingProducts.EmissionGetTradingProducts token ->
                    Api.getTradingProductList token
                        (\result ->
                            PageMsg
                                (TradingProductsPageMsg (Page.TradingProducts.GetProductsResponse result))
                        )

                Page.TradingProducts.EmissionByLogIn e ->
                    logInEmissionToCmd e

                Page.TradingProducts.EmissionByProductList e ->
                    productListEmissionToCmd e

                Page.TradingProducts.EmissionAddLogMessage log ->
                    Task.succeed ()
                        |> Task.perform (always (AddLogMessage log))
        )
        >> Cmd.batch


tradedProductsEmissionListToCmd : List Page.TradedProducts.Emission -> Cmd Msg
tradedProductsEmissionListToCmd =
    List.map
        (\emission ->
            case emission of
                Page.TradedProducts.EmissionGetTradedProducts token ->
                    Api.getTradedProductList token
                        (\result ->
                            PageMsg
                                (TradedProductsPageMsg (Page.TradedProducts.GetTradesResponse result))
                        )

                Page.TradedProducts.EmissionByLogIn e ->
                    logInEmissionToCmd e

                Page.TradedProducts.EmissionByProductList e ->
                    productListEmissionToCmd e

                Page.TradedProducts.EmissionAddLogMessage log ->
                    Task.succeed ()
                        |> Task.perform (always (AddLogMessage log))
        )
        >> Cmd.batch


commentedProductsEmissionListToCmd : List Page.CommentedProducts.Emission -> Cmd Msg
commentedProductsEmissionListToCmd =
    List.map
        (\emission ->
            case emission of
                Page.CommentedProducts.EmissionGetCommentedProducts token ->
                    Api.getCommentedProductList token
                        (\result ->
                            PageMsg
                                (CommentedProductsPageMsg (Page.CommentedProducts.GetProductsResponse result))
                        )

                Page.CommentedProducts.EmissionByLogIn e ->
                    logInEmissionToCmd e

                Page.CommentedProducts.EmissionByProductList e ->
                    productListEmissionToCmd e

                Page.CommentedProducts.EmissionAddLogMessage log ->
                    Task.succeed ()
                        |> Task.perform (always (AddLogMessage log))
        )
        >> Cmd.batch


logInPageEmissionListToCmd : Browser.Navigation.Key -> List Page.LogIn.Emission -> Cmd Msg
logInPageEmissionListToCmd key =
    List.map
        (\emission ->
            case emission of
                Page.LogIn.LogInOrSignUpEmission e ->
                    logInEmissionToCmd e

                Page.LogIn.EmissionPageToHome ->
                    Browser.Navigation.pushUrl key SiteMap.homeUrl
        )
        >> Cmd.batch


exhibitionPageEmissionListToCmd : List Page.Exhibition.Emission -> Cmd Msg
exhibitionPageEmissionListToCmd =
    List.map
        (\emission ->
            case emission of
                Page.Exhibition.EmissionLogInOrSignUp e ->
                    logInEmissionToCmd e

                Page.Exhibition.EmissionSellProducts ( token, request ) ->
                    Api.sellProduct token request SellProductResponse

                Page.Exhibition.EmissionByProductEditor e ->
                    productEditorEmissionToCmd e
        )
        >> Cmd.batch


signUpPageEmissionListToCmd : List Page.SignUp.Emission -> Cmd Msg
signUpPageEmissionListToCmd =
    List.map
        (\emission ->
            case emission of
                Page.SignUp.EmissionAddEventListenerForUserImage idRecord ->
                    addEventListenerForUserImage idRecord

                Page.SignUp.EmissionReplaceElementText idAndText ->
                    replaceText idAndText

                Page.SignUp.EmissionSignUp signUpRequest ->
                    Api.sendConfirmEmail signUpRequest (\response -> SignUpConfirmResponse response)

                Page.SignUp.EmissionByUniversity e ->
                    universityEmissionToCmd e

                Page.SignUp.EmissionAddLogMessage log ->
                    Task.succeed ()
                        |> Task.perform (always (AddLogMessage log))
        )
        >> Cmd.batch


searchPageEmissionListToCmd : List Page.Search.Emission -> Cmd Msg
searchPageEmissionListToCmd =
    List.map
        (\emission ->
            case emission of
                Page.Search.EmissionReplaceElementText idAndText ->
                    replaceText idAndText
        )
        >> Cmd.batch


notificationEmissionListToCmd : List Page.Notification.Emission -> Cmd Msg
notificationEmissionListToCmd =
    List.map
        (\emission ->
            case emission of
                Page.Notification.Emission ->
                    Cmd.none
        )
        >> Cmd.batch


userPageEmissionListToCmd : List Page.User.Emission -> Cmd Msg
userPageEmissionListToCmd =
    List.map
        (\emission ->
            case emission of
                Page.User.EmissionChangeProfile token profile ->
                    Api.updateProfile token profile ChangeProfileResponse

                Page.User.EmissionReplaceElementText idAndText ->
                    replaceText idAndText

                Page.User.EmissionByUniversity e ->
                    universityEmissionToCmd e

                Page.User.EmissionLogOut ->
                    Cmd.batch
                        [ deleteRefreshTokenAndAllFromLocalStorage ()
                        , Task.perform (always LogOut) (Task.succeed ())
                        ]

                Page.User.EmissionGetUserProfile userId ->
                    Api.getUserProfile userId
                        (\e -> PageMsg (UserPageMsg (Page.User.MsgUserProfileResponse e)))

                Page.User.EmissionAddLogMessage log ->
                    Task.succeed ()
                        |> Task.perform (always (AddLogMessage log))
        )
        >> Cmd.batch


productPageEmissionListToCmd : List Page.Product.Emission -> Cmd Msg
productPageEmissionListToCmd =
    List.map
        (\emission ->
            case emission of
                Page.Product.EmissionGetProduct { productId } ->
                    Api.getProduct productId (\result -> PageMsg (ProductPageMsg (Page.Product.GetProductResponse result)))

                Page.Product.EmissionGetCommentList { productId } ->
                    Api.getProductComments productId (\result -> PageMsg (ProductPageMsg (Page.Product.GetCommentListResponse result)))

                Page.Product.EmissionPostComment token { productId } comment ->
                    Api.postProductComment token
                        productId
                        comment
                        (\result -> PageMsg (ProductPageMsg (Page.Product.PostCommentResponse result)))

                Page.Product.EmissionLike token id ->
                    Api.likeProduct token id (LikeProductResponse id)

                Page.Product.EmissionUnLike token id ->
                    Api.unlikeProduct token id (UnlikeProductResponse id)

                Page.Product.EmissionTradeStart token id ->
                    Api.tradeStart token id (\result -> PageMsg (ProductPageMsg (Page.Product.TradeStartResponse result)))

                Page.Product.EmissionAddLogMessage log ->
                    Task.succeed ()
                        |> Task.perform (always (AddLogMessage log))

                Page.Product.EmissionUpdateNowTime ->
                    Task.map2
                        Tuple.pair
                        Time.now
                        Time.here
                        |> Task.attempt GetNowTime

                Page.Product.EmissionDelete token productId ->
                    Api.deleteProduct token productId

                Page.Product.EmissionByProductEditor e ->
                    productEditorEmissionToCmd e

                Page.Product.EmissionUpdateProductData token productId requestData ->
                    Api.updateProduct token
                        productId
                        requestData
                        (\m -> PageMsg (ProductPageMsg (Page.Product.UpdateProductDataResponse m)))
        )
        >> Cmd.batch



{- ===================== Page Component Emission To Msg ======================== -}


logInEmissionToCmd : Page.Component.LogIn.Emission -> Cmd Msg
logInEmissionToCmd emission =
    case emission of
        Page.Component.LogIn.EmissionLogInOrSignUp service ->
            Api.logInOrSignUpUrlRequest service LogInOrSignUpUrlResponse


productListEmissionToCmd : Page.Component.ProductList.Emission -> Cmd Msg
productListEmissionToCmd emission =
    case emission of
        Page.Component.ProductList.EmissionLike token id ->
            Api.likeProduct token id (LikeProductResponse id)

        Page.Component.ProductList.EmissionUnlike token id ->
            Api.unlikeProduct token id (UnlikeProductResponse id)

        Page.Component.ProductList.EmissionScrollIntoView idString ->
            elementScrollIntoView idString


universityEmissionToCmd : Page.Component.University.Emission -> Cmd Msg
universityEmissionToCmd emission =
    case emission of
        Page.Component.University.EmissionChangeSelectedIndex { id, index } ->
            changeSelectedIndex { id = id, index = index }


productEditorEmissionToCmd : Page.Component.ProductEditor.Emission -> Cmd Msg
productEditorEmissionToCmd emission =
    case emission of
        Page.Component.ProductEditor.EmissionAddEventListenerForProductImages record ->
            addEventListenerForProductImages record

        Page.Component.ProductEditor.EmissionReplaceText { id, text } ->
            replaceText { id = id, text = text }

        Page.Component.ProductEditor.EmissionChangeSelectedIndex { id, index } ->
            changeSelectedIndex { id = id, index = index }


urlParserResultToModel : Maybe ( PageModel, Cmd Msg ) -> ( PageModel, Cmd Msg )
urlParserResultToModel parserResult =
    case parserResult of
        Just ( page, cmd ) ->
            ( page
            , cmd
            )

        Nothing ->
            let
                ( homeModel, emission ) =
                    Page.Home.initModel Nothing
            in
            ( PageHome homeModel
            , (Task.succeed ()
                |> Task.perform (always (AddLogMessage "指定したページが見つからないのでホームに移動しました"))
              )
                :: [ homePageEmissionListToCmd emission ]
                |> Cmd.batch
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
                |> Tuple.mapBoth PageHome homePageEmissionListToCmd

        SiteMap.LogIn ->
            ( PageLogIn Page.LogIn.initModel
            , Cmd.none
            )

        SiteMap.LikedProducts ->
            Page.LikedProducts.initModel (getProductId rec.page) rec.logInState
                |> Tuple.mapBoth PageLikedProducts likedProductsEmissionListToCmd

        SiteMap.History ->
            Page.History.initModel (getProductId rec.page) rec.logInState
                |> Tuple.mapBoth PageHistory historyEmissionListToCmd

        SiteMap.SoldProducts userId ->
            Page.SoldProducts.initModel userId (getProductId rec.page)
                |> Tuple.mapBoth PageSoldProducts soldProductsPageEmissionListToCmd

        SiteMap.BoughtProducts ->
            Page.BoughtProducts.initModel (getProductId rec.page) rec.logInState
                |> Tuple.mapBoth PageBoughtProducts boughtProductsPageEmissionListToCmd

        SiteMap.TradingProducts ->
            Page.TradingProducts.initModel (getProductId rec.page) rec.logInState
                |> Tuple.mapBoth PageTradingProducts tradingProductsEmissionListToCmd

        SiteMap.TradedProducts ->
            Page.TradedProducts.initModel (getProductId rec.page) rec.logInState
                |> Tuple.mapBoth PageTradedProducts tradedProductsEmissionListToCmd

        SiteMap.CommentedProducts ->
            Page.CommentedProducts.initModel (getProductId rec.page) rec.logInState
                |> Tuple.mapBoth PageCommentedProducts commentedProductsEmissionListToCmd

        SiteMap.Exhibition ->
            case rec.page of
                PageExhibition exhibitionModel ->
                    exhibitionModel
                        |> Page.Exhibition.update rec.logInState Page.Exhibition.BackToEditPage
                        |> Tuple.mapBoth PageExhibition exhibitionPageEmissionListToCmd

                _ ->
                    Page.Exhibition.initModel
                        |> Tuple.mapBoth PageExhibition exhibitionPageEmissionListToCmd

        SiteMap.ExhibitionConfirm ->
            case rec.page of
                PageExhibition pageModel ->
                    case Page.Exhibition.toConfirmPageMsgFromModel rec.logInState pageModel of
                        Just msg ->
                            (pageModel |> Page.Exhibition.update rec.logInState msg)
                                |> Tuple.mapBoth
                                    PageExhibition
                                    exhibitionPageEmissionListToCmd

                        Nothing ->
                            ( PageExhibition pageModel, Cmd.none )

                _ ->
                    ( rec.page, Cmd.none )

        SiteMap.Product productId ->
            (case getProductFromPage productId rec.page of
                Just product ->
                    Page.Product.initModelFromProduct product

                Nothing ->
                    Page.Product.initModel productId
            )
                |> Tuple.mapBoth PageProduct productPageEmissionListToCmd

        SiteMap.User userId ->
            (case getUserFromPage userId rec.page of
                Just userWithName ->
                    Page.User.initModelWithName userWithName

                Nothing ->
                    Page.User.initModelFromId rec.logInState userId
            )
                |> Tuple.mapBoth
                    PageUser
                    userPageEmissionListToCmd

        SiteMap.Search condition ->
            Page.Search.initModel condition
                |> Tuple.mapBoth
                    PageSearch
                    searchPageEmissionListToCmd

        SiteMap.Notification ->
            Page.Notification.initModel
                |> Tuple.mapBoth
                    PageNotification
                    notificationEmissionListToCmd

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


getProductFromPage : Data.Product.Id -> PageModel -> Maybe Data.Product.Product
getProductFromPage productId pageModel =
    (case pageModel of
        PageHome model ->
            Page.Home.getAllProducts model

        PageLikedProducts model ->
            Page.LikedProducts.getAllProducts model

        PageHistory model ->
            Page.History.getAllProducts model

        PageSoldProducts model ->
            Page.SoldProducts.getAllProducts model

        PageBoughtProducts model ->
            Page.BoughtProducts.getAllProducts model

        PageTradingProducts model ->
            Page.TradingProducts.getAllProducts model

        PageTradedProducts model ->
            Page.TradedProducts.getAllProducts model

        PageCommentedProducts model ->
            Page.CommentedProducts.getAllProducts model

        PageProduct model ->
            case Page.Product.getProduct model of
                Just product ->
                    [ product ]

                Nothing ->
                    []

        _ ->
            []
    )
        |> Data.Product.searchFromId productId


getUserFromPage : Data.User.Id -> PageModel -> Maybe Data.User.WithName
getUserFromPage userId pageModel =
    (case pageModel of
        PageProduct model ->
            Page.Product.getUser model

        PageUser model ->
            Page.User.getUser model

        _ ->
            []
    )
        |> Data.User.searchFromId userId


{-| 各ページにいいねを押した結果を反映するように通知する
-}
updateLikedCountInEachPageProduct : Data.Product.Id -> Result String Int -> PageModel -> ( PageModel, Cmd Msg )
updateLikedCountInEachPageProduct productId result page =
    let
        productListMsg =
            Page.Component.ProductList.UpdateLikedCountResponse productId result
    in
    case page of
        PageHome pageMsg ->
            let
                ( newModel, emissionList ) =
                    pageMsg |> Page.Home.update (Page.Home.MsgByProductList productListMsg)
            in
            ( PageHome newModel
            , homePageEmissionListToCmd emissionList
            )

        PageHistory pageMsg ->
            let
                ( newModel, emissionList ) =
                    pageMsg
                        |> Page.History.update (Page.History.MsgByProductList productListMsg)
            in
            ( PageHistory newModel
            , historyEmissionListToCmd emissionList
            )

        PageSoldProducts pageMsg ->
            let
                ( newModel, emissionList ) =
                    pageMsg
                        |> Page.SoldProducts.update (Page.SoldProducts.MsgByProductList productListMsg)
            in
            ( PageSoldProducts newModel
            , soldProductsPageEmissionListToCmd emissionList
            )

        PageBoughtProducts pageMsg ->
            let
                ( newModel, emissionList ) =
                    pageMsg
                        |> Page.BoughtProducts.update (Page.BoughtProducts.MsgByProductList productListMsg)
            in
            ( PageBoughtProducts newModel
            , boughtProductsPageEmissionListToCmd emissionList
            )

        PageProduct pageMsg ->
            let
                ( newModel, emissionList ) =
                    pageMsg |> Page.Product.update (Page.Product.LikeResponse result)
            in
            ( PageProduct newModel
            , productPageEmissionListToCmd emissionList
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
titleAndTabDataAndMainView logInState isWideScreen nowMaybe page =
    case page of
        PageHome model ->
            model
                |> Page.Home.view logInState isWideScreen
                |> mapPageData HomePageMsg

        PageLikedProducts model ->
            model
                |> Page.LikedProducts.view logInState isWideScreen
                |> mapPageData LikedProductsPageMsg

        PageHistory model ->
            model
                |> Page.History.view logInState isWideScreen
                |> mapPageData HistoryPageMsg

        PageBoughtProducts model ->
            model
                |> Page.BoughtProducts.view logInState isWideScreen
                |> mapPageData BoughtProductsPageMsg

        PageSoldProducts model ->
            model
                |> Page.SoldProducts.view logInState isWideScreen
                |> mapPageData SoldProductsPageMsg

        PageTradingProducts model ->
            model
                |> Page.TradingProducts.view logInState isWideScreen
                |> mapPageData TradingProductsPageMsg

        PageTradedProducts model ->
            model
                |> Page.TradedProducts.view logInState isWideScreen
                |> mapPageData TradedProductsPageMsg

        PageCommentedProducts model ->
            model
                |> Page.CommentedProducts.view logInState isWideScreen
                |> mapPageData CommentedProductsPageMsg

        PageExhibition model ->
            model
                |> Page.Exhibition.view logInState
                |> mapPageData ExhibitionPageMsg

        PageSignUp model ->
            model
                |> Page.SignUp.view
                |> mapPageData SignUpMsg

        PageLogIn model ->
            model
                |> Page.LogIn.view
                |> mapPageData LogInPageMsg

        PageProduct model ->
            model
                |> Page.Product.view logInState isWideScreen nowMaybe
                |> mapPageData ProductPageMsg

        PageUser model ->
            model
                |> Page.User.view logInState
                |> mapPageData UserPageMsg

        PageSearch model ->
            model
                |> Page.Search.view
                |> mapPageData SearchPageMsg

        PageNotification model ->
            model
                |> Page.Notification.view
                |> mapPageData NotificationMsg

        PageAbout model ->
            model
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
