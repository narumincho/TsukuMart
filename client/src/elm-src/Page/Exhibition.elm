module Page.Exhibition exposing
    ( Emission(..)
    , Model
    , Msg(..)
    , initModel
    , toConfirmPageMsgFromModel
    , update
    , view
    )

import Api
import BasicParts
import Data.LogInState
import Data.Product as Product
import Html
import Html.Attributes
import Html.Events
import Page.Component.LogIn as LogIn
import Page.Component.ProductEditor as ProductEditor
import SiteMap


type Model
    = Model
        { logInOrSignUpModel : LogIn.Model
        , page : Page
        }


type Page
    = EditPage ProductEditor.Model
    | ConfirmPage
        { request : ProductEditor.RequestData
        , sending : Bool
        }


type Emission
    = EmissionLogInOrSignUp LogIn.Emission
    | EmissionSellProducts ( Api.Token, Api.SellProductRequest )
    | EmissionByProductsEditor ProductEditor.Emission


type Msg
    = ToConfirmPage ( Api.Token, ProductEditor.RequestData )
    | ToEditPage
    | LogInOrSignUpMsg LogIn.Msg
    | SellProduct ( Api.Token, Api.SellProductRequest )
    | MsgByProductEditor ProductEditor.Msg


initModel : ( Model, List Emission )
initModel =
    let
        ( editorModel, editorEmission ) =
            ProductEditor.initModel
                { name = ""
                , description = ""
                , price = Nothing
                , condition = Nothing
                , category = Nothing
                , image = Nothing
                }
    in
    ( Model
        { logInOrSignUpModel = LogIn.initModel
        , page = EditPage editorModel
        }
    , editorEmission |> List.map EmissionByProductsEditor
    )


toConfirmPageMsgFromModel : Data.LogInState.LogInState -> Model -> Maybe Msg
toConfirmPageMsgFromModel logInState (Model rec) =
    case ( rec.page, logInState ) of
        ( EditPage editModel, Data.LogInState.LoadingProfile { accessToken } ) ->
            ProductEditor.toRequestData editModel
                |> Maybe.map (\request -> ToConfirmPage ( accessToken, request ))

        ( EditPage editModel, Data.LogInState.Ok { accessToken } ) ->
            ProductEditor.toRequestData editModel
                |> Maybe.map (\request -> ToConfirmPage ( accessToken, request ))

        ( _, _ ) ->
            Nothing



{- ==========================================
                  Update
   ==========================================
-}


update : Data.LogInState.LogInState -> Msg -> Model -> ( Model, List Emission )
update logInState msg (Model rec) =
    case logInState of
        Data.LogInState.None ->
            updateWhenNoLogIn msg (Model rec)

        _ ->
            updateWhenLogIn msg rec.page
                |> Tuple.mapFirst
                    (\p ->
                        Model { rec | page = p }
                    )


updateWhenLogIn : Msg -> Page -> ( Page, List Emission )
updateWhenLogIn msg page =
    case page of
        EditPage productEditorModel ->
            case msg of
                ToConfirmPage ( _, request ) ->
                    ( ConfirmPage { request = request, sending = False }
                    , []
                    )

                MsgByProductEditor m ->
                    ProductEditor.update m productEditorModel
                        |> Tuple.mapBoth
                            EditPage
                            (List.map EmissionByProductsEditor)

                _ ->
                    ( EditPage productEditorModel
                    , []
                    )

        ConfirmPage rec ->
            case msg of
                SellProduct data ->
                    ( ConfirmPage { rec | sending = True }
                    , [ EmissionSellProducts data ]
                    )

                ToEditPage ->
                    ProductEditor.initModel
                        { name = rec.request.name
                        , description = rec.request.description
                        , price = Just rec.request.price
                        , condition = Just rec.request.condition
                        , category = Just rec.request.category
                        , image = Just rec.request.image
                        }
                        |> Tuple.mapBoth
                            EditPage
                            (List.map EmissionByProductsEditor)

                _ ->
                    ( ConfirmPage rec
                    , []
                    )


updateWhenNoLogIn : Msg -> Model -> ( Model, List Emission )
updateWhenNoLogIn msg (Model rec) =
    case msg of
        LogInOrSignUpMsg m ->
            let
                exEmission =
                    []
            in
            rec.logInOrSignUpModel
                |> LogIn.update m
                |> Tuple.mapBoth
                    (\logInModel -> Model { rec | logInOrSignUpModel = logInModel })
                    (\e -> (e |> List.map EmissionLogInOrSignUp) ++ exEmission)

        _ ->
            ( Model rec, [] )



{- ==========================================
                  View
   ==========================================
-}


view :
    Data.LogInState.LogInState
    -> Model
    -> { title : Maybe String, tab : BasicParts.Tab Msg, html : List (Html.Html Msg) }
view logInState (Model { page, logInOrSignUpModel }) =
    let
        ( tabText, body ) =
            case Data.LogInState.getAccessToken logInState of
                Just accessToken ->
                    case page of
                        EditPage editModel ->
                            editView editModel

                        ConfirmPage { request, sending } ->
                            confirmView accessToken request sending

                Nothing ->
                    logInStateNoneView logInOrSignUpModel
    in
    { title = Just "出品"
    , tab = BasicParts.tabSingle tabText
    , html =
        [ Html.div
            [ Html.Attributes.class "container" ]
            [ Html.div
                [ Html.Attributes.class "exhibition" ]
                body
            ]
        ]
    }


logInStateNoneView : LogIn.Model -> ( String, List (Html.Html Msg) )
logInStateNoneView model =
    ( "出品画面"
    , [ Html.div
            []
            [ Html.text "ログインして商品を出品しよう" ]
      , LogIn.view model
            |> Html.map LogInOrSignUpMsg
      ]
    )



{- =====================================
               出品 編集画面
   =====================================
-}


editView : ProductEditor.Model -> ( String, List (Html.Html Msg) )
editView productEditorModel =
    ( "商品の情報を入力"
    , (ProductEditor.view productEditorModel
        |> List.map (Html.map MsgByProductEditor)
      )
        ++ [ toConformPageButton (ProductEditor.toRequestData productEditorModel /= Nothing) ]
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


confirmView : Api.Token -> ProductEditor.RequestData -> Bool -> ( String, List (Html.Html Msg) )
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
            , Html.span [ Html.Attributes.class "exhibition-confirm-item-value" ] [ Html.text (Product.priceToString requestData.price) ]
            ]
      , Html.div [ Html.Attributes.class "exhibition-confirm-item" ]
            [ Html.span [] [ Html.text "状態" ]
            , Html.span [ Html.Attributes.class "exhibition-confirm-item-value" ] [ Html.text (Product.conditionToJapaneseString requestData.condition) ]
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
                [ Html.Events.onClick (SellProduct ( accessToken, ProductEditor.requestDataToApiRequest requestData ))
                , Html.Attributes.class "mainButton"
                , Html.Attributes.disabled False
                ]
            )
            [ Html.text "出品する" ]
      ]
    )


confirmViewImage : ProductEditor.ImageList -> Html.Html Msg
confirmViewImage imageList =
    Html.div
        [ Html.Attributes.class "exhibition-photo-cardList-container" ]
        [ Html.div
            [ Html.Attributes.class "exhibition-photo-cardList" ]
            (ProductEditor.imageListToBlobUrlList (Just imageList)
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
