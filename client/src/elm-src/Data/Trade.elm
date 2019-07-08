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
    , getId
    , getProduct
    , getProductId
    , getSeller
    , getUpdateAt
    , idFromString
    , idToString
    , searchFromId)

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


getProductId : Trade -> Id
getProductId (Trade { id }) =
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
