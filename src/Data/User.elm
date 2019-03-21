module Data.User exposing (User, UserId, getIntroduction, getNickName, getUniversity, make, userIdFromInt, userIdToInt)

import Data.University as University


type User
    = User
        { id : UserId
        , introduction : String
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


make : { id : UserId, introduction : String, university : University.University, nickName : String } -> User
make =
    User


getIntroduction : User -> String
getIntroduction (User { introduction }) =
    introduction


getUniversity : User -> University.University
getUniversity (User { university }) =
    university


getNickName : User -> String
getNickName (User { nickName }) =
    nickName
