module Page.Exhibition exposing (Emit(..), Model, Msg(..), initModel, update, view)

import Html
import Html.Attributes
import Html.Events
import Json.Decode
import Tab


type Model
    = Model
        { title : String
        , description : String
        , price : Maybe Int
        , image : List String
        }


type Emit
    = EmitInputExhibitionImage String


type Msg
    = InputExhibitionImage (List String)


initModel : Model
initModel =
    Model
        { title = ""
        , description = ""
        , price = Nothing
        , image = []
        }


update : Msg -> Model -> Model
update msg (Model rec) =
    case msg of
        InputExhibitionImage dataUrlList ->
            Model
                { rec
                    | image = dataUrlList
                }


view : Model -> ( Tab.Tab Never, List (Html.Html Emit) )
view (Model { title, description, price, image }) =
    ( Tab.Single "商品の情報を入力"
    , [ Html.div
            [ Html.Attributes.class "exhibitionView" ]
            [ photoView image
            , titleAndDescriptionView
            , priceView price
            ]
      ]
    )


photoView : List String -> Html.Html Emit
photoView imageUrlList =
    Html.div
        [ Html.Attributes.class "exhibitionView-photo" ]
        ([ Html.input
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
            ]
            []
        , Html.textarea
            [ Html.Attributes.placeholder "商品の説明"
            , Html.Attributes.class "exhibitionView-itemDescription"
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
                ([ Html.Attributes.type_ "number"
                 , Html.Attributes.class "exhibitionView-itemPrice-input-input"
                 ]
                    ++ (case price of
                            Just p ->
                                [ Html.Attributes.value (String.fromInt p) ]

                            Nothing ->
                                []
                       )
                )
                []
            , Html.text "円"
            ]
        ]
