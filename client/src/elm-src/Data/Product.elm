module Data.Product exposing
    ( Comment
    , Condition
    , Id
    , Product
    , ProductDetail
    , Status
    , addComment
    , commentFromApi
    , commentGetBody
    , commentGetCreatedAt
    , commentGetSpeaker
    , conditionAll
    , conditionFromIdString
    , conditionIndex
    , conditionToIdString
    , conditionToJapaneseString
    , createdAtToString
    , detailGetCommentList
    , detailGetCondition
    , detailGetDescription
    , detailGetId
    , detailGetImageUrls
    , detailGetLikedCount
    , detailGetName
    , detailGetPrice
    , detailGetSeller
    , detailUpdateLikedCount
    , fromDetail
    , getId
    , getLikedCount
    , getName
    , getPrice
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
    , updateById
    , updateLikedCount
    )

{-| 商品
-}

import Data.Category as Category
import Data.ImageId as ImageId
import Data.User as User
import Time
import Time.Extra
import Utility


type Product
    = Product
        { id : Id
        , name : String
        , price : Int
        , category : Category.SubCategory
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
        , category : Category.SubCategory
        , status : Status
        , imageIds : ( ImageId.ImageId, List ImageId.ImageId )
        , likedCount : Int
        , seller : User.WithName
        , commentList : Maybe (List Comment)
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
    , category : Category.SubCategory
    , status : Status
    , thumbnailImageId : ImageId.ImageId
    , likeCount : Int
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
        , likedCount = max 0 rec.likeCount
        }


detailFromApi :
    { id : String
    , name : String
    , description : String
    , price : Int
    , condition : Condition
    , category : Category.SubCategory
    , status : Status
    , imageIds : ( ImageId.ImageId, List ImageId.ImageId )
    , likedCount : Int
    , seller : User.WithName
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
        }


setCommentList : List Comment -> ProductDetail -> ProductDetail
setCommentList commentList (ProductDetail rec) =
    ProductDetail { rec | commentList = Just commentList }


addComment : Comment -> ProductDetail -> ProductDetail
addComment comment (ProductDetail rec) =
    case rec.commentList of
        Just commentList ->
            ProductDetail
                { rec
                    | commentList =
                        Just
                            (commentList ++ [ comment ])
                }

        _ ->
            ProductDetail rec



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


conditionIndex : Condition -> Int
conditionIndex condition =
    Utility.getFirstIndex condition conditionAll
        |> Maybe.withDefault 0


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
detailGetImageUrls (ProductDetail { imageIds }) =
    Tuple.first imageIds
        :: Tuple.second imageIds
        |> List.map ImageId.toUrlString


{-| 出品者を取得する
-}
detailGetSeller : ProductDetail -> User.WithName
detailGetSeller (ProductDetail { seller }) =
    seller


{-| 商品のコメントを取得する
-}
detailGetCommentList : ProductDetail -> Maybe (List Comment)
detailGetCommentList (ProductDetail { commentList }) =
    commentList


createdAtToString : Maybe ( Time.Posix, Time.Zone ) -> Time.Posix -> String
createdAtToString nowMaybe createdTime =
    case nowMaybe of
        Just ( nowPosix, zone ) ->
            if (nowPosix |> Time.Extra.diff Time.Extra.Month zone createdTime) == 0 then
                let
                    diffDay =
                        nowPosix
                            |> Time.Extra.diff Time.Extra.Day zone createdTime

                    diffHour =
                        nowPosix
                            |> Time.Extra.diff Time.Extra.Hour zone createdTime

                    diffMinute =
                        nowPosix
                            |> Time.Extra.diff Time.Extra.Minute zone createdTime

                    diffSecond =
                        nowPosix
                            |> Time.Extra.diff Time.Extra.Second zone createdTime
                in
                if diffDay /= 0 then
                    String.fromInt diffDay ++ "日前"

                else if diffHour /= 0 then
                    String.fromInt diffHour ++ "時間前"

                else if diffMinute /= 0 then
                    String.fromInt diffMinute ++ "分前"

                else
                    String.fromInt diffSecond ++ "秒前"

            else
                posixAndZoneToString createdTime zone

        Nothing ->
            posixAndZoneToString createdTime Time.utc ++ "(UTC)"


posixAndZoneToString : Time.Posix -> Time.Zone -> String
posixAndZoneToString posix zone =
    timeToString
        { year = Time.toYear zone posix
        , month = Time.toMonth zone posix
        , day = Time.toDay zone posix
        , hour = Time.toHour zone posix
        , minute = Time.toMinute zone posix
        , second = Time.toSecond zone posix
        }


timeToString : { year : Int, month : Time.Month, day : Int, hour : Int, minute : Int, second : Int } -> String
timeToString { year, month, day, hour, minute, second } =
    String.concat
        [ year |> String.fromInt |> String.padLeft 4 '0'
        , "/"
        , month |> monthToString |> String.padLeft 2 '0'
        , "/"
        , day |> String.fromInt |> String.padLeft 2 '0'
        , " "
        , hour |> String.fromInt |> String.padLeft 2 '0'
        , ":"
        , minute |> String.fromInt |> String.padLeft 2 '0'
        , ":"
        , second |> String.fromInt |> String.padLeft 2 '0'
        ]


monthToString : Time.Month -> String
monthToString month =
    case month of
        Time.Jan ->
            "1"

        Time.Feb ->
            "2"

        Time.Mar ->
            "3"

        Time.Apr ->
            "4"

        Time.May ->
            "5"

        Time.Jun ->
            "6"

        Time.Jul ->
            "7"

        Time.Aug ->
            "8"

        Time.Sep ->
            "9"

        Time.Oct ->
            "10"

        Time.Nov ->
            "11"

        Time.Dec ->
            "12"


{-| 価格(整数)を3桁ごとに,がついたものにする
-}
priceToString : Int -> String
priceToString price =
    priceToStringWithoutYen price ++ "円"


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
