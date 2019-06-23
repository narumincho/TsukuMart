module SiteMap exposing
    ( UrlParserInitResult(..)
    , UrlParserResult(..)
    , aboutPrivacyPolicyUrl
    , aboutUrl
    , boughtProductsUrl
    , exhibitionConfirmUrl
    , exhibitionUrl
    , homeUrl
    , likeHistoryUrl
    , logInUrl
    , productUrl
    , siteMapXml
    , soldProductsUrl
    , urlParser
    , urlParserInit
    , userUrl
    )

import Api
import Data.Product
import Data.User
import Dict
import Erl
import Url
import Url.Builder


type UrlParserInitResult
    = InitHome
    | InitSignUp { sendEmailToken : String, name : String, imageUrl : String }
    | InitLogIn
    | InitLikeAndHistory
    | IntiSoldProducts
    | InitBoughtProducts
    | InitExhibition
    | InitProduct Data.Product.Id
    | InitUser Data.User.Id
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

        fragment =
            (Erl.parse ("?" ++ hash)).query
                |> Dict.fromList
    in
    ( case ( fragment |> Dict.get "refreshToken", fragment |> Dict.get "accessToken" ) of
        ( Just refreshToken, Just accessToken ) ->
            Just
                { refreshToken = Api.tokenFromString refreshToken
                , accessToken = Api.tokenFromString accessToken
                }

        ( _, _ ) ->
            Nothing
    , [ homeParser |> parserMap (always InitHome)
      , signUpParser fragment |> parserMap InitSignUp
      , logInParser |> parserMap (always InitLogIn)
      , likeHistoryParser |> parserMap (always InitLikeAndHistory)
      , soldProductsParser |> parserMap (always InitExhibition)
      , boughtProductsParser |> parserMap (always InitBoughtProducts)
      , exhibitionParser |> parserMap (always InitExhibition)
      , productParser |> parserMap InitProduct
      , userParser |> parserMap InitUser
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
    | LikeAndHistory
    | SoldProducts
    | BoughtProducts
    | Exhibition
    | ExhibitionConfirm
    | Product Data.Product.Id
    | User Data.User.Id
    | SiteMap
    | About
    | AboutPrivacyPolicy


urlParser : Url.Url -> Maybe UrlParserResult
urlParser url =
    let
        { path } =
            url
                |> Url.toString
                |> Erl.parse
    in
    [ homeParser |> parserMap (always Home)
    , logInParser |> parserMap (always LogIn)
    , likeHistoryParser |> parserMap (always LikeAndHistory)
    , soldProductsParser |> parserMap (always SoldProducts)
    , boughtProductsParser |> parserMap (always BoughtProducts)
    , exhibitionParser |> parserMap (always Exhibition)
    , exhibitionConfirmParser |> parserMap (always ExhibitionConfirm)
    , productParser |> parserMap Product
    , userParser |> parserMap User
    , siteMapParser |> parserMap (always SiteMap)
    , aboutParser |> parserMap (always About)
    , aboutPrivacyPolicyParser |> parserMap (always AboutPrivacyPolicy)
    ]
        |> List.map (\f -> f path)
        |> oneOf


homeParser : List String -> Maybe ()
homeParser path =
    if path == [] then
        Just ()

    else
        Nothing


homeUrl : String
homeUrl =
    Url.Builder.absolute [] []



{- signup -}


signUpParser :
    Dict.Dict String String
    -> List String
    -> Maybe { sendEmailToken : String, name : String, imageUrl : String }
signUpParser fragment path =
    case ( path, ( fragment |> Dict.get "sendEmailToken", fragment |> Dict.get "name", fragment |> Dict.get "imageUrl" ) ) of
        ( [ "signup" ], ( Just sendEmailToken, Just name, Just imageUrl ) ) ->
            Just
                { sendEmailToken = sendEmailToken
                , name = name
                , imageUrl = imageUrl
                }

        ( _, ( _, _, _ ) ) ->
            Nothing



{- login -}


logInParser : List String -> Maybe ()
logInParser path =
    if path == [ logInPath ] then
        Just ()

    else
        Nothing


logInUrl : String
logInUrl =
    Url.Builder.absolute [ logInPath ] []


logInPath : String
logInPath =
    "login"



{- like-history -}


likeHistoryParser : List String -> Maybe ()
likeHistoryParser path =
    if path == [ likeHistoryPath ] then
        Just ()

    else
        Nothing


likeHistoryUrl : String
likeHistoryUrl =
    Url.Builder.absolute [ likeHistoryPath ] []


likeHistoryPath : String
likeHistoryPath =
    "like-history"



{- Sold Products -}


soldProductsParser : List String -> Maybe ()
soldProductsParser path =
    if path == [ soldProductsPath ] then
        Just ()

    else
        Nothing


soldProductsUrl : String
soldProductsUrl =
    Url.Builder.absolute [ soldProductsPath ] []


soldProductsPath : String
soldProductsPath =
    "sold-products"



{- Bought Products -}


boughtProductsParser : List String -> Maybe ()
boughtProductsParser path =
    if path == [ boughtProductsPath ] then
        Just ()

    else
        Nothing


boughtProductsUrl : String
boughtProductsUrl =
    Url.Builder.absolute [ boughtProductsPath ] []


boughtProductsPath : String
boughtProductsPath =
    "bought-products"



{- exhibition -}


exhibitionParser : List String -> Maybe ()
exhibitionParser path =
    if path == [ exhibitionPath ] then
        Just ()

    else
        Nothing


exhibitionUrl : String
exhibitionUrl =
    Url.Builder.absolute [ exhibitionPath ] []


exhibitionPath : String
exhibitionPath =
    "exhibition"


exhibitionConfirmParser : List String -> Maybe ()
exhibitionConfirmParser path =
    if path == [ exhibitionPath, exhibitionConfirmPath ] then
        Just ()

    else
        Nothing


exhibitionConfirmUrl : String
exhibitionConfirmUrl =
    Url.Builder.absolute [ exhibitionPath, exhibitionConfirmPath ] []


exhibitionConfirmPath : String
exhibitionConfirmPath =
    "confirm"



{- Product -}


productParser : List String -> Maybe Data.Product.Id
productParser path =
    case path of
        [ "product", productIdString ] ->
            productIdString |> String.toInt |> Maybe.map Data.Product.idFromInt

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
    Url.Builder.absolute [ userPath, Data.User.idToString userId ] []


userPath : String
userPath =
    "user"



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
