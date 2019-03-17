module Page.Exhibition exposing (Emit(..), Model, Msg(..), initModel, update, view)

import Api
import Array
import Data.Goods as Goods
import Html
import Html.Attributes
import Html.Events
import Json.Decode
import Tab


type Model
    = Model
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
    = EmitInputExhibitionImage String
    | EmitInputGoodsName String
    | EmitInputGoodsDescription String
    | EmitInputGoodsPrice String
    | EmitInputCondition (Maybe Goods.Condition)
    | EmitToConfirmPage Api.SellGoodsRequest
    | EmitSellGoods Api.SellGoodsRequest


type Msg
    = InputExhibitionImage (List String)
    | InputGoodsName String
    | InputGoodsDescription String
    | InputGoodsPrice String
    | InputCondition (Maybe Goods.Condition)
    | ToConfirmPage Api.SellGoodsRequest


initModel : Model
initModel =
    Model
        { name = ""
        , description = ""
        , price = Nothing
        , image = []
        , condition = Nothing
        }


update : Msg -> Model -> Model
update msg model =
    case model of
        Model rec ->
            case msg of
                InputExhibitionImage dataUrlList ->
                    Model
                        { rec
                            | image = dataUrlList
                        }

                ToConfirmPage request ->
                    ConfirmPage { request = request }

                InputGoodsName name ->
                    Model
                        { rec
                            | name = name
                        }

                InputGoodsDescription description ->
                    Model
                        { rec
                            | description = description
                        }

                InputGoodsPrice priceString ->
                    Model
                        { rec
                            | price = String.toInt priceString
                        }

                InputCondition condition ->
                    Model
                        { rec
                            | condition = condition
                        }

        ConfirmPage rec ->
            ConfirmPage rec


view : Model -> ( Tab.Tab Never, List (Html.Html Emit) )
view model =
    case model of
        Model rec ->
            ( Tab.Single "商品の情報を入力"
            , [ Html.div
                    [ Html.Attributes.class "exhibitionView" ]
                    [ photoView rec.image
                    , titleAndDescriptionView
                    , priceView rec.price
                    , toConformPageButton (editPageToSellGoodsRequest rec)
                    , conditionView
                        |> Html.map EmitInputCondition
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


photoView : List String -> Html.Html Emit
photoView imageUrlList =
    Html.div
        [ Html.Attributes.class "exhibitionView-photo" ]
        ([ Html.label [] [ Html.text "ラベル" ]
         , Html.input
            [ Html.Attributes.class "exhibitionView-photo-input"
            , Html.Attributes.id "exhibitionView-photo-input"
            , Html.Attributes.type_ "file"
            , Html.Attributes.multiple True
            , Html.Attributes.accept "image/png,image/jpeg"
            , Html.Events.on "change" (Json.Decode.succeed (EmitInputExhibitionImage "exhibitionView-photo-input"))
            ]
            []
         ]
            ++ (case imageUrlList of
                    _ :: _ ->
                        imageUrlList
                            |> List.map
                                (\imageUrl ->
                                    Html.img
                                        [ Html.Attributes.src imageUrl
                                        , Html.Attributes.class "exhibitionView-photo-image"
                                        ]
                                        []
                                )

                    [] ->
                        [ Html.img
                            [ Html.Attributes.src "/assets/add_a_photo.svg"
                            , Html.Attributes.class "exhibitionView-photo-icon"
                            ]
                            []
                        ]
               )
        )


titleAndDescriptionView : Html.Html Emit
titleAndDescriptionView =
    Html.div
        [ Html.Attributes.class "exhibitionView-itemTitleAndDescription" ]
        [ Html.h2 [] [ Html.text "商品名と説明" ]
        , Html.input
            [ Html.Attributes.placeholder "商品名(40文字まで)"
            , Html.Attributes.class "exhibitionView-itemTitle"
            , Html.Attributes.maxlength 40
            , Html.Events.onInput EmitInputGoodsName
            ]
            []
        , Html.textarea
            [ Html.Attributes.placeholder "商品の説明"
            , Html.Attributes.class "exhibitionView-itemDescription"
            , Html.Events.onInput EmitInputGoodsDescription
            ]
            []
        ]


priceView : Maybe Int -> Html.Html Emit
priceView price =
    Html.div
        [ Html.Attributes.class "exhibitionView-itemPrice" ]
        [ Html.text "販売価格 (0～100万円)"
        , Html.div
            [ Html.Attributes.class "exhibitionView-itemPrice-input" ]
            [ Html.input
                [ Html.Attributes.type_ "number"
                , Html.Attributes.class "exhibitionView-itemPrice-input-input"
                , Html.Events.onInput EmitInputGoodsPrice
                ]
                []
            , Html.text "円"
            ]
        ]


conditionView : Html.Html (Maybe Goods.Condition)
conditionView =
    Html.div
        []
        [ Html.label
            [ Html.Attributes.for "exhibition-selectCondition" ]
            [ Html.text "商品の状態" ]
        , Html.select
            [ Html.Attributes.id "exhibition-selectCondition"
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
