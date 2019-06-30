module Page.Component.ProductEditor exposing
    ( Emission(..)
    , Model
    , Msg(..)
    , initModel
    , initModelBlank
    , initModelFromSellRequstData
    , toSoldRequest
    , toUpdateRequest
    , update
    , view
    )

import Api
import Data.Category as Category
import Data.ImageId as ImageId
import Data.Product as Product
import Html
import Html.Attributes
import Html.Events
import Json.Decode
import Set
import Svg
import Svg.Attributes
import Svg.Events
import Utility


type Model
    = Model
        { name : String
        , description : String
        , price : Maybe Int
        , condition : Maybe Product.Condition
        , category : CategorySelect
        , addImages : List String
        , beforeImageIds : List ImageId.ImageId
        , deleteImagesAt : Set.Set Int
        }


type CategorySelect
    = CategoryNone
    | CategoryGroupSelect Category.Group
    | CategorySelect Category.Category


type Emission
    = EmissionAddEventListenerForProductImages { labelId : String, inputId : String }
    | EmissionReplaceText { id : String, text : String }
    | EmissionChangeSelectedIndex { id : String, index : Int }


type Msg
    = InputName String
    | InputDescription String
    | InputPrice String
    | SelectCondition Int
    | SelectCategoryGroup Int
    | SelectCategory Int
    | DeleteImage Int
    | InputImageList (List String)


initModelBlank : ( Model, List Emission )
initModelBlank =
    ( Model
        { name = ""
        , description = ""
        , price = Nothing
        , condition = Nothing
        , category = CategoryNone
        , addImages = []
        , beforeImageIds = []
        , deleteImagesAt = Set.empty
        }
    , [ EmissionAddEventListenerForProductImages { labelId = photoAddLabelId, inputId = photoAddInputId }
      , EmissionReplaceText { id = nameEditorId, text = "" }
      , EmissionReplaceText { id = descriptionEditorId, text = "" }
      , EmissionReplaceText { id = priceEditorId, text = "" }
      , EmissionChangeSelectedIndex { id = conditionEditorId, index = 0 }
      ]
    )


initModelFromSellRequstData : Api.SellProductRequest -> ( Model, List Emission )
initModelFromSellRequstData (Api.SellProductRequest rec) =
    ( Model
        { name = rec.name
        , description = rec.description
        , price = Just rec.price
        , condition = Just rec.condition
        , category = CategorySelect rec.category
        , addImages = rec.images
        , beforeImageIds = []
        , deleteImagesAt = Set.empty
        }
    , [ EmissionAddEventListenerForProductImages
            { labelId = photoAddLabelId, inputId = photoAddInputId }
      , EmissionReplaceText
            { id = nameEditorId, text = rec.name }
      , EmissionReplaceText
            { id = descriptionEditorId, text = rec.description }
      , EmissionReplaceText
            { id = priceEditorId, text = String.fromInt rec.price }
      , EmissionChangeSelectedIndex
            { id = conditionEditorId, index = rec.condition |> Product.conditionIndex }
      ]
    )


initModel :
    { name : String
    , description : String
    , price : Int
    , condition : Product.Condition
    , category : Category.Category
    , imageIds : List ImageId.ImageId
    }
    -> ( Model, List Emission )
initModel { name, description, price, condition, category, imageIds } =
    ( Model
        { name = name
        , description = description
        , price = Just price
        , condition = Just condition
        , category = CategorySelect category
        , addImages = []
        , beforeImageIds = imageIds
        , deleteImagesAt = Set.empty
        }
    , [ EmissionAddEventListenerForProductImages
            { labelId = photoAddLabelId, inputId = photoAddInputId }
      , EmissionReplaceText
            { id = nameEditorId, text = name }
      , EmissionReplaceText
            { id = descriptionEditorId, text = description }
      , EmissionReplaceText
            { id = priceEditorId, text = String.fromInt price }
      , EmissionChangeSelectedIndex
            { id = conditionEditorId, index = condition |> Product.conditionIndex }
      ]
    )


update : Msg -> Model -> ( Model, List Emission )
update msg (Model rec) =
    case msg of
        InputName nameString ->
            ( Model { rec | name = nameString }
            , []
            )

        InputDescription descriptionString ->
            ( Model { rec | description = descriptionString }
            , []
            )

        InputPrice priceString ->
            ( Model
                { rec
                    | price =
                        String.toInt priceString
                            |> Maybe.andThen
                                (\price ->
                                    if 0 <= price && price <= 1000000 then
                                        Just price

                                    else
                                        Nothing
                                )
                }
            , []
            )

        SelectCondition index ->
            ( case Product.conditonFromIndex index of
                Just condition ->
                    Model
                        { rec
                            | condition = Just condition
                        }

                Nothing ->
                    Model rec
            , []
            )

        SelectCategoryGroup index ->
            ( case Category.groupFromIndex index of
                Just categoryGroup ->
                    Model
                        { rec
                            | category =
                                case rec.category of
                                    CategoryNone ->
                                        CategoryGroupSelect categoryGroup

                                    CategoryGroupSelect _ ->
                                        CategoryGroupSelect categoryGroup

                                    CategorySelect category ->
                                        if Category.groupFromCategory category == categoryGroup then
                                            CategorySelect category

                                        else
                                            CategoryGroupSelect categoryGroup
                        }

                Nothing ->
                    Model rec
            , []
            )

        SelectCategory index ->
            ( Model
                { rec
                    | category =
                        case rec.category of
                            CategoryNone ->
                                CategoryNone

                            CategoryGroupSelect group ->
                                case Category.fromIndexInGroup group index of
                                    Just category ->
                                        CategorySelect category

                                    Nothing ->
                                        CategoryGroupSelect group

                            CategorySelect beforeCategory ->
                                case
                                    Category.fromIndexInGroup
                                        (Category.groupFromCategory beforeCategory)
                                        index
                                of
                                    Just afterCategory ->
                                        CategorySelect afterCategory

                                    Nothing ->
                                        CategorySelect beforeCategory
                }
            , []
            )

        DeleteImage index ->
            let
                { addImages, deleteIndex } =
                    imageDeleteAt
                        index
                        { beforeImageIdLength = rec.beforeImageIds |> List.length
                        , addImages = rec.addImages
                        , deleteIndex = rec.deleteImagesAt
                        }
            in
            ( Model
                { rec
                    | addImages = addImages
                    , deleteImagesAt = deleteIndex
                }
            , []
            )

        InputImageList dataUrlList ->
            ( Model
                { rec | addImages = rec.addImages ++ dataUrlList }
            , []
            )


imageDeleteAt :
    Int
    -> { beforeImageIdLength : Int, addImages : List String, deleteIndex : Set.Set Int }
    -> { addImages : List String, deleteIndex : Set.Set Int }
imageDeleteAt index { beforeImageIdLength, addImages, deleteIndex } =
    case beforeImageAddDeleteIndex index beforeImageIdLength deleteIndex 0 of
        Just newDeleteIndex ->
            { addImages = addImages
            , deleteIndex = newDeleteIndex
            }

        Nothing ->
            { addImages =
                addImages
                    |> Utility.removeAt
                        (index - (beforeImageIdLength - Set.size deleteIndex))
            , deleteIndex = deleteIndex
            }


beforeImageAddDeleteIndex : Int -> Int -> Set.Set Int -> Int -> Maybe (Set.Set Int)
beforeImageAddDeleteIndex index beforeImageIdLength deleteAt offset =
    if offset <= beforeImageIdLength then
        if Set.member offset deleteAt then
            beforeImageAddDeleteIndex
                index
                beforeImageIdLength
                deleteAt
                (offset + 1)

        else if index == 0 then
            Just (deleteAt |> Set.insert offset)

        else
            beforeImageAddDeleteIndex
                (index - 1)
                beforeImageIdLength
                deleteAt
                (offset + 1)

    else
        Nothing


toSoldRequest : Model -> Maybe Api.SellProductRequest
toSoldRequest (Model rec) =
    case ( priceCheck rec.price, rec.condition, rec.category ) of
        ( Ok price, Just condition, CategorySelect category ) ->
            if
                nameCheck rec.name
                    == Nothing
                    && imagesCheck rec.addImages
                    == Nothing
            then
                Api.SellProductRequest
                    { name = rec.name
                    , description = rec.description
                    , price = price
                    , condition = condition
                    , category = category
                    , images = rec.addImages
                    }
                    |> Just

            else
                Nothing

        ( _, _, _ ) ->
            Nothing


toUpdateRequest : Model -> Maybe Api.UpdateProductRequest
toUpdateRequest (Model rec) =
    case ( rec.price, rec.condition, rec.category ) of
        ( Just price, Just condition, CategorySelect category ) ->
            if
                nameCheck rec.name
                    == Nothing
                    && imagesCheck rec.addImages
                    == Nothing
            then
                Api.UpdateProductRequest
                    { name = rec.name
                    , description = rec.description
                    , price = price
                    , condition = condition
                    , addImageList = rec.addImages
                    , deleteImageIndex = rec.deleteImagesAt
                    }
                    |> Just

            else
                Nothing

        ( _, _, _ ) ->
            Nothing


{-| 指定された名前が正常か調べる。Nothingなら異常なし、Just Stringはエラーメッセージ
-}
nameCheck : String -> Maybe String
nameCheck name =
    let
        nameLength =
            name |> String.trim |> String.length
    in
    if nameLength < 1 then
        Just "商品名は1文字以上でないといけません"

    else if 40 < nameLength then
        Just "商品名は40文字以内でないといけません"

    else
        Nothing


{-| 指定された価格が正常か調べる。Nothingなら異常なし、Just Stringはエラーメッセージ
-}
priceCheck : Maybe Int -> Result String Int
priceCheck priceMaybe =
    case priceMaybe of
        Just price ->
            if price < 0 then
                Err "価格は正の値で入力してください"

            else if 1000000 < price then
                Err "価格は100万円以下でないといけません"

            else
                Ok price

        Nothing ->
            Err "0 ～ 100万円の価格を入力してください"


imagesCheck : List String -> Maybe String
imagesCheck images =
    let
        length =
            List.length images
    in
    if length < 1 then
        Just "画像は1枚以上必要です"

    else if 4 < length then
        Just "画像は4枚以内でなければいけません"

    else
        Nothing


view : Model -> List (Html.Html Msg)
view (Model rec) =
    (if
        4
            <= imageCount
                { addImagesLength = rec.addImages |> List.length
                , deleteIndexSize = rec.deleteImagesAt |> Set.size
                , beforeImageIdsLength = rec.beforeImageIds |> List.length
                }
     then
        []

     else
        [ photoAdd ]
    )
        ++ [ photoCardList []
           , nameView rec.name
           , descriptionView
           , priceView rec.price
           , conditionView rec.condition
           ]


imageCount : { addImagesLength : Int, deleteIndexSize : Int, beforeImageIdsLength : Int } -> Int
imageCount { addImagesLength, deleteIndexSize, beforeImageIdsLength } =
    beforeImageIdsLength - deleteIndexSize + addImagesLength



{- =======================================================
                          Image
   =======================================================
-}


photoAdd : Html.Html Msg
photoAdd =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.class "exhibition-photo-add"
            , Html.Attributes.id photoAddLabelId
            , Html.Attributes.for photoAddInputId
            ]
            [ photoAddIcon ]
        , Html.input
            [ Html.Attributes.style "display" "none"
            , Html.Attributes.id photoAddInputId
            , Html.Attributes.type_ "file"
            , Html.Attributes.multiple True
            , Html.Attributes.accept "image/*"
            ]
            []
        ]


photoAddLabelId : String
photoAddLabelId =
    "exhibition-photo-addLabel"


photoAddInputId : String
photoAddInputId =
    "exhibition-photo-input"


photoAddIcon : Html.Html msg
photoAddIcon =
    Svg.svg
        [ Svg.Attributes.style "width:7rem"
        , Svg.Attributes.style "height:7rem"
        , Svg.Attributes.viewBox "0 0 24 24"
        ]
        [ Svg.path
            [ Svg.Attributes.d "M3 8c0 .55.45 1 1 1s1-.45 1-1V6h2c.55 0 1-.45 1-1s-.45-1-1-1H5V2c0-.55-.45-1-1-1s-1 .45-1 1v2H1c-.55 0-1 .45-1 1s.45 1 1 1h2v2z" ]
            []
        , Svg.circle
            [ Svg.Attributes.cx "13", Svg.Attributes.cy "14", Svg.Attributes.r "3" ]
            []
        , Svg.path
            [ Svg.Attributes.d
                "M21 6h-3.17l-1.24-1.35c-.37-.41-.91-.65-1.47-.65h-6.4c.17.3.28.63.28 1 0 1.1-.9 2-2 2H6v1c0 1.1-.9 2-2 2-.37 0-.7-.11-1-.28V20c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
            ]
            []
        ]


photoCardList : List String -> Html.Html Msg
photoCardList imageUrlList =
    Html.div
        [ Html.Attributes.class "exhibition-photo-cardList-container" ]
        [ Html.div
            [ Html.Attributes.class "exhibition-photo-cardList" ]
            (imageUrlList |> List.indexedMap photoImage)
        ]


photoImage : Int -> String -> Html.Html Msg
photoImage index dataUrl =
    Html.div
        [ Html.Attributes.class "exhibition-photo-card" ]
        [ photoDeleteButton
            |> Html.map (always (DeleteImage index))
        , Html.img
            [ Html.Attributes.src dataUrl
            , Html.Attributes.class "exhibition-photo-card-image"
            ]
            []
        ]


photoDeleteButton : Html.Html ()
photoDeleteButton =
    Svg.svg
        [ Svg.Attributes.class "exhibition-photo-card-deleteButton"
        , Svg.Attributes.viewBox "0 0 10 10"
        , Svg.Events.onClick ()
        ]
        [ Svg.circle
            [ Svg.Attributes.cx "5", Svg.Attributes.cy "5", Svg.Attributes.r "5", Svg.Attributes.stroke "none" ]
            []
        , Svg.line
            [ Svg.Attributes.x1 "3", Svg.Attributes.y1 "3", Svg.Attributes.x2 "7", Svg.Attributes.y2 "7" ]
            []
        , Svg.line
            [ Svg.Attributes.x1 "7", Svg.Attributes.y1 "3", Svg.Attributes.x2 "3", Svg.Attributes.y2 "7" ]
            []
        ]



{- =======================================================
                          Name
   =======================================================
-}


nameView : String -> Html.Html Msg
nameView name =
    Html.div
        []
        ([ Html.label
            [ Html.Attributes.for nameEditorId
            , Html.Attributes.class "form-label"
            ]
            [ Html.text "商品名" ]
         , Html.input
            [ Html.Attributes.placeholder "40文字まで"
            , Html.Attributes.class "form-input"
            , Html.Attributes.id nameEditorId
            , Html.Attributes.maxlength 40
            , Html.Events.onInput InputName
            ]
            []
         ]
            ++ (case nameCheck name of
                    Just errorMsg ->
                        [ Html.text errorMsg ]

                    Nothing ->
                        []
               )
        )


nameEditorId : String
nameEditorId =
    "exhibition-name"



{- =======================================================
                       Description
   =======================================================
-}


descriptionView : Html.Html Msg
descriptionView =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.for descriptionEditorId
            , Html.Attributes.class "form-label"
            ]
            [ Html.text "商品の説明" ]
        , Html.textarea
            [ Html.Attributes.class "form-textarea"
            , Html.Attributes.id descriptionEditorId
            , Html.Events.onInput InputDescription
            ]
            []
        ]


descriptionEditorId : String
descriptionEditorId =
    "exhibition-description"



{- =======================================================
                        Price
   =======================================================
-}


priceView : Maybe Int -> Html.Html Msg
priceView priceMaybe =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.for priceEditorId
            , Html.Attributes.class "form-label"
            ]
            [ Html.text "販売価格" ]
        , Html.div
            [ Html.Attributes.class "exhibition-itemPrice-input"
            ]
            [ Html.input
                [ Html.Attributes.type_ "number"
                , Html.Attributes.class "exhibition-itemPrice-input-input"
                , Html.Attributes.id priceEditorId
                , Html.Attributes.placeholder "0 ～ 1000000"
                , Html.Attributes.min "0"
                , Html.Attributes.max "1000000"
                , Html.Events.onInput InputPrice
                ]
                []
            , Html.span
                [ Html.Attributes.class "exhibition-itemPrice-yen" ]
                [ Html.text "円" ]
            ]
        , Html.div
            [ Html.Attributes.class "exhibition-priceView" ]
            [ Html.text
                (case priceMaybe of
                    Just price ->
                        Product.priceToString price

                    Nothing ->
                        "0 ～ 100万円の価格を入力してください"
                )
            ]
        ]


priceEditorId : String
priceEditorId =
    "exhibition-price"



{- =======================================================
                       Condition
   =======================================================
-}


conditionView : Maybe Product.Condition -> Html.Html Msg
conditionView condition =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.for conditionEditorId
            , Html.Attributes.class "form-label"
            ]
            [ Html.text "商品の状態" ]
        , Html.select
            [ Html.Attributes.id conditionEditorId
            , Html.Attributes.class "form-menu"
            , Html.Events.on "change" (selectDecoder |> Json.Decode.map SelectCondition)
            ]
            ([ Html.option [] [ Html.text "--選択してください--" ] ]
                ++ (Product.conditionAll
                        |> List.map
                            (\s ->
                                Html.option [] [ Html.text (Product.conditionToJapaneseString s) ]
                            )
                   )
            )
        ]


conditionEditorId : String
conditionEditorId =
    "exhibition-selectCondition"


selectDecoder : Json.Decode.Decoder Int
selectDecoder =
    Json.Decode.at
        [ "target", "selectedIndex" ]
        Json.Decode.int
