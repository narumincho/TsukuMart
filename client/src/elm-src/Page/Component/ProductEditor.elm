module Page.Component.ProductEditor exposing
    ( Emission(..)
    , Model
    , Msg(..)
    , initModel
    , initModelBlank
    , initModelFromSellRequestData
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
import Html.Keyed
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
    , [ EmissionAddEventListenerForProductImages { labelId = photoAddLabelId, inputId = photoAddInputId } ]
    )


initModelFromSellRequestData : Api.SellProductRequest -> ( Model, List Emission )
initModelFromSellRequestData (Api.SellProductRequest rec) =
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
            { id = conditionSelectId, index = Product.conditionToIndex rec.condition + 1 }
      , EmissionChangeSelectedIndex
            { id = categoryGroupSelectId
            , index = Category.groupToIndex (Category.groupFromCategory rec.category) + 1
            }
      , EmissionChangeSelectedIndex
            { id = categorySelectId, index = Category.toIndexInGroup rec.category + 1 }
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
            { id = conditionSelectId, index = Product.conditionToIndex condition + 1 }
      , EmissionChangeSelectedIndex
            { id = categoryGroupSelectId
            , index = Category.groupToIndex (Category.groupFromCategory category) + 1
            }
      , EmissionChangeSelectedIndex
            { id = categorySelectId
            , index = Category.toIndexInGroup category + 1
            }
      ]
    )


update : Msg -> Model -> ( Model, List Emission )
update msg (Model rec) =
    ( case msg of
        InputName nameString ->
            Model { rec | name = nameString }

        InputDescription descriptionString ->
            Model { rec | description = descriptionString }

        InputPrice priceString ->
            Model
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

        SelectCondition index ->
            case Product.conditionFromIndex index of
                Just condition ->
                    Model
                        { rec
                            | condition = Just condition
                        }

                Nothing ->
                    Model rec

        SelectCategoryGroup index ->
            Model
                { rec
                    | category =
                        selectCategoryGroup index rec.category
                }

        SelectCategory index ->
            Model
                { rec
                    | category = selectCategory index rec.category
                }

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
            Model
                { rec
                    | addImages = addImages
                    , deleteImagesAt = deleteIndex
                }

        InputImageList dataUrlList ->
            Model
                { rec | addImages = rec.addImages ++ dataUrlList }
    , []
    )


selectCategoryGroup : Int -> CategorySelect -> CategorySelect
selectCategoryGroup index categorySelect =
    case ( Category.groupFromIndex (index - 1), categorySelect ) of
        ( Just group, CategoryNone ) ->
            CategoryGroupSelect group

        ( Just group, CategoryGroupSelect _ ) ->
            CategoryGroupSelect group

        ( Just group, CategorySelect category ) ->
            if Category.groupFromCategory category == group then
                categorySelect

            else
                CategoryGroupSelect group

        ( _, _ ) ->
            categorySelect


selectCategory : Int -> CategorySelect -> CategorySelect
selectCategory index categorySelect =
    case categorySelect of
        CategoryNone ->
            CategoryNone

        CategoryGroupSelect group ->
            case Category.fromIndexInGroup group (index - 1) of
                Just category ->
                    CategorySelect category

                Nothing ->
                    categorySelect

        CategorySelect category ->
            case Category.fromIndexInGroup (Category.groupFromCategory category) (index - 1) of
                Just newCategory ->
                    CategorySelect newCategory

                Nothing ->
                    categorySelect


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
        ++ [ photoCardList
                { addImages = rec.addImages
                , deleteAt = rec.deleteImagesAt
                , beforeImageIds = rec.beforeImageIds
                }
           , nameView rec.name
           , descriptionView
           , priceView rec.price
           , conditionView rec.condition
           , categoryView rec.category
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
            [ Html.Attributes.id photoAddInputId
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


photoCardList : { addImages : List String, deleteAt : Set.Set Int, beforeImageIds : List ImageId.ImageId } -> Html.Html Msg
photoCardList rec =
    Html.div
        [ Html.Attributes.class "exhibition-photo-cardList-container" ]
        [ Html.div
            [ Html.Attributes.class "exhibition-photo-cardList" ]
            (rec |> toImageUrlList |> List.indexedMap photoImage)
        ]


toImageUrlList : { addImages : List String, deleteAt : Set.Set Int, beforeImageIds : List ImageId.ImageId } -> List String
toImageUrlList { addImages, deleteAt, beforeImageIds } =
    (addImages
        |> List.indexedMap
            (\index image ->
                if deleteAt |> Set.member index then
                    []

                else
                    [ image ]
            )
        |> List.concat
    )
        ++ (beforeImageIds |> List.map ImageId.toUrlString)


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
            [ Html.Attributes.for conditionSelectId
            , Html.Attributes.class "form-label"
            ]
            [ Html.text "商品の状態" ]
        , Html.select
            [ Html.Attributes.id conditionSelectId
            , Html.Attributes.class "form-menu"
            , Html.Events.on "change" (selectDecoder |> Json.Decode.map SelectCondition)
            ]
            (blankOption
                :: (Product.conditionAll
                        |> List.map
                            (\s ->
                                Html.option [] [ Html.text (Product.conditionToJapaneseString s) ]
                            )
                   )
            )
        ]


conditionSelectId : String
conditionSelectId =
    "exhibition-selectCondition"


blankOption : Html.Html msg
blankOption =
    Html.option [] [ Html.text "--選択してください--" ]


selectDecoder : Json.Decode.Decoder Int
selectDecoder =
    Json.Decode.at
        [ "target", "selectedIndex" ]
        Json.Decode.int



{- =======================================================
                       Category
   =======================================================
-}


categoryView : CategorySelect -> Html.Html Msg
categoryView categorySelect =
    Html.Keyed.node "div"
        []
        (case categorySelect of
            CategoryNone ->
                [ selectCategoryGroupView Nothing ]

            CategoryGroupSelect group ->
                [ selectCategoryGroupView
                    (Just group)
                , selectCategoryView
                    group
                    Nothing
                ]

            CategorySelect category ->
                [ selectCategoryGroupView
                    (Just (Category.groupFromCategory category))
                , selectCategoryView
                    (Category.groupFromCategory category)
                    (Just category)
                ]
        )


selectCategoryGroupView : Maybe Category.Group -> ( String, Html.Html Msg )
selectCategoryGroupView categoryGroup =
    ( "selectCategoryGroup"
    , Html.div
        []
        [ Html.label
            [ Html.Attributes.for conditionSelectId
            , Html.Attributes.class "form-label"
            ]
            [ Html.text "カテゴリ グループ" ]
        , Html.select
            [ Html.Attributes.id categoryGroupSelectId
            , Html.Attributes.class "form-menu"
            , Html.Events.on "change" (selectDecoder |> Json.Decode.map SelectCategoryGroup)
            ]
            (blankOption
                :: (Category.groupAll
                        |> List.map
                            (\g ->
                                Html.option [] [ Html.text (Category.groupToJapaneseString g) ]
                            )
                   )
            )
        ]
    )


categoryGroupSelectId : String
categoryGroupSelectId =
    "select-category-group"


selectCategoryView : Category.Group -> Maybe Category.Category -> ( String, Html.Html Msg )
selectCategoryView group category =
    ( "selectCategory" ++ Category.groupToJapaneseString group
      -- TODO ascii以外は避けたい
    , Html.div
        []
        [ Html.label
            [ Html.Attributes.for conditionSelectId
            , Html.Attributes.class "form-label"
            ]
            [ Html.text "カテゴリ" ]
        , Html.select
            [ Html.Attributes.id categorySelectId
            , Html.Attributes.class "form-menu"
            , Html.Events.on "change" (selectDecoder |> Json.Decode.map SelectCategory)
            ]
            (blankOption
                :: (Category.groupToCategoryList group
                        |> List.map
                            (\c ->
                                Html.option [] [ Html.text (Category.toJapaneseString c) ]
                            )
                   )
            )
        ]
    )


categorySelectId : String
categorySelectId =
    "select-category"
