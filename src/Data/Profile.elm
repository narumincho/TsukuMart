module Data.Profile exposing (Profile, getIntroduction, getNickName, getUniversity, make)

import Data.University as University


type Profile
    = Profile
        { introduction : String
        , university : University.University
        , nickName : String
        }


make : { introduction : String, university : University.University, nickName : String } -> Profile
make =
    Profile


getIntroduction : Profile -> String
getIntroduction (Profile { introduction }) =
    introduction


getUniversity : Profile -> University.University
getUniversity (Profile { university }) =
    university


getNickName : Profile -> String
getNickName (Profile { nickName }) =
    nickName
