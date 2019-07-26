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
import Css
import Data.Category
import Data.LogInState
import Data.Product as Product
import Html
import Html.Attributes
import Html.Events
import Html.Keyed
import Html.Styled
import Icon
import Page.Component.LogIn as LogIn
import Page.Component.ProductEditor as ProductEditor
import Page.Style
import PageLocation


type Model
    = Model
        { logInOrSignUpModel : LogIn.Model
        , page : Page
        }


type Page
    = EditPage ProductEditor.Model
    | ConfirmPage
        { request : Api.SellProductRequest
        , sending : Bool
        }


type Emission
    = EmissionLogInOrSignUp LogIn.Emission
    | EmissionSellProducts ( Api.Token, Api.SellProductRequest )
    | EmissionByProductEditor ProductEditor.Emission


type Msg
    = ToConfirmPage ( Api.Token, Api.SellProductRequest )
    | BackToEditPage
    | LogInOrSignUpMsg LogIn.Msg
    | SellProduct ( Api.Token, Api.SellProductRequest )
    | MsgByProductEditor ProductEditor.Msg


initModel : ( Model, List Emission )
initModel =
    let
        ( editorModel, editorEmission ) =
            ProductEditor.initModelBlank
    in
    ( Model
        { logInOrSignUpModel = LogIn.initModel
        , page = EditPage editorModel
        }
    , editorEmission |> List.map EmissionByProductEditor
    )


toConfirmPageMsgFromModel : Data.LogInState.LogInState -> Model -> Maybe Msg
toConfirmPageMsgFromModel logInState (Model rec) =
    case ( rec.page, Data.LogInState.getToken logInState ) of
        ( EditPage editModel, Just token ) ->
            ProductEditor.toSoldRequest editModel
                |> Maybe.map (\request -> ToConfirmPage ( token, request ))

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
                    ( EditPage (ProductEditor.update m productEditorModel)
                    , []
                    )

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

                BackToEditPage ->
                    ProductEditor.initModelFromSellRequestData
                        rec.request
                        |> Tuple.mapBoth
                            EditPage
                            (List.map EmissionByProductEditor)

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
    ->
        { title : Maybe String
        , tab : BasicParts.Tab Msg
        , html : List (Html.Html Msg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view logInState (Model { page, logInOrSignUpModel }) =
    let
        ( tabText, body ) =
            case Data.LogInState.getToken logInState of
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
            [ Html.Keyed.node "div"
                [ Html.Attributes.class "exhibition" ]
                body
            ]
        ]
    , bottomNavigation = Nothing
    }


logInStateNoneView : LogIn.Model -> ( String, List ( String, Html.Html Msg ) )
logInStateNoneView model =
    ( "出品画面"
    , [ ( "logIn"
        , Html.div
            []
            [ Html.text "ログインして商品を出品しよう" ]
        )
      , ( "logInComp"
        , LogIn.view model
            |> Html.map LogInOrSignUpMsg
        )
      ]
    )



{- =====================================
               出品 編集画面
   =====================================
-}


editView : ProductEditor.Model -> ( String, List ( String, Html.Html Msg ) )
editView productEditorModel =
    ( "商品の情報を入力"
    , (ProductEditor.view productEditorModel
        |> List.map (Tuple.mapSecond (Html.map MsgByProductEditor))
      )
        ++ [ ( "conform"
             , toConformPageButton (ProductEditor.toSoldRequest productEditorModel /= Nothing)
             )
           ]
    )


toConformPageButton : Bool -> Html.Html Msg
toConformPageButton available =
    if available then
        Html.a
            [ Html.Attributes.href (PageLocation.toUrlAsString PageLocation.ExhibitionConfirm)
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


confirmView : Api.Token -> Api.SellProductRequest -> Bool -> ( String, List ( String, Html.Html Msg ) )
confirmView accessToken (Api.SellProductRequest requestData) sending =
    ( "出品 確認"
    , ([ confirmViewImage requestData.images
       , Page.Style.titleAndContent "商品名"
            (Html.span [] [ Html.text requestData.name ])
       , Page.Style.titleAndContent "説明文"
            (Html.div [] [ Html.text requestData.description ])
       , Page.Style.titleAndContent "値段"
            (Html.div [] [ Html.text (Product.priceToString requestData.price) ])
       , Page.Style.titleAndContent "カテゴリー"
            (Html.div [] [ Html.text (Data.Category.toJapaneseString requestData.category) ])
       , Page.Style.titleAndContent "状態"
            (Html.div [] [ Html.text (Product.conditionToJapaneseString requestData.condition) ])
       ]
        ++ (if sending then
                [ Html.button
                    [ Html.Attributes.class "mainButton"
                    , Html.Attributes.class "mainButton-disabled"
                    , Html.Attributes.disabled True
                    ]
                    [ Icon.loading { size = 24, color = Css.rgb 255 255 255 }
                        |> Html.Styled.toUnstyled
                    ]
                ]

            else
                [ Html.div [ Html.Attributes.class "exhibition-confirm-msg" ]
                    [ Html.text "この商品を出品します。よろしいですか?" ]
                , Html.button
                    [ Html.Events.onClick (SellProduct ( accessToken, Api.SellProductRequest requestData ))
                    , Html.Attributes.class "mainButton"
                    ]
                    [ Html.text "出品する" ]
                ]
           )
      )
        |> List.indexedMap (\index a -> ( String.fromInt index, a ))
    )


confirmViewImage : List String -> Html.Html Msg
confirmViewImage images =
    Html.div
        [ Html.Attributes.class "exhibition-photo-cardList-container" ]
        [ Html.div
            [ Html.Attributes.class "exhibition-photo-cardList" ]
            (images
                |> List.map
                    (\dataUrl ->
                        Html.div
                            [ Html.Attributes.class "exhibition-photo-card" ]
                            [ Html.img
                                [ Html.Attributes.src dataUrl
                                , Html.Attributes.class "exhibition-photo-card-image"
                                ]
                                []
                            ]
                    )
            )
        ]
