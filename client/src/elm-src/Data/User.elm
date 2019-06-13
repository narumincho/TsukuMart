module Data.User exposing
    ( Profile
    , User
    , UserId
    , getProfile
    , getUserId
    , makeFromApi
    , makeFromUserIdAndProfile
    , makeProfile
    , profileGetIntroduction
    , profileGetDisplayName
    , profileGetUniversity
    , setProfile
    , userIdFromString
    , userIdToString
    )

import Data.University as University


type User
    = User UserId Profile


type Profile
    = Profile
        { introduction : String
        , university : University.University
        , displayName : String
        }


{-| ユーザーを識別するためのID
-}
type UserId
    = UserId String


userIdToString : UserId -> String
userIdToString (UserId id) =
    id


userIdFromString : String -> UserId
userIdFromString =
    UserId


makeFromApi :
    { id : UserId
    , introduction : String
    , university : Maybe University.University
    , displayName : String
    }
    -> Maybe User
makeFromApi { id, introduction, university, displayName } =
    case university of
        Just u ->
            Just
                (User
                    id
                    (Profile
                        { introduction = introduction
                        , university = u
                        , displayName = displayName
                        }
                    )
                )

        Nothing ->
            Nothing


makeProfile : { displayName : String, introduction : String, university : University.University } -> Profile
makeProfile =
    Profile


makeFromUserIdAndProfile : UserId -> Profile -> User
makeFromUserIdAndProfile =
    User


getUserId : User -> UserId
getUserId (User id _) =
    id


profileGetIntroduction : Profile -> String
profileGetIntroduction (Profile { introduction }) =
    introduction


profileGetUniversity : Profile -> University.University
profileGetUniversity (Profile { university }) =
    university


profileGetDisplayName : Profile -> String
profileGetDisplayName (Profile { displayName }) =
    displayName


{-| プロフィールを取得する
-}
getProfile : User -> Profile
getProfile (User _ profile) =
    profile


{-| プロフィールを変更する
-}
setProfile : Profile -> User -> User
setProfile profile (User userId _) =
    User userId profile
