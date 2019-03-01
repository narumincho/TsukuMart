module Goods exposing (Goods, none)


type Goods
    = Goods
        { id : Int
        , name : String -- 長さは1～255文字
        , description : String
        , price : Int
        , condition : Condition
        , location : String
        , complete : Bool
        }


type Condition
    = LikeNew
    | VeryGood
    | Good
    | Acceptable


{-| 仮の商品
-}
none : Goods
none =
    Goods
        { id = 0
        , name = "仮"
        , description = "説明文"
        , price = 99
        , condition = LikeNew
        , location = "場所"
        , complete = False
        }
