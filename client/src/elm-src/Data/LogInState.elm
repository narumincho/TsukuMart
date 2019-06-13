module Data.LogInState exposing (LogInState(..), addUserWithProfile, getAccessToken)

import Api
import Data.User as User


type LogInState
    = None
    | LoadingProfile
        { accessToken : Api.Token
        , refreshToken : Api.Token
        }
    | Ok
        { accessToken : Api.Token
        , refreshToken : Api.Token
        , userWithProfile : User.WithProfile
        }


addUserWithProfile : User.WithProfile -> LogInState -> LogInState
addUserWithProfile userWithProfile logInState =
    case logInState of
        None ->
            None

        LoadingProfile { accessToken, refreshToken } ->
            Ok
                { accessToken = accessToken
                , refreshToken = refreshToken
                , userWithProfile = userWithProfile
                }

        Ok { accessToken, refreshToken } ->
            Ok
                { accessToken = accessToken
                , refreshToken = refreshToken
                , userWithProfile = userWithProfile
                }


getAccessToken : LogInState -> Maybe Api.Token
getAccessToken logInState =
    case logInState of
        None ->
            Nothing

        LoadingProfile { accessToken } ->
            Just accessToken

        Ok { accessToken } ->
            Just accessToken
