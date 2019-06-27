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
    , withProfileToWithName)

import Data.University as University


{-| IDと名前との情報をまであるユーザー
-}
type WithName
    = WithName
        { id : Id
        , displayName : String
        , imageId : String
        }


{-| プロフィールの情報まであるユーザー
-}
type WithProfile
    = WithProfile
        { id : Id
        , displayName : String
        , imageId : String
        , introduction : String
        , university : University.University
        }

withProfileToWithName : WithProfile -> WithName
withProfileToWithName (WithProfile rec) =
    WithName
        { id = rec.id
        , displayName = rec.displayName
        , imageId = rec.imageId
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


withNameFromApi : { id : String, displayName : String, imageId : String } -> WithName
withNameFromApi { id, displayName, imageId } =
    WithName
        { id = idFromString id
        , displayName = displayName
        , imageId = imageId
        }


withProfileFromApi : { id : String, displayName : String, imageId : String, introduction : String, university : Maybe University.University } -> Maybe WithProfile
withProfileFromApi { id, displayName, imageId, introduction, university } =
    university
        |> Maybe.map
            (\u ->
                WithProfile
                    { id = idFromString id
                    , displayName = displayName
                    , imageId = imageId
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
withNameGetImageUrl (WithName { imageId }) =
    "https://asia-northeast1-tsukumart-f0971.cloudfunctions.net/image/" ++ imageId


withProfileGetId : WithProfile -> Id
withProfileGetId (WithProfile { id }) =
    id


withProfileGetDisplayName : WithProfile -> String
withProfileGetDisplayName (WithProfile { displayName }) =
    displayName


withProfileGetImageUrl : WithProfile -> String
withProfileGetImageUrl (WithProfile { imageId }) =
    "https://asia-northeast1-tsukumart-f0971.cloudfunctions.net/image/" ++ imageId


withProfileGetIntroduction : WithProfile -> String
withProfileGetIntroduction (WithProfile { introduction }) =
    introduction


withProfileGetUniversity : WithProfile -> University.University
withProfileGetUniversity (WithProfile { university }) =
    university
