module PageLocation exposing
    ( InitPageLocation(..)
    , PageLocation(..)
    , aboutPrivacyPolicyUrl
    , fromUrl
    , initFromUrl
    , initToUrlAsString
    , toUrlAsString
    )

import Api
import Data.Category
import Data.ImageId
import Data.Product
import Data.SearchCondition
import Data.Trade
import Data.University
import Data.User
import Dict
import Erl
import Url
import Url.Builder


type InitPageLocation
    = InitHome
    | InitLogIn
    | InitLikedProducts
    | InitHistory
    | InitSoldProducts Data.User.Id
    | InitBoughtProducts
    | InitTradingProducts
    | InitTradedProducts
    | InitCommentedProducts
    | InitExhibition
    | InitProduct Data.Product.Id
    | InitTrade Data.Trade.Id
    | InitUser Data.User.Id
    | InitSearch (Maybe Data.SearchCondition.Condition)
    | InitNotification
    | InitAbout
    | InitAboutPrivacyPolicy


initFromUrl : Url.Url -> ( Maybe Api.Token, Maybe InitPageLocation )
initFromUrl url =
    let
        { path, hash } =
            url
                |> Url.toString
                |> Erl.parse

        fragmentDict =
            (Erl.parse ("?" ++ hash)).query
                |> Dict.fromList
    in
    ( case ( fragmentDict |> Dict.get "refreshToken", fragmentDict |> Dict.get "accessToken" ) of
        ( Just refreshToken, Just accessToken ) ->
            Just
                (Api.makeToken
                    { refreshToken = refreshToken
                    , accessToken = accessToken
                    }
                )

        ( _, _ ) ->
            Nothing
    , [ homeParser |> parserMap (always InitHome)
      , logInParser |> parserMap (always InitLogIn)
      , likedProductsParser |> parserMap (always InitLikedProducts)
      , historyParser |> parserMap (always InitHistory)
      , soldProductsParser |> parserMap InitSoldProducts
      , boughtProductsParser |> parserMap (always InitBoughtProducts)
      , tradingProductsParser |> parserMap (always InitTradingProducts)
      , tradedProductsParser |> parserMap (always InitTradedProducts)
      , commentedProductsParser |> parserMap (always InitCommentedProducts)
      , exhibitionParser |> parserMap (always InitExhibition)
      , productParser |> parserMap InitProduct
      , tradeParser |> parserMap InitTrade
      , userParser |> parserMap InitUser
      , searchParser fragmentDict |> parserMap InitSearch
      , notificationParser |> parserMap (always InitNotification)
      , aboutParser |> parserMap (always InitAbout)
      , aboutPrivacyPolicyParser |> parserMap (always InitAboutPrivacyPolicy)
      ]
        |> List.map (\f -> f path)
        |> oneOf
    )


parserMap : (a -> b) -> (List String -> Maybe a) -> (List String -> Maybe b)
parserMap f parser path =
    parser path |> Maybe.map f


oneOf : List (Maybe a) -> Maybe a
oneOf list =
    case list of
        (Just x) :: _ ->
            Just x

        Nothing :: xs ->
            oneOf xs

        [] ->
            Nothing


{-| ページの場所から、文字列で表現したURLに変換する。一方通行のページの場合、ホームのURLを返す
-}
initToUrlAsString : InitPageLocation -> String
initToUrlAsString location =
    case location of
        InitHome ->
            homeUrl

        InitLogIn ->
            logInUrl

        InitLikedProducts ->
            likedProductsUrl

        InitHistory ->
            historyUrl

        InitSoldProducts id ->
            soldProductsUrl id

        InitBoughtProducts ->
            boughtProductsUrl

        InitTradingProducts ->
            tradingProductsUrl

        InitTradedProducts ->
            tradedProductsUrl

        InitCommentedProducts ->
            commentedProductsUrl

        InitExhibition ->
            exhibitionUrl

        InitProduct id ->
            productUrl id

        InitTrade id ->
            tradeUrl id

        InitUser id ->
            userUrl id

        InitSearch condition ->
            searchUrl condition

        InitNotification ->
            notificationUrl

        InitAbout ->
            aboutUrl

        InitAboutPrivacyPolicy ->
            aboutPrivacyPolicyUrl


type PageLocation
    = Home
    | LogIn
    | LikedProducts
    | History
    | SoldProducts Data.User.Id
    | BoughtProducts
    | TradingProducts
    | TradedProducts
    | CommentedProducts
    | Exhibition
    | ExhibitionConfirm
    | Product Data.Product.Id
    | Trade Data.Trade.Id
    | User Data.User.Id
    | Search (Maybe Data.SearchCondition.Condition)
    | Notification
    | About
    | AboutPrivacyPolicy


fromUrl : Url.Url -> Maybe PageLocation
fromUrl url =
    let
        { path, hash } =
            url
                |> Url.toString
                |> Erl.parse

        fragmentDict =
            (Erl.parse ("?" ++ hash)).query
                |> Dict.fromList
    in
    [ homeParser |> parserMap (always Home)
    , logInParser |> parserMap (always LogIn)
    , likedProductsParser |> parserMap (always LikedProducts)
    , historyParser |> parserMap (always History)
    , soldProductsParser |> parserMap SoldProducts
    , boughtProductsParser |> parserMap (always BoughtProducts)
    , tradingProductsParser |> parserMap (always TradingProducts)
    , tradedProductsParser |> parserMap (always TradedProducts)
    , commentedProductsParser |> parserMap (always CommentedProducts)
    , exhibitionParser |> parserMap (always Exhibition)
    , exhibitionConfirmParser |> parserMap (always ExhibitionConfirm)
    , productParser |> parserMap Product
    , tradeParser |> parserMap Trade
    , userParser |> parserMap User
    , searchParser fragmentDict |> parserMap Search
    , notificationParser |> parserMap (always Notification)
    , aboutParser |> parserMap (always About)
    , aboutPrivacyPolicyParser |> parserMap (always AboutPrivacyPolicy)
    ]
        |> List.map (\f -> f path)
        |> oneOf


toUrlAsString : PageLocation -> String
toUrlAsString location =
    case location of
        Home ->
            homeUrl

        LogIn ->
            logInUrl

        LikedProducts ->
            likedProductsUrl

        History ->
            historyUrl

        SoldProducts id ->
            soldProductsUrl id

        BoughtProducts ->
            boughtProductsUrl

        TradingProducts ->
            tradingProductsUrl

        TradedProducts ->
            tradedProductsUrl

        CommentedProducts ->
            commentedProductsUrl

        Exhibition ->
            exhibitionUrl

        ExhibitionConfirm ->
            exhibitionConfirmUrl

        Product id ->
            productUrl id

        Trade id ->
            tradeUrl id

        User id ->
            userUrl id

        Search condition ->
            searchUrl condition

        Notification ->
            notificationUrl

        About ->
            aboutUrl

        AboutPrivacyPolicy ->
            aboutPrivacyPolicyUrl


homeParser : List String -> Maybe ()
homeParser path =
    if path == homePath then
        Just ()

    else
        Nothing


homeUrl : String
homeUrl =
    Url.Builder.absolute homePath []


homePath : List String
homePath =
    []



{- login -}


logInParser : List String -> Maybe ()
logInParser path =
    if path == logInPath then
        Just ()

    else
        Nothing


logInUrl : String
logInUrl =
    Url.Builder.absolute logInPath []


logInPath : List String
logInPath =
    [ "login" ]



{- like -}


likedProductsParser : List String -> Maybe ()
likedProductsParser path =
    if path == likedProductsPath then
        Just ()

    else
        Nothing


likedProductsUrl : String
likedProductsUrl =
    Url.Builder.absolute
        likedProductsPath
        []


likedProductsPath : List String
likedProductsPath =
    [ "liked-products" ]



{- history -}


historyParser : List String -> Maybe ()
historyParser path =
    if path == historyPath then
        Just ()

    else
        Nothing


historyUrl : String
historyUrl =
    Url.Builder.absolute historyPath []


historyPath : List String
historyPath =
    [ "history" ]



{- Sold Products -}


soldProductsParser : List String -> Maybe Data.User.Id
soldProductsParser path =
    case path of
        [ p, userId ] ->
            if p == soldProductsPath then
                Just (Data.User.idFromString userId)

            else
                Nothing

        _ ->
            Nothing


soldProductsUrl : Data.User.Id -> String
soldProductsUrl userId =
    Url.Builder.absolute
        [ soldProductsPath, Data.User.idToString userId ]
        []


soldProductsPath : String
soldProductsPath =
    "sold-products"



{- Bought Products -}


boughtProductsParser : List String -> Maybe ()
boughtProductsParser path =
    if path == boughtProductsPath then
        Just ()

    else
        Nothing


boughtProductsUrl : String
boughtProductsUrl =
    Url.Builder.absolute boughtProductsPath []


boughtProductsPath : List String
boughtProductsPath =
    [ "bought-products" ]



{- Trading Products -}


tradingProductsParser : List String -> Maybe ()
tradingProductsParser path =
    if path == tradingProductsPath then
        Just ()

    else
        Nothing


tradingProductsUrl : String
tradingProductsUrl =
    Url.Builder.absolute tradingProductsPath []


tradingProductsPath : List String
tradingProductsPath =
    [ "treading-products" ]



{- Traded Products -}


tradedProductsParser : List String -> Maybe ()
tradedProductsParser path =
    if path == tradedProductsPath then
        Just ()

    else
        Nothing


tradedProductsUrl : String
tradedProductsUrl =
    Url.Builder.absolute tradedProductsPath []


tradedProductsPath : List String
tradedProductsPath =
    [ "traded-products" ]



{- Commented Products -}


commentedProductsParser : List String -> Maybe ()
commentedProductsParser path =
    if path == commentedProductsPath then
        Just ()

    else
        Nothing


commentedProductsUrl : String
commentedProductsUrl =
    Url.Builder.absolute commentedProductsPath []


commentedProductsPath : List String
commentedProductsPath =
    [ "commented-products" ]



{- Exhibition -}


exhibitionParser : List String -> Maybe ()
exhibitionParser path =
    if path == exhibitionPath then
        Just ()

    else
        Nothing


exhibitionUrl : String
exhibitionUrl =
    Url.Builder.absolute exhibitionPath []


exhibitionPath : List String
exhibitionPath =
    [ "exhibition" ]


exhibitionConfirmParser : List String -> Maybe ()
exhibitionConfirmParser path =
    if path == exhibitionConfirmPath then
        Just ()

    else
        Nothing


exhibitionConfirmUrl : String
exhibitionConfirmUrl =
    Url.Builder.absolute exhibitionConfirmPath []


exhibitionConfirmPath : List String
exhibitionConfirmPath =
    exhibitionPath ++ [ "confirm" ]



{- Product -}


productParser : List String -> Maybe Data.Product.Id
productParser path =
    case path of
        [ "product", productIdString ] ->
            productIdString |> Data.Product.idFromString |> Just

        _ ->
            Nothing


productUrl : Data.Product.Id -> String
productUrl productId =
    Url.Builder.absolute [ "product", Data.Product.idToString productId ] []



{- Trade -}


tradeParser : List String -> Maybe Data.Trade.Id
tradeParser path =
    case path of
        [ "trade", idString ] ->
            idString |> Data.Trade.idFromString |> Just

        _ ->
            Nothing


tradeUrl : Data.Trade.Id -> String
tradeUrl id =
    Url.Builder.absolute [ "trade", Data.Trade.idToString id ] []



{- User -}


userParser : List String -> Maybe Data.User.Id
userParser path =
    case path of
        [ "user", userId ] ->
            Just (Data.User.idFromString userId)

        _ ->
            Nothing


userUrl : Data.User.Id -> String
userUrl userId =
    Url.Builder.absolute [ "user", Data.User.idToString userId ] []



{- search -}


searchParser : Dict.Dict String String -> List String -> Maybe (Maybe Data.SearchCondition.Condition)
searchParser fragment path =
    if path == searchPath then
        if fragment |> Dict.isEmpty then
            Just Nothing

        else
            Data.SearchCondition.init
                (fragment |> Dict.get "query" |> Maybe.withDefault "")
                (case ( fragment |> Dict.get "categoryType", fragment |> Dict.get "category" ) of
                    ( Just "category", Just categoryString ) ->
                        case Data.Category.fromIdString categoryString of
                            Just category ->
                                Data.SearchCondition.CategorySelectCategory category

                            Nothing ->
                                Data.SearchCondition.CategorySelectNone

                    ( Just "group", Just groupString ) ->
                        case Data.Category.groupFromIdString groupString of
                            Just group ->
                                Data.SearchCondition.CategorySelectGroup group

                            Nothing ->
                                Data.SearchCondition.CategorySelectNone

                    ( _, _ ) ->
                        Data.SearchCondition.CategorySelectNone
                )
                (case ( fragment |> Dict.get "universityType", fragment |> Dict.get "university" ) of
                    ( Just "department", Just departmentString ) ->
                        case Data.University.departmentFromIdString departmentString of
                            Just department ->
                                Data.SearchCondition.UniversitySelectDepartment department

                            Nothing ->
                                Data.SearchCondition.UniversitySelectNone

                    ( Just "school", Just schoolString ) ->
                        case Data.University.schoolFromIdString schoolString of
                            Just school ->
                                Data.SearchCondition.UniversitySelectSchool school

                            Nothing ->
                                Data.SearchCondition.UniversitySelectNone

                    ( Just "graduate", Just graduateString ) ->
                        case Data.University.graduateFromIdString graduateString of
                            Just graduate ->
                                Data.SearchCondition.UniversitySelectGraduate graduate

                            Nothing ->
                                Data.SearchCondition.UniversitySelectNone

                    ( _, _ ) ->
                        Data.SearchCondition.UniversitySelectNone
                )
                |> Just
                |> Just

    else
        Nothing


searchUrl : Maybe Data.SearchCondition.Condition -> String
searchUrl conditionMaybe =
    case conditionMaybe of
        Just condition ->
            Url.Builder.absolute
                (searchPath ++ [ searchFragmentFromCondition condition ])
                []

        Nothing ->
            Url.Builder.absolute
                searchPath
                []


searchFragmentFromCondition : Data.SearchCondition.Condition -> String
searchFragmentFromCondition condition =
    "#"
        ++ (([ "query=" ++ Url.percentEncode (Data.SearchCondition.getQuery condition) ]
                ++ (case Data.SearchCondition.getCategory condition of
                        Data.SearchCondition.CategorySelectNone ->
                            []

                        Data.SearchCondition.CategorySelectCategory category ->
                            [ "categoryType=category"
                            , "category=" ++ Data.Category.toIdString category
                            ]

                        Data.SearchCondition.CategorySelectGroup group ->
                            [ "categoryType=group"
                            , "category=" ++ Data.Category.groupToIdString group
                            ]
                   )
                ++ (case Data.SearchCondition.getUniversitySelect condition of
                        Data.SearchCondition.UniversitySelectNone ->
                            []

                        Data.SearchCondition.UniversitySelectDepartment department ->
                            [ "universityType=department"
                            , "university=" ++ Data.University.departmentToIdString department
                            ]

                        Data.SearchCondition.UniversitySelectSchool school ->
                            [ "universityType=school"
                            , "university=" ++ Data.University.schoolToIdString school
                            ]

                        Data.SearchCondition.UniversitySelectGraduate graduate ->
                            [ "universityType=graduate"
                            , "university=" ++ Data.University.graduateToIdString graduate
                            ]
                   )
            )
                |> String.join "&"
           )


searchPath : List String
searchPath =
    [ "search" ]



{- notification -}


notificationParser : List String -> Maybe ()
notificationParser path =
    if path == [ notificationPath ] then
        Just ()

    else
        Nothing


notificationUrl : String
notificationUrl =
    Url.Builder.absolute [ notificationPath ] []


notificationPath : String
notificationPath =
    "notification"



{- about -}


aboutParser : List String -> Maybe ()
aboutParser path =
    if path == [ aboutPath ] then
        Just ()

    else
        Nothing


aboutUrl : String
aboutUrl =
    Url.Builder.absolute [ aboutPath ] []


aboutPath : String
aboutPath =
    "about"


aboutPrivacyPolicyParser : List String -> Maybe ()
aboutPrivacyPolicyParser path =
    if path == [ aboutPath, aboutPrivacyPolicyPath ] then
        Just ()

    else
        Nothing


aboutPrivacyPolicyUrl : String
aboutPrivacyPolicyUrl =
    Url.Builder.absolute [ aboutPath, aboutPrivacyPolicyPath ] []


aboutPrivacyPolicyPath : String
aboutPrivacyPolicyPath =
    "privacy-policy"
