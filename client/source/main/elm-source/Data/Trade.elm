module Data.Trade exposing
    ( Comment(..)
    , Id
    , SellerOrBuyer(..)
    , Status(..)
    , Trade
    , TradeDetail
    , detailFromApi
    , detailGetBuyer
    , detailGetComment
    , detailGetCreatedAt
    , detailGetId
    , detailGetProductId
    , detailGetStatus
    , detailGetUpdateAt
    , fromApi
    , getBuyer
    , getCreatedAt
    , getId
    , getProductId
    , getUpdateAt
    , idFromString
    , idToString
    , searchFromId
    , statusFromIdString
    , statusToJapaneseString
    )

import Data.Product as Product
import Data.User as User
import Time


type Trade
    = Trade
        { id : Id
        , productId : Product.Id
        , buyer : User.WithName
        , createdAt : Time.Posix
        , updateAt : Time.Posix
        }


type Id
    = Id String


idFromString : String -> Id
idFromString =
    Id


idToString : Id -> String
idToString (Id string) =
    string


fromApi :
    { id : String
    , productId : String
    , buyer : User.WithName
    , createdAt : Time.Posix
    , updateAt : Time.Posix
    }
    -> Trade
fromApi rec =
    Trade
        { id = Id rec.id
        , productId = Product.idFromString rec.productId
        , buyer = rec.buyer
        , createdAt = rec.createdAt
        , updateAt = rec.updateAt
        }


getId : Trade -> Id
getId (Trade { id }) =
    id


getProductId : Trade -> Product.Id
getProductId (Trade { productId }) =
    productId


getBuyer : Trade -> User.WithName
getBuyer (Trade { buyer }) =
    buyer


getCreatedAt : Trade -> Time.Posix
getCreatedAt (Trade { createdAt }) =
    createdAt


getUpdateAt : Trade -> Time.Posix
getUpdateAt (Trade { updateAt }) =
    updateAt


type TradeDetail
    = TradeDetail
        { id : Id
        , productId : Product.Id
        , buyer : User.WithName
        , createdAt : Time.Posix
        , updateAt : Time.Posix
        , comments : List Comment
        , status : Status
        }


type Status
    = InProgress
    | WaitSellerFinish
    | WaitBuyerFinish
    | CancelBySeller
    | CancelByBuyer
    | Finish


statusFromIdString : String -> Maybe Status
statusFromIdString string =
    case string of
        "inProgress" ->
            Just InProgress

        "waitSellerFinish" ->
            Just WaitSellerFinish

        "waitBuyerFinish" ->
            Just WaitBuyerFinish

        "cancelBySeller" ->
            Just CancelBySeller

        "cancelByBuyer" ->
            Just CancelByBuyer

        "finish" ->
            Just Finish

        _ ->
            Nothing


statusToJapaneseString : Status -> String
statusToJapaneseString status =
    case status of
        InProgress ->
            "進行中"

        WaitSellerFinish ->
            "出品者の終了待ち"

        WaitBuyerFinish ->
            "購入者の終了待ち"

        CancelBySeller ->
            "出品者がキャンセルした"

        CancelByBuyer ->
            "購入者がキャンセルした"

        Finish ->
            "取引終了"


type Comment
    = Comment
        { body : String
        , speaker : SellerOrBuyer
        , createdAt : Time.Posix
        }


type SellerOrBuyer
    = Seller
    | Buyer


detailFromApi :
    { id : String
    , productId : String
    , buyer : User.WithName
    , createdAt : Time.Posix
    , updateAt : Time.Posix
    , comments : List Comment
    , status : Status
    }
    -> TradeDetail
detailFromApi rec =
    TradeDetail
        { id = Id rec.id
        , productId = Product.idFromString rec.productId
        , buyer = rec.buyer
        , createdAt = rec.createdAt
        , updateAt = rec.updateAt
        , comments = rec.comments
        , status = rec.status
        }


detailGetId : TradeDetail -> Id
detailGetId (TradeDetail { id }) =
    id


detailGetProductId : TradeDetail -> Product.Id
detailGetProductId (TradeDetail { productId }) =
    productId


detailGetBuyer : TradeDetail -> User.WithName
detailGetBuyer (TradeDetail { buyer }) =
    buyer


detailGetCreatedAt : TradeDetail -> Time.Posix
detailGetCreatedAt (TradeDetail { createdAt }) =
    createdAt


detailGetUpdateAt : TradeDetail -> Time.Posix
detailGetUpdateAt (TradeDetail { updateAt }) =
    updateAt


detailGetStatus : TradeDetail -> Status
detailGetStatus (TradeDetail { status }) =
    status


detailGetComment : TradeDetail -> List Comment
detailGetComment (TradeDetail { comments }) =
    comments


searchFromId : Id -> List Trade -> Maybe Trade
searchFromId id list =
    case list of
        x :: xs ->
            if getId x == id then
                Just x

            else
                searchFromId id xs

        [] ->
            Nothing
