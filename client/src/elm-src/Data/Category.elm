module Data.Category exposing
    ( Category
    , Group
    , all
    , fromIdString
    , fromIndexInGroup
    , groupAll
    , groupFromCategory
    , groupFromIndex
    , groupToCategoryList
    , groupToIndex
    , groupToJapaneseString
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
groupToJapaneseString category =
    case category of
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
toJapaneseString subCategory =
    case subCategory of
        FurnitureTable ->
            "家具 / 机"

        FurnitureChair ->
            "家具 家具  / イス"

        FurnitureChest ->
            "家具 / タンス・棚"

        FurnitureBed ->
            "家具 / 寝具"

        FurnitureKitchen ->
            "家具 / 食器・調理器具"

        FurnitureCurtain ->
            "家具 / カーテン"

        FurnitureMat ->
            "家具 / マット・カーペット"

        FurnitureOther ->
            "家具 / その他"

        ApplianceRefrigerator ->
            "電化製品・電子機器 / 冷蔵庫"

        ApplianceMicrowave ->
            "電化製品・電子機器 / 電子レンジ"

        ApplianceWashing ->
            "電化製品・電子機器 / 洗濯機"

        ApplianceVacuum ->
            "電化製品・電子機器 / 掃除機"

        ApplianceTemperature ->
            "電化製品・電子機器 / 冷暖房・扇風機"

        ApplianceHumidity ->
            "電化製品・電子機器 / 加湿器・除湿機"

        ApplianceLight ->
            "電化製品・電子機器 / 照明・ライト"

        ApplianceTv ->
            "電化製品・電子機器 / TV・ディスプレイ・プロジェクター"

        ApplianceSpeaker ->
            "電化製品・電子機器 / スピーカー"

        ApplianceSmartphone ->
            "電化製品・電子機器 / スマホ・タブレット"

        AppliancePc ->
            "電化製品・電子機器 / パソコン"

        ApplianceCommunication ->
            "電化製品・電子機器 / Wi-Fi ルーター・通信機器"

        ApplianceOther ->
            "電化製品・電子機器 / その他"

        FashionMens ->
            "ファッション / メンズ"

        FashionLadies ->
            "ファッション / レディース"

        FashionOther ->
            "ファッション / その他"

        BookTextbook ->
            "教科書・本 / 教科書"

        BookBook ->
            "教科書・本 / 本"

        BookComic ->
            "教科書・本 / 漫画"

        BookOther ->
            "教科書・本 / その他"

        VehicleBicycle ->
            "自転車・車両 / 自転車"

        VehicleBike ->
            "自転車・車両 / バイク"

        VehicleCar ->
            "自転車・車両 / 自動車"

        VehicleOther ->
            "自転車・車両 / その他"

        FoodFood ->
            "食料品 / 食料"

        FoodBeverage ->
            "食料品 / 飲料"

        FoodOther ->
            "食料品 / その他"

        HobbyDisc ->
            "ホビー・雑貨 / CD・DVD"

        HobbyInstrument ->
            "ホビー・雑貨 / 楽器"

        HobbyCamera ->
            "ホビー・雑貨 / カメラ"

        HobbyGame ->
            "ホビー・雑貨 / ゲーム"

        HobbySport ->
            "ホビー・雑貨 / スポーツ"

        HobbyArt ->
            "ホビー・雑貨 / 美術・芸術品"

        HobbyAccessory ->
            "ホビー・雑貨 / 雑貨・小物"

        HobbyDaily ->
            "ホビー・雑貨 / 日用品"

        HobbyHandmade ->
            "ホビー・雑貨 / ハンドメイド"

        HobbyOther ->
            "ホビー・雑貨 / その他"


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
