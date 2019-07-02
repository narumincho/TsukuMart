module SiteMap exposing
    ( UrlParserInitResult(..)
    , UrlParserResult(..)
    , aboutPrivacyPolicyUrl
    , aboutUrl
    , boughtProductsUrl
    , commentedProductsUrl
    , exhibitionConfirmUrl
    , exhibitionUrl
    , historyUrl
    , homeUrl
    , likedProductsUrl
    , logInUrl
    , notificationUrl
    , productUrl
    , searchUrl
    , siteMapXml
    , soldProductsUrl
    , tradedProductsUrl
    , tradingProductsUrl
    , urlParser
    , urlParserInit
    , userUrl
    )

import Api
import Data.Product
import Data.SearchCondition
import Data.User
import Dict
import Erl
import Url
import Url.Builder


type UrlParserInitResult
    = InitHome
    | InitSignUp { sendEmailToken : String, name : String, imageId : String }
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
    | InitUser Data.User.Id
    | InitSearch Data.SearchCondition.Condition
    | InitNotification
    | InitSiteMap
    | InitAbout
    | InitAboutPrivacyPolicy


urlParserInit : Url.Url -> ( Maybe { refreshToken : Api.Token, accessToken : Api.Token }, Maybe UrlParserInitResult )
urlParserInit url =
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
                { refreshToken = Api.tokenFromString refreshToken
                , accessToken = Api.tokenFromString accessToken
                }

        ( _, _ ) ->
            Nothing
    , [ homeParser |> parserMap (always InitHome)
      , signUpParser fragmentDict |> parserMap InitSignUp
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
      , userParser |> parserMap InitUser
      , searchParser fragmentDict |> parserMap InitSearch
      , notificationParser |> parserMap (always InitNotification)
      , siteMapParser |> parserMap (always InitSiteMap)
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


type UrlParserResult
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
    | User Data.User.Id
    | Search Data.SearchCondition.Condition
    | Notification
    | SiteMap
    | About
    | AboutPrivacyPolicy


urlParser : Url.Url -> Maybe UrlParserResult
urlParser url =
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
    , userParser |> parserMap User
    , searchParser fragmentDict |> parserMap Search
    , notificationParser |> parserMap (always Notification)
    , siteMapParser |> parserMap (always SiteMap)
    , aboutParser |> parserMap (always About)
    , aboutPrivacyPolicyParser |> parserMap (always AboutPrivacyPolicy)
    ]
        |> List.map (\f -> f path)
        |> oneOf


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



{- Sign Up -}


signUpParser :
    Dict.Dict String String
    -> List String
    -> Maybe { sendEmailToken : String, name : String, imageId : String }
signUpParser fragment path =
    case ( path, ( fragment |> Dict.get "sendEmailToken", fragment |> Dict.get "name", fragment |> Dict.get "imageId" ) ) of
        ( [ "signup" ], ( Just sendEmailToken, Just name, Just imageId ) ) ->
            Just
                { sendEmailToken = sendEmailToken
                , name = name
                , imageId = imageId
                }

        ( _, ( _, _, _ ) ) ->
            Nothing



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



{- user -}


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


searchParser : Dict.Dict String String -> List String -> Maybe Data.SearchCondition.Condition
searchParser fragment path =
    if path == searchPath then
        Just
            (case fragment |> Dict.get "text" of
                Just text ->
                    Data.SearchCondition.ByText text

                Nothing ->
                    Data.SearchCondition.None
            )

    else
        Nothing


searchUrl : Data.SearchCondition.Condition -> String
searchUrl condition =
    Url.Builder.absolute
        (case condition of
            Data.SearchCondition.None ->
                searchPath

            Data.SearchCondition.ByText text ->
                searchPath ++ [ "#text=" ++ Url.percentEncode text ]
        )
        []


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



{- siteMap -}


siteMapParser : List String -> Maybe ()
siteMapParser path =
    if path == [ siteMapPath ] then
        Just ()

    else
        Nothing


siteMapPath : String
siteMapPath =
    "sitemap"


siteMapXml : String
siteMapXml =
    ([ "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
     , "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n"
     ]
        ++ ([ homeUrl ]
                |> List.map urlNode
           )
        ++ [ "</urlset>\n" ]
    )
        |> String.concat


urlNode : String -> String
urlNode string =
    "  <url>\n"
        ++ ("    <loc>https://tsukumart.com" ++ string ++ "</loc>\n")
        ++ "  </url>\n"
