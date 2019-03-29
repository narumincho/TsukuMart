module SiteMap exposing
    ( UrlParserInitResult(..)
    , UrlParserResult(..)
    , aboutPrivacyPolicyUrl
    , aboutUrl
    , exhibitionConfirmUrl
    , exhibitionGoodsUrl
    , exhibitionUrl
    , goodsUrl
    , homeUrl
    , likeHistoryUrl
    , logInUrl
    , profileUrl
    , purchaseGoodsUrl
    , signUpUrl
    , siteMapUrl
    , siteMapXml
    , urlParser
    , urlParserInit
    )

import Data.Good
import Url
import Url.Builder
import Url.Parser as Parser exposing ((</>))


type UrlParserInitResult
    = InitHome
    | InitSignUp
    | InitLogIn
    | InitLikeAndHistory
    | IntiExhibitionGood
    | InitPurchaseGood
    | InitExhibition
    | InitGood Data.Good.GoodId
    | InitProfile
    | InitSiteMap
    | InitAbout
    | InitAboutPrivacyPolicy


urlParserInit : Url.Url -> Maybe UrlParserInitResult
urlParserInit =
    Parser.oneOf
        [ homeParser |> Parser.map InitHome
        , signUpParser |> Parser.map InitSignUp
        , logInParser |> Parser.map InitLogIn
        , likeHistoryParser |> Parser.map InitLikeAndHistory
        , exhibitionGoodsParser |> Parser.map IntiExhibitionGood
        , purchaseGoodsParser |> Parser.map InitPurchaseGood
        , exhibitionParser |> Parser.map InitExhibition
        , goodsParser |> Parser.map InitGood
        , profileParser |> Parser.map InitProfile
        , siteMapParser |> Parser.map InitSiteMap
        , aboutParser |> Parser.map InitAbout
        , aboutPrivacyPolicyParser |> Parser.map InitAboutPrivacyPolicy
        ]
        |> Parser.parse


type UrlParserResult
    = Home
    | SignUp
    | LogIn
    | LikeAndHistory
    | ExhibitionGood
    | PurchaseGood
    | Exhibition
    | ExhibitionConfirm
    | Good Data.Good.GoodId
    | Profile
    | SiteMap
    | About
    | AboutPrivacyPolicy


urlParser : Url.Url -> Maybe UrlParserResult
urlParser =
    Parser.oneOf
        [ homeParser |> Parser.map Home
        , signUpParser |> Parser.map SignUp
        , logInParser |> Parser.map LogIn
        , likeHistoryParser |> Parser.map LikeAndHistory
        , exhibitionGoodsParser |> Parser.map ExhibitionGood
        , purchaseGoodsParser |> Parser.map PurchaseGood
        , exhibitionParser |> Parser.map Exhibition
        , exhibitionConfirmParser |> Parser.map ExhibitionConfirm
        , goodsParser |> Parser.map Good
        , profileParser |> Parser.map Profile
        , siteMapParser |> Parser.map SiteMap
        , aboutParser |> Parser.map About
        , aboutPrivacyPolicyParser |> Parser.map AboutPrivacyPolicy
        ]
        |> Parser.parse


homeParser : Parser.Parser a a
homeParser =
    Parser.top


homeUrl : String
homeUrl =
    Url.Builder.absolute [] []



{- signup -}


signUpParser : Parser.Parser a a
signUpParser =
    Parser.s signUpPath


signUpUrl : String
signUpUrl =
    Url.Builder.absolute [ signUpPath ] []


signUpPath : String
signUpPath =
    "signup"



{- login -}


logInParser : Parser.Parser a a
logInParser =
    Parser.s logInPath


logInUrl : String
logInUrl =
    Url.Builder.absolute [ logInPath ] []


logInPath : String
logInPath =
    "login"



{- like-history -}


likeHistoryParser : Parser.Parser a a
likeHistoryParser =
    Parser.s likeHistoryPath


likeHistoryUrl : String
likeHistoryUrl =
    Url.Builder.absolute [ likeHistoryPath ] []


likeHistoryPath : String
likeHistoryPath =
    "like-history"



{- exhibition-goods -}


exhibitionGoodsParser : Parser.Parser a a
exhibitionGoodsParser =
    Parser.s exhibitionGoodsPath


exhibitionGoodsUrl : String
exhibitionGoodsUrl =
    Url.Builder.absolute [ exhibitionGoodsPath ] []


exhibitionGoodsPath : String
exhibitionGoodsPath =
    "exhibition-goods"



{- purchase-goods -}


purchaseGoodsParser : Parser.Parser a a
purchaseGoodsParser =
    Parser.s "purchase-goods"


purchaseGoodsUrl : String
purchaseGoodsUrl =
    Url.Builder.absolute [ purchaseGoodsPath ] []


purchaseGoodsPath : String
purchaseGoodsPath =
    "purchase-goods"



{- exhibition -}


exhibitionParser : Parser.Parser a a
exhibitionParser =
    Parser.s exhibitionPath


exhibitionUrl : String
exhibitionUrl =
    Url.Builder.absolute [ exhibitionPath ] []


exhibitionPath : String
exhibitionPath =
    "exhibition"


exhibitionConfirmParser : Parser.Parser a a
exhibitionConfirmParser =
    Parser.s exhibitionPath </> Parser.s exhibitionConfirmPath


exhibitionConfirmUrl : String
exhibitionConfirmUrl =
    Url.Builder.absolute [ exhibitionPath, exhibitionConfirmPath ] []


exhibitionConfirmPath : String
exhibitionConfirmPath =
    "confirm"



{- goods -}


goodsParser : Parser.Parser (Data.Good.GoodId -> a) a
goodsParser =
    Parser.s goodsPath </> (Parser.int |> Parser.map Data.Good.goodIdFromInt)


goodsUrl : Data.Good.GoodId -> String
goodsUrl goodsId =
    Url.Builder.absolute [ goodsPath, Data.Good.goodIdToString goodsId ] []


goodsPath : String
goodsPath =
    "goods"



{- profile -}


profileParser : Parser.Parser a a
profileParser =
    Parser.s profilePath


profileUrl : String
profileUrl =
    Url.Builder.absolute [ profilePath ] []


profilePath : String
profilePath =
    "profile"



{- about -}


aboutParser : Parser.Parser a a
aboutParser =
    Parser.s aboutPath


aboutUrl : String
aboutUrl =
    Url.Builder.absolute [ aboutPath ] []


aboutPath : String
aboutPath =
    "about"


aboutPrivacyPolicyParser : Parser.Parser a a
aboutPrivacyPolicyParser =
    Parser.s aboutPath </> Parser.s aboutPrivacyPolicyPath


aboutPrivacyPolicyUrl : String
aboutPrivacyPolicyUrl =
    Url.Builder.absolute [ aboutPath, aboutPrivacyPolicyPath ] []


aboutPrivacyPolicyPath : String
aboutPrivacyPolicyPath =
    "privacy-policy"



{- sitemap -}


siteMapParser : Parser.Parser a a
siteMapParser =
    Parser.s siteMapPath


siteMapUrl : String
siteMapUrl =
    Url.Builder.absolute [ siteMapPath ] []


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
        ++ ("    <loc>http://tsukumart.com" ++ string ++ "</loc>\n")
        ++ "  </url>\n"
