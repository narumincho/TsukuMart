module Page.Exhibition exposing (Emit(..), Model, Msg(..), initModel, update, view)

import Api
import Array
import Data.Goods as Goods
import Html
import Html.Attributes
import Html.Events
import Json.Decode
import Svg
import Svg.Attributes
import Svg.Events
import Tab


type Model
    = EditPage EditModel
    | ConfirmPage
        { request : Api.SellGoodsRequest
        }


type EditModel
    = EditModel
        { name : String
        , description : String
        , price : Maybe Int
        , condition : Maybe Goods.Condition
        , image : Image
        }


type Image
    = ImageNone
    | Image1 String
    | Image2 String String
    | Image3 String String String
    | Image4 String String String String


type Emit
    = EmitInputImageList String
    | EmitDeleteImage Int
    | EmitInputGoodsName String
    | EmitInputGoodsDescription String
    | EmitInputGoodsPrice String
    | EmitInputCondition (Maybe Goods.Condition)
    | EmitToConfirmPage Api.SellGoodsRequest
    | EmitSellGoods Api.SellGoodsRequest


type Msg
    = InputImageList (List String)
    | DeleteImage Int
    | InputGoodsName String
    | InputGoodsDescription String
    | InputGoodsPrice String
    | InputCondition (Maybe Goods.Condition)
    | ToConfirmPage Api.SellGoodsRequest


initModel : Model
initModel =
    EditPage
        (EditModel
            { name = ""
            , description = ""
            , price = Nothing
            , condition = Nothing
            , image = ImageNone
            }
        )


update : Msg -> Model -> Model
update msg model =
    case model of
        EditPage (EditModel rec) ->
            case msg of
                InputImageList dataUrlList ->
                    EditPage
                        (EditModel
                            { rec | image = imageAdd dataUrlList rec.image }
                        )

                DeleteImage index ->
                    EditPage
                        (EditModel
                            { rec
                                | image = imageDeleteAt index rec.image
                            }
                        )

                InputGoodsName name ->
                    EditPage
                        (EditModel
                            { rec
                                | name = name
                            }
                        )

                InputGoodsDescription description ->
                    EditPage
                        (EditModel
                            { rec
                                | description = description
                            }
                        )

                InputGoodsPrice priceString ->
                    EditPage
                        (EditModel
                            { rec
                                | price = String.toInt priceString
                            }
                        )

                InputCondition condition ->
                    EditPage
                        (EditModel
                            { rec
                                | condition = condition
                            }
                        )

                ToConfirmPage request ->
                    ConfirmPage { request = request }

        ConfirmPage rec ->
            ConfirmPage rec


imageAdd : List String -> Image -> Image
imageAdd imageList imageSelected =
    case imageList of
        [] ->
            imageSelected

        a0 :: [] ->
            case imageSelected of
                ImageNone ->
                    Image1 a0

                Image1 i0 ->
                    Image2 i0 a0

                Image2 i0 i1 ->
                    Image3 i0 i1 a0

                Image3 i0 i1 i2 ->
                    Image4 i0 i1 i2 a0

                Image4 _ _ _ _ ->
                    imageSelected

        a0 :: a1 :: [] ->
            case imageSelected of
                ImageNone ->
                    Image2 a0 a1

                Image1 i0 ->
                    Image3 i0 a0 a1

                Image2 i0 i1 ->
                    Image4 i0 i1 a0 a1

                _ ->
                    imageSelected

        a0 :: a1 :: a2 :: [] ->
            case imageSelected of
                ImageNone ->
                    Image3 a0 a1 a2

                Image1 i0 ->
                    Image4 i0 a0 a1 a2

                _ ->
                    imageSelected

        a0 :: a1 :: a2 :: a3 :: _ ->
            case imageSelected of
                ImageNone ->
                    Image4 a0 a1 a2 a3

                _ ->
                    imageSelected


imageDeleteAt : Int -> Image -> Image
imageDeleteAt index image =
    case image of
        ImageNone ->
            ImageNone

        Image1 _ ->
            case index of
                0 ->
                    ImageNone

                _ ->
                    image

        Image2 i0 i1 ->
            case index of
                0 ->
                    Image1 i1

                1 ->
                    Image1 i0

                _ ->
                    image

        Image3 i0 i1 i2 ->
            case index of
                0 ->
                    Image2 i1 i2

                1 ->
                    Image2 i0 i2

                2 ->
                    Image2 i0 i1

                _ ->
                    image

        Image4 i0 i1 i2 i3 ->
            case index of
                0 ->
                    Image3 i1 i2 i3

                1 ->
                    Image3 i0 i2 i3

                2 ->
                    Image3 i0 i1 i3

                3 ->
                    Image3 i0 i1 i2

                _ ->
                    image


imageToList : Image -> List String
imageToList image =
    case image of
        ImageNone ->
            []

        Image1 i0 ->
            [ i0 ]

        Image2 i0 i1 ->
            [ i0, i1 ]

        Image3 i0 i1 i2 ->
            [ i0, i1, i2 ]

        Image4 i0 i1 i2 i3 ->
            [ i0, i1, i2, i3 ]


editPageToSellGoodsRequest : EditModel -> Maybe Api.SellGoodsRequest
editPageToSellGoodsRequest (EditModel { name, description, price, condition, image }) =
    case ( price, condition ) of
        ( Just p, Just c ) ->
            if 0 < String.length name && String.length name <= 40 && 0 <= p && p <= 1000000 then
                case itemToRequest image of
                    Just { image0, image1, image2, image3 } ->
                        Just
                            (Api.SellGoodsRequest
                                { name = name
                                , description = description
                                , price = p
                                , condition = c
                                , image0 = image0
                                , image1 = image1
                                , image2 = image2
                                , image3 = image3
                                }
                            )

                    Nothing ->
                        Nothing

            else
                Nothing

        ( _, _ ) ->
            Nothing


itemToRequest : Image -> Maybe { image0 : String, image1 : Maybe String, image2 : Maybe String, image3 : Maybe String }
itemToRequest image =
    case image of
        ImageNone ->
            Nothing

        Image1 i0 ->
            Just { image0 = i0, image1 = Nothing, image2 = Nothing, image3 = Nothing }

        Image2 i0 i1 ->
            Just { image0 = i0, image1 = Just i1, image2 = Nothing, image3 = Nothing }

        Image3 i0 i1 i2 ->
            Just { image0 = i0, image1 = Just i1, image2 = Just i2, image3 = Nothing }

        Image4 i0 i1 i2 i3 ->
            Just { image0 = i0, image1 = Just i1, image2 = Just i2, image3 = Just i3 }


view : Model -> ( Tab.Tab Never, List (Html.Html Emit) )
view model =
    let
        ( tabText, body ) =
            case model of
                EditPage editModel ->
                    editView editModel

                ConfirmPage { request } ->
                    confirmView request
    in
    ( Tab.Single tabText
    , [ Html.div
            [ Html.Attributes.class "exhibition-container" ]
            [ Html.div
                [ Html.Attributes.class "exhibition" ]
                body
            ]
      ]
    )



{- =====================================
               出品 編集画面
   =====================================
-}


editView : EditModel -> ( String, List (Html.Html Emit) )
editView (EditModel rec) =
    ( "商品の情報を入力"
    , (if 4 <= List.length (imageToList rec.image) then
        []

       else
        photoAdd
      )
        ++ [ photoCardList (imageToList rec.image)
           , nameView
           , descriptionView
           , priceView rec.price
           , conditionView
                |> Html.map EmitInputCondition
           , toConformPageButton (editPageToSellGoodsRequest (EditModel rec))
           ]
    )


photoAdd : List (Html.Html Emit)
photoAdd =
    [ Html.label
        [ Html.Attributes.for "exhibition-photo-input"
        , Html.Attributes.class "exhibition-photo-add"
        ]
        [ Html.img
            [ Html.Attributes.src "/assets/add_a_photo.svg"
            , Html.Attributes.class "exhibition-photo-addIcon"
            ]
            []
        ]
    , Html.input
        [ Html.Attributes.class "exhibition-photo-input"
        , Html.Attributes.id "exhibition-photo-input"
        , Html.Attributes.type_ "file"
        , Html.Attributes.multiple True
        , Html.Attributes.accept "image/png,image/jpeg"
        , Html.Events.on "change" (Json.Decode.succeed (EmitInputImageList "exhibition-photo-input"))
        ]
        []
    ]


photoCardList : List String -> Html.Html Emit
photoCardList imageUrlList =
    Html.div
        [ Html.Attributes.class "exhibition-photo-cardList-container" ]
        [ Html.div
            [ Html.Attributes.class "exhibition-photo-cardList" ]
            (imageUrlList |> List.indexedMap photoImage)
        ]


photoImage : Int -> String -> Html.Html Emit
photoImage index dataUrl =
    Html.div
        [ Html.Attributes.class "exhibition-photo-card" ]
        [ photoDeleteButton
            |> Html.map (always (EmitDeleteImage index))
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


nameView : Html.Html Emit
nameView =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.for "exhibition-name"
            , Html.Attributes.class "exhibition-label"
            ]
            [ Html.text "商品名" ]
        , Html.input
            [ Html.Attributes.placeholder "40文字まで"
            , Html.Attributes.class "exhibition-itemTitle"
            , Html.Attributes.id "exhibition-name"
            , Html.Attributes.maxlength 40
            , Html.Events.onInput EmitInputGoodsName
            ]
            []
        ]


descriptionView : Html.Html Emit
descriptionView =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.for "exhibition-description"
            , Html.Attributes.class "exhibition-label"
            ]
            [ Html.text "商品の説明" ]
        , Html.textarea
            [ Html.Attributes.class "exhibition-itemDescription"
            , Html.Attributes.id "exhibition-description"
            , Html.Events.onInput EmitInputGoodsDescription
            ]
            []
        ]


priceView : Maybe Int -> Html.Html Emit
priceView price =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.for "exhibition-price"
            , Html.Attributes.class "exhibition-label"
            ]
            [ Html.text "販売価格" ]
        , Html.div
            [ Html.Attributes.class "exhibition-itemPrice-input"
            ]
            [ Html.input
                [ Html.Attributes.type_ "number"
                , Html.Attributes.class "exhibition-itemPrice-input-input"
                , Html.Attributes.id "exhibition-price"
                , Html.Attributes.placeholder "0～100万"
                , Html.Attributes.min "0"
                , Html.Attributes.max "1000000"
                , Html.Events.onInput EmitInputGoodsPrice
                ]
                []
            , Html.span
                [ Html.Attributes.class "exhibition-itemPrice-yen" ]
                [ Html.text "円" ]
            ]
        ]


conditionView : Html.Html (Maybe Goods.Condition)
conditionView =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.for "exhibition-selectCondition"
            , Html.Attributes.class "exhibition-label"
            ]
            [ Html.text "商品の状態" ]
        , Html.select
            [ Html.Attributes.id "exhibition-selectCondition"
            , Html.Attributes.class "exhibition-condition"
            , Html.Events.on "change" selectConditionDecoder
            ]
            ([ Html.option [] [ Html.text "--選択してください--" ] ]
                ++ (Goods.conditionAll
                        |> List.map
                            (\s ->
                                Html.option [] [ Html.text (Goods.conditionToJapaneseString s) ]
                            )
                   )
            )
        ]


selectConditionDecoder : Json.Decode.Decoder (Maybe Goods.Condition)
selectConditionDecoder =
    Json.Decode.at
        [ "target", "selectedIndex" ]
        Json.Decode.int
        |> Json.Decode.map (\index -> Goods.conditionAll |> Array.fromList |> Array.get (index - 1))


toConformPageButton : Maybe Api.SellGoodsRequest -> Html.Html Emit
toConformPageButton requestMaybe =
    case requestMaybe of
        Just request ->
            Html.button
                [ Html.Events.onClick (EmitToConfirmPage request)
                , Html.Attributes.disabled False
                , Html.Attributes.class "exhibition-sellButton"
                ]
                [ Html.text "出品確認画面へ" ]

        Nothing ->
            Html.button
                [ Html.Attributes.disabled True
                , Html.Attributes.class "exhibition-sellButton"
                ]
                [ Html.text "出品確認画面へ" ]



{- =====================================
               出品 確認画面
   =====================================
-}


confirmView : Api.SellGoodsRequest -> ( String, List (Html.Html Emit) )
confirmView request =
    let
        (Api.SellGoodsRequest { name, description, price, condition }) =
            request
    in
    ( "出品 確認"
    , [ Html.div [ Html.Attributes.class "exhibition-confirm-item" ]
            [ Html.span [] [ Html.text "商品名" ]
            , Html.span [ Html.Attributes.class "exhibition-confirm-item-value" ] [ Html.text name ]
            ]
      , Html.div [ Html.Attributes.class "exhibition-confirm-item" ]
            [ Html.span [] [ Html.text "説明文" ]
            , Html.span [ Html.Attributes.class "exhibition-confirm-item-value" ] [ Html.text description ]
            ]
      , Html.div [ Html.Attributes.class "exhibition-confirm-item" ]
            [ Html.span [] [ Html.text "値段" ]
            , Html.span [ Html.Attributes.class "exhibition-confirm-item-value" ] [ Html.text (Goods.priceToString price) ]
            ]
      , Html.div [ Html.Attributes.class "exhibition-confirm-item" ]
            [ Html.span [] [ Html.text "状態" ]
            , Html.span [ Html.Attributes.class "exhibition-confirm-item-value" ] [ Html.text (Goods.conditionToJapaneseString condition) ]
            ]
      , Html.div [ Html.Attributes.class "exhibition-confirm-msg" ]
            [ Html.text "この商品を出品します。よろしいですか?" ]
      , Html.button
            [ Html.Events.onClick (EmitSellGoods request)
            , Html.Attributes.class "exhibition-sellButton"
            ]
            [ Html.text "出品する" ]
      ]
    )
