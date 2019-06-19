module Data.Product exposing
    ( Comment
    , Condition
    , CreatedTime(..)
    , Product
    , Id
    , Status
    , addComment
    , conditionAll
    , conditionFromString
    , conditionIndex
    , conditionToIdString
    , conditionToJapaneseString
    , createdAtToString
    , getCommentCreatedAtString
    , getCommentList
    , getCondition
    , getDescription
    , getFirstImageUrl
    , getId
    , getLikedCount
    , getName
    , getOthersImageUrlList
    , getPrice
    , getSellerId
    , getSellerName
    , idFromInt
    , idToString
    , like
    , listMapIf
    , makeDetailFromApi
    , makeNormalFromApi
    , priceToString
    , priceToStringWithoutYen
    , replaceCommentTimeStringToTimePosix
    , searchFromId
    , setCommentList
    , statusAll
    , statusFromIdString
    , statusToIdString
    , unlike
    )

{-| 商品
-}

import Data.User as User
import Time
import Time.Extra
import Utility


type Product
    = Product
        { id : Id
        , name : String -- 長さは1～255文字
        , description : String
        , price : Int
        , condition : Condition
        , status : Status
        , image0Url : String
        , image1Url : Maybe String
        , image2Url : Maybe String
        , image3Url : Maybe String
        , seller : User.UserId
        , sellerName : Maybe String
        , likeCount: Int
        , commentList : Maybe (List Comment)
        }


type Id
    = Id Int


idToString : Id -> String
idToString (Id id) =
    String.fromInt id


idFromInt : Int -> Id
idFromInt id =
    Id id


type alias Comment =
    { text : String
    , createdAt : CreatedTime
    , userName : String
    , userId : User.UserId
    }


type CreatedTime
    = CreatedTimeString String
    | CreatedTimePosix Time.Posix


makeNormalFromApi :
    { id : Int
    , name : String
    , description : String
    , price : Int
    , condition : Condition
    , status : Status
    , image0Url : String
    , image1Url : Maybe String
    , image2Url : Maybe String
    , image3Url : Maybe String
    , seller : String
    , likeCount : Int
    }
    -> Product
makeNormalFromApi { id, name, likeCount, description, price, condition, status, image0Url, image1Url, image2Url, image3Url, seller } =
    Product
        { id = Id id
        , name = name
        , description = description
        , price = price
        , condition = condition
        , status = status
        , image0Url = image0Url
        , image1Url = image1Url
        , image2Url = image2Url
        , image3Url = image3Url
        , seller = User.idFromString seller
        , sellerName = Nothing
        ,likeCount = max 0 likeCount
        , commentList = Nothing
        }


makeDetailFromApi :
    { id : Int
    , name : String
    , description : String
    , price : Int
    , condition : Condition
    , status : Status
    , image0Url : String
    , image1Url : Maybe String
    , image2Url : Maybe String
    , image3Url : Maybe String
    , seller : String
    , sellerName : String
    , likeCount : Int
    }
    -> Product
makeDetailFromApi { id, name, description, price, condition, status, image0Url, image1Url, image2Url, image3Url, seller, sellerName, likeCount } =
    Product
        { id = Id id
        , name = name
        , description = description
        , price = price
        , condition = condition
        , status = status
        , image0Url = image0Url
        , image1Url = image1Url
        , image2Url = image2Url
        , image3Url = image3Url
        , seller = User.idFromString seller
        , sellerName = Just sellerName
        , likeCount = max 0 likeCount
        , commentList = Nothing
        }


setCommentList : List Comment -> Product -> Product
setCommentList commentList (Product rec) =
    Product { rec | commentList = Just commentList }


addComment : Comment -> Product -> Product
addComment comment (Product rec) =
    case rec.commentList of
        Just commentList ->
            Product
                { rec
                    | commentList =
                        Just
                            (commentList ++ [ comment ])
                }

        _ ->
            Product rec


replaceCommentTimeStringToTimePosix : List Time.Posix -> Product -> Product
replaceCommentTimeStringToTimePosix timeList (Product rec) =
    case rec.commentList of
        Just commentList ->
            Product
                { rec
                    | commentList = Just (commentTimeStringToTimePosix commentList timeList)
                }

        _ ->
            Product rec


commentTimeStringToTimePosix : List Comment -> List Time.Posix -> List Comment
commentTimeStringToTimePosix commentList commentTimePosix =
    case ( commentList, commentTimePosix ) of
        ( cs :: csx, cp :: cpx ) ->
            { userName = cs.userName
            , createdAt = CreatedTimePosix cp
            , userId = cs.userId
            , text = cs.text
            }
                :: commentTimeStringToTimePosix csx cpx

        ( cs :: csx, [] ) ->
            cs
                :: commentTimeStringToTimePosix csx []

        ( [], _ ) ->
            []


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
            "New"

        ConditionLikeNew ->
            "Like New"

        ConditionVeryGood ->
            "Very Good"

        ConditionGood ->
            "Good"

        ConditionAcceptable ->
            "Acceptable"

        ConditionJunk ->
            "Junk"


conditionFromString : String -> Maybe Condition
conditionFromString idString =
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


type Status
    = Draft
    | Selling
    | Trading
    | SoldOut


statusAll : List Status
statusAll =
    [ Draft, Selling, Trading, SoldOut ]


statusToIdString : Status -> String
statusToIdString status =
    case status of
        Draft ->
            "draft"

        Selling ->
            "selling"

        Trading ->
            "trading"

        SoldOut ->
            "soldout"


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
getLikedCount (Product { likeCount }) =
    likeCount


{-| いいねをする
-}
like : User.UserId -> Product -> Product
like userId (Product rec) =
    Product { rec | likeCount = rec.likeCount + 1  }


{-| いいねを外す
-}
unlike : User.UserId -> Product -> Product
unlike userId (Product rec) =
    Product { rec | likeCount = max 0 (rec.likeCount - 1)  }


{-| 商品の説明
-}
getDescription : Product -> String
getDescription (Product { description }) =
    description


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


{-| 商品の最初の画像のURL
-}
getFirstImageUrl : Product -> String
getFirstImageUrl (Product { image0Url }) =
    image0Url


{-| 商品の最初以外の画像のURL
-}
getOthersImageUrlList : Product -> List String
getOthersImageUrlList (Product { image1Url, image2Url, image3Url }) =
    [ image1Url, image2Url, image3Url ] |> List.map maybeToList |> List.concat


maybeToList : Maybe a -> List a
maybeToList aMaybe =
    case aMaybe of
        Just a ->
            [ a ]

        Nothing ->
            []


{-| 出品者のUser IDを取得する
-}
getSellerId : Product -> User.UserId
getSellerId (Product { seller }) =
    seller


{-| 出品者の名前を取得する
-}
getSellerName : Product -> Maybe String
getSellerName (Product { sellerName }) =
    sellerName


{-| 商品のコメントを取得する
-}
getCommentList : Product -> Maybe (List Comment)
getCommentList (Product { commentList }) =
    commentList


getCommentCreatedAtString : List Comment -> List String
getCommentCreatedAtString commentList =
    commentList
        |> List.map
            (\{ createdAt } ->
                case createdAt of
                    CreatedTimePosix _ ->
                        "済み"

                    CreatedTimeString timeString ->
                        timeString
            )


createdAtToString : Maybe ( Time.Posix, Time.Zone ) -> CreatedTime -> String
createdAtToString nowMaybe createdTime =
    case ( createdTime, nowMaybe ) of
        ( CreatedTimeString string, _ ) ->
            string

        ( CreatedTimePosix posix, Just ( nowPosix, zone ) ) ->
            if (nowPosix |> Time.Extra.diff Time.Extra.Month zone posix) == 0 then
                let
                    diffDay =
                        nowPosix
                            |> Time.Extra.diff Time.Extra.Day zone posix

                    diffHour =
                        nowPosix
                            |> Time.Extra.diff Time.Extra.Hour zone posix

                    diffMinute =
                        nowPosix
                            |> Time.Extra.diff Time.Extra.Minute zone posix

                    diffSecond =
                        nowPosix
                            |> Time.Extra.diff Time.Extra.Second zone posix
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
                posixAndZoneToString posix zone

        ( CreatedTimePosix posix, Nothing ) ->
            posixAndZoneToString posix Time.utc ++ "(UTC)"


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


listMapIf : (Product -> Bool) -> (Product -> Product) -> List Product -> List Product
listMapIf condition f list =
    case list of
        x :: xs ->
            if condition x then
                f x :: listMapIf condition f xs

            else
                x :: listMapIf condition f xs

        [] ->
            []
