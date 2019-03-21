module SiteMap exposing
    ( exhibitionGoodsParser
    , exhibitionGoodsUrl
    , exhibitionParser
    , exhibitionUrl
    , goodsParser
    , goodsUrl
    , homeParser
    , homeUrl
    , likeHistoryParser
    , likeHistoryUrl
    , logInParser
    , logInUrl
    , profileParser
    , profileUrl
    , purchaseGoodsParser
    , purchaseGoodsUrl
    , signUpParser
    , signUpUrl
    , siteMapParser
    , siteMapUrl
    , siteMapXml
    )

import Url.Builder
import Url.Parser exposing ((</>))


homeParser : Url.Parser.Parser a a
homeParser =
    Url.Parser.top


homeUrl : String
homeUrl =
    Url.Builder.absolute [] []



{- signup -}


signUpParser : Url.Parser.Parser a a
signUpParser =
    Url.Parser.s signUpPath


signUpUrl : String
signUpUrl =
    Url.Builder.absolute [ signUpPath ] []


signUpPath : String
signUpPath =
    "signup"



{- login -}


logInParser : Url.Parser.Parser a a
logInParser =
    Url.Parser.s logInPath


logInUrl : String
logInUrl =
    Url.Builder.absolute [ logInPath ] []


logInPath : String
logInPath =
    "login"



{- like-history -}


likeHistoryParser : Url.Parser.Parser a a
likeHistoryParser =
    Url.Parser.s likeHistoryPath


likeHistoryUrl : String
likeHistoryUrl =
    Url.Builder.absolute [ likeHistoryPath ] []


likeHistoryPath : String
likeHistoryPath =
    "like-history"



{- exhibition-goods -}


exhibitionGoodsParser : Url.Parser.Parser a a
exhibitionGoodsParser =
    Url.Parser.s exhibitionGoodsPath


exhibitionGoodsUrl : String
exhibitionGoodsUrl =
    Url.Builder.absolute [ exhibitionGoodsPath ] []


exhibitionGoodsPath : String
exhibitionGoodsPath =
    "exhibition-goods"



{- purchase-goods -}


purchaseGoodsParser : Url.Parser.Parser a a
purchaseGoodsParser =
    Url.Parser.s "purchase-goods"


purchaseGoodsUrl : String
purchaseGoodsUrl =
    Url.Builder.absolute [ purchaseGoodsPath ] []


purchaseGoodsPath : String
purchaseGoodsPath =
    "purchase-goods"



{- exhibition -}


exhibitionParser : Url.Parser.Parser a a
exhibitionParser =
    Url.Parser.s exhibitionPath


exhibitionUrl : String
exhibitionUrl =
    Url.Builder.absolute [ exhibitionPath ] []


exhibitionPath : String
exhibitionPath =
    "exhibition"



{- goods -}


goodsParser : Url.Parser.Parser (String -> a) a
goodsParser =
    Url.Parser.s goodsPath </> Url.Parser.string


goodsUrl : String -> String
goodsUrl goodsId =
    Url.Builder.absolute [ goodsPath, goodsId ] []


goodsPath : String
goodsPath =
    "goods"



{- profile -}


profileParser : Url.Parser.Parser a a
profileParser =
    Url.Parser.s profilePath


profileUrl : String
profileUrl =
    Url.Builder.absolute [ profilePath ] []


profilePath : String
profilePath =
    "profile"



{- sitemap -}


siteMapParser : Url.Parser.Parser a a
siteMapParser =
    Url.Parser.s siteMapPath


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
        ++ (([ homeUrl ] ++ [ goodsUrl "sampleId" ])
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
