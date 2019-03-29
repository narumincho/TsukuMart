module Page.Exhibition exposing
    ( Emit(..)
    , Model
    , Msg(..)
    , initModel
    , toConfirmPageMsgFromModel
    , update
    , view
    )

import Api
import Array
import Data.Good as Good
import Data.LogInState
import File
import Html
import Html.Attributes
import Html.Events
import Json.Decode
import Page.Component.LogInOrSignUp as LogInOrSignUp
import SiteMap
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
        { request : RequestData
        }


type EditModel
    = EditModel
        { name : String
        , description : String
        , price : Maybe Int
        , condition : Maybe Good.Condition
        , image : Maybe ImageList
        }


type RequestData
    = RequestData
        { name : String
        , description : String
        , price : Int
        , condition : Good.Condition
        , image : ImageList
        }


type ImageList
    = Image1 Image
    | Image2 Image Image
    | Image3 Image Image Image
    | Image4 Image Image Image Image


type alias Image =
    { file : File.File, blobUrl : String }


type Emit
    = EmitLogInOrSignUp LogInOrSignUp.Emit
    | EmitSellGoods ( Api.Token, Api.SellGoodsRequest )
    | EmitCatchImageList String -- JSにファイルとBlobURLの取得を要請する
    | EmitAddEventListenerDrop String
    | EmitReplaceText { id : String, text : String }
    | EmitChangeSelectedIndex { id : String, index : Int }


type Msg
    = InputImageList (List Image)
    | CatchImageList String -- JSにファイルとBlobURLの取得を要請する
    | DeleteImage Int
    | InputGoodsName String
    | InputGoodsDescription String
    | InputGoodsPrice String
    | InputCondition (Maybe Good.Condition)
    | ToConfirmPage ( Api.Token, RequestData )
    | ToEditPage
    | LogInOrSignUpMsg LogInOrSignUp.Msg
    | SellGoods ( Api.Token, Api.SellGoodsRequest )


initModel : ( Model, List Emit )
initModel =
    ( Model
        { logInOrSignUpModel = LogInOrSignUp.initModel
        , page =
            EditPage
                (EditModel
                    { name = ""
                    , description = ""
                    , price = Nothing
                    , condition = Nothing
                    , image = Nothing
                    }
                )
        }
    , [ EmitAddEventListenerDrop photoAddLabelId ]
    )


toConfirmPageMsgFromModel : Data.LogInState.LogInState -> Model -> Maybe Msg
toConfirmPageMsgFromModel logInState (Model rec) =
    case ( rec.page, logInState ) of
        ( EditPage editModel, Data.LogInState.LogInStateOk { access } ) ->
            editPageToSellGoodsRequest editModel
                |> Maybe.map (\request -> ToConfirmPage ( access, request ))

        ( _, _ ) ->
            Nothing



{- ==========================================
                  Update
   ==========================================
-}


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
                |> Tuple.mapFirst
                    (\l ->
                        Model { rec | logInOrSignUpModel = l }
                    )


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
                                | price =
                                    String.toInt priceString
                                        |> Maybe.andThen
                                            (\price ->
                                                if 0 < price && price <= 1000000 then
                                                    Just price

                                                else
                                                    Nothing
                                            )
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
                    , []
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

                ToEditPage ->
                    let
                        (RequestData reqRec) =
                            rec.request
                    in
                    ( EditPage (editPageFromRequest rec.request)
                    , [ EmitReplaceText { id = nameEditorId, text = reqRec.name }
                      , EmitReplaceText { id = descriptionEditorId, text = reqRec.description }
                      , EmitReplaceText { id = priceEditorId, text = String.fromInt reqRec.price }
                      , EmitChangeSelectedIndex { id = conditionEditorId, index = Good.conditionIndex reqRec.condition + 1 }
                      , EmitAddEventListenerDrop photoAddLabelId
                      ]
                    )

                _ ->
                    ( ConfirmPage rec
                    , []
                    )


updateWhenNoLogIn : Msg -> LogInOrSignUp.Model -> ( LogInOrSignUp.Model, List Emit )
updateWhenNoLogIn msg model =
    case msg of
        LogInOrSignUpMsg m ->
            let
                exEmit =
                    case m of
                        LogInOrSignUp.LogInSuccess ->
                            [ EmitAddEventListenerDrop photoAddLabelId ]

                        _ ->
                            []
            in
            model
                |> LogInOrSignUp.update m
                |> Tuple.mapSecond (\e -> (e |> List.map EmitLogInOrSignUp) ++ exEmit)

        _ ->
            ( model, [] )


imageAdd : List Image -> Maybe ImageList -> Maybe ImageList
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


imageListToBlobUrlList : Maybe ImageList -> List String
imageListToBlobUrlList imageList =
    (case imageList of
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
    )
        |> List.map .blobUrl


editPageToSellGoodsRequest : EditModel -> Maybe RequestData
editPageToSellGoodsRequest (EditModel { name, description, price, condition, image }) =
    case ( price, condition ) of
        ( Just p, Just c ) ->
            if 0 < String.length name && String.length name <= 40 && 0 <= p && p <= 1000000 then
                image
                    |> Maybe.map
                        (\i ->
                            RequestData
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


editPageFromRequest : RequestData -> EditModel
editPageFromRequest (RequestData { name, description, price, condition, image }) =
    EditModel
        { name = name
        , description = description
        , price = Just price
        , condition = Just condition
        , image = Just image
        }



{- ==========================================
                  View
   ==========================================
-}


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
                            editView editModel

                        ConfirmPage { request } ->
                            confirmView access request
    in
    ( "出品"
    , Tab.single tabText
    , [ Html.div
            [ Html.Attributes.class "container" ]
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


editView : EditModel -> ( String, List (Html.Html Msg) )
editView (EditModel rec) =
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
           , conditionView |> Html.map InputCondition
           , toConformPageButton (editPageToSellGoodsRequest (EditModel rec) /= Nothing)
           ]
    )


photoAdd : List (Html.Html Msg)
photoAdd =
    [ Html.label
        [ Html.Attributes.class "exhibition-photo-add"
        , Html.Attributes.id photoAddLabelId
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


photoAddLabelId : String
photoAddLabelId =
    "exhibition-photo-addLabel"


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
            [ Html.Attributes.for nameEditorId
            , Html.Attributes.class "form-label"
            ]
            [ Html.text "商品名" ]
        , Html.input
            [ Html.Attributes.placeholder "40文字まで"
            , Html.Attributes.class "form-input"
            , Html.Attributes.id nameEditorId
            , Html.Attributes.maxlength 40
            , Html.Events.onInput InputGoodsName
            ]
            []
        ]


nameEditorId : String
nameEditorId =
    "exhibition-name"


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
            , Html.Events.onInput InputGoodsDescription
            ]
            []
        ]


descriptionEditorId : String
descriptionEditorId =
    "exhibition-description"


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
                , Html.Events.onInput InputGoodsPrice
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
                        Good.priceToString price

                    Nothing ->
                        "0 ～ 100万円の価格を入力してください"
                )
            ]
        ]


priceEditorId : String
priceEditorId =
    "exhibition-price"


conditionView : Html.Html (Maybe Good.Condition)
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
                ++ (Good.conditionAll
                        |> List.map
                            (\s ->
                                Html.option [] [ Html.text (Good.conditionToJapaneseString s) ]
                            )
                   )
            )
        ]


conditionEditorId : String
conditionEditorId =
    "exhibition-selectCondition"


selectConditionDecoder : Json.Decode.Decoder (Maybe Good.Condition)
selectConditionDecoder =
    Json.Decode.at
        [ "target", "selectedIndex" ]
        Json.Decode.int
        |> Json.Decode.map (\index -> Good.conditionAll |> Array.fromList |> Array.get (index - 1))


toConformPageButton : Bool -> Html.Html Msg
toConformPageButton abalable =
    if abalable then
        Html.a
            [ Html.Attributes.href SiteMap.exhibitionConfirmUrl
            , Html.Attributes.class "mainButton"
            ]
            [ Html.text "出品確認画面へ" ]

    else
        Html.button
            [ Html.Attributes.class "mainButton"
            , Html.Attributes.class "mainButton-disabled"
            , Html.Attributes.disabled True
            ]
            [ Html.text "出品確認画面へ" ]



{- =====================================
               出品 確認画面
   =====================================
-}


confirmView : Api.Token -> RequestData -> ( String, List (Html.Html Msg) )
confirmView accessToken (RequestData rec) =
    ( "出品 確認"
    , [ confirmViewImage rec.image
      , Html.div [ Html.Attributes.class "exhibition-confirm-item" ]
            [ Html.span [] [ Html.text "商品名" ]
            , Html.span [ Html.Attributes.class "exhibition-confirm-item-value" ] [ Html.text rec.name ]
            ]
      , Html.div [ Html.Attributes.class "exhibition-confirm-item" ]
            [ Html.span [] [ Html.text "説明文" ]
            , Html.span [ Html.Attributes.class "exhibition-confirm-item-value" ] [ Html.text rec.description ]
            ]
      , Html.div [ Html.Attributes.class "exhibition-confirm-item" ]
            [ Html.span [] [ Html.text "値段" ]
            , Html.span [ Html.Attributes.class "exhibition-confirm-item-value" ] [ Html.text (Good.priceToString rec.price) ]
            ]
      , Html.div [ Html.Attributes.class "exhibition-confirm-item" ]
            [ Html.span [] [ Html.text "状態" ]
            , Html.span [ Html.Attributes.class "exhibition-confirm-item-value" ] [ Html.text (Good.conditionToJapaneseString rec.condition) ]
            ]
      , Html.div [ Html.Attributes.class "exhibition-confirm-msg" ]
            [ Html.text "この商品を出品します。よろしいですか?" ]
      , Html.button
            [ Html.Events.onClick (SellGoods ( accessToken, requestDataToApiRequest (RequestData rec) ))
            , Html.Attributes.class "mainButton"
            ]
            [ Html.text "出品する" ]
      ]
    )


confirmViewImage : ImageList -> Html.Html Msg
confirmViewImage imageList =
    Html.div
        [ Html.Attributes.class "exhibition-photo-cardList-container" ]
        [ Html.div
            [ Html.Attributes.class "exhibition-photo-cardList" ]
            (imageListToBlobUrlList (Just imageList)
                |> List.map
                    (\blobUrl ->
                        Html.div
                            [ Html.Attributes.class "exhibition-photo-card" ]
                            [ Html.img
                                [ Html.Attributes.src blobUrl
                                , Html.Attributes.class "exhibition-photo-card-image"
                                ]
                                []
                            ]
                    )
            )
        ]


requestDataToApiRequest : RequestData -> Api.SellGoodsRequest
requestDataToApiRequest (RequestData { name, description, price, condition, image }) =
    let
        { image0, image1, image2, image3 } =
            itemToRequest image
    in
    Api.SellGoodsRequest
        { name = name
        , description = description
        , price = price
        , condition = condition
        , image0 = image0
        , image1 = image1
        , image2 = image2
        , image3 = image3
        }


itemToRequest : ImageList -> { image0 : File.File, image1 : Maybe File.File, image2 : Maybe File.File, image3 : Maybe File.File }
itemToRequest image =
    case image of
        Image1 i0 ->
            { image0 = i0.file, image1 = Nothing, image2 = Nothing, image3 = Nothing }

        Image2 i0 i1 ->
            { image0 = i0.file, image1 = Just i1.file, image2 = Nothing, image3 = Nothing }

        Image3 i0 i1 i2 ->
            { image0 = i0.file, image1 = Just i1.file, image2 = Just i2.file, image3 = Nothing }

        Image4 i0 i1 i2 i3 ->
            { image0 = i0.file, image1 = Just i1.file, image2 = Just i2.file, image3 = Just i3.file }
