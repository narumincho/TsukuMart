module Data.Category exposing
    ( Category
    , Group
    , all
    , fromIdString
    , fromIndexInGroup
    , groupAll
    , groupFromCategory
    , groupFromIdString
    , groupFromIndex
    , groupToCategoryList
    , groupToIdString
    , groupToIndex
    , groupToJapaneseString
    , partToJapaneseString
    , toIdString
    , toIndexInGroup
    , toJapaneseString
    )

import Utility


type Group
    = Furniture
    | Appliance
    | Fashion
    | Book
    | Vehicle
    | Food
    | Hobby


{-| すべての大まかなカテゴリー
-}
groupAll : List Group
groupAll =
    [ Furniture
    , Appliance
    , Fashion
    , Book
    , Vehicle
    , Food
    , Hobby
    ]


groupToIndex : Group -> Int
groupToIndex group =
    groupAll
        |> Utility.getFirstIndex group
        |> Maybe.withDefault 0


groupFromIndex : Int -> Maybe Group
groupFromIndex index =
    groupAll
        |> Utility.getAt index


groupToJapaneseString : Group -> String
groupToJapaneseString group =
    case group of
        Furniture ->
            "家具"

        Appliance ->
            "電化製品・電子機器"

        Fashion ->
            "ファッション"

        Book ->
            "教科書・本"

        Vehicle ->
            "自転車・車両"

        Food ->
            "食料品"

        Hobby ->
            "ホビー・雑貨"


groupToIdString : Group -> String
groupToIdString group =
    case group of
        Furniture ->
            "furniture"

        Appliance ->
            "appliance"

        Fashion ->
            "fashion"

        Book ->
            "book"

        Vehicle ->
            "vehicle"

        Food ->
            "food"

        Hobby ->
            "hobby"


groupFromIdString : String -> Maybe Group
groupFromIdString id =
    case id of
        "furniture" ->
            Just Furniture

        "appliance" ->
            Just Appliance

        "fashion" ->
            Just Fashion

        "book" ->
            Just Book

        "vehicle" ->
            Just Vehicle

        "food" ->
            Just Food

        "hobby" ->
            Just Hobby

        _ ->
            Nothing


groupToCategoryList : Group -> List Category
groupToCategoryList category =
    case category of
        Furniture ->
            [ FurnitureTable
            , FurnitureChair
            , FurnitureChest
            , FurnitureBed
            , FurnitureKitchen
            , FurnitureCurtain
            , FurnitureMat
            , FurnitureOther
            ]

        Appliance ->
            [ ApplianceRefrigerator
            , ApplianceMicrowave
            , ApplianceWashing
            , ApplianceVacuum
            , ApplianceTemperature
            , ApplianceHumidity
            , ApplianceLight
            , ApplianceTv
            , ApplianceSpeaker
            , ApplianceSmartphone
            , AppliancePc
            , ApplianceCommunication
            , ApplianceOther
            ]

        Fashion ->
            [ FashionMens
            , FashionLadies
            , FashionOther
            ]

        Book ->
            [ BookTextbook
            , BookBook
            , BookComic
            , BookOther
            ]

        Vehicle ->
            [ VehicleBicycle
            , VehicleBike
            , VehicleCar
            , VehicleOther
            ]

        Food ->
            [ FoodFood
            , FoodBeverage
            , FoodOther
            ]

        Hobby ->
            [ HobbyDisc
            , HobbyInstrument
            , HobbyCamera
            , HobbyGame
            , HobbySport
            , HobbyArt
            , HobbyAccessory
            , HobbyDaily
            , HobbyHandmade
            , HobbyOther
            ]


groupFromCategory : Category -> Group
groupFromCategory subCategory =
    case subCategory of
        FurnitureTable ->
            Furniture

        FurnitureChair ->
            Furniture

        FurnitureChest ->
            Furniture

        FurnitureBed ->
            Furniture

        FurnitureKitchen ->
            Furniture

        FurnitureCurtain ->
            Furniture

        FurnitureMat ->
            Furniture

        FurnitureOther ->
            Furniture

        ApplianceRefrigerator ->
            Appliance

        ApplianceMicrowave ->
            Appliance

        ApplianceWashing ->
            Appliance

        ApplianceVacuum ->
            Appliance

        ApplianceTemperature ->
            Appliance

        ApplianceHumidity ->
            Appliance

        ApplianceLight ->
            Appliance

        ApplianceTv ->
            Appliance

        ApplianceSpeaker ->
            Appliance

        ApplianceSmartphone ->
            Appliance

        AppliancePc ->
            Appliance

        ApplianceCommunication ->
            Appliance

        ApplianceOther ->
            Appliance

        FashionMens ->
            Fashion

        FashionLadies ->
            Fashion

        FashionOther ->
            Fashion

        BookTextbook ->
            Book

        BookBook ->
            Book

        BookComic ->
            Book

        BookOther ->
            Book

        VehicleBicycle ->
            Vehicle

        VehicleBike ->
            Vehicle

        VehicleCar ->
            Vehicle

        VehicleOther ->
            Vehicle

        FoodFood ->
            Food

        FoodBeverage ->
            Food

        FoodOther ->
            Food

        HobbyDisc ->
            Hobby

        HobbyInstrument ->
            Hobby

        HobbyCamera ->
            Hobby

        HobbyGame ->
            Hobby

        HobbySport ->
            Hobby

        HobbyArt ->
            Hobby

        HobbyAccessory ->
            Hobby

        HobbyDaily ->
            Hobby

        HobbyHandmade ->
            Hobby

        HobbyOther ->
            Hobby


type Category
    = FurnitureTable
    | FurnitureChair
    | FurnitureChest
    | FurnitureBed
    | FurnitureKitchen
    | FurnitureCurtain
    | FurnitureMat
    | FurnitureOther
    | ApplianceRefrigerator
    | ApplianceMicrowave
    | ApplianceWashing
    | ApplianceVacuum
    | ApplianceTemperature
    | ApplianceHumidity
    | ApplianceLight
    | ApplianceTv
    | ApplianceSpeaker
    | ApplianceSmartphone
    | AppliancePc
    | ApplianceCommunication
    | ApplianceOther
    | FashionMens
    | FashionLadies
    | FashionOther
    | BookTextbook
    | BookBook
    | BookComic
    | BookOther
    | VehicleBicycle
    | VehicleBike
    | VehicleCar
    | VehicleOther
    | FoodFood
    | FoodBeverage
    | FoodOther
    | HobbyDisc
    | HobbyInstrument
    | HobbyCamera
    | HobbyGame
    | HobbySport
    | HobbyArt
    | HobbyAccessory
    | HobbyDaily
    | HobbyHandmade
    | HobbyOther


{-| すべてのカテゴリー
-}
all : List Category
all =
    [ FurnitureTable
    , FurnitureChair
    , FurnitureChest
    , FurnitureBed
    , FurnitureKitchen
    , FurnitureCurtain
    , FurnitureMat
    , FurnitureOther
    , ApplianceRefrigerator
    , ApplianceMicrowave
    , ApplianceWashing
    , ApplianceVacuum
    , ApplianceTemperature
    , ApplianceHumidity
    , ApplianceLight
    , ApplianceTv
    , ApplianceSpeaker
    , ApplianceSmartphone
    , AppliancePc
    , ApplianceCommunication
    , ApplianceOther
    , FashionMens
    , FashionLadies
    , FashionOther
    , BookTextbook
    , BookBook
    , BookComic
    , BookOther
    , VehicleBicycle
    , VehicleBike
    , VehicleCar
    , VehicleOther
    , FoodFood
    , FoodBeverage
    , FoodOther
    , HobbyDisc
    , HobbyInstrument
    , HobbyCamera
    , HobbyGame
    , HobbySport
    , HobbyArt
    , HobbyAccessory
    , HobbyDaily
    , HobbyHandmade
    , HobbyOther
    ]


toIndexInGroup : Category -> Int
toIndexInGroup subCategory =
    subCategory
        |> groupFromCategory
        |> groupToCategoryList
        |> Utility.getFirstIndex subCategory
        |> Maybe.withDefault 0


fromIndexInGroup : Group -> Int -> Maybe Category
fromIndexInGroup group index =
    group
        |> groupToCategoryList
        |> Utility.getAt index


toJapaneseString : Category -> String
toJapaneseString category =
    (category
        |> groupFromCategory
        |> groupToJapaneseString
    )
        ++ " / "
        ++ partToJapaneseString category


partToJapaneseString : Category -> String
partToJapaneseString category =
    case category of
        FurnitureTable ->
            "机"

        FurnitureChair ->
            "イス"

        FurnitureChest ->
            "タンス・棚"

        FurnitureBed ->
            "寝具"

        FurnitureKitchen ->
            "食器・調理器具"

        FurnitureCurtain ->
            "カーテン"

        FurnitureMat ->
            "マット・カーペット"

        FurnitureOther ->
            "その他"

        ApplianceRefrigerator ->
            "冷蔵庫"

        ApplianceMicrowave ->
            "電子レンジ"

        ApplianceWashing ->
            "洗濯機"

        ApplianceVacuum ->
            "掃除機"

        ApplianceTemperature ->
            "冷暖房・扇風機"

        ApplianceHumidity ->
            "加湿器・除湿機"

        ApplianceLight ->
            "照明・ライト"

        ApplianceTv ->
            "TV・ディスプレイ・プロジェクター"

        ApplianceSpeaker ->
            "スピーカー"

        ApplianceSmartphone ->
            "スマホ・タブレット"

        AppliancePc ->
            "パソコン"

        ApplianceCommunication ->
            "Wi-Fi ルーター・通信機器"

        ApplianceOther ->
            "その他"

        FashionMens ->
            "メンズ"

        FashionLadies ->
            "レディース"

        FashionOther ->
            "その他"

        BookTextbook ->
            "教科書"

        BookBook ->
            "本"

        BookComic ->
            "漫画"

        BookOther ->
            "その他"

        VehicleBicycle ->
            "自転車"

        VehicleBike ->
            "バイク"

        VehicleCar ->
            "自動車"

        VehicleOther ->
            "その他"

        FoodFood ->
            "食料"

        FoodBeverage ->
            "飲料"

        FoodOther ->
            "その他"

        HobbyDisc ->
            "CD・DVD"

        HobbyInstrument ->
            "楽器"

        HobbyCamera ->
            "カメラ"

        HobbyGame ->
            "ゲーム"

        HobbySport ->
            "スポーツ"

        HobbyArt ->
            "美術・芸術品"

        HobbyAccessory ->
            "雑貨・小物"

        HobbyDaily ->
            "日用品"

        HobbyHandmade ->
            "ハンドメイド"

        HobbyOther ->
            "その他"


toIdString : Category -> String
toIdString subCategory =
    case subCategory of
        FurnitureTable ->
            "furnitureTable"

        FurnitureChair ->
            "furnitureChair"

        FurnitureChest ->
            "furnitureChest"

        FurnitureBed ->
            "furnitureBed"

        FurnitureKitchen ->
            "furnitureKitchen"

        FurnitureCurtain ->
            "furnitureCurtain"

        FurnitureMat ->
            "furnitureMat"

        FurnitureOther ->
            "furnitureOther"

        ApplianceRefrigerator ->
            "applianceRefrigerator"

        ApplianceMicrowave ->
            "applianceMicrowave"

        ApplianceWashing ->
            "applianceWashing"

        ApplianceVacuum ->
            "applianceVacuum"

        ApplianceTemperature ->
            "applianceTemperature"

        ApplianceHumidity ->
            "applianceHumidity"

        ApplianceLight ->
            "applianceLight"

        ApplianceTv ->
            "applianceTv"

        ApplianceSpeaker ->
            "applianceSpeaker"

        ApplianceSmartphone ->
            "applianceSmartphone"

        AppliancePc ->
            "appliancePc"

        ApplianceCommunication ->
            "applianceCommunication"

        ApplianceOther ->
            "applianceOther"

        FashionMens ->
            "fashionMens"

        FashionLadies ->
            "fashionLadies"

        FashionOther ->
            "fashionOther"

        BookTextbook ->
            "bookTextbook"

        BookBook ->
            "bookBook"

        BookComic ->
            "bookComic"

        BookOther ->
            "bookOther"

        VehicleBicycle ->
            "vehicleBicycle"

        VehicleBike ->
            "vehicleBike"

        VehicleCar ->
            "vehicleCar"

        VehicleOther ->
            "vehicleOther"

        FoodFood ->
            "foodFood"

        FoodBeverage ->
            "foodBeverage"

        FoodOther ->
            "foodOther"

        HobbyDisc ->
            "hobbyDisc"

        HobbyInstrument ->
            "hobbyInstrument"

        HobbyCamera ->
            "hobbyCamera"

        HobbyGame ->
            "hobbyGame"

        HobbySport ->
            "hobbySport"

        HobbyArt ->
            "hobbyArt"

        HobbyAccessory ->
            "hobbyAccessory"

        HobbyDaily ->
            "hobbyDaily"

        HobbyHandmade ->
            "hobbyHandmade"

        HobbyOther ->
            "hobbyOther"


fromIdString : String -> Maybe Category
fromIdString id =
    case id of
        "furnitureTable" ->
            Just FurnitureTable

        "furnitureChair" ->
            Just FurnitureChair

        "furnitureChest" ->
            Just FurnitureChest

        "furnitureBed" ->
            Just FurnitureBed

        "furnitureKitchen" ->
            Just FurnitureKitchen

        "furnitureCurtain" ->
            Just FurnitureCurtain

        "furnitureMat" ->
            Just FurnitureMat

        "furnitureOther" ->
            Just FurnitureOther

        "applianceRefrigerator" ->
            Just ApplianceRefrigerator

        "applianceMicrowave" ->
            Just ApplianceMicrowave

        "applianceWashing" ->
            Just ApplianceWashing

        "applianceVacuum" ->
            Just ApplianceVacuum

        "applianceTemperature" ->
            Just ApplianceTemperature

        "applianceHumidity" ->
            Just ApplianceHumidity

        "applianceLight" ->
            Just ApplianceLight

        "applianceTv" ->
            Just ApplianceTv

        "applianceSpeaker" ->
            Just ApplianceSpeaker

        "applianceSmartphone" ->
            Just ApplianceSmartphone

        "appliancePc" ->
            Just AppliancePc

        "applianceCommunication" ->
            Just ApplianceCommunication

        "applianceOther" ->
            Just ApplianceOther

        "fashionMens" ->
            Just FashionMens

        "fashionLadies" ->
            Just FashionLadies

        "fashionOther" ->
            Just FashionOther

        "bookTextbook" ->
            Just BookTextbook

        "bookBook" ->
            Just BookBook

        "bookComic" ->
            Just BookComic

        "bookOther" ->
            Just BookOther

        "vehicleBicycle" ->
            Just VehicleBicycle

        "vehicleBike" ->
            Just VehicleBike

        "vehicleCar" ->
            Just VehicleCar

        "vehicleOther" ->
            Just VehicleOther

        "foodFood" ->
            Just FoodFood

        "foodBeverage" ->
            Just FoodBeverage

        "foodOther" ->
            Just FoodOther

        "hobbyDisc" ->
            Just HobbyDisc

        "hobbyInstrument" ->
            Just HobbyInstrument

        "hobbyCamera" ->
            Just HobbyCamera

        "hobbyGame" ->
            Just HobbyGame

        "hobbySport" ->
            Just HobbySport

        "hobbyArt" ->
            Just HobbyArt

        "hobbyAccessory" ->
            Just HobbyAccessory

        "hobbyDaily" ->
            Just HobbyDaily

        "hobbyHandmade" ->
            Just HobbyHandmade

        "hobbyOther" ->
            Just HobbyOther

        _ ->
            Nothing
