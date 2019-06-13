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
    , purchaseGoodsUrl
    , siteMapXml
    , urlParser
    , urlParserInit
    , userUrl
    )

import Api
import Data.Good
import Data.User
import Dict
import Erl
import Url
import Url.Builder


type UrlParserInitResult
    = InitHome (Maybe { refreshToken : Api.Token, accessToken : Api.Token })
    | InitSignUp { sendEmailToken : String, name : String, imageUrl : String }
    | InitLogIn
    | InitLikeAndHistory
    | IntiExhibitionGood
    | InitPurchaseGood
    | InitExhibition
    | InitGood Data.Good.GoodId
    | InitUser Data.User.UserId
    | InitSiteMap
    | InitAbout
    | InitAboutPrivacyPolicy
    | InitSendConfirmTokenPage Api.Token


urlParserInit : Url.Url -> Maybe UrlParserInitResult
urlParserInit url =
    let
        { path, query } =
            url
                |> Url.toString
                |> Erl.parse

        queryDict =
            query |> Dict.fromList
    in
    [ homeParser |> parserMap InitHome
    , signUpParser |> parserMap InitSignUp
    , logInParser |> parserMap (always InitLogIn)
    , likeHistoryParser |> parserMap (always InitLikeAndHistory)
    , exhibitionGoodsParser |> parserMap (always InitExhibition)
    , purchaseGoodsParser |> parserMap (always InitPurchaseGood)
    , exhibitionParser |> parserMap (always InitExhibition)
    , goodsParser |> parserMap InitGood
    , userParser |> parserMap InitUser
    , siteMapParser |> parserMap (always InitSiteMap)
    , aboutParser |> parserMap (always InitAbout)
    , aboutPrivacyPolicyParser |> parserMap (always InitAboutPrivacyPolicy)
    ]
        |> List.map (\f -> f path queryDict)
        |> oneOf


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
    | ExhibitionGood
    | PurchaseGood
    | Exhibition
    | ExhibitionConfirm
    | Good Data.Good.GoodId
    | User Data.User.UserId
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
    , exhibitionGoodsParser |> parserMap (always ExhibitionGood)
    , purchaseGoodsParser |> parserMap (always PurchaseGood)
    , exhibitionParser |> parserMap (always Exhibition)
    , exhibitionConfirmParser |> parserMap (always ExhibitionConfirm)
    , goodsParser |> parserMap Good
    , userParser |> parserMap User
    , siteMapParser |> parserMap (always SiteMap)
    , aboutParser |> parserMap (always About)
    , aboutPrivacyPolicyParser |> parserMap (always AboutPrivacyPolicy)
    ]
        |> List.map (\f -> f path queryDict)
        |> oneOf


homeParser : List String -> Dict.Dict String String -> Maybe (Maybe { refreshToken : Api.Token, accessToken : Api.Token })
homeParser path query =
    case ( path, query |> Dict.get "refreshToken", query |> Dict.get "accessToken" ) of
        ( [], Just refreshToken, Just accessToken ) ->
            Just
                (Just
                    { refreshToken = Api.tokenFromString refreshToken
                    , accessToken = Api.tokenFromString accessToken
                    }
                )

        ( [], _, _ ) ->
            Just Nothing

        _ ->
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
logInParser path query =
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
likeHistoryParser path query =
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



{- exhibition-goods -}


exhibitionGoodsParser : List String -> Dict.Dict String String -> Maybe ()
exhibitionGoodsParser path query =
    if path == [ exhibitionGoodsPath ] then
        Just ()

    else
        Nothing


exhibitionGoodsUrl : String
exhibitionGoodsUrl =
    Url.Builder.absolute [ exhibitionGoodsPath ] []


exhibitionGoodsPath : String
exhibitionGoodsPath =
    "exhibition-goods"



{- purchase-goods -}


purchaseGoodsParser : List String -> Dict.Dict String String -> Maybe ()
purchaseGoodsParser path query =
    if path == [ purchaseGoodsPath ] then
        Just ()

    else
        Nothing


purchaseGoodsUrl : String
purchaseGoodsUrl =
    Url.Builder.absolute [ purchaseGoodsPath ] []


purchaseGoodsPath : String
purchaseGoodsPath =
    "purchase-goods"



{- exhibition -}


exhibitionParser : List String -> Dict.Dict String String -> Maybe ()
exhibitionParser path query =
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
exhibitionConfirmParser path query =
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



{- goods -}


goodsParser : List String -> Dict.Dict String String -> Maybe Data.Good.GoodId
goodsParser path query =
    case path of
        [ "goods", goodIdString ] ->
            goodIdString |> String.toInt |> Maybe.map Data.Good.goodIdFromInt

        _ ->
            Nothing


goodsUrl : Data.Good.GoodId -> String
goodsUrl goodsId =
    Url.Builder.absolute [ goodsPath, Data.Good.goodIdToString goodsId ] []


goodsPath : String
goodsPath =
    "goods"



{- user -}


userParser : List String -> Dict.Dict String String -> Maybe Data.User.UserId
userParser path query =
    case path of
        [ "user", userId ] ->
            Just (Data.User.idFromString userId)

        _ ->
            Nothing


userUrl : Data.User.UserId -> String
userUrl userId =
    Url.Builder.absolute [ userPath, Data.User.idToString userId ] []


userPath : String
userPath =
    "user"



{- about -}


aboutParser : List String -> Dict.Dict String String -> Maybe ()
aboutParser path query =
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
aboutPrivacyPolicyParser path query =
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



{- sitemap -}


siteMapParser : List String -> Dict.Dict String String -> Maybe ()
siteMapParser path query =
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
