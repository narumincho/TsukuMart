module Data.Product exposing
    ( Comment
    , Condition
    , Firestore
    , Id
    , Product
    , Status(..)
    , commentFromApi
    , commentGetBody
    , commentGetCreatedAt
    , commentGetSpeaker
    , conditionAll
    , conditionFromIdString
    , conditionFromIndex
    , conditionToIdString
    , conditionToIndex
    , conditionToJapaneseString
    , getCreatedAt
    , fromApi
    , fromFirestore
    , getCategory
    , getCondition
    , getDescription
    , getId
    , getImageIds
    , getImageUrls
    , getLikedCount
    , getName
    , getPrice
    , getSeller
    , getStatus
    , getThumbnailImageUrl
    , idFromString
    , idToString
    , priceToString
    , priceToStringWithoutYen
    , searchFromId
    , statusAll
    , statusFromIdString
    , statusToIdString
    , statusToJapaneseString
    , updateById
    , updateLikedCount
    )

{-| 商品
-}

import Data.Category as Category
import Data.ImageId as ImageId
import Data.User as User
import Time
import Utility


type Product
    = Product
        { id : Id
        , category : Category.Category
        , condition : Condition
        , createdAt : Time.Posix
        , description : String
        , imageIds : ( ImageId.ImageId, List ImageId.ImageId )
        , likedCount : Int
        , name : String
        , price : Int
        , seller : User.WithName
        , status : Status
        , thumbnailImageId : ImageId.ImageId
        , updateAt : Time.Posix
        }


type alias Firestore =
    { id : String
    , category : String
    , condition : String
    , createdAt : Int
    , description : String
    , imageIds : List String
    , likedCount : Int
    , name : String
    , price : Int
    , sellerDisplayName : String
    , sellerId : String
    , sellerImageId : String
    , status : String
    , thumbnailImageId : String
    , updateAt : Int
    }


type Id
    = Id String


idToString : Id -> String
idToString (Id id) =
    id


idFromString : String -> Id
idFromString =
    Id


fromFirestore : Firestore -> Maybe Product
fromFirestore rec =
    case ( Category.fromIdString rec.category, statusFromIdString rec.status, ( conditionFromIdString rec.condition, rec.imageIds ) ) of
        ( Just category, Just status, ( Just condition, imageIdFirst :: imageIdOthers ) ) ->
            Just
                (Product
                    { id = Id rec.id
                    , category = category
                    , condition = condition
                    , createdAt = Time.millisToPosix rec.createdAt
                    , description = rec.description
                    , imageIds = ( ImageId.fromString imageIdFirst, imageIdOthers |> List.map ImageId.fromString )
                    , likedCount = rec.likedCount
                    , name = rec.name
                    , price = rec.price
                    , seller =
                        User.withNameFromApi
                            { id = rec.sellerId
                            , displayName = rec.sellerDisplayName
                            , imageId = ImageId.fromString rec.sellerImageId
                            }
                    , status = status
                    , thumbnailImageId = ImageId.fromString rec.thumbnailImageId
                    , updateAt = Time.millisToPosix rec.updateAt
                    }
                )

        ( _, _, ( _, _ ) ) ->
            Nothing


fromApi :
    { id : String
    , category : Category.Category
    , condition : Condition
    , createdAt : Time.Posix
    , description : String
    , imageIds : ( ImageId.ImageId, List ImageId.ImageId )
    , likedCount : Int
    , name : String
    , price : Int
    , seller : User.WithName
    , status : Status
    , thumbnailImageId : ImageId.ImageId
    , updateAt : Time.Posix
    }
    -> Product
fromApi rec =
    Product
        { id = Id rec.id
        , category = rec.category
        , condition = rec.condition
        , createdAt = rec.createdAt
        , description = rec.description
        , imageIds = rec.imageIds
        , likedCount = rec.likedCount
        , name = rec.name
        , price = rec.price
        , seller = rec.seller
        , status = rec.status
        , thumbnailImageId = rec.thumbnailImageId
        , updateAt = rec.updateAt
        }



{- ============================================================
                        Condition
   ============================================================
-}


type Condition
    = ConditionNew
    | ConditionLikeNew
    | ConditionVeryGood
    | ConditionGood
    | ConditionAcceptable
    | ConditionJunk


conditionAll : List Condition
conditionAll =
    [ ConditionNew
    , ConditionLikeNew
    , ConditionVeryGood
    , ConditionGood
    , ConditionAcceptable
    , ConditionJunk
    ]


conditionToIndex : Condition -> Int
conditionToIndex condition =
    conditionAll
        |> Utility.getFirstIndex condition
        |> Maybe.withDefault 0


conditionFromIndex : Int -> Maybe Condition
conditionFromIndex index =
    conditionAll
        |> Utility.getAt index


conditionToJapaneseString : Condition -> String
conditionToJapaneseString condition =
    case condition of
        ConditionNew ->
            "新品・未使用"

        ConditionLikeNew ->
            "ほぼ未使用"

        ConditionVeryGood ->
            "目立った傷や汚れなし"

        ConditionGood ->
            "多少の傷や汚れあり"

        ConditionAcceptable ->
            "目立つ傷や汚れあり"

        ConditionJunk ->
            "状態が悪い・ジャンク"


conditionToIdString : Condition -> String
conditionToIdString condition =
    case condition of
        ConditionNew ->
            "new"

        ConditionLikeNew ->
            "likeNew"

        ConditionVeryGood ->
            "veryGood"

        ConditionGood ->
            "good"

        ConditionAcceptable ->
            "acceptable"

        ConditionJunk ->
            "junk"


conditionFromIdString : String -> Maybe Condition
conditionFromIdString idString =
    conditionFromStringLoop idString conditionAll


conditionFromStringLoop : String -> List Condition -> Maybe Condition
conditionFromStringLoop idString conditionList =
    case conditionList of
        x :: xs ->
            if conditionToIdString x == idString then
                Just x

            else
                conditionFromStringLoop idString xs

        [] ->
            Nothing



{- ============================================================
                            Status
   ============================================================
-}


type Status
    = Selling
    | Trading
    | SoldOut


statusAll : List Status
statusAll =
    [ Selling, Trading, SoldOut ]


statusToIdString : Status -> String
statusToIdString status =
    case status of
        Selling ->
            "selling"

        Trading ->
            "trading"

        SoldOut ->
            "soldOut"


statusFromIdString : String -> Maybe Status
statusFromIdString idString =
    statusFromIdStringLoop idString statusAll


statusFromIdStringLoop : String -> List Status -> Maybe Status
statusFromIdStringLoop idString statusList =
    case statusList of
        x :: xs ->
            if statusToIdString x == idString then
                Just x

            else
                statusFromIdStringLoop idString xs

        [] ->
            Nothing


statusToJapaneseString : Status -> String
statusToJapaneseString status =
    case status of
        Selling ->
            "出品中"

        Trading ->
            "取引中"

        SoldOut ->
            "売却済み"



{- ============================================================
                        Condition
   ============================================================
-}


type Comment
    = Comment
        { body : String
        , createdAt : Time.Posix
        , speaker : User.WithName
        }


commentFromApi : { body : String, createdAt : Time.Posix, speaker : User.WithName } -> Comment
commentFromApi =
    Comment


commentGetBody : Comment -> String
commentGetBody (Comment { body }) =
    body


commentGetCreatedAt : Comment -> Time.Posix
commentGetCreatedAt (Comment { createdAt }) =
    createdAt


commentGetSpeaker : Comment -> User.WithName
commentGetSpeaker (Comment { speaker }) =
    speaker


{-| 商品のID
-}
getId : Product -> Id
getId (Product { id }) =
    id


{-| 商品の名前
-}
getName : Product -> String
getName (Product { name }) =
    name


{-| いいねをされた数
-}
getLikedCount : Product -> Int
getLikedCount (Product { likedCount }) =
    likedCount


{-| いいねの数を更新する
-}
updateLikedCount : Int -> Product -> Product
updateLikedCount likedCount (Product rec) =
    Product { rec | likedCount = likedCount }


{-| 商品の説明
-}
getDescription : Product -> String
getDescription (Product { description }) =
    description


{-| 商品のカテゴリー
-}
getCategory : Product -> Category.Category
getCategory (Product { category }) =
    category


{-| 商品の価格
-}
getPrice : Product -> Int
getPrice (Product { price }) =
    price


{-| 商品の状態
-}
getCondition : Product -> Condition
getCondition (Product { condition }) =
    condition


{-| 商品のサムネイル画像のURL
-}
getThumbnailImageUrl : Product -> String
getThumbnailImageUrl (Product { thumbnailImageId }) =
    ImageId.toUrlString thumbnailImageId


getImageUrls : Product -> List String
getImageUrls =
    getImageIds >> List.map ImageId.toUrlString


getImageIds : Product -> List ImageId.ImageId
getImageIds (Product { imageIds }) =
    Tuple.first imageIds
        :: Tuple.second imageIds


{-| 出品者を取得する
-}
getSeller : Product -> User.WithName
getSeller (Product { seller }) =
    seller


{-| 商品の取引状態を取得する
-}
getStatus : Product -> Status
getStatus (Product { status }) =
    status


{-| 出品日を取得する
-}
getCreatedAt : Product -> Time.Posix
getCreatedAt (Product { createdAt }) =
    createdAt


{-| 価格(整数)を3桁ごとに,をつけ、円を末尾に追加。例 5120 → 5,120円
-}
priceToString : Int -> String
priceToString price =
    priceToStringWithoutYen price ++ "円"


{-| 価格(整数)を3桁ごとに,がついたものにする。例 5120 → 5,120
-}
priceToStringWithoutYen : Int -> String
priceToStringWithoutYen price =
    (if price < 1000 then
        ( price, [] )

     else if price < 1000000 then
        ( price // 1000, [ price |> modBy 1000 ] )

     else
        ( price // 1000000, [ price // 1000 |> modBy 1000, price |> modBy 1000 ] )
    )
        |> Tuple.mapFirst String.fromInt
        |> Tuple.mapSecond (List.map (String.fromInt >> String.padLeft 3 '0'))
        |> (\( a, b ) -> a :: b)
        |> String.join ","


searchFromId : Id -> List Product -> Product
searchFromId id list =
    case list of
        x :: xs ->
            if getId x == id then
                x

            else
                searchFromId id xs

        [] ->
            Product
                { id = Id "unknown"
                , category = Category.FurnitureOther
                , condition = ConditionJunk
                , createdAt = Time.millisToPosix 0
                , description = "存在しない商品"
                , imageIds = ( ImageId.fromString "unknown", [] )
                , likedCount = 0
                , name = "?????????"
                , price = 0
                , seller =
                    User.withNameFromApi
                        { id = "unknownUser"
                        , displayName = "???"
                        , imageId = ImageId.fromString "unknown"
                        }
                , status = Selling
                , thumbnailImageId = ImageId.fromString "unknown"
                , updateAt = Time.millisToPosix 0
                }


updateById : Id -> (Product -> Product) -> List Product -> List Product
updateById id f list =
    case list of
        x :: xs ->
            if getId x == id then
                f x :: updateById id f xs

            else
                x :: updateById id f xs

        [] ->
            []
