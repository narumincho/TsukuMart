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
    = EditPage
        { name : String
        , description : String
        , price : Maybe Int
        , image : List String
        , condition : Maybe Goods.Condition
        }
    | ConfirmPage
        { request : Api.SellGoodsRequest
        }


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
        { name = ""
        , description = ""
        , price = Nothing
        , image = []
        , condition = Nothing
        }


update : Msg -> Model -> Model
update msg model =
    case model of
        EditPage rec ->
            case msg of
                InputImageList dataUrlList ->
                    EditPage
                        { rec
                            | image = rec.image ++ dataUrlList
                        }

                DeleteImage index ->
                    EditPage
                        { rec
                            | image = List.take index rec.image ++ List.drop (index + 1) rec.image
                        }

                ToConfirmPage request ->
                    ConfirmPage { request = request }

                InputGoodsName name ->
                    EditPage
                        { rec
                            | name = name
                        }

                InputGoodsDescription description ->
                    EditPage
                        { rec
                            | description = description
                        }

                InputGoodsPrice priceString ->
                    EditPage
                        { rec
                            | price = String.toInt priceString
                        }

                InputCondition condition ->
                    EditPage
                        { rec
                            | condition = condition
                        }

        ConfirmPage rec ->
            ConfirmPage rec


view : Model -> ( Tab.Tab Never, List (Html.Html Emit) )
view model =
    case model of
        EditPage rec ->
            ( Tab.Single "商品の情報を入力"
            , [ Html.div
                    [ Html.Attributes.class "exhibition-container" ]
                    [ Html.div
                        [ Html.Attributes.class "exhibition" ]
                        [ photoAdd
                        , photoCardList rec.image
                        , descriptionView
                        , priceView rec.price
                        , conditionView
                            |> Html.map EmitInputCondition
                        , toConformPageButton (editPageToSellGoodsRequest rec)
                        ]
                    ]
              ]
            )

        ConfirmPage { request } ->
            ( Tab.Single "出品確認画面"
            , [ Html.button
                    [ Html.Events.onClick (EmitSellGoods request) ]
                    [ Html.text "出品する" ]
              ]
            )


photoAdd : Html.Html Emit
photoAdd =
    Html.div
        []
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


editPageToSellGoodsRequest : { name : String, description : String, price : Maybe Int, image : List String, condition : Maybe Goods.Condition } -> Maybe Api.SellGoodsRequest
editPageToSellGoodsRequest { name, description, price, condition } =
    case ( price, condition ) of
        ( Just p, Just c ) ->
            Just
                (Api.SellGoodsRequest
                    { name = name
                    , description = description
                    , price = p
                    , condition = c
                    }
                )

        ( _, _ ) ->
            Nothing


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
                ]
                [ Html.text "出品確認画面へ" ]

        Nothing ->
            Html.button
                [ Html.Attributes.disabled True
                ]
                [ Html.text "出品確認画面へ" ]
