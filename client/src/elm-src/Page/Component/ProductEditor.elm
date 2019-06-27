module Page.Component.ProductEditor exposing
    ( Emission(..)
    , ImageList(..)
    , Model
    , Msg(..)
    , RequestData
    , imageListToBlobUrlList
    , initModel
    , requestDataToApiRequest
    , requestDataToEditApiRequest
    , sendEmission
    , toRequestData
    , update
    , view
    )

import Api
import Array
import Data.Category as Category
import Data.Product as Product
import Html
import Html.Attributes
import Html.Events
import Json.Decode
import Svg
import Svg.Attributes
import Svg.Events


type Model
    = Model
        { name : String
        , description : String
        , price : Maybe Int
        , condition : Maybe Product.Condition
        , category : Maybe Category.Category
        , image : Maybe ImageList
        }


type ImageList
    = Image1 String
    | Image2 String String
    | Image3 String String String
    | Image4 String String String String


type Emission
    = EmissionAddEventListenerForProductImages { labelId : String, inputId : String }
    | EmissionReplaceText { id : String, text : String }
    | EmissionChangeSelectedIndex { id : String, index : Int }


type Msg
    = InputName String
    | InputDescription String
    | InputPrice String
    | InputCondition (Maybe Product.Condition)
    | DeleteImage Int
    | InputImageList (List String)


type alias RequestData =
    { name : String
    , description : String
    , price : Int
    , condition : Product.Condition
    , image : ImageList
    }


initModel :
    { name : String
    , description : String
    , price : Maybe Int
    , condition : Maybe Product.Condition
    , category : Maybe Category.Category
    , image : Maybe ImageList
    }
    -> ( Model, List Emission )
initModel rec =
    let
        model =
            Model
                { name = rec.name
                , description = rec.description
                , price = rec.price
                , condition = rec.condition
                , category = rec.category
                , image = rec.image
                }
    in
    ( model
    , sendEmission model
    )


sendEmission : Model -> List Emission
sendEmission (Model rec) =
    [ EmissionAddEventListenerForProductImages { labelId = photoAddLabelId, inputId = photoAddInputId }
    , EmissionReplaceText { id = nameEditorId, text = rec.name }
    , EmissionReplaceText { id = descriptionEditorId, text = rec.description }
    , EmissionReplaceText { id = priceEditorId, text = rec.price |> Maybe.map String.fromInt |> Maybe.withDefault "" }
    , EmissionChangeSelectedIndex { id = conditionEditorId, index = rec.condition |> Maybe.map (\c -> Product.conditionIndex c + 1) |> Maybe.withDefault 0 }
    ]


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

        InputCondition conditionMaybe ->
            ( Model { rec | condition = conditionMaybe }
            , []
            )

        DeleteImage index ->
            ( Model
                { rec
                    | image = imageDeleteAt index rec.image
                }
            , []
            )

        InputImageList dataUrlList ->
            ( Model
                { rec | image = imageAdd dataUrlList rec.image }
            , []
            )


imageAdd : List String -> Maybe ImageList -> Maybe ImageList
imageAdd fileList imageSelected =
    case fileList of
        [] ->
            imageSelected

        a0 :: [] ->
            case imageSelected of
                Nothing ->
                    Just (Image1 a0)

                Just (Image1 i0) ->
                    Just (Image2 i0 a0)

                Just (Image2 i0 i1) ->
                    Just (Image3 i0 i1 a0)

                Just (Image3 i0 i1 i2) ->
                    Just (Image4 i0 i1 i2 a0)

                Just (Image4 _ _ _ _) ->
                    imageSelected

        a0 :: a1 :: [] ->
            case imageSelected of
                Nothing ->
                    Just (Image2 a0 a1)

                Just (Image1 i0) ->
                    Just (Image3 i0 a0 a1)

                Just (Image2 i0 i1) ->
                    Just (Image4 i0 i1 a0 a1)

                _ ->
                    imageSelected

        a0 :: a1 :: a2 :: [] ->
            case imageSelected of
                Nothing ->
                    Just (Image3 a0 a1 a2)

                Just (Image1 i0) ->
                    Just (Image4 i0 a0 a1 a2)

                _ ->
                    imageSelected

        a0 :: a1 :: a2 :: a3 :: _ ->
            case imageSelected of
                Nothing ->
                    Just (Image4 a0 a1 a2 a3)

                _ ->
                    imageSelected


imageDeleteAt : Int -> Maybe ImageList -> Maybe ImageList
imageDeleteAt index image =
    case image of
        Nothing ->
            Nothing

        Just (Image1 _) ->
            case index of
                0 ->
                    Nothing

                _ ->
                    image

        Just (Image2 i0 i1) ->
            case index of
                0 ->
                    Just (Image1 i1)

                1 ->
                    Just (Image1 i0)

                _ ->
                    image

        Just (Image3 i0 i1 i2) ->
            case index of
                0 ->
                    Just (Image2 i1 i2)

                1 ->
                    Just (Image2 i0 i2)

                2 ->
                    Just (Image2 i0 i1)

                _ ->
                    image

        Just (Image4 i0 i1 i2 i3) ->
            case index of
                0 ->
                    Just (Image3 i1 i2 i3)

                1 ->
                    Just (Image3 i0 i2 i3)

                2 ->
                    Just (Image3 i0 i1 i3)

                3 ->
                    Just (Image3 i0 i1 i2)

                _ ->
                    image


toRequestData : Model -> Maybe RequestData
toRequestData (Model { name, description, price, condition, image }) =
    case ( price, condition ) of
        ( Just p, Just c ) ->
            if nameCheck name == Nothing && priceCheck price == Nothing then
                image
                    |> Maybe.map
                        (\i ->
                            { name = name
                            , description = description
                            , price = p
                            , condition = c
                            , image = i
                            }
                        )

            else
                Nothing

        ( _, _ ) ->
            Nothing


requestDataToApiRequest : RequestData -> Api.SellProductRequest
requestDataToApiRequest { name, description, price, condition, image } =
    Api.SellProductRequest
        { name = name
        , description = description
        , price = price
        , condition = condition
        , imageList = []
        }


requestDataToEditApiRequest : RequestData -> Api.EditProductRequest
requestDataToEditApiRequest { name, description, price, condition, image } =
    Api.EditProductRequest
        { name = name
        , description = description
        , price = price
        , condition = condition
        , addImageList = []
        , deleteImageIndex = []
        }


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
priceCheck : Maybe Int -> Maybe String
priceCheck priceMaybe =
    case priceMaybe of
        Just price ->
            if price < 0 then
                Just "価格は正の値で入力してください"

            else if 1000000 < price then
                Just "価格は100万円以下でないといけません"

            else
                Nothing

        Nothing ->
            Just "0 ～ 100万円の価格を入力してください"


view : Model -> List (Html.Html Msg)
view (Model rec) =
    (if 4 <= List.length (imageListToBlobUrlList rec.image) then
        []

     else
        photoAdd
    )
        ++ [ photoCardList (imageListToBlobUrlList rec.image)
           , nameView rec.name
           , descriptionView
           , priceView rec.price
           , conditionView |> Html.map InputCondition
           ]



{- =======================================================
                          Image
   =======================================================
-}


photoAdd : List (Html.Html Msg)
photoAdd =
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


imageListToBlobUrlList : Maybe ImageList -> List String
imageListToBlobUrlList imageList =
    case imageList of
        Nothing ->
            []

        Just (Image1 i0) ->
            [ i0 ]

        Just (Image2 i0 i1) ->
            [ i0, i1 ]

        Just (Image3 i0 i1 i2) ->
            [ i0, i1, i2 ]

        Just (Image4 i0 i1 i2 i3) ->
            [ i0, i1, i2, i3 ]



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


conditionView : Html.Html (Maybe Product.Condition)
conditionView =
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
            , Html.Events.on "change" selectConditionDecoder
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


selectConditionDecoder : Json.Decode.Decoder (Maybe Product.Condition)
selectConditionDecoder =
    Json.Decode.at
        [ "target", "selectedIndex" ]
        Json.Decode.int
        |> Json.Decode.map (\index -> Product.conditionAll |> Array.fromList |> Array.get (index - 1))
