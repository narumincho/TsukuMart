module Data.User exposing
    ( Profile
    , User
    , UserId
    , getIntroduction
    , getNickName
    , getUniversity
    , getUserId
    , makeFromApi
    , userIdFromInt
    , userIdToInt
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


getUserId : User -> UserId
getUserId (User id _) =
    id


getIntroduction : User -> String
getIntroduction (User _ (Profile { introduction })) =
    introduction


getUniversity : User -> University.University
getUniversity (User _ (Profile { university })) =
    university


getNickName : User -> String
getNickName (User _ (Profile { nickName })) =
    nickName
