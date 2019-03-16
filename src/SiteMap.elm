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

import Url.Parser exposing ((</>))


homeParser : Url.Parser.Parser a a
homeParser =
    Url.Parser.top


homeUrl : String
homeUrl =
    "/"


signUpParser : Url.Parser.Parser a a
signUpParser =
    Url.Parser.s "signup"


signUpUrl : String
signUpUrl =
    "/signup"


logInParser : Url.Parser.Parser a a
logInParser =
    Url.Parser.s "login"


logInUrl : String
logInUrl =
    "/login"


likeHistoryParser : Url.Parser.Parser a a
likeHistoryParser =
    Url.Parser.s "like-history"


likeHistoryUrl : String
likeHistoryUrl =
    "/like-history"


exhibitionGoodsParser : Url.Parser.Parser a a
exhibitionGoodsParser =
    Url.Parser.s "exhibition-item"


exhibitionGoodsUrl : String
exhibitionGoodsUrl =
    "/exhibition-item"


purchaseGoodsParser : Url.Parser.Parser a a
purchaseGoodsParser =
    Url.Parser.s "purchase-item"


purchaseGoodsUrl : String
purchaseGoodsUrl =
    "/purchase-item"


exhibitionParser : Url.Parser.Parser a a
exhibitionParser =
    Url.Parser.s "exhibition"


exhibitionUrl : String
exhibitionUrl =
    "/exhibition"


goodsParser : Url.Parser.Parser (String -> a) a
goodsParser =
    Url.Parser.s "goods" </> Url.Parser.string


goodsUrl : String -> String
goodsUrl goodsId =
    "/goods/" ++ goodsId


profileParser : Url.Parser.Parser a a
profileParser =
    Url.Parser.s "profile"


profileUrl : String
profileUrl =
    "profile"


siteMapParser : Url.Parser.Parser a a
siteMapParser =
    Url.Parser.s "sitemap"


siteMapUrl : String
siteMapUrl =
    "/sitemap"


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
        ++ "    <loc>http://tsukumart.com"
        ++ string
        ++ "</loc>\n"
        ++ "  </url>\n"
