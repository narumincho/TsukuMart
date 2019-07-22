module Page.Component.Comment exposing (view)

import Css
import Data.DateTime
import Data.User as User
import Html
import Html.Attributes
import Icon
import Page.Style
import PageLocation
import Svg.Styled as S
import Svg.Styled.Attributes as A
import Time


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
                , Icon.loading { size = 48, color = Css.rgb 0 0 0 }
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
            [ Page.Style.userImage 48 (User.withNameGetImageId comment.user)
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
    S.svg
        ([ A.viewBox "0 0 10 10"
         , A.class "product-comment-text-triangle"
         ]
            ++ (if isMine then
                    [ A.class "product-comment-text-triangle-mine" ]

                else
                    []
               )
        )
        [ S.polygon
            [ A.points "10 0 0 0 10 10" ]
            []
        ]
        |> S.toUnstyled


commentTriangleRight : Bool -> Html.Html msg
commentTriangleRight isMine =
    S.svg
        ([ A.viewBox "0 0 10 10"
         , A.class "product-comment-text-triangle"
         ]
            ++ (if isMine then
                    [ A.class "product-comment-text-triangle-mine" ]

                else
                    []
               )
        )
        [ S.polygon
            [ A.points "0 0 10 0 0 10" ]
            []
        ]
        |> S.toUnstyled
