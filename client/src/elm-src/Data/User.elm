module Data.User exposing
    ( Id
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
        { id : Id
        , displayName : String
        , imageUrl : String
        }


{-| プロフィールの情報まであるユーザー
-}
type WithProfile
    = WithProfile
        { id : Id
        , displayName : String
        , imageUrl : String
        , introduction : String
        , university : University.University
        }


{-| ユーザーを識別するためのID
-}
type Id
    = Id String


idToString : Id -> String
idToString (Id id) =
    id


idFromString : String -> Id
idFromString =
    Id


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


withNameGetId : WithName -> Id
withNameGetId (WithName { id }) =
    id


withNameGetDisplayName : WithName -> String
withNameGetDisplayName (WithName { displayName }) =
    displayName


withNameGetImageUrl : WithName -> String
withNameGetImageUrl (WithName { imageUrl }) =
    imageUrl


withProfileGetId : WithProfile -> Id
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
