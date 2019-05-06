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
import Data.Good as Good
import Data.LogInState
import File
import Html
import Html.Attributes
import Html.Events
import Page.Component.GoodEditor as GoodEditor
import Page.Component.LogInOrSignUp as LogInOrSignUp
import SiteMap
import Tab


type Model
    = Model
        { logInOrSignUpModel : LogInOrSignUp.Model
        , page : Page
        }


type Page
    = EditPage GoodEditor.Model
    | ConfirmPage
        { request : GoodEditor.RequestData
        , sending : Bool
        }


type Emit
    = EmitLogInOrSignUp LogInOrSignUp.Emit
    | EmitSellGoods ( Api.Token, Api.SellGoodsRequest )
    | EmitGoodEditor GoodEditor.Emit


type Msg
    = ToConfirmPage ( Api.Token, GoodEditor.RequestData )
    | ToEditPage
    | LogInOrSignUpMsg LogInOrSignUp.Msg
    | SellGoods ( Api.Token, Api.SellGoodsRequest )
    | GoodEditorMsg GoodEditor.Msg


initModel : ( Model, List Emit )
initModel =
    let
        ( editorModel, editorEmit ) =
            GoodEditor.initModel
                { name = ""
                , description = ""
                , price = Nothing
                , condition = Nothing
                , image = Nothing
                }
    in
    ( Model
        { logInOrSignUpModel = LogInOrSignUp.initModel
        , page = EditPage editorModel
        }
    , editorEmit |> List.map EmitGoodEditor
    )


toConfirmPageMsgFromModel : Data.LogInState.LogInState -> Model -> Maybe Msg
toConfirmPageMsgFromModel logInState (Model rec) =
    case ( rec.page, logInState ) of
        ( EditPage editModel, Data.LogInState.LogInStateOk { access } ) ->
            GoodEditor.toRequestData editModel
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
            updateWhenNoLogIn msg (Model rec)


updateWhenLogIn : Msg -> Page -> ( Page, List Emit )
updateWhenLogIn msg page =
    case page of
        EditPage goodEditorModel ->
            case msg of
                ToConfirmPage ( _, request ) ->
                    ( ConfirmPage { request = request, sending = False }
                    , []
                    )

                GoodEditorMsg m ->
                    GoodEditor.update m goodEditorModel
                        |> Tuple.mapBoth
                            EditPage
                            (List.map EmitGoodEditor)

                _ ->
                    ( EditPage goodEditorModel
                    , []
                    )

        ConfirmPage rec ->
            case msg of
                SellGoods data ->
                    ( ConfirmPage { rec | sending = True }
                    , [ EmitSellGoods data ]
                    )

                ToEditPage ->
                    GoodEditor.initModel
                        { name = rec.request.name
                        , description = rec.request.description
                        , price = Just rec.request.price
                        , condition = Just rec.request.condition
                        , image = Just rec.request.image
                        }
                        |> Tuple.mapBoth
                            EditPage
                            (List.map EmitGoodEditor)

                _ ->
                    ( ConfirmPage rec
                    , []
                    )


updateWhenNoLogIn : Msg -> Model -> ( Model, List Emit )
updateWhenNoLogIn msg (Model rec) =
    case msg of
        LogInOrSignUpMsg m ->
            let
                exEmit =
                    case m of
                        LogInOrSignUp.LogInSuccess ->
                            case rec.page of
                                EditPage goodEditorModel ->
                                    GoodEditor.resendEmit goodEditorModel
                                        |> List.map EmitGoodEditor

                                _ ->
                                    []

                        _ ->
                            []
            in
            rec.logInOrSignUpModel
                |> LogInOrSignUp.update m
                |> Tuple.mapBoth
                    (\logInModel -> Model { rec | logInOrSignUpModel = logInModel })
                    (\e -> (e |> List.map EmitLogInOrSignUp) ++ exEmit)

        _ ->
            ( Model rec, [] )



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

                        ConfirmPage { request, sending } ->
                            confirmView access request sending
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
    , [ Html.div
            [ Html.Attributes.class "logInRecommendText" ]
            [ Html.text "ログインしていません" ]
      , LogInOrSignUp.view model
            |> Html.map LogInOrSignUpMsg
      ]
    )



{- =====================================
               出品 編集画面
   =====================================
-}


editView : GoodEditor.Model -> ( String, List (Html.Html Msg) )
editView goodEditorModel =
    ( "商品の情報を入力"
    , (GoodEditor.view goodEditorModel
        |> List.map (Html.map GoodEditorMsg)
      )
        ++ [ toConformPageButton (GoodEditor.toRequestData goodEditorModel /= Nothing) ]
    )


toConformPageButton : Bool -> Html.Html Msg
toConformPageButton available =
    if available then
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


confirmView : Api.Token -> GoodEditor.RequestData -> Bool -> ( String, List (Html.Html Msg) )
confirmView accessToken requestData sending =
    ( "出品 確認"
    , [ confirmViewImage requestData.image
      , Html.div [ Html.Attributes.class "exhibition-confirm-item" ]
            [ Html.span [] [ Html.text "商品名" ]
            , Html.span [ Html.Attributes.class "exhibition-confirm-item-value" ] [ Html.text requestData.name ]
            ]
      , Html.div [ Html.Attributes.class "exhibition-confirm-item" ]
            [ Html.span [] [ Html.text "説明文" ]
            , Html.span [ Html.Attributes.class "exhibition-confirm-item-value" ] [ Html.text requestData.description ]
            ]
      , Html.div [ Html.Attributes.class "exhibition-confirm-item" ]
            [ Html.span [] [ Html.text "値段" ]
            , Html.span [ Html.Attributes.class "exhibition-confirm-item-value" ] [ Html.text (Good.priceToString requestData.price) ]
            ]
      , Html.div [ Html.Attributes.class "exhibition-confirm-item" ]
            [ Html.span [] [ Html.text "状態" ]
            , Html.span [ Html.Attributes.class "exhibition-confirm-item-value" ] [ Html.text (Good.conditionToJapaneseString requestData.condition) ]
            ]
      , Html.div [ Html.Attributes.class "exhibition-confirm-msg" ]
            [ Html.text
                (if sending then
                    "送信中……"

                 else
                    "この商品を出品します。よろしいですか?"
                )
            ]
      , Html.button
            (if sending then
                [ Html.Attributes.class "mainButton"
                , Html.Attributes.class "mainButton-disabled"
                , Html.Attributes.disabled True
                ]

             else
                [ Html.Events.onClick (SellGoods ( accessToken, GoodEditor.requestDataToApiRequest requestData ))
                , Html.Attributes.class "mainButton"
                , Html.Attributes.disabled False
                ]
            )
            [ Html.text "出品する" ]
      ]
    )


confirmViewImage : GoodEditor.ImageList -> Html.Html Msg
confirmViewImage imageList =
    Html.div
        [ Html.Attributes.class "exhibition-photo-cardList-container" ]
        [ Html.div
            [ Html.Attributes.class "exhibition-photo-cardList" ]
            (GoodEditor.imageListToBlobUrlList (Just imageList)
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
