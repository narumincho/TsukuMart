module Data.Product exposing
    ( Comment
    , Condition
    , Id
    , Product
    , ProductDetail
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
    , detailFromApi
    , detailGetCategory
    , detailGetCommentList
    , detailGetCondition
    , detailGetCreatedAt
    , detailGetDescription
    , detailGetId
    , detailGetImageIds
    , detailGetImageUrls
    , detailGetLikedCount
    , detailGetName
    , detailGetPrice
    , detailGetSeller
    , detailGetStatus
    , detailUpdateLikedCount
    , fromApi
    , fromDetail
    , getId
    , getLikedCount
    , getName
    , getPrice
    , getStatus
    , getThumbnailImageUrl
    , idFromString
    , idToString
    , priceToString
    , priceToStringWithoutYen
    , searchFromId
    , setCommentList
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
        , name : String
        , price : Int
        , category : Category.Category
        , status : Status
        , thumbnailImageId : ImageId.ImageId
        , likedCount : Int
        }


type ProductDetail
    = ProductDetail
        { id : Id
        , name : String
        , description : String
        , price : Int
        , condition : Condition
        , category : Category.Category
        , status : Status
        , imageIds : ( ImageId.ImageId, List ImageId.ImageId )
        , likedCount : Int
        , seller : User.WithName
        , commentList : Maybe (List Comment)
        , createdAt : Time.Posix
        }


type Id
    = Id String


idToString : Id -> String
idToString (Id id) =
    id


idFromString : String -> Id
idFromString =
    Id


fromApi :
    { id : String
    , name : String
    , price : Int
    , category : Category.Category
    , status : Status
    , thumbnailImageId : ImageId.ImageId
    , likedCount : Int
    }
    -> Product
fromApi rec =
    Product
        { id = Id rec.id
        , name = rec.name
        , price = rec.price
        , status = rec.status
        , category = rec.category
        , thumbnailImageId = rec.thumbnailImageId
        , likedCount = rec.likedCount
        }


detailFromApi :
    { id : String
    , name : String
    , description : String
    , price : Int
    , condition : Condition
    , category : Category.Category
    , status : Status
    , imageIds : ( ImageId.ImageId, List ImageId.ImageId )
    , likedCount : Int
    , seller : User.WithName
    , createdAt : Time.Posix
    }
    -> ProductDetail
detailFromApi rec =
    ProductDetail
        { id = Id rec.id
        , name = rec.name
        , description = rec.description
        , price = rec.price
        , condition = rec.condition
        , category = rec.category
        , status = rec.status
        , imageIds = rec.imageIds
        , likedCount = rec.likedCount
        , seller = rec.seller
        , commentList = Nothing
        , createdAt = rec.createdAt
        }


setCommentList : List Comment -> ProductDetail -> ProductDetail
setCommentList commentList (ProductDetail rec) =
    ProductDetail { rec | commentList = Just commentList }



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


{-| 詳細データから簡易データの形式にするが、サムネイル画像は商品画像の0枚目になる
-}
fromDetail : ProductDetail -> Product
fromDetail (ProductDetail rec) =
    Product
        { id = rec.id
        , name = rec.name
        , price = rec.price
        , category = rec.category
        , status = rec.status
        , thumbnailImageId = Tuple.first rec.imageIds
        , likedCount = rec.likedCount
        }


{-| 商品のID
-}
getId : Product -> Id
getId (Product { id }) =
    id


detailGetId : ProductDetail -> Id
detailGetId (ProductDetail { id }) =
    id


{-| 商品の名前
-}
getName : Product -> String
getName (Product { name }) =
    name


detailGetName : ProductDetail -> String
detailGetName (ProductDetail { name }) =
    name


{-| いいねをされた数
-}
getLikedCount : Product -> Int
getLikedCount (Product { likedCount }) =
    likedCount


detailGetLikedCount : ProductDetail -> Int
detailGetLikedCount (ProductDetail { likedCount }) =
    likedCount


{-| いいねの数を更新する
-}
updateLikedCount : Int -> Product -> Product
updateLikedCount likedCount (Product rec) =
    Product { rec | likedCount = likedCount }


detailUpdateLikedCount : Int -> ProductDetail -> ProductDetail
detailUpdateLikedCount likedCount (ProductDetail rec) =
    ProductDetail { rec | likedCount = likedCount }


{-| 商品の説明
-}
detailGetDescription : ProductDetail -> String
detailGetDescription (ProductDetail { description }) =
    description


{-| 商品のカテゴリー
-}
detailGetCategory : ProductDetail -> Category.Category
detailGetCategory (ProductDetail { category }) =
    category


{-| 商品の価格
-}
getPrice : Product -> Int
getPrice (Product { price }) =
    price


detailGetPrice : ProductDetail -> Int
detailGetPrice (ProductDetail { price }) =
    price


{-| 商品の状態
-}
detailGetCondition : ProductDetail -> Condition
detailGetCondition (ProductDetail { condition }) =
    condition


{-| 商品のサムネイル画像のURL
-}
getThumbnailImageUrl : Product -> String
getThumbnailImageUrl (Product { thumbnailImageId }) =
    ImageId.toUrlString thumbnailImageId


detailGetImageUrls : ProductDetail -> List String
detailGetImageUrls =
    detailGetImageIds >> List.map ImageId.toUrlString


detailGetImageIds : ProductDetail -> List ImageId.ImageId
detailGetImageIds (ProductDetail { imageIds }) =
    Tuple.first imageIds
        :: Tuple.second imageIds


{-| 出品者を取得する
-}
detailGetSeller : ProductDetail -> User.WithName
detailGetSeller (ProductDetail { seller }) =
    seller


getStatus : Product -> Status
getStatus (Product { status }) =
    status


detailGetStatus : ProductDetail -> Status
detailGetStatus (ProductDetail { status }) =
    status


detailGetCreatedAt : ProductDetail -> Time.Posix
detailGetCreatedAt (ProductDetail { createdAt }) =
    createdAt


{-| 商品のコメントを取得する
-}
detailGetCommentList : ProductDetail -> Maybe (List Comment)
detailGetCommentList (ProductDetail { commentList }) =
    commentList


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


searchFromId : Id -> List Product -> Maybe Product
searchFromId id list =
    case list of
        x :: xs ->
            if getId x == id then
                Just x

            else
                searchFromId id xs

        [] ->
            Nothing


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
