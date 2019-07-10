module Page.Component.Comment exposing (view)

import Data.DateTime
import Data.User as User
import Html
import Html.Attributes
import Icon
import PageLocation
import Svg
import Svg.Attributes
import Time
import Time.Extra


view :
    Maybe ( Time.Posix, Time.Zone )
    -> Maybe (List { isMine : Bool, isSeller : Bool, user : User.WithName, body : String, createdAt : Time.Posix })
    -> Html.Html msg
view nowMaybe commentListMaybe =
    Html.div
        [ Html.Attributes.class "product-commentList" ]
        (case commentListMaybe of
            Just comments ->
                comments
                    |> List.reverse
                    |> List.map
                        (commentView nowMaybe)

            Nothing ->
                [ Html.text "コメント読み込み中"
                , Icon.loading { size = 48, color = "black" }
                ]
        )


commentView :
    Maybe ( Time.Posix, Time.Zone )
    -> { isMine : Bool, isSeller : Bool, user : User.WithName, body : String, createdAt : Time.Posix }
    -> Html.Html msg
commentView nowMaybe comment =
    Html.div
        [ Html.Attributes.class "product-comment" ]
        [ Html.a
            [ Html.Attributes.class
                (if comment.isSeller then
                    "product-comment-sellerName"

                 else
                    "product-comment-name"
                )
            , Html.Attributes.href (PageLocation.toUrlAsString (PageLocation.User (User.withNameGetId comment.user)))
            ]
            [ Html.img
                [ Html.Attributes.style "border-radius" "50%"
                , Html.Attributes.style "width" "48px"
                , Html.Attributes.style "height" "48px"
                , Html.Attributes.src (User.withNameGetImageUrl comment.user)
                ]
                []
            , Html.text (User.withNameGetDisplayName comment.user)
            ]
        , Html.div
            [ Html.Attributes.class
                (if comment.isSeller then
                    "product-comment-sellerBox"

                 else
                    "product-comment-box"
                )
            ]
            ((if comment.isSeller then
                [ commentTriangleLeft comment.isMine ]

              else
                []
             )
                ++ [ Html.div
                        [ Html.Attributes.classList
                            [ ( "product-comment-text", True )
                            , ( "product-comment-text-mine", comment.isMine )
                            , ( "product-comment-text-seller", comment.isSeller )
                            ]
                        ]
                        [ Html.text comment.body ]
                   ]
                ++ (if comment.isSeller then
                        []

                    else
                        [ commentTriangleRight comment.isMine ]
                   )
            )
        , Html.div
            [ Html.Attributes.class "product-comment-time" ]
            [ Html.text (Data.DateTime.toDiffString nowMaybe comment.createdAt) ]
        ]


commentTriangleLeft : Bool -> Html.Html msg
commentTriangleLeft isMine =
    Svg.svg
        ([ Svg.Attributes.viewBox "0 0 10 10"
         , Svg.Attributes.class "product-comment-text-triangle"
         ]
            ++ (if isMine then
                    [ Svg.Attributes.class "product-comment-text-triangle-mine" ]

                else
                    []
               )
        )
        [ Svg.polygon
            [ Svg.Attributes.points "10 0 0 0 10 10" ]
            []
        ]


commentTriangleRight : Bool -> Html.Html msg
commentTriangleRight isMine =
    Svg.svg
        ([ Svg.Attributes.viewBox "0 0 10 10"
         , Svg.Attributes.class "product-comment-text-triangle"
         ]
            ++ (if isMine then
                    [ Svg.Attributes.class "product-comment-text-triangle-mine" ]

                else
                    []
               )
        )
        [ Svg.polygon
            [ Svg.Attributes.points "0 0 10 0 0 10" ]
            []
        ]
