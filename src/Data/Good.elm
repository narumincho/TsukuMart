module Data.Good exposing
    ( Condition
    , Good(..)
    , Status
    , conditionAll
    , conditionFromString
    , conditionToIdString
    , conditionToJapaneseString
    , getCondition
    , getDescription
    , getFirstImageUrl
    , getId
    , getLikedByUserList
    , getLikedCount
    , getName
    , getOthersImageUrlList
    , getPrice
    , like
    , listMapIf
    , priceToString
    , searchGoodsFromId
    , statusAll
    , statusFromIdString
    , statusToIdString
    )

{-| 商品
-}

import Data.User as Profile


type Good
    = Good
        { id : Int
        , name : String -- 長さは1～255文字
        , description : String
        , price : Int
        , condition : Condition
        , status : Status
        , image0Url : String
        , image1Url : Maybe String
        , image2Url : Maybe String
        , image3Url : Maybe String
        , likedByUserList : List Profile.UserId
        }


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
getId : Good -> Int
getId (Good { id }) =
    id


{-| 商品の名前
-}
getName : Good -> String
getName (Good { name }) =
    name


{-| いいねをされた数
-}
getLikedCount : Good -> Int
getLikedCount (Good { likedByUserList }) =
    List.length likedByUserList


{-| いいねをする
-}
like : Profile.UserId -> Good -> Good
like userId (Good rec) =
    Good { rec | likedByUserList = rec.likedByUserList ++ [ userId ] }


{-| 商品の説明
-}
getDescription : Good -> String
getDescription (Good { description }) =
    description


{-| 商品の価格
-}
getPrice : Good -> Int
getPrice (Good { price }) =
    price


{-| 商品の状態
-}
getCondition : Good -> Condition
getCondition (Good { condition }) =
    condition


{-| 商品の最初の画像のURL
-}
getFirstImageUrl : Good -> String
getFirstImageUrl (Good { image0Url }) =
    image0Url


{-| 商品の最初以外の画像のURL
-}
getOthersImageUrlList : Good -> List String
getOthersImageUrlList (Good { image1Url, image2Url, image3Url }) =
    [ image1Url, image2Url, image3Url ] |> List.map maybeToList |> List.concat


maybeToList : Maybe a -> List a
maybeToList aMaybe =
    case aMaybe of
        Just a ->
            [ a ]

        Nothing ->
            []


{-| いいねをしたユーザーIDを取得する
-}
getLikedByUserList : Good -> List Profile.UserId
getLikedByUserList (Good { likedByUserList }) =
    likedByUserList


{-| 価格(整数)を3桁ごとに,がついたものにする
-}
priceToString : Int -> String
priceToString price =
    ((if price < 1000 then
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
    )
        ++ "円"


searchGoodsFromId : Int -> List Good -> Maybe Good
searchGoodsFromId id goodsList =
    case goodsList of
        x :: xs ->
            if getId x == id then
                Just x

            else
                searchGoodsFromId id xs

        [] ->
            Nothing


listMapIf : (Good -> Bool) -> (Good -> Good) -> List Good -> List Good
listMapIf condition f list =
    case list of
        x :: xs ->
            if condition x then
                f x :: listMapIf condition f xs

            else
                x :: listMapIf condition f xs

        [] ->
            []
