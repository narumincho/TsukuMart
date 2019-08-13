module Data.SocialLoginService exposing (SocialLoginService(..), serviceName)


type SocialLoginService
    = Line


serviceName : SocialLoginService -> String
serviceName service =
    case service of
        Line ->
            "LINE"
