port module Main exposing (main)

import Api
import BasicParts
import Browser
import Browser.Navigation
import Component.Category
import Component.GraduateSelect
import Component.LogIn
import Component.ProductEditor
import Component.ProductList
import Component.SchoolSelect
import Component.University
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
import Utility


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


port startListenRecommendProducts : () -> Cmd msg


port receiveAllProducts : (List Data.Product.Firestore -> msg) -> Sub msg


type Model
    = Model
        { page : PageModel -- 開いているページ
        , allProducts : Maybe (List Data.Product.Product)
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
    | LikeProductResponse Data.Product.Id (Result String Int)
    | UnlikeProductResponse Data.Product.Id (Result String Int)
    | ChangeProfileResponse (Result String Data.User.WithProfile)
    | HistoryBack
    | PageMsg PageMsg
    | GetNowTime (Result () ( Time.Posix, Time.Zone ))
    | Jump (Result String Url.Url)
    | UpdateProducts (List Data.Product.Firestore)


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
        , allProducts = Nothing
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
               , startListenRecommendProducts ()
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
                |> mapPageModel PageHome homePageCmdToCmd

        PageLocation.InitLogIn ->
            Page.LogIn.initModel
                |> mapPageModel PageLogIn (logInPageCmdToCmd key)

        PageLocation.InitLikedProducts ->
            Page.LikedProducts.initModel Nothing logInState
                |> mapPageModel PageLikedProducts likedProductsCmdToCmd

        PageLocation.InitHistory ->
            Page.History.initModel Nothing logInState
                |> mapPageModel PageHistory historyCmdToCmd

        PageLocation.InitSoldProducts userId ->
            Page.SoldProducts.initModel userId Nothing
                |> mapPageModel PageSoldProducts soldProductsPageCmdToCmd

        PageLocation.InitBoughtProducts ->
            Page.BoughtProducts.initModel Nothing logInState
                |> mapPageModel PageBoughtProducts boughtProductsPageCmdToCmd

        PageLocation.InitTradingProducts ->
            Page.TradesInProgress.initModel Nothing logInState
                |> mapPageModel PageTradesInProgress tradingProductsCmdToCmd

        PageLocation.InitTradedProducts ->
            Page.TradesInPast.initModel Nothing logInState
                |> mapPageModel PageTradesInPast tradedProductsCmdToCmd

        PageLocation.InitCommentedProducts ->
            Page.CommentedProducts.initModel Nothing logInState
                |> mapPageModel PageCommentedProducts commentedProductsCmdToCmd

        PageLocation.InitExhibition ->
            Page.Exhibition.initModel
                |> mapPageModel PageExhibition (exhibitionPageCmdToCmd key)

        PageLocation.InitProduct productId ->
            Page.Product.initModel logInState productId
                |> mapPageModel PageProduct (productPageCmdToCmd key)

        PageLocation.InitTrade tradeId ->
            Page.Trade.initModelFromId logInState tradeId
                |> mapPageModel PageTrade tradePageCmdToCmd

        PageLocation.InitUser userId ->
            Page.User.initModelFromId logInState userId
                |> mapPageModel PageUser userPageCmdToCmd

        PageLocation.InitSearch ->
            Page.Search.initModel
                |> mapPageModel PageSearch searchPageCmdToCmd

        PageLocation.InitSearchResult condition ->
            Page.SearchResult.initModel Nothing condition
                |> mapPageModel PageSearchResult searchResultPageCmdToCmd

        PageLocation.InitNotification ->
            Page.Notification.initModel
                |> mapPageModel PageNotification notificationCmdToCmd

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
                        ( newModel, cmds ) =
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
                            ++ List.map homePageCmdToCmd cmds
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
                        ( newModel, cmds ) =
                            Page.Exhibition.update
                                rec.logInState
                                (Page.Exhibition.MsgByProductEditor
                                    (Component.ProductEditor.InputImageList dataUrlList)
                                )
                                exhibitionPageModel
                    in
                    ( Model { rec | page = PageExhibition newModel }
                    , cmds |> List.map (exhibitionPageCmdToCmd rec.key) |> Cmd.batch
                    )

                PageProduct productPageModel ->
                    let
                        ( newModel, cmds ) =
                            Page.Product.update
                                (Page.Product.MsgByProductEditor
                                    (Component.ProductEditor.InputImageList dataUrlList)
                                )
                                productPageModel
                    in
                    ( Model { rec | page = PageProduct newModel }
                    , cmds |> List.map (productPageCmdToCmd rec.key) |> Cmd.batch
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
                                ( newModel, cmds ) =
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
                            , cmds |> List.map userPageCmdToCmd |> Cmd.batch
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

        Jump result ->
            case result of
                Ok url ->
                    ( Model rec
                    , Browser.Navigation.load (Url.toString url)
                    )

                Err string ->
                    ( Model
                        { rec | message = Just ("URL取得に失敗した " ++ string) }
                    , Cmd.none
                    )

        UpdateProducts products ->
            case products |> List.map Data.Product.fromFirestore |> Utility.sequenceMaybeList of
                Just allProducts ->
                    ( Model { rec | allProducts = Just allProducts }
                    , Cmd.none
                    )

                Nothing ->
                    ( Model rec
                    , Task.succeed ()
                        |> Task.perform (always (AddLogMessage "FireStoreから取得した商品データの型が合わない"))
                    )


updatePageMsg : PageMsg -> Model -> ( PageModel, Cmd Msg )
updatePageMsg pageMsg (Model rec) =
    case ( pageMsg, rec.page ) of
        ( PageMsgHome msg, PageHome model ) ->
            model
                |> Page.Home.update msg
                |> mapPageModel PageHome homePageCmdToCmd

        ( PageMsgLikedProducts msg, PageLikedProducts model ) ->
            model
                |> Page.LikedProducts.update msg
                |> mapPageModel PageLikedProducts likedProductsCmdToCmd

        ( PageMsgHistory msg, PageHistory model ) ->
            model
                |> Page.History.update msg
                |> mapPageModel PageHistory historyCmdToCmd

        ( PageMsgSoldProducts msg, PageSoldProducts model ) ->
            model
                |> Page.SoldProducts.update msg
                |> mapPageModel PageSoldProducts soldProductsPageCmdToCmd

        ( PageMsgBoughtProducts msg, PageBoughtProducts model ) ->
            model
                |> Page.BoughtProducts.update msg
                |> mapPageModel PageBoughtProducts boughtProductsPageCmdToCmd

        ( PageMsgTradesInProgress msg, PageTradesInProgress model ) ->
            model
                |> Page.TradesInProgress.update msg
                |> mapPageModel PageTradesInProgress tradingProductsCmdToCmd

        ( PageMsgTradesInPast msg, PageTradesInPast model ) ->
            model
                |> Page.TradesInPast.update msg
                |> mapPageModel PageTradesInPast tradedProductsCmdToCmd

        ( PageMsgCommentedProducts msg, PageCommentedProducts model ) ->
            model
                |> Page.CommentedProducts.update msg
                |> mapPageModel PageCommentedProducts commentedProductsCmdToCmd

        ( PageMsgLogIn msg, PageLogIn model ) ->
            model
                |> Page.LogIn.update msg
                |> mapPageModel PageLogIn (logInPageCmdToCmd rec.key)

        ( PageMsgExhibition msg, PageExhibition model ) ->
            model
                |> Page.Exhibition.update rec.logInState msg
                |> mapPageModel PageExhibition (exhibitionPageCmdToCmd rec.key)

        ( PageMsgSearch msg, PageSearch model ) ->
            model
                |> Page.Search.update msg
                |> mapPageModel PageSearch searchPageCmdToCmd

        ( PageMsgSearchResult msg, PageSearchResult model ) ->
            model
                |> Page.SearchResult.update msg
                |> mapPageModel PageSearchResult searchResultPageCmdToCmd

        ( PageMsgNotification msg, PageNotification model ) ->
            model
                |> Page.Notification.update msg
                |> mapPageModel PageNotification notificationCmdToCmd

        ( PageMsgUser msg, PageUser model ) ->
            model
                |> Page.User.update msg
                |> mapPageModel PageUser userPageCmdToCmd

        ( PageMsgProduct msg, PageProduct model ) ->
            model
                |> Page.Product.update msg
                |> mapPageModel PageProduct (productPageCmdToCmd rec.key)

        ( PageMsgTrade msg, PageTrade model ) ->
            model
                |> Page.Trade.update msg
                |> mapPageModel PageTrade tradePageCmdToCmd

        ( _, _ ) ->
            ( rec.page, Cmd.none )


mapPageModel :
    (eachPageModel -> PageModel)
    -> (eachPageCmd -> Cmd Msg)
    -> ( eachPageModel, List eachPageCmd )
    -> ( PageModel, Cmd Msg )
mapPageModel modelFunc cmdListFunc ( eachPageMsg, eachPageCmdList ) =
    ( modelFunc eachPageMsg
    , eachPageCmdList |> List.map cmdListFunc |> Cmd.batch
    )



{- ===================== Page Cmd To Msg ======================== -}


homePageCmdToCmd : Page.Home.Cmd -> Cmd Msg
homePageCmdToCmd cmd =
    case cmd of
        Page.Home.CmdProducts e ->
            productListCmdToCmd e

        Page.Home.CmdAddLogMessage log ->
            Task.succeed ()
                |> Task.perform (always (AddLogMessage log))


likedProductsCmdToCmd : Page.LikedProducts.Cmd -> Cmd Msg
likedProductsCmdToCmd cmd =
    case cmd of
        Page.LikedProducts.CmdGetLikedProducts token ->
            Api.getLikedProducts token
                (Page.LikedProducts.GetProductsResponse >> PageMsgLikedProducts >> PageMsg)

        Page.LikedProducts.CmdByLogIn e ->
            logInCmdToCmd e

        Page.LikedProducts.CmdByProductList e ->
            productListCmdToCmd e

        Page.LikedProducts.CmdAddLogMessage log ->
            Task.succeed ()
                |> Task.perform (always (AddLogMessage log))


historyCmdToCmd : Page.History.Cmd -> Cmd Msg
historyCmdToCmd cmd =
    case cmd of
        Page.History.CmdGetHistoryProducts token ->
            Api.getHistoryViewProducts token (Page.History.GetProductsResponse >> PageMsgHistory >> PageMsg)

        Page.History.CmdByLogIn e ->
            logInCmdToCmd e

        Page.History.CmdByProductList e ->
            productListCmdToCmd e

        Page.History.CmdAddLogMessage log ->
            Task.succeed ()
                |> Task.perform (always (AddLogMessage log))


soldProductsPageCmdToCmd : Page.SoldProducts.Cmd -> Cmd Msg
soldProductsPageCmdToCmd cmd =
    case cmd of
        Page.SoldProducts.CmdGetSoldProducts userId ->
            Api.getSoldProductList userId
                (Page.SoldProducts.GetSoldProductListResponse >> PageMsgSoldProducts >> PageMsg)

        Page.SoldProducts.CmdByProductList e ->
            productListCmdToCmd e

        Page.SoldProducts.CmdAddLogMessage log ->
            Task.succeed ()
                |> Task.perform (always (AddLogMessage log))


boughtProductsPageCmdToCmd : Page.BoughtProducts.Cmd -> Cmd Msg
boughtProductsPageCmdToCmd cmd =
    case cmd of
        Page.BoughtProducts.CmdGetPurchaseProducts token ->
            Api.getBoughtProductList token
                (Page.BoughtProducts.GetProductsResponse >> PageMsgBoughtProducts >> PageMsg)

        Page.BoughtProducts.CmdByLogIn e ->
            logInCmdToCmd e

        Page.BoughtProducts.CmdByProductList e ->
            productListCmdToCmd e

        Page.BoughtProducts.CmdAddLogMessage log ->
            Task.succeed ()
                |> Task.perform (always (AddLogMessage log))


tradingProductsCmdToCmd : Page.TradesInProgress.Cmd -> Cmd Msg
tradingProductsCmdToCmd cmd =
    case cmd of
        Page.TradesInProgress.CmdGetTradingProducts token ->
            Api.getTradingProductList token
                (Page.TradesInProgress.GetProductsResponse >> PageMsgTradesInProgress >> PageMsg)

        Page.TradesInProgress.CmdByLogIn e ->
            logInCmdToCmd e

        Page.TradesInProgress.CmdAddLogMessage log ->
            Task.succeed ()
                |> Task.perform (always (AddLogMessage log))


tradedProductsCmdToCmd : Page.TradesInPast.Cmd -> Cmd Msg
tradedProductsCmdToCmd cmd =
    case cmd of
        Page.TradesInPast.CmdGetTradedProducts token ->
            Api.getTradedProductList token
                (Page.TradesInPast.GetTradesResponse >> PageMsgTradesInPast >> PageMsg)

        Page.TradesInPast.CmdByLogIn e ->
            logInCmdToCmd e

        Page.TradesInPast.CmdAddLogMessage log ->
            Task.succeed ()
                |> Task.perform (always (AddLogMessage log))


commentedProductsCmdToCmd : Page.CommentedProducts.Cmd -> Cmd Msg
commentedProductsCmdToCmd cmd =
    case cmd of
        Page.CommentedProducts.CmdGetCommentedProducts token ->
            Api.getCommentedProductList token
                (Page.CommentedProducts.GetProductsResponse >> PageMsgCommentedProducts >> PageMsg)

        Page.CommentedProducts.CmdByLogIn e ->
            logInCmdToCmd e

        Page.CommentedProducts.CmdByProductList e ->
            productListCmdToCmd e

        Page.CommentedProducts.CmdAddLogMessage log ->
            Task.succeed ()
                |> Task.perform (always (AddLogMessage log))


logInPageCmdToCmd : Browser.Navigation.Key -> Page.LogIn.Cmd -> Cmd Msg
logInPageCmdToCmd key cmd =
    case cmd of
        Page.LogIn.LogInOrSignUpCmd e ->
            logInCmdToCmd e

        Page.LogIn.CmdPageToHome ->
            Browser.Navigation.pushUrl key (PageLocation.toUrlAsString PageLocation.Home)


exhibitionPageCmdToCmd : Browser.Navigation.Key -> Page.Exhibition.Cmd -> Cmd Msg
exhibitionPageCmdToCmd key cmd =
    case cmd of
        Page.Exhibition.CmdLogInOrSignUp e ->
            logInCmdToCmd e

        Page.Exhibition.CmdSellProducts ( token, request ) ->
            Api.sellProduct request token (Page.Exhibition.SellProductResponse >> PageMsgExhibition >> PageMsg)

        Page.Exhibition.CmdByProductEditor e ->
            productEditorCmdToCmd e

        Page.Exhibition.CmdAddLogMessage log ->
            Task.succeed ()
                |> Task.perform (always (AddLogMessage log))

        Page.Exhibition.CmdJumpToHome ->
            Browser.Navigation.pushUrl key (PageLocation.toUrlAsString PageLocation.Home)


searchPageCmdToCmd : Page.Search.Cmd -> Cmd Msg
searchPageCmdToCmd cmd =
    case cmd of
        Page.Search.CmdReplaceElementText idAndText ->
            replaceText idAndText

        Page.Search.CmdByCategory e ->
            categoryCmdToCmd e

        Page.Search.CmdBySchoolSelect c ->
            schoolSelectCmdToCmd c

        Page.Search.CmdByGraduateSelect c ->
            graduateSelectCmdToCmd c


searchResultPageCmdToCmd : Page.SearchResult.Command -> Cmd Msg
searchResultPageCmdToCmd command =
    case command of
        Page.SearchResult.SearchProducts condition ->
            Api.searchProducts condition (Page.SearchResult.SearchProductsResponse >> PageMsgSearchResult >> PageMsg)

        Page.SearchResult.CommandByProductList cmd ->
            productListCmdToCmd cmd


notificationCmdToCmd : Page.Notification.Cmd -> Cmd Msg
notificationCmdToCmd cmd =
    case cmd of
        Page.Notification.Cmd ->
            Cmd.none


userPageCmdToCmd : Page.User.Cmd -> Cmd Msg
userPageCmdToCmd cmd =
    case cmd of
        Page.User.CmdChangeProfile token profile ->
            Api.updateProfile profile token ChangeProfileResponse

        Page.User.CmdReplaceElementText idAndText ->
            replaceText idAndText

        Page.User.CmdByUniversity e ->
            universityCmdToCmd e

        Page.User.CmdLogOut ->
            Cmd.batch
                [ deleteAllFromLocalStorage ()
                , Task.perform (always LogOut) (Task.succeed ())
                ]

        Page.User.CmdGetUserProfile userId ->
            Api.getUserProfile userId
                (Page.User.MsgUserProfileResponse >> PageMsgUser >> PageMsg)

        Page.User.CmdAddLogMessage log ->
            Task.succeed ()
                |> Task.perform (always (AddLogMessage log))

        Page.User.CmdJumpToLineNotifySetting token ->
            Api.getLineNotifyUrl token Jump


productPageCmdToCmd : Browser.Navigation.Key -> Page.Product.Cmd -> Cmd Msg
productPageCmdToCmd key cmd =
    case cmd of
        Page.Product.CmdGetProduct { productId } ->
            Api.getProduct productId
                (Page.Product.GetProductResponse >> PageMsgProduct >> PageMsg)

        Page.Product.CmdGetProductAndMarkHistory { productId, token } ->
            Api.markProductInHistory
                productId
                token
                (Page.Product.GetProductResponse >> PageMsgProduct >> PageMsg)

        Page.Product.CmdGetCommentList { productId } ->
            Api.getProductComments productId (Page.Product.GetCommentListResponse >> PageMsgProduct >> PageMsg)

        Page.Product.CmdAddComment token { productId } comment ->
            Api.addProductComment
                productId
                comment
                token
                (Page.Product.GetCommentListResponse >> PageMsgProduct >> PageMsg)

        Page.Product.CmdLike token id ->
            Api.likeProduct id token (LikeProductResponse id)

        Page.Product.CmdUnLike token id ->
            Api.unlikeProduct id token (UnlikeProductResponse id)

        Page.Product.CmdTradeStart token id ->
            Api.startTrade id token (Page.Product.TradeStartResponse >> PageMsgProduct >> PageMsg)

        Page.Product.CmdAddLogMessage log ->
            Task.succeed ()
                |> Task.perform (always (AddLogMessage log))

        Page.Product.CmdUpdateNowTime ->
            Task.map2
                Tuple.pair
                Time.now
                Time.here
                |> Task.attempt GetNowTime

        Page.Product.CmdDelete token productId ->
            Api.deleteProduct productId token (Page.Product.DeleteResponse >> PageMsgProduct >> PageMsg)

        Page.Product.CmdJumpToTradePage trade ->
            Browser.Navigation.pushUrl key (PageLocation.toUrlAsString (PageLocation.Trade (Data.Trade.getId trade)))

        Page.Product.CmdByProductEditor e ->
            productEditorCmdToCmd e

        Page.Product.CmdUpdateProductData token productId requestData ->
            Api.updateProduct
                productId
                requestData
                token
                (Page.Product.UpdateProductDataResponse >> PageMsgProduct >> PageMsg)

        Page.Product.CmdReplaceElementText idAndText ->
            replaceText idAndText

        Page.Product.CmdJumpToHome ->
            Browser.Navigation.load (PageLocation.toUrlAsString PageLocation.Home)


tradePageCmdToCmd : Page.Trade.Cmd -> Cmd Msg
tradePageCmdToCmd cmd =
    case cmd of
        Page.Trade.CmdUpdateNowTime ->
            Task.map2
                Tuple.pair
                Time.now
                Time.here
                |> Task.attempt GetNowTime

        Page.Trade.CmdGetTrade token id ->
            Api.getTradeDetail id token (Page.Trade.TradeResponse >> PageMsgTrade >> PageMsg)

        Page.Trade.CmdAddComment token id string ->
            Api.addTradeComment id string token (Page.Trade.AddCommentResponse >> PageMsgTrade >> PageMsg)

        Page.Trade.CmdAddLogMessage log ->
            Task.succeed ()
                |> Task.perform (always (AddLogMessage log))

        Page.Trade.CmdReplaceElementText idAndText ->
            replaceText idAndText

        Page.Trade.CmdFinishTrade token id ->
            Api.finishTrade id token (Page.Trade.FinishTradeResponse >> PageMsgTrade >> PageMsg)

        Page.Trade.CmdCancelTrade token id ->
            Api.cancelTrade id token (Page.Trade.CancelTradeResponse >> PageMsgTrade >> PageMsg)



{- ===================== Page Component Cmd To Msg ======================== -}


logInCmdToCmd : Component.LogIn.Cmd -> Cmd Msg
logInCmdToCmd cmd =
    case cmd of
        Component.LogIn.CmdLogInOrSignUp service ->
            Api.getLogInUrl service Jump


productListCmdToCmd : Component.ProductList.Cmd -> Cmd Msg
productListCmdToCmd cmd =
    case cmd of
        Component.ProductList.CmdLike token id ->
            Api.likeProduct id token (LikeProductResponse id)

        Component.ProductList.CmdUnlike token id ->
            Api.unlikeProduct id token (UnlikeProductResponse id)

        Component.ProductList.CmdScrollIntoView idString ->
            elementScrollIntoView idString


universityCmdToCmd : Component.University.Cmd -> Cmd Msg
universityCmdToCmd cmd =
    case cmd of
        Component.University.CmdChangeSelectedIndex { id, index } ->
            changeSelectedIndex { id = id, index = index }

        Component.University.CmdBySchoolSelect c ->
            schoolSelectCmdToCmd c

        Component.University.CmdByGraduateSelect c ->
            graduateSelectCmdToCmd c


schoolSelectCmdToCmd : Component.SchoolSelect.Cmd -> Cmd Msg
schoolSelectCmdToCmd cmd =
    case cmd of
        Component.SchoolSelect.CmdChangeSelectedIndex idAndIndex ->
            changeSelectedIndex idAndIndex


graduateSelectCmdToCmd : Component.GraduateSelect.Cmd -> Cmd Msg
graduateSelectCmdToCmd cmd =
    case cmd of
        Component.GraduateSelect.CmdChangeSelectedIndex idAndIndex ->
            changeSelectedIndex idAndIndex


productEditorCmdToCmd : Component.ProductEditor.Cmd -> Cmd Msg
productEditorCmdToCmd cmd =
    case cmd of
        Component.ProductEditor.CmdAddEventListenerForProductImages record ->
            addEventListenerForProductImages record

        Component.ProductEditor.CmdReplaceText { id, text } ->
            replaceText { id = id, text = text }

        Component.ProductEditor.CmdChangeSelectedIndex { id, index } ->
            changeSelectedIndex { id = id, index = index }

        Component.ProductEditor.CmdByCategory e ->
            categoryCmdToCmd e


categoryCmdToCmd : Component.Category.Cmd -> Cmd Msg
categoryCmdToCmd cmd =
    case cmd of
        Component.Category.CmdChangeSelectedIndex { id, index } ->
            changeSelectedIndex { id = id, index = index }


urlParser : Model -> Url.Url -> ( Model, Cmd Msg )
urlParser (Model rec) url =
    let
        ( page, cmds ) =
            case PageLocation.fromUrl url of
                Just urlParserResult ->
                    urlParserResultToPageAndCmd (Model rec) urlParserResult

                Nothing ->
                    pageNotFound
    in
    ( Model { rec | page = page }, cmds )


pageNotFound : ( PageModel, Cmd Msg )
pageNotFound =
    Page.Home.initModel Nothing
        |> mapPageModel PageHome homePageCmdToCmd
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
                |> mapPageModel PageHome homePageCmdToCmd

        PageLocation.LogIn ->
            Page.LogIn.initModel
                |> mapPageModel PageLogIn (logInPageCmdToCmd rec.key)

        PageLocation.LikedProducts ->
            Page.LikedProducts.initModel (getProductId rec.page) rec.logInState
                |> mapPageModel PageLikedProducts likedProductsCmdToCmd

        PageLocation.History ->
            Page.History.initModel (getProductId rec.page) rec.logInState
                |> mapPageModel PageHistory historyCmdToCmd

        PageLocation.SoldProducts userId ->
            Page.SoldProducts.initModel userId (getProductId rec.page)
                |> mapPageModel PageSoldProducts soldProductsPageCmdToCmd

        PageLocation.BoughtProducts ->
            Page.BoughtProducts.initModel (getProductId rec.page) rec.logInState
                |> mapPageModel PageBoughtProducts boughtProductsPageCmdToCmd

        PageLocation.TradingProducts ->
            Page.TradesInProgress.initModel (getProductId rec.page) rec.logInState
                |> mapPageModel PageTradesInProgress tradingProductsCmdToCmd

        PageLocation.TradedProducts ->
            Page.TradesInPast.initModel (getProductId rec.page) rec.logInState
                |> mapPageModel PageTradesInPast tradedProductsCmdToCmd

        PageLocation.CommentedProducts ->
            Page.CommentedProducts.initModel (getProductId rec.page) rec.logInState
                |> mapPageModel PageCommentedProducts commentedProductsCmdToCmd

        PageLocation.Exhibition ->
            case rec.page of
                PageExhibition exhibitionModel ->
                    exhibitionModel
                        |> Page.Exhibition.update rec.logInState Page.Exhibition.BackToEditPage
                        |> mapPageModel PageExhibition (exhibitionPageCmdToCmd rec.key)

                _ ->
                    Page.Exhibition.initModel
                        |> mapPageModel PageExhibition (exhibitionPageCmdToCmd rec.key)

        PageLocation.ExhibitionConfirm ->
            case rec.page of
                PageExhibition pageModel ->
                    case Page.Exhibition.toConfirmPageMsgFromModel rec.logInState pageModel of
                        Just msg ->
                            pageModel
                                |> Page.Exhibition.update rec.logInState msg
                                |> mapPageModel PageExhibition (exhibitionPageCmdToCmd rec.key)

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
                |> mapPageModel PageProduct (productPageCmdToCmd rec.key)

        PageLocation.Trade tradeId ->
            (case getTradeFromPage tradeId rec.page of
                Just trade ->
                    Page.Trade.initModelFromTrade rec.logInState trade

                Nothing ->
                    Page.Trade.initModelFromId rec.logInState tradeId
            )
                |> mapPageModel PageTrade tradePageCmdToCmd

        PageLocation.User userId ->
            (case getUserFromPage userId rec.page of
                Just userWithName ->
                    Page.User.initModelWithName userWithName

                Nothing ->
                    Page.User.initModelFromId rec.logInState userId
            )
                |> mapPageModel PageUser userPageCmdToCmd

        PageLocation.Search ->
            Page.Search.initModel
                |> mapPageModel PageSearch searchPageCmdToCmd

        PageLocation.SearchResult condition ->
            Page.SearchResult.initModel (getProductId rec.page) condition
                |> mapPageModel PageSearchResult searchResultPageCmdToCmd

        PageLocation.Notification ->
            Page.Notification.initModel
                |> mapPageModel PageNotification notificationCmdToCmd

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


{-| 各ページにいいねを押した結果を反映するように通知する
-}
updateLikedCountInEachPageProduct : Browser.Navigation.Key -> Data.Product.Id -> Result String Int -> PageModel -> ( PageModel, Cmd Msg )
updateLikedCountInEachPageProduct key productId result page =
    let
        productListMsg =
            Component.ProductList.UpdateLikedCountResponse productId result
    in
    case page of
        PageHome msg ->
            msg
                |> Page.Home.update (Page.Home.MsgByProductList productListMsg)
                |> mapPageModel PageHome homePageCmdToCmd

        PageLikedProducts msg ->
            msg
                |> Page.LikedProducts.update (Page.LikedProducts.MsgByProductList productListMsg)
                |> mapPageModel PageLikedProducts likedProductsCmdToCmd

        PageHistory msg ->
            msg
                |> Page.History.update (Page.History.MsgByProductList productListMsg)
                |> mapPageModel PageHistory historyCmdToCmd

        PageSoldProducts msg ->
            msg
                |> Page.SoldProducts.update (Page.SoldProducts.MsgByProductList productListMsg)
                |> mapPageModel PageSoldProducts soldProductsPageCmdToCmd

        PageBoughtProducts msg ->
            msg
                |> Page.BoughtProducts.update (Page.BoughtProducts.MsgByProductList productListMsg)
                |> mapPageModel PageBoughtProducts boughtProductsPageCmdToCmd

        PageProduct msg ->
            msg
                |> Page.Product.update (Page.Product.LikeResponse result)
                |> mapPageModel PageProduct (productPageCmdToCmd key)

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
        , receiveAllProducts UpdateProducts
        ]
