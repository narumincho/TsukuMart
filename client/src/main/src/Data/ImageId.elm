module Data.ImageId exposing (ImageId, fromString, toUrlString)


type ImageId
    = ImageId String


fromString : String -> ImageId
fromString =
    ImageId


toUrlString : ImageId -> String
toUrlString (ImageId id) =
    "https://asia-northeast1-tsukumart-f0971.cloudfunctions.net/image/" ++ id
