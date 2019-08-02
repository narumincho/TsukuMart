port module Main exposing (main)

import Api
import BasicParts
import Browser
import Browser.Navigation
import Css
import Css.Animations
import Data.LogInState
import Data.Product
import Data.Trade
import Data.User
import Html.Styled
import Html.Styled.Attributes
import Html.Styled.Keyed
import Page.About
import Page.BoughtProducts
import Page.CommentedProducts
import Page.Component.Category
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
import Page.SearchResult
import Page.SoldProducts
import Page.Trade
import Page.TradesInPast
import Page.TradesInProgress
import Page.User
import PageLocation
import Task
import Time
import Url


port addEventListenerForUserImage : { labelId : String, inputId : String } -> Cmd msg


port receiveUserImage : (String -> msg) -> Sub msg


port addEventListenerForProductImages : { labelId : String, inputId : String } -> Cmd msg


port receiveProductImages : (List String -> msg) -> Sub msg


port toWideScreenMode : (() -> msg) -> Sub msg


port toNarrowScreenMode : (() -> msg) -> Sub msg


port saveAccessTokenToLocalStorage : String -> Cmd msg


port deleteAllFromLocalStorage : () -> Cmd msg


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
    | PageLogIn Page.LogIn.Model
    | PageLikedProducts Page.LikedProducts.Model
    | PageHistory Page.History.Model
    | PageSoldProducts Page.SoldProducts.Model
    | PageBoughtProducts Page.BoughtProducts.Model
    | PageTradesInProgress Page.TradesInProgress.Model
    | PageTradesInPast Page.TradesInPast.Model
    | PageCommentedProducts Page.CommentedProducts.Model
    | PageExhibition Page.Exhibition.Model
    | PageProduct Page.Product.Model
    | PageTrade Page.Trade.Model
    | PageUser Page.User.Model
    | PageSearch Page.Search.Model
    | PageSearchResult Page.SearchResult.Model
    | PageNotification Page.Notification.Model
    | PageAbout Page.About.Model


type Msg
    = ToWideScreenMode
    | ToNarrowScreenMode
    | UrlChange Url.Url
    | UrlRequest Browser.UrlRequest
    | AddLogMessage String
    | LogInResponse (Result String Api.Token)
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
    = PageMsgHome Page.Home.Msg
    | PageMsgLikedProducts Page.LikedProducts.Msg
    | PageMsgHistory Page.History.Msg
    | PageMsgSoldProducts Page.SoldProducts.Msg
    | PageMsgBoughtProducts Page.BoughtProducts.Msg
    | PageMsgTradesInProgress Page.TradesInProgress.Msg
    | PageMsgTradesInPast Page.TradesInPast.Msg
    | PageMsgCommentedProducts Page.CommentedProducts.Msg
    | PageMsgLogIn Page.LogIn.Msg
    | PageMsgExhibition Page.Exhibition.Msg
    | PageMsgSearch Page.Search.Msg
    | PageMsgSearchResult Page.SearchResult.Msg
    | PageMsgNotification Page.Notification.Msg
    | PageMsgProduct Page.Product.Msg
    | PageMsgUser Page.User.Msg
    | PageMsgTrade Page.Trade.Msg


main : Program { accessToken : Maybe String } Model Msg
main =
    Browser.application
        { init = init
        , update = update
        , view =
            \model ->
                { title = (view model).title
                , body = (view model).body |> List.map Html.Styled.toUnstyled
                }
        , subscriptions = subscription
        , onUrlRequest = UrlRequest
        , onUrlChange = UrlChange
        }


init : { accessToken : Maybe String } -> Url.Url -> Browser.Navigation.Key -> ( Model, Cmd Msg )
init { accessToken } url key =
    let
        ( tokenFromUrlMaybe, page ) =
            PageLocation.initFromUrl url

        ( newPage, cmd ) =
            urlParserInit Data.LogInState.None key page
    in
    ( Model
        { page = newPage
        , wideScreen = False
        , message = Nothing
        , logInState =
            case ( tokenFromUrlMaybe, accessToken ) of
                ( Just tokenFromUrl, _ ) ->
                    Data.LogInState.LoadingProfile tokenFromUrl

                ( Nothing, Just accessTokenString ) ->
                    Data.LogInState.LoadingProfile (Api.tokenFromString accessTokenString)

                ( _, _ ) ->
                    Data.LogInState.None
        , notificationVisible = False
        , key = key
        , now = Nothing
        }
    , Cmd.batch
        ((case ( tokenFromUrlMaybe, accessToken ) of
            ( Just tokenFromUrl, _ ) ->
                [ Api.getMyNameAndLikedProductsId
                    tokenFromUrl
                    GetMyProfileAndLikedProductIdsResponse
                , saveAccessTokenToLocalStorage (Api.tokenToString tokenFromUrl)
                , Browser.Navigation.replaceUrl key
                    (page
                        |> Maybe.withDefault PageLocation.InitHome
                        |> PageLocation.initToUrlAsString
                    )
                ]

            ( Nothing, Just accessTokenString ) ->
                [ Api.getMyNameAndLikedProductsId
                    (Api.tokenFromString accessTokenString)
                    GetMyProfileAndLikedProductIdsResponse
                , saveAccessTokenToLocalStorage accessTokenString
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


urlParserInit : Data.LogInState.LogInState -> Browser.Navigation.Key -> Maybe PageLocation.InitPageLocation -> ( PageModel, Cmd Msg )
urlParserInit logInState key page =
    case page of
        Just p ->
            urlParserInitResultToPageAndCmd key logInState p

        Nothing ->
            pageNotFound


urlParserInitResultToPageAndCmd : Browser.Navigation.Key -> Data.LogInState.LogInState -> PageLocation.InitPageLocation -> ( PageModel, Cmd Msg )
urlParserInitResultToPageAndCmd key logInState page =
    case page of
        PageLocation.InitHome ->
            Page.Home.initModel Nothing
                |> mapPageModel PageHome homePageEmissionToCmd

        PageLocation.InitLogIn ->
            Page.LogIn.initModel
                |> mapPageModel PageLogIn (logInPageEmissionToCmd key)

        PageLocation.InitLikedProducts ->
            Page.LikedProducts.initModel Nothing logInState
                |> mapPageModel PageLikedProducts likedProductsEmissionToCmd

        PageLocation.InitHistory ->
            Page.History.initModel Nothing logInState
                |> mapPageModel PageHistory historyEmissionToCmd

        PageLocation.InitSoldProducts userId ->
            Page.SoldProducts.initModel userId Nothing
                |> mapPageModel PageSoldProducts soldProductsPageEmissionToCmd

        PageLocation.InitBoughtProducts ->
            Page.BoughtProducts.initModel Nothing logInState
                |> mapPageModel PageBoughtProducts boughtProductsPageEmissionToCmd

        PageLocation.InitTradingProducts ->
            Page.TradesInProgress.initModel Nothing logInState
                |> mapPageModel PageTradesInProgress tradingProductsEmissionToCmd

        PageLocation.InitTradedProducts ->
            Page.TradesInPast.initModel Nothing logInState
                |> mapPageModel PageTradesInPast tradedProductsEmissionToCmd

        PageLocation.InitCommentedProducts ->
            Page.CommentedProducts.initModel Nothing logInState
                |> mapPageModel PageCommentedProducts commentedProductsEmissionToCmd

        PageLocation.InitExhibition ->
            Page.Exhibition.initModel
                |> mapPageModel PageExhibition exhibitionPageEmissionToCmd

        PageLocation.InitProduct productId ->
            Page.Product.initModel logInState productId
                |> mapPageModel PageProduct (productPageEmissionToCmd key)

        PageLocation.InitTrade tradeId ->
            Page.Trade.initModelFromId logInState tradeId
                |> mapPageModel PageTrade tradePageEmissionToCmd

        PageLocation.InitUser userId ->
            Page.User.initModelFromId logInState userId
                |> mapPageModel PageUser userPageEmissionToCmd

        PageLocation.InitSearch ->
            Page.Search.initModel
                |> mapPageModel PageSearch searchPageEmissionToCmd

        PageLocation.InitSearchResult condition ->
            Page.SearchResult.initModel Nothing condition
                |> mapPageModel PageSearchResult searchResultPageEmissionToCmd

        PageLocation.InitNotification ->
            Page.Notification.initModel
                |> mapPageModel PageNotification notificationEmissionToCmd

        PageLocation.InitAbout ->
            ( PageAbout Page.About.aboutModel, Cmd.none )

        PageLocation.InitAboutPrivacyPolicy ->
            ( PageAbout Page.About.privacyPolicyModel, Cmd.none )


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
            urlParser (Model rec) url

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
                Ok token ->
                    ( Model
                        { rec
                            | message = Just "ログインしました"
                            , logInState =
                                Data.LogInState.LoadingProfile token
                        }
                    , Cmd.batch
                        []
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
                        ( newModel, emissions ) =
                            Page.Home.initModel (getProductId rec.page)
                    in
                    ( Model
                        { rec
                            | message = Just "新規登録完了"
                            , page = PageHome newModel
                        }
                    , Cmd.batch
                        ([ Browser.Navigation.pushUrl rec.key (PageLocation.toUrlAsString PageLocation.Home)
                         ]
                            ++ List.map homePageEmissionToCmd emissions
                        )
                    )

                Err e ->
                    ( Model rec
                    , Cmd.none
                    )

        ReceiveProductImages dataUrlList ->
            case rec.page of
                PageExhibition exhibitionPageModel ->
                    let
                        ( newModel, emissions ) =
                            Page.Exhibition.update
                                rec.logInState
                                (Page.Exhibition.MsgByProductEditor
                                    (Page.Component.ProductEditor.InputImageList dataUrlList)
                                )
                                exhibitionPageModel
                    in
                    ( Model { rec | page = PageExhibition newModel }
                    , emissions |> List.map exhibitionPageEmissionToCmd |> Cmd.batch
                    )

                PageProduct productPageModel ->
                    let
                        ( newModel, emissions ) =
                            Page.Product.update
                                (Page.Product.MsgByProductEditor
                                    (Page.Component.ProductEditor.InputImageList dataUrlList)
                                )
                                productPageModel
                    in
                    ( Model { rec | page = PageProduct newModel }
                    , emissions |> List.map (productPageEmissionToCmd rec.key) |> Cmd.batch
                    )

                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        ReceiveUserImage image ->
            case rec.page of
                _ ->
                    ( Model rec
                    , Cmd.none
                    )

        PageMsg pageMsg ->
            let
                ( pageModel, cmd ) =
                    updatePageMsg pageMsg (Model rec)
            in
            ( Model { rec | page = pageModel }
            , cmd
            )

        GetMyProfileAndLikedProductIdsResponse response ->
            case response of
                Ok userWithProfile ->
                    ( Model
                        { rec
                            | logInState =
                                rec.logInState
                                    |> Data.LogInState.addUserWithNameAndLikedProductIds userWithProfile
                        }
                    , Cmd.none
                    )

                Err string ->
                    ( Model { rec | message = Just string }
                    , if string == "他の端末でログインされたので、ログインしなおしてください" then
                        deleteAllFromLocalStorage ()

                      else
                        Cmd.none
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
                    updateLikedCountInEachPageProduct rec.key id response rec.page
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
                    updateLikedCountInEachPageProduct rec.key id response rec.page
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
                                ( newModel, emissions ) =
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
                            , emissions |> List.map userPageEmissionToCmd |> Cmd.batch
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


updatePageMsg : PageMsg -> Model -> ( PageModel, Cmd Msg )
updatePageMsg pageMsg (Model rec) =
    case ( pageMsg, rec.page ) of
        ( PageMsgHome msg, PageHome model ) ->
            model
                |> Page.Home.update msg
                |> mapPageModel PageHome homePageEmissionToCmd

        ( PageMsgLikedProducts msg, PageLikedProducts model ) ->
            model
                |> Page.LikedProducts.update msg
                |> mapPageModel PageLikedProducts likedProductsEmissionToCmd

        ( PageMsgHistory msg, PageHistory model ) ->
            model
                |> Page.History.update msg
                |> mapPageModel PageHistory historyEmissionToCmd

        ( PageMsgSoldProducts msg, PageSoldProducts model ) ->
            model
                |> Page.SoldProducts.update msg
                |> mapPageModel PageSoldProducts soldProductsPageEmissionToCmd

        ( PageMsgBoughtProducts msg, PageBoughtProducts model ) ->
            model
                |> Page.BoughtProducts.update msg
                |> mapPageModel PageBoughtProducts boughtProductsPageEmissionToCmd

        ( PageMsgTradesInProgress msg, PageTradesInProgress model ) ->
            model
                |> Page.TradesInProgress.update msg
                |> mapPageModel PageTradesInProgress tradingProductsEmissionToCmd

        ( PageMsgTradesInPast msg, PageTradesInPast model ) ->
            model
                |> Page.TradesInPast.update msg
                |> mapPageModel PageTradesInPast tradedProductsEmissionToCmd

        ( PageMsgCommentedProducts msg, PageCommentedProducts model ) ->
            model
                |> Page.CommentedProducts.update msg
                |> mapPageModel PageCommentedProducts commentedProductsEmissionToCmd

        ( PageMsgLogIn msg, PageLogIn model ) ->
            model
                |> Page.LogIn.update msg
                |> mapPageModel PageLogIn (logInPageEmissionToCmd rec.key)

        ( PageMsgExhibition msg, PageExhibition model ) ->
            model
                |> Page.Exhibition.update rec.logInState msg
                |> mapPageModel PageExhibition exhibitionPageEmissionToCmd

        ( PageMsgSearch msg, PageSearch model ) ->
            model
                |> Page.Search.update msg
                |> mapPageModel PageSearch searchPageEmissionToCmd

        ( PageMsgSearchResult msg, PageSearchResult model ) ->
            model
                |> Page.SearchResult.update msg
                |> mapPageModel PageSearchResult searchResultPageEmissionToCmd

        ( PageMsgNotification msg, PageNotification model ) ->
            model
                |> Page.Notification.update msg
                |> mapPageModel PageNotification notificationEmissionToCmd

        ( PageMsgUser msg, PageUser model ) ->
            model
                |> Page.User.update msg
                |> mapPageModel PageUser userPageEmissionToCmd

        ( PageMsgProduct msg, PageProduct model ) ->
            model
                |> Page.Product.update msg
                |> mapPageModel PageProduct (productPageEmissionToCmd rec.key)

        ( PageMsgTrade msg, PageTrade model ) ->
            model
                |> Page.Trade.update msg
                |> mapPageModel PageTrade tradePageEmissionToCmd

        ( _, _ ) ->
            ( rec.page, Cmd.none )


mapPageModel :
    (eachPageModel -> PageModel)
    -> (eachPageEmission -> Cmd Msg)
    -> ( eachPageModel, List eachPageEmission )
    -> ( PageModel, Cmd Msg )
mapPageModel modelFunc emissionListFunc ( eachPageMsg, eachPageEmissionList ) =
    ( modelFunc eachPageMsg
    , eachPageEmissionList |> List.map emissionListFunc |> Cmd.batch
    )



{- ===================== Page Emission To Msg ======================== -}


homePageEmissionToCmd : Page.Home.Emission -> Cmd Msg
homePageEmissionToCmd emission =
    case emission of
        Page.Home.EmissionGetRecentProducts ->
            Api.getRecentProductList (Page.Home.GetRecentProductsResponse >> PageMsgHome >> PageMsg)

        Page.Home.EmissionGetRecommendProducts ->
            Api.getRecommendProductList (Page.Home.GetRecommendProductsResponse >> PageMsgHome >> PageMsg)

        Page.Home.EmissionGetFreeProducts ->
            Api.getFreeProductList (Page.Home.GetFreeProductsResponse >> PageMsgHome >> PageMsg)

        Page.Home.EmissionProducts e ->
            productListEmissionToCmd e

        Page.Home.EmissionAddLogMessage log ->
            Task.succeed ()
                |> Task.perform (always (AddLogMessage log))


likedProductsEmissionToCmd : Page.LikedProducts.Emission -> Cmd Msg
likedProductsEmissionToCmd emission =
    case emission of
        Page.LikedProducts.EmissionGetLikedProducts token ->
            Api.getLikedProducts token
                (Page.LikedProducts.GetProductsResponse >> PageMsgLikedProducts >> PageMsg)

        Page.LikedProducts.EmissionByLogIn e ->
            logInEmissionToCmd e

        Page.LikedProducts.EmissionByProductList e ->
            productListEmissionToCmd e

        Page.LikedProducts.EmissionAddLogMessage log ->
            Task.succeed ()
                |> Task.perform (always (AddLogMessage log))


historyEmissionToCmd : Page.History.Emission -> Cmd Msg
historyEmissionToCmd emission =
    case emission of
        Page.History.EmissionGetHistoryProducts token ->
            Api.getHistoryViewProducts token (Page.History.GetProductsResponse >> PageMsgHistory >> PageMsg)

        Page.History.EmissionByLogIn e ->
            logInEmissionToCmd e

        Page.History.EmissionByProductList e ->
            productListEmissionToCmd e

        Page.History.EmissionAddLogMessage log ->
            Task.succeed ()
                |> Task.perform (always (AddLogMessage log))


soldProductsPageEmissionToCmd : Page.SoldProducts.Emission -> Cmd Msg
soldProductsPageEmissionToCmd emission =
    case emission of
        Page.SoldProducts.EmissionGetSoldProducts userId ->
            Api.getSoldProductList userId
                (Page.SoldProducts.GetSoldProductListResponse >> PageMsgSoldProducts >> PageMsg)

        Page.SoldProducts.EmissionByProductList e ->
            productListEmissionToCmd e

        Page.SoldProducts.EmissionAddLogMessage log ->
            Task.succeed ()
                |> Task.perform (always (AddLogMessage log))


boughtProductsPageEmissionToCmd : Page.BoughtProducts.Emission -> Cmd Msg
boughtProductsPageEmissionToCmd emission =
    case emission of
        Page.BoughtProducts.EmissionGetPurchaseProducts token ->
            Api.getBoughtProductList token
                (Page.BoughtProducts.GetProductsResponse >> PageMsgBoughtProducts >> PageMsg)

        Page.BoughtProducts.EmissionByLogIn e ->
            logInEmissionToCmd e

        Page.BoughtProducts.EmissionByProductList e ->
            productListEmissionToCmd e

        Page.BoughtProducts.EmissionAddLogMessage log ->
            Task.succeed ()
                |> Task.perform (always (AddLogMessage log))


tradingProductsEmissionToCmd : Page.TradesInProgress.Emission -> Cmd Msg
tradingProductsEmissionToCmd emission =
    case emission of
        Page.TradesInProgress.EmissionGetTradingProducts token ->
            Api.getTradingProductList token
                (Page.TradesInProgress.GetProductsResponse >> PageMsgTradesInProgress >> PageMsg)

        Page.TradesInProgress.EmissionByLogIn e ->
            logInEmissionToCmd e

        Page.TradesInProgress.EmissionAddLogMessage log ->
            Task.succeed ()
                |> Task.perform (always (AddLogMessage log))


tradedProductsEmissionToCmd : Page.TradesInPast.Emission -> Cmd Msg
tradedProductsEmissionToCmd emission =
    case emission of
        Page.TradesInPast.EmissionGetTradedProducts token ->
            Api.getTradedProductList token
                (Page.TradesInPast.GetTradesResponse >> PageMsgTradesInPast >> PageMsg)

        Page.TradesInPast.EmissionByLogIn e ->
            logInEmissionToCmd e

        Page.TradesInPast.EmissionAddLogMessage log ->
            Task.succeed ()
                |> Task.perform (always (AddLogMessage log))


commentedProductsEmissionToCmd : Page.CommentedProducts.Emission -> Cmd Msg
commentedProductsEmissionToCmd emission =
    case emission of
        Page.CommentedProducts.EmissionGetCommentedProducts token ->
            Api.getCommentedProductList token
                (Page.CommentedProducts.GetProductsResponse >> PageMsgCommentedProducts >> PageMsg)

        Page.CommentedProducts.EmissionByLogIn e ->
            logInEmissionToCmd e

        Page.CommentedProducts.EmissionByProductList e ->
            productListEmissionToCmd e

        Page.CommentedProducts.EmissionAddLogMessage log ->
            Task.succeed ()
                |> Task.perform (always (AddLogMessage log))


logInPageEmissionToCmd : Browser.Navigation.Key -> Page.LogIn.Emission -> Cmd Msg
logInPageEmissionToCmd key emission =
    case emission of
        Page.LogIn.LogInOrSignUpEmission e ->
            logInEmissionToCmd e

        Page.LogIn.EmissionPageToHome ->
            Browser.Navigation.pushUrl key (PageLocation.toUrlAsString PageLocation.Home)


exhibitionPageEmissionToCmd : Page.Exhibition.Emission -> Cmd Msg
exhibitionPageEmissionToCmd emission =
    case emission of
        Page.Exhibition.EmissionLogInOrSignUp e ->
            logInEmissionToCmd e

        Page.Exhibition.EmissionSellProducts ( token, request ) ->
            Api.sellProduct request token SellProductResponse

        Page.Exhibition.EmissionByProductEditor e ->
            productEditorEmissionToCmd e


searchPageEmissionToCmd : Page.Search.Emission -> Cmd Msg
searchPageEmissionToCmd emission =
    case emission of
        Page.Search.EmissionReplaceElementText idAndText ->
            replaceText idAndText

        Page.Search.EmissionByCategory e ->
            categoryEmissionToCmd e


searchResultPageEmissionToCmd : Page.SearchResult.Command -> Cmd Msg
searchResultPageEmissionToCmd command =
    case command of
        Page.SearchResult.SearchProducts condition ->
            Api.searchProducts condition (Page.SearchResult.SearchProductsResponse >> PageMsgSearchResult >> PageMsg)

        Page.SearchResult.CommandByProductList emission ->
            productListEmissionToCmd emission


notificationEmissionToCmd : Page.Notification.Emission -> Cmd Msg
notificationEmissionToCmd emission =
    case emission of
        Page.Notification.Emission ->
            Cmd.none


userPageEmissionToCmd : Page.User.Emission -> Cmd Msg
userPageEmissionToCmd emission =
    case emission of
        Page.User.EmissionChangeProfile token profile ->
            Api.updateProfile profile token ChangeProfileResponse

        Page.User.EmissionReplaceElementText idAndText ->
            replaceText idAndText

        Page.User.EmissionByUniversity e ->
            universityEmissionToCmd e

        Page.User.EmissionLogOut ->
            Cmd.batch
                [ deleteAllFromLocalStorage ()
                , Task.perform (always LogOut) (Task.succeed ())
                ]

        Page.User.EmissionGetUserProfile userId ->
            Api.getUserProfile userId
                (Page.User.MsgUserProfileResponse >> PageMsgUser >> PageMsg)

        Page.User.EmissionAddLogMessage log ->
            Task.succeed ()
                |> Task.perform (always (AddLogMessage log))


productPageEmissionToCmd : Browser.Navigation.Key -> Page.Product.Emission -> Cmd Msg
productPageEmissionToCmd key emission =
    case emission of
        Page.Product.EmissionGetProduct { productId } ->
            Api.getProduct productId
                (Page.Product.GetProductResponse >> PageMsgProduct >> PageMsg)

        Page.Product.EmissionGetProductAndMarkHistory { productId, token } ->
            Api.markProductInHistory
                productId
                token
                (Page.Product.GetProductResponse >> PageMsgProduct >> PageMsg)

        Page.Product.EmissionGetCommentList { productId } ->
            Api.getProductComments productId (Page.Product.GetCommentListResponse >> PageMsgProduct >> PageMsg)

        Page.Product.EmissionAddComment token { productId } comment ->
            Api.addProductComment
                productId
                comment
                token
                (Page.Product.GetCommentListResponse >> PageMsgProduct >> PageMsg)

        Page.Product.EmissionLike token id ->
            Api.likeProduct id token (LikeProductResponse id)

        Page.Product.EmissionUnLike token id ->
            Api.unlikeProduct id token (UnlikeProductResponse id)

        Page.Product.EmissionTradeStart token id ->
            Api.startTrade id token (Page.Product.TradeStartResponse >> PageMsgProduct >> PageMsg)

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

        Page.Product.EmissionJumpToTradePage trade ->
            Browser.Navigation.pushUrl key (PageLocation.toUrlAsString (PageLocation.Trade (Data.Trade.getId trade)))

        Page.Product.EmissionByProductEditor e ->
            productEditorEmissionToCmd e

        Page.Product.EmissionUpdateProductData token productId requestData ->
            Api.updateProduct token
                productId
                requestData
                (Page.Product.UpdateProductDataResponse >> PageMsgProduct >> PageMsg)

        Page.Product.EmissionReplaceElementText idAndText ->
            replaceText idAndText


tradePageEmissionToCmd : Page.Trade.Emission -> Cmd Msg
tradePageEmissionToCmd emission =
    case emission of
        Page.Trade.EmissionUpdateNowTime ->
            Task.map2
                Tuple.pair
                Time.now
                Time.here
                |> Task.attempt GetNowTime

        Page.Trade.EmissionGetTradeDetail token id ->
            Api.getTradeDetail id token (Page.Trade.TradeDetailResponse >> PageMsgTrade >> PageMsg)

        Page.Trade.EmissionAddComment token id string ->
            Api.addTradeComment id string token (Page.Trade.AddCommentResponse >> PageMsgTrade >> PageMsg)

        Page.Trade.EmissionAddLogMessage log ->
            Task.succeed ()
                |> Task.perform (always (AddLogMessage log))

        Page.Trade.EmissionReplaceElementText idAndText ->
            replaceText idAndText

        Page.Trade.EmissionFinishTrade token id ->
            Api.finishTrade id token (Page.Trade.FinishTradeResponse >> PageMsgTrade >> PageMsg)

        Page.Trade.EmissionCancelTrade token id ->
            Api.cancelTrade id token (Page.Trade.CancelTradeResponse >> PageMsgTrade >> PageMsg)



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
            Api.likeProduct id token (LikeProductResponse id)

        Page.Component.ProductList.EmissionUnlike token id ->
            Api.unlikeProduct id token (UnlikeProductResponse id)

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

        Page.Component.ProductEditor.EmissionByCategory e ->
            categoryEmissionToCmd e


categoryEmissionToCmd : Page.Component.Category.Emission -> Cmd Msg
categoryEmissionToCmd emission =
    case emission of
        Page.Component.Category.EmissionChangeSelectedIndex { id, index } ->
            changeSelectedIndex { id = id, index = index }


urlParser : Model -> Url.Url -> ( Model, Cmd Msg )
urlParser (Model rec) url =
    let
        ( page, emissions ) =
            case PageLocation.fromUrl url of
                Just urlParserResult ->
                    urlParserResultToPageAndCmd (Model rec) urlParserResult

                Nothing ->
                    pageNotFound
    in
    ( Model { rec | page = page }, emissions )


pageNotFound : ( PageModel, Cmd Msg )
pageNotFound =
    Page.Home.initModel Nothing
        |> mapPageModel PageHome homePageEmissionToCmd
        |> Tuple.mapSecond
            (\c ->
                Cmd.batch
                    [ c
                    , Task.perform identity
                        (Task.succeed
                            (AddLogMessage "指定したページが見つからないのでホームに移動しました")
                        )
                    ]
            )


urlParserResultToPageAndCmd : Model -> PageLocation.PageLocation -> ( PageModel, Cmd Msg )
urlParserResultToPageAndCmd (Model rec) result =
    case result of
        PageLocation.Home ->
            Page.Home.initModel (getProductId rec.page)
                |> mapPageModel PageHome homePageEmissionToCmd

        PageLocation.LogIn ->
            Page.LogIn.initModel
                |> mapPageModel PageLogIn (logInPageEmissionToCmd rec.key)

        PageLocation.LikedProducts ->
            Page.LikedProducts.initModel (getProductId rec.page) rec.logInState
                |> mapPageModel PageLikedProducts likedProductsEmissionToCmd

        PageLocation.History ->
            Page.History.initModel (getProductId rec.page) rec.logInState
                |> mapPageModel PageHistory historyEmissionToCmd

        PageLocation.SoldProducts userId ->
            Page.SoldProducts.initModel userId (getProductId rec.page)
                |> mapPageModel PageSoldProducts soldProductsPageEmissionToCmd

        PageLocation.BoughtProducts ->
            Page.BoughtProducts.initModel (getProductId rec.page) rec.logInState
                |> mapPageModel PageBoughtProducts boughtProductsPageEmissionToCmd

        PageLocation.TradingProducts ->
            Page.TradesInProgress.initModel (getProductId rec.page) rec.logInState
                |> mapPageModel PageTradesInProgress tradingProductsEmissionToCmd

        PageLocation.TradedProducts ->
            Page.TradesInPast.initModel (getProductId rec.page) rec.logInState
                |> mapPageModel PageTradesInPast tradedProductsEmissionToCmd

        PageLocation.CommentedProducts ->
            Page.CommentedProducts.initModel (getProductId rec.page) rec.logInState
                |> mapPageModel PageCommentedProducts commentedProductsEmissionToCmd

        PageLocation.Exhibition ->
            case rec.page of
                PageExhibition exhibitionModel ->
                    exhibitionModel
                        |> Page.Exhibition.update rec.logInState Page.Exhibition.BackToEditPage
                        |> mapPageModel PageExhibition exhibitionPageEmissionToCmd

                _ ->
                    Page.Exhibition.initModel
                        |> mapPageModel PageExhibition exhibitionPageEmissionToCmd

        PageLocation.ExhibitionConfirm ->
            case rec.page of
                PageExhibition pageModel ->
                    case Page.Exhibition.toConfirmPageMsgFromModel rec.logInState pageModel of
                        Just msg ->
                            pageModel
                                |> Page.Exhibition.update rec.logInState msg
                                |> mapPageModel PageExhibition exhibitionPageEmissionToCmd

                        Nothing ->
                            ( PageExhibition pageModel, Cmd.none )

                _ ->
                    ( rec.page, Cmd.none )

        PageLocation.Product productId ->
            (case getProductFromPage productId rec.page of
                Just product ->
                    Page.Product.initModelFromProduct rec.logInState product

                Nothing ->
                    Page.Product.initModel rec.logInState productId
            )
                |> mapPageModel PageProduct (productPageEmissionToCmd rec.key)

        PageLocation.Trade tradeId ->
            (case getTradeFromPage tradeId rec.page of
                Just trade ->
                    Page.Trade.initModelFromTrade rec.logInState trade

                Nothing ->
                    Page.Trade.initModelFromId rec.logInState tradeId
            )
                |> mapPageModel PageTrade tradePageEmissionToCmd

        PageLocation.User userId ->
            (case getUserFromPage userId rec.page of
                Just userWithName ->
                    Page.User.initModelWithName userWithName

                Nothing ->
                    Page.User.initModelFromId rec.logInState userId
            )
                |> mapPageModel PageUser userPageEmissionToCmd

        PageLocation.Search ->
            Page.Search.initModel
                |> mapPageModel PageSearch searchPageEmissionToCmd

        PageLocation.SearchResult condition ->
            Page.SearchResult.initModel (getProductId rec.page) condition
                |> mapPageModel PageSearchResult searchResultPageEmissionToCmd

        PageLocation.Notification ->
            Page.Notification.initModel
                |> mapPageModel PageNotification notificationEmissionToCmd

        PageLocation.About ->
            ( PageAbout Page.About.aboutModel, Cmd.none )

        PageLocation.AboutPrivacyPolicy ->
            ( PageAbout Page.About.privacyPolicyModel, Cmd.none )


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

        PageTradesInProgress model ->
            Page.TradesInProgress.getAllProducts model

        PageTradesInPast model ->
            Page.TradesInPast.getAllProducts model

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


getTradeFromPage : Data.Trade.Id -> PageModel -> Maybe Data.Trade.Trade
getTradeFromPage tradeId pageModel =
    (case pageModel of
        PageTradesInProgress model ->
            Page.TradesInProgress.getAllTrades model

        PageTradesInPast model ->
            Page.TradesInPast.getAllTrades model

        _ ->
            []
    )
        |> Data.Trade.searchFromId tradeId


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
updateLikedCountInEachPageProduct : Browser.Navigation.Key -> Data.Product.Id -> Result String Int -> PageModel -> ( PageModel, Cmd Msg )
updateLikedCountInEachPageProduct key productId result page =
    let
        productListMsg =
            Page.Component.ProductList.UpdateLikedCountResponse productId result
    in
    case page of
        PageHome msg ->
            msg
                |> Page.Home.update (Page.Home.MsgByProductList productListMsg)
                |> mapPageModel PageHome homePageEmissionToCmd

        PageLikedProducts msg ->
            msg
                |> Page.LikedProducts.update (Page.LikedProducts.MsgByProductList productListMsg)
                |> mapPageModel PageLikedProducts likedProductsEmissionToCmd

        PageHistory msg ->
            msg
                |> Page.History.update (Page.History.MsgByProductList productListMsg)
                |> mapPageModel PageHistory historyEmissionToCmd

        PageSoldProducts msg ->
            msg
                |> Page.SoldProducts.update (Page.SoldProducts.MsgByProductList productListMsg)
                |> mapPageModel PageSoldProducts soldProductsPageEmissionToCmd

        PageBoughtProducts msg ->
            msg
                |> Page.BoughtProducts.update (Page.BoughtProducts.MsgByProductList productListMsg)
                |> mapPageModel PageBoughtProducts boughtProductsPageEmissionToCmd

        PageProduct msg ->
            msg
                |> Page.Product.update (Page.Product.LikeResponse result)
                |> mapPageModel PageProduct (productPageEmissionToCmd key)

        _ ->
            ( page
            , Cmd.none
            )



{- ============================ View ============================= -}


{-| 見た目を決める
-}
view : Model -> { title : String, body : List (Html.Styled.Html Msg) }
view (Model { page, wideScreen, message, logInState, now }) =
    let
        { title, tab, html, bottomNavigation } =
            titleAndTabDataAndMainView logInState wideScreen now page
    in
    { title = title
    , body =
        [ BasicParts.headerWithBackArrow
            |> Html.Styled.map (always HistoryBack)
        ]
            ++ (if wideScreen then
                    [ BasicParts.menu logInState ]

                else
                    []
               )
            ++ [ BasicParts.tabView wideScreen tab |> Html.Styled.map PageMsg
               , Html.Styled.div
                    [ Html.Styled.Attributes.css
                        [ mainViewPaddingStyle tab wideScreen
                        , Css.property "word-wrap" "break-word"
                        , Css.overflowX Css.hidden
                        , Css.width (Css.pct 100)
                        ]
                    ]
                    html
                    |> Html.Styled.map PageMsg
               ]
            ++ (case message of
                    Just m ->
                        [ Html.Styled.Keyed.node "div" [] [ ( m, messageView m ) ] ]

                    Nothing ->
                        []
               )
            ++ (case ( wideScreen, bottomNavigation ) of
                    ( False, Just select ) ->
                        [ BasicParts.bottomNavigation logInState select ]

                    ( _, _ ) ->
                        []
               )
    }


mainViewPaddingStyle : BasicParts.Tab msg -> Bool -> Css.Style
mainViewPaddingStyle tab wideScreen =
    let
        paddingTop =
            (if BasicParts.isTabNone tab then
                64

             else
                112
            )
                |> Css.px
    in
    if wideScreen then
        Css.padding4
            paddingTop
            Css.zero
            Css.zero
            (Css.px 320)

    else
        Css.padding4
            paddingTop
            Css.zero
            (Css.px 64)
            Css.zero


titleAndTabDataAndMainView :
    Data.LogInState.LogInState
    -> Bool
    -> Maybe ( Time.Posix, Time.Zone )
    -> PageModel
    ->
        { title : String
        , tab : BasicParts.Tab PageMsg
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        , html : List (Html.Styled.Html PageMsg)
        }
titleAndTabDataAndMainView logInState isWideScreen nowMaybe page =
    case page of
        PageHome model ->
            model
                |> Page.Home.view logInState isWideScreen
                |> mapPageMsg PageMsgHome

        PageLikedProducts model ->
            model
                |> Page.LikedProducts.view logInState isWideScreen
                |> mapPageMsg PageMsgLikedProducts

        PageHistory model ->
            model
                |> Page.History.view logInState isWideScreen
                |> mapPageMsg PageMsgHistory

        PageBoughtProducts model ->
            model
                |> Page.BoughtProducts.view logInState isWideScreen
                |> mapPageMsg PageMsgBoughtProducts

        PageSoldProducts model ->
            model
                |> Page.SoldProducts.view logInState isWideScreen
                |> mapPageMsg PageMsgSoldProducts

        PageTradesInProgress model ->
            model
                |> Page.TradesInProgress.view logInState
                |> mapPageMsg PageMsgTradesInProgress

        PageTradesInPast model ->
            model
                |> Page.TradesInPast.view logInState
                |> mapPageMsg PageMsgTradesInPast

        PageCommentedProducts model ->
            model
                |> Page.CommentedProducts.view logInState isWideScreen
                |> mapPageMsg PageMsgCommentedProducts

        PageExhibition model ->
            model
                |> Page.Exhibition.view logInState
                |> mapPageMsg PageMsgExhibition

        PageLogIn model ->
            model
                |> Page.LogIn.view
                |> mapPageMsg PageMsgLogIn

        PageProduct model ->
            model
                |> Page.Product.view logInState isWideScreen nowMaybe
                |> mapPageMsg PageMsgProduct

        PageTrade model ->
            model
                |> Page.Trade.view logInState nowMaybe
                |> mapPageMsg PageMsgTrade

        PageUser model ->
            model
                |> Page.User.view logInState isWideScreen
                |> mapPageMsg PageMsgUser

        PageSearch model ->
            model
                |> Page.Search.view
                |> mapPageMsg PageMsgSearch

        PageSearchResult model ->
            model
                |> Page.SearchResult.view logInState isWideScreen
                |> mapPageMsg PageMsgSearchResult

        PageNotification model ->
            model
                |> Page.Notification.view
                |> mapPageMsg PageMsgNotification

        PageAbout model ->
            model
                |> Page.About.view


mapPageMsg :
    (eachPageMsg -> PageMsg)
    ->
        { title : Maybe String
        , tab : BasicParts.Tab eachPageMsg
        , html : List (Html.Styled.Html eachPageMsg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
    ->
        { title : String
        , tab : BasicParts.Tab PageMsg
        , html : List (Html.Styled.Html PageMsg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
mapPageMsg f { title, tab, html, bottomNavigation } =
    { title =
        case title of
            Just titleText ->
                titleText ++ " | つくマート"

            Nothing ->
                "つくマート"
    , tab = tab |> BasicParts.tabMap f
    , html = html |> List.map (Html.Styled.map f)
    , bottomNavigation = bottomNavigation
    }


messageView : String -> Html.Styled.Html msg
messageView message =
    Html.Styled.div
        [ Html.Styled.Attributes.css
            [ Css.position Css.fixed
            , Css.top (Css.px 128)
            , Css.left (Css.pct 10)
            , Css.width (Css.pct 80)
            , Css.textAlign Css.center
            , Css.zIndex (Css.int 2)
            , Css.backgroundColor (Css.rgb 221 221 221)
            , Css.color (Css.rgb 17 17 17)
            , Css.border3 (Css.px 2) Css.solid (Css.rgb 17 17 17)
            , Css.borderRadius (Css.px 8)
            , Css.fontSize (Css.rem 1.3)
            , Css.padding (Css.px 32)
            , Css.pointerEvents Css.none
            , Css.animationName
                (Css.Animations.keyframes
                    [ ( 0, [ Css.Animations.opacity (Css.num 1) ] )
                    , ( 100, [ Css.Animations.opacity (Css.num 0) ] )
                    ]
                )
            , Css.animationDuration (Css.sec 2)
            , Css.animationDelay (Css.sec 4)
            , Css.animationIterationCount (Css.int 1)
            , Css.property "animation-fill-mode" "forwards"
            , Css.maxWidth (Css.pct 100)
            , Css.boxSizing Css.borderBox
            , Css.property "word-break" "break-word"
            ]
        ]
        [ Html.Styled.text message ]


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
