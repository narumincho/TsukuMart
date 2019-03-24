module Page.Exhibition exposing
    ( Emit(..)
    , Model
    , Msg(..)
    , initModel
    , update
    , view
    )

import Api
import Array
import Data.Good as Goods
import Data.LogInState
import File
import Html
import Html.Attributes
import Html.Events
import Json.Decode
import Page.Component.LogInOrSignUp as LogInOrSignUp
import Svg
import Svg.Attributes
import Svg.Events
import Tab


type Model
    = Model
        { logInOrSignUpModel : LogInOrSignUp.Model
        , page : Page
        }


type Page
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
        , image : ImageList
        }


type ImageList
    = ImageNone
    | Image1 Image
    | Image2 Image Image
    | Image3 Image Image Image
    | Image4 Image Image Image Image


type alias Image =
    { file : File.File, blobUrl : String }


type Emit
    = EmitLogInOrSignUp LogInOrSignUp.Emit
    | EmitSellGoods ( Api.Token, Api.SellGoodsRequest )
    | EmitCatchImageList String -- JSにファイルとBlobURLの取得を要請する
    | EmitHistoryPushExhibitionUrl


type Msg
    = InputImageList (List Image)
    | CatchImageList String -- JSにファイルとBlobURLの取得を要請する
    | DeleteImage Int
    | InputGoodsName String
    | InputGoodsDescription String
    | InputGoodsPrice String
    | InputCondition (Maybe Goods.Condition)
    | ToConfirmPage ( Api.Token, Api.SellGoodsRequest )
    | LogInOrSignUpMsg LogInOrSignUp.Msg
    | SellGoods ( Api.Token, Api.SellGoodsRequest )


initModel : Model
initModel =
    Model
        { logInOrSignUpModel = LogInOrSignUp.initModel
        , page =
            EditPage
                (EditModel
                    { name = ""
                    , description = ""
                    , price = Nothing
                    , condition = Nothing
                    , image = ImageNone
                    }
                )
        }


update : Data.LogInState.LogInState -> Msg -> Model -> ( Model, List Emit )
update logInState msg (Model rec) =
    case logInState of
        Data.LogInState.LogInStateOk _ ->
            updateWhenLogIn msg rec.page
                |> Tuple.mapFirst
                    (\p ->
                        Model { rec | page = p }
                    )

        Data.LogInState.LogInStateNone ->
            updateWhenNoLogIn msg rec.logInOrSignUpModel
                |> Tuple.mapBoth
                    (\l ->
                        Model { rec | logInOrSignUpModel = l }
                    )
                    (List.map EmitLogInOrSignUp)


updateWhenLogIn : Msg -> Page -> ( Page, List Emit )
updateWhenLogIn msg page =
    case page of
        EditPage (EditModel rec) ->
            case msg of
                InputImageList fileList ->
                    ( EditPage
                        (EditModel
                            { rec | image = imageAdd fileList rec.image }
                        )
                    , []
                    )

                DeleteImage index ->
                    ( EditPage
                        (EditModel
                            { rec
                                | image = imageDeleteAt index rec.image
                            }
                        )
                    , []
                    )

                InputGoodsName name ->
                    ( EditPage
                        (EditModel
                            { rec
                                | name = name
                            }
                        )
                    , []
                    )

                InputGoodsDescription description ->
                    ( EditPage
                        (EditModel
                            { rec
                                | description = description
                            }
                        )
                    , []
                    )

                InputGoodsPrice priceString ->
                    ( EditPage
                        (EditModel
                            { rec
                                | price = String.toInt priceString
                            }
                        )
                    , []
                    )

                InputCondition condition ->
                    ( EditPage
                        (EditModel
                            { rec
                                | condition = condition
                            }
                        )
                    , []
                    )

                ToConfirmPage ( _, request ) ->
                    ( ConfirmPage { request = request }
                    , [ EmitHistoryPushExhibitionUrl ]
                    )

                CatchImageList idString ->
                    ( EditPage (EditModel rec)
                    , [ EmitCatchImageList idString ]
                    )

                _ ->
                    ( EditPage (EditModel rec)
                    , []
                    )

        ConfirmPage rec ->
            case msg of
                SellGoods data ->
                    ( ConfirmPage rec
                    , [ EmitSellGoods data ]
                    )

                _ ->
                    ( ConfirmPage rec
                    , []
                    )


updateWhenNoLogIn : Msg -> LogInOrSignUp.Model -> ( LogInOrSignUp.Model, List LogInOrSignUp.Emit )
updateWhenNoLogIn msg model =
    case msg of
        LogInOrSignUpMsg m ->
            model |> LogInOrSignUp.update m

        _ ->
            ( model, [] )


imageAdd : List Image -> ImageList -> ImageList
imageAdd fileList imageSelected =
    case fileList of
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


imageDeleteAt : Int -> ImageList -> ImageList
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


imageListToBlobUrlList : ImageList -> List String
imageListToBlobUrlList imageList =
    (case imageList of
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
    )
        |> List.map .blobUrl


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


itemToRequest : ImageList -> Maybe { image0 : File.File, image1 : Maybe File.File, image2 : Maybe File.File, image3 : Maybe File.File }
itemToRequest image =
    case image of
        ImageNone ->
            Nothing

        Image1 i0 ->
            Just { image0 = i0.file, image1 = Nothing, image2 = Nothing, image3 = Nothing }

        Image2 i0 i1 ->
            Just { image0 = i0.file, image1 = Just i1.file, image2 = Nothing, image3 = Nothing }

        Image3 i0 i1 i2 ->
            Just { image0 = i0.file, image1 = Just i1.file, image2 = Just i2.file, image3 = Nothing }

        Image4 i0 i1 i2 i3 ->
            Just { image0 = i0.file, image1 = Just i1.file, image2 = Just i2.file, image3 = Just i3.file }


view : Data.LogInState.LogInState -> Model -> ( String, Tab.Tab Msg, List (Html.Html Msg) )
view logInState (Model { page, logInOrSignUpModel }) =
    let
        ( tabText, body ) =
            case logInState of
                Data.LogInState.LogInStateNone ->
                    logInStateNoneView logInOrSignUpModel

                Data.LogInState.LogInStateOk { access } ->
                    case page of
                        EditPage editModel ->
                            editView access editModel

                        ConfirmPage { request } ->
                            confirmView access request
    in
    ( "出品"
    , Tab.single tabText
    , [ Html.div
            [ Html.Attributes.class "exhibition-container" ]
            [ Html.div
                [ Html.Attributes.class "exhibition" ]
                body
            ]
      ]
    )


logInStateNoneView : LogInOrSignUp.Model -> ( String, List (Html.Html Msg) )
logInStateNoneView model =
    ( "出品画面"
    , [ Html.text "ログインしていません"
      , LogInOrSignUp.view model
            |> Html.map LogInOrSignUpMsg
      ]
    )



{- =====================================
               出品 編集画面
   =====================================
-}


editView : Api.Token -> EditModel -> ( String, List (Html.Html Msg) )
editView accessToken (EditModel rec) =
    ( "商品の情報を入力"
    , (if 4 <= List.length (imageListToBlobUrlList rec.image) then
        []

       else
        photoAdd
      )
        ++ [ photoCardList (imageListToBlobUrlList rec.image)
           , nameView
           , descriptionView
           , priceView rec.price
           , conditionView
                |> Html.map InputCondition
           , toConformPageButton accessToken (editPageToSellGoodsRequest (EditModel rec))
           ]
    )


photoAdd : List (Html.Html Msg)
photoAdd =
    [ Html.label
        [ Html.Attributes.class "exhibition-photo-add"
        , Html.Attributes.for "exhibition-photo-input"
        ]
        [ photoAddIcon ]
    , Html.input
        [ Html.Attributes.class "exhibition-photo-input"
        , Html.Attributes.id "exhibition-photo-input"
        , Html.Attributes.type_ "file"
        , Html.Attributes.multiple True
        , Html.Attributes.accept "image/png,image/jpeg"
        , Html.Events.on "change" (Json.Decode.succeed (CatchImageList "exhibition-photo-input"))
        ]
        []
    ]


photoAddIcon : Html.Html msg
photoAddIcon =
    Svg.svg
        [ Svg.Attributes.class "exhibition-photo-addIcon"
        , Svg.Attributes.viewBox "0 0 24 24"
        ]
        [ Svg.path [ Svg.Attributes.d "M3 8c0 .55.45 1 1 1s1-.45 1-1V6h2c.55 0 1-.45 1-1s-.45-1-1-1H5V2c0-.55-.45-1-1-1s-1 .45-1 1v2H1c-.55 0-1 .45-1 1s.45 1 1 1h2v2z" ] []
        , Svg.circle [ Svg.Attributes.cx "13", Svg.Attributes.cy "14", Svg.Attributes.r "3" ] []
        , Svg.path [ Svg.Attributes.d "M21 6h-3.17l-1.24-1.35c-.37-.41-.91-.65-1.47-.65h-6.4c.17.3.28.63.28 1 0 1.1-.9 2-2 2H6v1c0 1.1-.9 2-2 2-.37 0-.7-.11-1-.28V20c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" ] []
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


nameView : Html.Html Msg
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
            , Html.Events.onInput InputGoodsName
            ]
            []
        ]


descriptionView : Html.Html Msg
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
            , Html.Events.onInput InputGoodsDescription
            ]
            []
        ]


priceView : Maybe Int -> Html.Html Msg
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
                , Html.Events.onInput InputGoodsPrice
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


toConformPageButton : Api.Token -> Maybe Api.SellGoodsRequest -> Html.Html Msg
toConformPageButton accessToken requestMaybe =
    case requestMaybe of
        Just request ->
            Html.button
                [ Html.Events.onClick (ToConfirmPage ( accessToken, request ))
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


confirmView : Api.Token -> Api.SellGoodsRequest -> ( String, List (Html.Html Msg) )
confirmView accessToken request =
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
            [ Html.Events.onClick (SellGoods ( accessToken, request ))
            , Html.Attributes.class "exhibition-sellButton"
            ]
            [ Html.text "出品する" ]
      ]
    )
