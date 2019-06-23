module SiteMap exposing
    ( UrlParserInitResult(..)
    , UrlParserResult(..)
    , aboutPrivacyPolicyUrl
    , aboutUrl
    , exhibitionConfirmUrl
    , soldProductsUrl
    , exhibitionUrl
    , productUrl
    , homeUrl
    , likeHistoryUrl
    , logInUrl
    , boughtProductsUrl
    , siteMapXml
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
        { path, query } =
            url
                |> Url.toString
                |> Erl.parse

        queryDict =
            query |> Dict.fromList
    in
    ( case ( queryDict |> Dict.get "refreshToken", queryDict |> Dict.get "accessToken" ) of
        ( Just refreshToken, Just accessToken ) ->
            Just
                { refreshToken = Api.tokenFromString refreshToken
                , accessToken = Api.tokenFromString accessToken
                }

        ( _, _ ) ->
            Nothing
    , [ homeParser |> parserMap (always InitHome)
      , signUpParser |> parserMap InitSignUp
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
        |> List.map (\f -> f path queryDict)
        |> oneOf
    )


parserMap : (a -> b) -> (List String -> Dict.Dict String String -> Maybe a) -> (List String -> Dict.Dict String String -> Maybe b)
parserMap f parser path query =
    parser path query |> Maybe.map f


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
        { path, query } =
            url
                |> Url.toString
                |> Erl.parse

        queryDict =
            query |> Dict.fromList
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
        |> List.map (\f -> f path queryDict)
        |> oneOf


homeParser : List String -> Dict.Dict String String -> Maybe ()
homeParser path _ =
    if path == [] then
        Just ()

    else
        Nothing


homeUrl : String
homeUrl =
    Url.Builder.absolute [] []



{- signup -}


signUpParser : List String -> Dict.Dict String String -> Maybe { sendEmailToken : String, name : String, imageUrl : String }
signUpParser path query =
    case ( path, ( query |> Dict.get "sendEmailToken", query |> Dict.get "name", query |> Dict.get "imageUrl" ) ) of
        ( [ "signup" ], ( Just sendEmailToken, Just name, Just imageUrl ) ) ->
            Just
                { sendEmailToken = sendEmailToken
                , name = name
                , imageUrl = imageUrl
                }

        ( _, ( _, _, _ ) ) ->
            Nothing



{- login -}


logInParser : List String -> Dict.Dict String String -> Maybe ()
logInParser path _ =
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


likeHistoryParser : List String -> Dict.Dict String String -> Maybe ()
likeHistoryParser path _ =
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


soldProductsParser : List String -> Dict.Dict String String -> Maybe ()
soldProductsParser path _ =
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


boughtProductsParser : List String -> Dict.Dict String String -> Maybe ()
boughtProductsParser path _ =
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


exhibitionParser : List String -> Dict.Dict String String -> Maybe ()
exhibitionParser path _ =
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


exhibitionConfirmParser : List String -> Dict.Dict String String -> Maybe ()
exhibitionConfirmParser path _ =
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


productParser : List String -> Dict.Dict String String -> Maybe Data.Product.Id
productParser path _ =
    case path of
        [ "product", productIdString ] ->
            productIdString |> String.toInt |> Maybe.map Data.Product.idFromInt

        _ ->
            Nothing


productUrl : Data.Product.Id -> String
productUrl productId =
    Url.Builder.absolute [ "product", Data.Product.idToString productId ] []



{- user -}


userParser : List String -> Dict.Dict String String -> Maybe Data.User.Id
userParser path _ =
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


aboutParser : List String -> Dict.Dict String String -> Maybe ()
aboutParser path _ =
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


aboutPrivacyPolicyParser : List String -> Dict.Dict String String -> Maybe ()
aboutPrivacyPolicyParser path _ =
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


siteMapParser : List String -> Dict.Dict String String -> Maybe ()
siteMapParser path _ =
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
