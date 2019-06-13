module Data.User exposing
    ( UserId
    , WithName
    , WithProfile
    , idFromString
    , idToString
    , withNameFromApi
    , withNameGetDisplayName
    , withNameGetId
    , withNameGetImageUrl
    , withProfileFromApi
    , withProfileGetDisplayName
    , withProfileGetId
    , withProfileGetImageUrl
    , withProfileGetIntroduction
    , withProfileGetUniversity
    )

import Data.University as University


{-| IDと名前との情報をまであるユーザー
-}
type WithName
    = WithName
        { id : UserId
        , displayName : String
        , imageUrl : String
        }


{-| プロフィールの情報まであるユーザー
-}
type WithProfile
    = WithProfile
        { id : UserId
        , displayName : String
        , imageUrl : String
        , introduction : String
        , university : University.University
        }


{-| ユーザーを識別するためのID
-}
type UserId
    = UserId String


idToString : UserId -> String
idToString (UserId id) =
    id


idFromString : String -> UserId
idFromString =
    UserId


withNameFromApi : { id : String, displayName : String, imageUrl : String } -> WithName
withNameFromApi { id, displayName, imageUrl } =
    WithName
        { id = idFromString id
        , displayName = displayName
        , imageUrl = imageUrl
        }


withProfileFromApi : { id : String, displayName : String, imageUrl : String, introduction : String, university : Maybe University.University } -> Maybe WithProfile
withProfileFromApi { id, displayName, imageUrl, introduction, university } =
    university
        |> Maybe.map
            (\u ->
                WithProfile
                    { id = idFromString id
                    , displayName = displayName
                    , imageUrl = imageUrl
                    , introduction = introduction
                    , university = u
                    }
            )


withNameGetId : WithName -> UserId
withNameGetId (WithName { id }) =
    id


withNameGetDisplayName : WithName -> String
withNameGetDisplayName (WithName { displayName }) =
    displayName


withNameGetImageUrl : WithName -> String
withNameGetImageUrl (WithName { imageUrl }) =
    imageUrl


withProfileGetId : WithProfile -> UserId
withProfileGetId (WithProfile { id }) =
    id


withProfileGetDisplayName : WithProfile -> String
withProfileGetDisplayName (WithProfile { displayName }) =
    displayName


withProfileGetImageUrl : WithProfile -> String
withProfileGetImageUrl (WithProfile { imageUrl }) =
    imageUrl


withProfileGetIntroduction : WithProfile -> String
withProfileGetIntroduction (WithProfile { introduction }) =
    introduction


withProfileGetUniversity : WithProfile -> University.University
withProfileGetUniversity (WithProfile { university }) =
    university
