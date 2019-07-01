module Data.Trade exposing
    ( Comment(..)
    , Id
    , Speaker(..)
    , Trade
    , TradeDetail
    , detailFromApi
    , detailGetBuyer
    , detailGetComment
    , detailGetCreatedAt
    , detailGetProduct
    , detailGetProductId
    , detailGetSeller
    , detailGetTradeId
    , detailGetUpdateAt
    , fromApi
    , getBuyer
    , getCreatedAt
    , getProduct
    , getProductId
    , getSeller
    , getTradeId
    , getUpdateAt
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


getTradeId : TradeDetail -> Id
getTradeId (TradeDetail { id }) =
    id


getProductId : TradeDetail -> Id
getProductId (TradeDetail { id }) =
    id


getProduct : TradeDetail -> Product.Product
getProduct (TradeDetail { product }) =
    product


getSeller : TradeDetail -> User.WithName
getSeller (TradeDetail { seller }) =
    seller


getBuyer : TradeDetail -> User.WithName
getBuyer (TradeDetail { buyer }) =
    buyer


getCreatedAt : TradeDetail -> Time.Posix
getCreatedAt (TradeDetail { createdAt }) =
    createdAt


getUpdateAt : TradeDetail -> Time.Posix
getUpdateAt (TradeDetail { updateAt }) =
    updateAt


type TradeDetail
    = TradeDetail
        { id : Id
        , product : Product.Product
        , seller : User.WithName
        , buyer : User.WithName
        , createdAt : Time.Posix
        , updateAt : Time.Posix
        , comments : List Comment
        }


type Comment
    = Comment
        { body : String
        , speaker : Speaker
        , createdAt : Time.Posix
        }


type Speaker
    = Seller
    | Buyer


detailFromApi :
    { id : String
    , product : Product.Product
    , seller : User.WithName
    , buyer : User.WithName
    , createdAt : Time.Posix
    , updateAt : Time.Posix
    , comments : List Comment
    }
    -> TradeDetail
detailFromApi rec =
    TradeDetail
        { id = Id rec.id
        , product = rec.product
        , seller = rec.seller
        , buyer = rec.buyer
        , createdAt = rec.createdAt
        , updateAt = rec.updateAt
        , comments = rec.comments
        }


detailGetTradeId : TradeDetail -> Id
detailGetTradeId (TradeDetail { id }) =
    id


detailGetProductId : TradeDetail -> Id
detailGetProductId (TradeDetail { id }) =
    id


detailGetProduct : TradeDetail -> Product.Product
detailGetProduct (TradeDetail { product }) =
    product


detailGetSeller : TradeDetail -> User.WithName
detailGetSeller (TradeDetail { seller }) =
    seller


detailGetBuyer : TradeDetail -> User.WithName
detailGetBuyer (TradeDetail { buyer }) =
    buyer


detailGetCreatedAt : TradeDetail -> Time.Posix
detailGetCreatedAt (TradeDetail { createdAt }) =
    createdAt


detailGetUpdateAt : TradeDetail -> Time.Posix
detailGetUpdateAt (TradeDetail { updateAt }) =
    updateAt


detailGetComment : TradeDetail -> List Comment
detailGetComment (TradeDetail { comments }) =
    comments
