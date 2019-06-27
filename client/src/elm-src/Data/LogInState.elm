module Data.LogInState exposing
    ( LogInState(..)
    , addUserWithNameAndLikedProductIds
    , getAccessToken
    , likeProduct
    , unlikeProduct
    , updateWithName
    )

import Api
import Data.Product as Product
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
        , userWithName : User.WithName
        , likedProductIds : List Product.Id
        }


addUserWithNameAndLikedProductIds : ( User.WithName, List Product.Id ) -> LogInState -> LogInState
addUserWithNameAndLikedProductIds ( userWithName, likedProductIds ) logInState =
    case logInState of
        None ->
            None

        LoadingProfile rec ->
            Ok
                { accessToken = rec.accessToken
                , refreshToken = rec.refreshToken
                , userWithName = userWithName
                , likedProductIds = likedProductIds
                }

        Ok rec ->
            Ok
                { rec
                    | userWithName = userWithName
                    , likedProductIds = likedProductIds
                }


updateWithName : User.WithName -> LogInState -> LogInState
updateWithName userWithName logInState =
    case logInState of
        Ok rec ->
            Ok { rec | userWithName = userWithName }

        _ ->
            logInState


likeProduct : Product.Id -> LogInState -> LogInState
likeProduct id logInState =
    case logInState of
        Ok rec ->
            Ok
                { rec
                    | likedProductIds =
                        if List.member id rec.likedProductIds then
                            rec.likedProductIds

                        else
                            id :: rec.likedProductIds
                }

        _ ->
            logInState


unlikeProduct : Product.Id -> LogInState -> LogInState
unlikeProduct id logInState =
    case logInState of
        Ok rec ->
            Ok
                { rec
                    | likedProductIds =
                        rec.likedProductIds
                            |> List.filterMap
                                (\i ->
                                    if i == id then
                                        Nothing

                                    else
                                        Just i
                                )
                }

        _ ->
            logInState


getAccessToken : LogInState -> Maybe Api.Token
getAccessToken logInState =
    case logInState of
        None ->
            Nothing

        LoadingProfile { accessToken } ->
            Just accessToken

        Ok { accessToken } ->
            Just accessToken
