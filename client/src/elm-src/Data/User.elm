module Data.User exposing
    ( Profile
    , User
    , UserId
    , getProfile
    , getUserId
    , makeFromApi
    , makeProfile
    , profileGetIntroduction
    , profileGetNickName
    , profileGetUniversity
    , setProfile
    , userIdFromInt
    , userIdToInt
    , userIdToString
    )

import Data.University as University


type User
    = User UserId Profile


type Profile
    = Profile
        { introduction : String
        , university : University.University
        , nickName : String
        }


{-| ユーザーを識別するためのID
-}
type UserId
    = UserId Int


userIdToInt : UserId -> Int
userIdToInt (UserId id) =
    id


userIdToString : UserId -> String
userIdToString (UserId id) =
    String.fromInt id


userIdFromInt : Int -> UserId
userIdFromInt =
    UserId


makeFromApi : { id : UserId, introduction : String, university : University.University, nickName : String } -> User
makeFromApi { id, introduction, university, nickName } =
    User
        id
        (Profile
            { introduction = introduction
            , university = university
            , nickName = nickName
            }
        )


makeProfile : { nickName : String, introduction : String, university : University.University } -> Profile
makeProfile =
    Profile


getUserId : User -> UserId
getUserId (User id _) =
    id


profileGetIntroduction : Profile -> String
profileGetIntroduction (Profile { introduction }) =
    introduction


profileGetUniversity : Profile -> University.University
profileGetUniversity (Profile { university }) =
    university


profileGetNickName : Profile -> String
profileGetNickName (Profile { nickName }) =
    nickName


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
