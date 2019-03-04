module SiteMap exposing (exhibitionGoodsParser, exhibitionGoodsUrl, exhibitionParser, exhibitionUrl, goodsParser, goodsUrl, homeParser, homeUrl, likeHistoryParser, likeHistoryUrl, logInParser, logInUrl, purchaseGoodsParser, purchaseGoodsUrl, signUpParser, signUpUrl, siteMapParser, siteMapUrl)

import Url.Parser exposing ((</>))


homeParser : Url.Parser.Parser a a
homeParser =
    Url.Parser.top


homeUrl : String
homeUrl =
    "/"


signUpParser : Url.Parser.Parser a a
signUpParser =
    Url.Parser.s "user-signup"


signUpUrl : String
signUpUrl =
    "/user-signup"


logInParser : Url.Parser.Parser a a
logInParser =
    Url.Parser.s "user-login"


logInUrl : String
logInUrl =
    "/user-login"


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


goodsParser : Url.Parser.Parser (Int -> a) a
goodsParser =
    Url.Parser.s "goods" </> Url.Parser.int


goodsUrl : Int -> String
goodsUrl index =
    "/goods/" ++ String.fromInt index


siteMapParser : Url.Parser.Parser a a
siteMapParser =
    Url.Parser.s "sitemap"


siteMapUrl : String
siteMapUrl =
    "/sitemap"
