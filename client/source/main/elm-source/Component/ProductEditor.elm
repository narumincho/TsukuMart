module Component.ProductEditor exposing
    ( Cmd(..)
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
import Component.Category as CategoryComp
import Css
import Css.Transitions
import Data.Category as Category
import Data.ImageId as ImageId
import Data.Product as Product
import Html
import Html.Styled
import Html.Styled.Attributes
import Html.Styled.Events
import Icon
import Set
import Style
import Utility


type Model
    = Model
        { name : String
        , description : String
        , price : Maybe Int
        , condition : Maybe Product.Condition
        , category : CategoryComp.Model
        , addImages : List String
        , beforeImageIds : List ImageId.ImageId
        , deleteImagesAt : Set.Set Int
        }


type Cmd
    = CmdAddEventListenerForProductImages { labelId : String, inputId : String }
    | CmdReplaceText { id : String, text : String }
    | CmdChangeSelectedIndex { id : String, index : Int }
    | CmdByCategory CategoryComp.Cmd


type Msg
    = InputName String
    | InputDescription String
    | InputPrice String
    | SelectCondition (Maybe Int)
    | DeleteImage Int
    | InputImageList (List String)
    | MsgByCategory CategoryComp.Msg


initModelBlank : ( Model, List Cmd )
initModelBlank =
    let
        ( categoryModel, categoryCmd ) =
            CategoryComp.initModel
    in
    ( Model
        { name = ""
        , description = ""
        , price = Nothing
        , condition = Nothing
        , category = categoryModel
        , addImages = []
        , beforeImageIds = []
        , deleteImagesAt = Set.empty
        }
    , CmdAddEventListenerForProductImages { labelId = photoAddLabelId, inputId = photoAddInputId }
        :: (categoryCmd |> List.map CmdByCategory)
    )


initModelFromSellRequestData : Api.SellProductRequest -> ( Model, List Cmd )
initModelFromSellRequestData (Api.SellProductRequest rec) =
    let
        ( categoryModel, categoryCmd ) =
            CategoryComp.initModelWithCategorySelect rec.category
    in
    ( Model
        { name = rec.name
        , description = rec.description
        , price = Just rec.price
        , condition = Just rec.condition
        , category = categoryModel
        , addImages = rec.images
        , beforeImageIds = []
        , deleteImagesAt = Set.empty
        }
    , [ CmdAddEventListenerForProductImages
            { labelId = photoAddLabelId, inputId = photoAddInputId }
      , CmdReplaceText
            { id = nameEditorId, text = rec.name }
      , CmdReplaceText
            { id = descriptionEditorId, text = rec.description }
      , CmdReplaceText
            { id = priceEditorId, text = String.fromInt rec.price }
      , CmdChangeSelectedIndex
            { id = conditionSelectId, index = Product.conditionToIndex rec.condition + 1 }
      ]
        ++ (categoryCmd |> List.map CmdByCategory)
    )


initModel :
    { name : String
    , description : String
    , price : Int
    , condition : Product.Condition
    , category : Category.Category
    , imageIds : List ImageId.ImageId
    }
    -> ( Model, List Cmd )
initModel { name, description, price, condition, category, imageIds } =
    let
        ( categoryModel, categoryCmd ) =
            CategoryComp.initModelWithCategorySelect category
    in
    ( Model
        { name = name
        , description = description
        , price = Just price
        , condition = Just condition
        , category = categoryModel
        , addImages = []
        , beforeImageIds = imageIds
        , deleteImagesAt = Set.empty
        }
    , [ CmdAddEventListenerForProductImages
            { labelId = photoAddLabelId, inputId = photoAddInputId }
      , CmdReplaceText
            { id = nameEditorId, text = name }
      , CmdReplaceText
            { id = descriptionEditorId, text = description }
      , CmdReplaceText
            { id = priceEditorId, text = String.fromInt price }
      , CmdChangeSelectedIndex
            { id = conditionSelectId, index = Product.conditionToIndex condition + 1 }
      ]
        ++ (categoryCmd |> List.map CmdByCategory)
    )


update : Msg -> Model -> Model
update msg (Model rec) =
    case msg of
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
            Model
                { rec
                    | condition = index |> Maybe.andThen Product.conditionFromIndex
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

        MsgByCategory categoryMsg ->
            Model
                { rec
                    | category =
                        rec.category
                            |> CategoryComp.update categoryMsg
                }


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
    case ( priceCheck rec.price, rec.condition, CategoryComp.getCategory rec.category ) of
        ( Ok price, Just condition, Just category ) ->
            if
                nameCheck rec.name
                    == Nothing
                    && imagesCheck rec.addImages rec.beforeImageIds
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
    case ( rec.price, rec.condition, CategoryComp.getCategory rec.category ) of
        ( Just price, Just condition, Just category ) ->
            if
                nameCheck rec.name
                    == Nothing
                    && imagesCheck rec.addImages rec.beforeImageIds
                    == Nothing
            then
                Api.UpdateProductRequest
                    { name = rec.name
                    , description = rec.description
                    , price = price
                    , condition = condition
                    , category = category
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


imagesCheck : List String -> List ImageId.ImageId -> Maybe String
imagesCheck addImageList beforeImageIds =
    let
        length =
            List.length addImageList + List.length beforeImageIds
    in
    if length < 1 then
        Just "画像は1枚以上必要です"

    else if 4 < length then
        Just "画像は4枚以内でなければいけません"

    else
        Nothing


view : Model -> List ( String, Html.Html Msg )
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
        [ ( "photoAdd", photoAdd ) ]
    )
        ++ [ ( "photoCardList"
             , photoCardList
                { addImages = rec.addImages
                , deleteAt = rec.deleteImagesAt
                , beforeImageIds = rec.beforeImageIds
                }
             )
           , ( "name", nameView rec.name )
           , ( "description", descriptionView )
           , ( "price", priceView rec.price )
           , ( "condition", conditionView rec.condition )
           , ( "category"
             , CategoryComp.view rec.category
                |> Html.Styled.map MsgByCategory
             )
           ]
        |> List.map (Tuple.mapSecond Html.Styled.toUnstyled)


imageCount : { addImagesLength : Int, deleteIndexSize : Int, beforeImageIdsLength : Int } -> Int
imageCount { addImagesLength, deleteIndexSize, beforeImageIdsLength } =
    beforeImageIdsLength - deleteIndexSize + addImagesLength



{- =======================================================
                          Image
   =======================================================
-}


photoAdd : Html.Styled.Html Msg
photoAdd =
    Html.Styled.div
        []
        [ Html.Styled.label
            [ Html.Styled.Attributes.css
                [ Css.width (Css.pct 100)
                , Css.displayFlex
                , Css.justifyContent Css.center
                , Css.backgroundColor (Css.rgb 100 100 100)
                , Css.cursor Css.pointer
                ]
            , Html.Styled.Attributes.id photoAddLabelId
            , Html.Styled.Attributes.for photoAddInputId
            ]
            [ Icon.photo ]
        , Html.Styled.input
            [ Html.Styled.Attributes.id photoAddInputId
            , Html.Styled.Attributes.type_ "file"
            , Html.Styled.Attributes.multiple True
            , Html.Styled.Attributes.accept "image/*"
            ]
            []
        ]


photoAddLabelId : String
photoAddLabelId =
    "exhibition-photo-addLabel"


photoAddInputId : String
photoAddInputId =
    "exhibition-photo-input"


photoCardList : { addImages : List String, deleteAt : Set.Set Int, beforeImageIds : List ImageId.ImageId } -> Html.Styled.Html Msg
photoCardList rec =
    Style.cardListContainer
        (rec |> toImageUrlList |> List.map photoImage)


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


photoImage : String -> { url : String, delete : Maybe (Int -> Msg) }
photoImage dataUrl =
    { url = dataUrl
    , delete = Just DeleteImage
    }



{- =======================================================
                          Name
   =======================================================
-}


nameView : String -> Html.Styled.Html Msg
nameView name =
    Style.formItem
        "商品名"
        nameEditorId
        (Html.Styled.input
            [ Html.Styled.Attributes.placeholder "40文字まで"
            , Html.Styled.Attributes.class "form-input"
            , Html.Styled.Attributes.id nameEditorId
            , Html.Styled.Attributes.maxlength 40
            , Html.Styled.Events.onInput InputName
            ]
            []
            :: (case nameCheck name of
                    Just errorMsg ->
                        [ Html.Styled.text errorMsg ]

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


descriptionView : Html.Styled.Html Msg
descriptionView =
    Style.formItem
        "商品の説明"
        descriptionEditorId
        [ Html.Styled.textarea
            [ Html.Styled.Attributes.class "form-textarea"
            , Html.Styled.Attributes.id descriptionEditorId
            , Html.Styled.Events.onInput InputDescription
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


priceView : Maybe Int -> Html.Styled.Html Msg
priceView priceMaybe =
    Style.formItem
        "販売価格"
        priceEditorId
        [ Html.Styled.div
            [ Html.Styled.Attributes.css
                [ Css.displayFlex
                , Css.alignItems Css.baseline
                ]
            ]
            [ Html.Styled.input
                [ Html.Styled.Attributes.type_ "number"
                , Html.Styled.Attributes.css
                    [ Css.fontSize (Css.rem 2)
                    , Css.flexGrow (Css.int 1)
                    , Css.padding (Css.px 8)
                    , Css.textAlign Css.right
                    , Css.border3 (Css.px 1) Css.solid (Css.rgb 204 204 204)
                    , Css.boxSizing Css.borderBox
                    , Css.borderRadius (Css.px 8)
                    , Css.boxShadow5 Css.inset Css.zero (Css.px 1) (Css.px 1) (Css.rgba 0 0 0 0.075)
                    , Css.Transitions.transition
                        [ Css.Transitions.borderColor3 0 150 Css.Transitions.easeInOut
                        , Css.Transitions.boxShadow3 0 150 Css.Transitions.easeInOut
                        ]
                    , Css.outline Css.none
                    , Css.focus
                        [ Css.property "box-shadow" "inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6)"
                        , Css.border3 (Css.px 1) Css.solid (Css.rgb 102 175 233)
                        ]
                    ]
                , Html.Styled.Attributes.id priceEditorId
                , Html.Styled.Attributes.placeholder "0 ～ 1000000"
                , Html.Styled.Attributes.min "0"
                , Html.Styled.Attributes.max "1000000"
                , Html.Styled.Events.onInput InputPrice
                ]
                []
            , Html.Styled.span
                [ Html.Styled.Attributes.style "font-size" "1.5rem" ]
                [ Html.Styled.text "円" ]
            ]
        , Html.Styled.div
            [ Html.Styled.Attributes.css
                [Css.textAlign Css.right]
            ]
            [ Html.Styled.text
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


conditionView : Maybe Product.Condition -> Html.Styled.Html Msg
conditionView _ =
    Style.formItem
        "商品の状態"
        conditionSelectId
        [ Style.selectMenu
            False
            conditionSelectId
            (Product.conditionAll
                |> List.map Product.conditionToJapaneseString
            )
        ]
        |> Html.Styled.map SelectCondition


conditionSelectId : String
conditionSelectId =
    "exhibition-selectCondition"
