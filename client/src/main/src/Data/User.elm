module Data.User exposing
    ( Id
    , WithName
    , WithProfile
    , idFromString
    , idToString
    , searchFromId
    , withNameFromApi
    , withNameGetDisplayName
    , withNameGetId
    , withNameGetImageId
    , withProfileFromApi
    , withProfileGetDisplayName
    , withProfileGetId
    , withProfileGetImageId
    , withProfileGetIntroduction
    , withProfileGetUniversity
    , withProfileToWithName
    )

import Data.ImageId as ImageId
import Data.University as University


{-| IDと名前との情報をまであるユーザー
-}
type WithName
    = WithName
        { id : Id
        , displayName : String
        , imageId : ImageId.ImageId
        }


{-| プロフィールの情報まであるユーザー
-}
type WithProfile
    = WithProfile
        { id : Id
        , displayName : String
        , imageId : ImageId.ImageId
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


withNameFromApi : { id : String, displayName : String, imageId : ImageId.ImageId } -> WithName
withNameFromApi { id, displayName, imageId } =
    WithName
        { id = idFromString id
        , displayName = displayName
        , imageId = imageId
        }


withProfileFromApi :
    { id : String
    , displayName : String
    , imageId : ImageId.ImageId
    , introduction : String
    , university : Maybe University.University
    }
    -> Maybe WithProfile
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


withNameGetImageId : WithName -> ImageId.ImageId
withNameGetImageId (WithName { imageId }) =
    imageId


withProfileGetId : WithProfile -> Id
withProfileGetId (WithProfile { id }) =
    id


withProfileGetDisplayName : WithProfile -> String
withProfileGetDisplayName (WithProfile { displayName }) =
    displayName


withProfileGetImageId : WithProfile -> ImageId.ImageId
withProfileGetImageId (WithProfile { imageId }) =
    imageId


withProfileGetIntroduction : WithProfile -> String
withProfileGetIntroduction (WithProfile { introduction }) =
    introduction


withProfileGetUniversity : WithProfile -> University.University
withProfileGetUniversity (WithProfile { university }) =
    university


searchFromId : Id -> List WithName -> Maybe WithName
searchFromId id list =
    case list of
        x :: xs ->
            if withNameGetId x == id then
                Just x

            else
                searchFromId id xs

        [] ->
            Nothing
