module Data.Trade exposing
    ( Comment(..)
    , Id
    , SellerOrBuyer(..)
    , Status
    , Trade
    , TradeDetail
    , detailFromApi
    , detailGetBuyer
    , detailGetComment
    , detailGetCreatedAt
    , detailGetId
    , detailGetProduct
    , detailGetStatus
    , detailGetUpdateAt
    , fromApi
    , getBuyer
    , getCreatedAt
    , getId
    , getProduct
    , getSeller
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
        , product : Product.Product
        , seller : User.WithName
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
    , product : Product.Product
    , seller : User.WithName
    , buyer : User.WithName
    , createdAt : Time.Posix
    , updateAt : Time.Posix
    }
    -> Trade
fromApi rec =
    Trade
        { id = Id rec.id
        , product = rec.product
        , seller = rec.seller
        , buyer = rec.buyer
        , createdAt = rec.createdAt
        , updateAt = rec.updateAt
        }


getId : Trade -> Id
getId (Trade { id }) =
    id


getProduct : Trade -> Product.Product
getProduct (Trade { product }) =
    product


getSeller : Trade -> User.WithName
getSeller (Trade { seller }) =
    seller


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
        , product : Product.ProductDetail
        , buyer : User.WithName
        , createdAt : Time.Posix
        , updateAt : Time.Posix
        , comments : List Comment
        , status : Status
        }


type Status
    = InProgress
    | Finish
    | CancelBySeller
    | CancelByBuyer


statusFromIdString : String -> Maybe Status
statusFromIdString string =
    case string of
        "inProgress" ->
            Just InProgress

        "finish" ->
            Just Finish

        "cancelBySeller" ->
            Just CancelBySeller

        "cancelByBuyer" ->
            Just CancelByBuyer

        _ ->
            Nothing


statusToJapaneseString : Status -> String
statusToJapaneseString status =
    case status of
        InProgress ->
            "進行中"

        Finish ->
            "取引終了"

        CancelBySeller ->
            "出品者がキャンセルした"

        CancelByBuyer ->
            "購入者がキャンセルした"


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
    , product : Product.ProductDetail
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
        , product = rec.product
        , buyer = rec.buyer
        , createdAt = rec.createdAt
        , updateAt = rec.updateAt
        , comments = rec.comments
        , status = rec.status
        }


detailGetId : TradeDetail -> Id
detailGetId (TradeDetail { id }) =
    id


detailGetProduct : TradeDetail -> Product.ProductDetail
detailGetProduct (TradeDetail { product }) =
    product


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
