module Data.Goods exposing
    ( Condition(..)
    , Goods(..)
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
    , getPrice
    , priceToString
    , searchGoodsFromId
    , statusAll
    , statusFromIdString
    , statusToIdString
    )

{-| 商品
-}

import Data.User as Profile


type Goods
    = Goods
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
    = New
    | LikeNew
    | VeryGood
    | Good
    | Acceptable
    | Junk


conditionAll : List Condition
conditionAll =
    [ New
    , LikeNew
    , VeryGood
    , Good
    , Acceptable
    , Junk
    ]


conditionToJapaneseString : Condition -> String
conditionToJapaneseString condition =
    case condition of
        New ->
            "新品・未使用"

        LikeNew ->
            "ほぼ未使用"

        VeryGood ->
            "目立った傷や汚れなし"

        Good ->
            "多少の傷や汚れあり"

        Acceptable ->
            "目立つ傷や汚れあり"

        Junk ->
            "状態が悪い・ジャンク"


conditionToIdString : Condition -> String
conditionToIdString condition =
    case condition of
        New ->
            "New"

        LikeNew ->
            "Like New"

        VeryGood ->
            "Very Good"

        Good ->
            "Good"

        Acceptable ->
            "Acceptable"

        Junk ->
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
getId : Goods -> Int
getId (Goods { id }) =
    id


{-| 商品の名前
-}
getName : Goods -> String
getName (Goods { name }) =
    name


{-| いいねをされた数
-}
getLikedCount : Goods -> Int
getLikedCount (Goods { likedByUserList }) =
    List.length likedByUserList


{-| 商品の説明
-}
getDescription : Goods -> String
getDescription (Goods { description }) =
    description


{-| 商品の価格
-}
getPrice : Goods -> Int
getPrice (Goods { price }) =
    price


{-| 商品の状態
-}
getCondition : Goods -> Condition
getCondition (Goods { condition }) =
    condition


{-| 商品の最初の画像のURL
-}
getFirstImageUrl : Goods -> String
getFirstImageUrl (Goods { image0Url }) =
    image0Url


{-| いいねをしたユーザーIDを取得する
-}
getLikedByUserList : Goods -> List Profile.UserId
getLikedByUserList (Goods { likedByUserList }) =
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


searchGoodsFromId : Int -> List Goods -> Maybe Goods
searchGoodsFromId id goodsList =
    case goodsList of
        x :: xs ->
            if getId x == id then
                Just x

            else
                searchGoodsFromId id xs

        [] ->
            Nothing
