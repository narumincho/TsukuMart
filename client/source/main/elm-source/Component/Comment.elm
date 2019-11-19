module Component.Comment exposing (commentSendButtonStyle, view)

import Css
import Data.DateTime
import Data.User as User
import Html.Styled
import Html.Styled.Attributes
import Icon
import Style
import PageLocation
import Svg.Styled as S
import Svg.Styled.Attributes as A
import Time


view :
    Maybe ( Time.Posix, Time.Zone )
    -> Maybe (List { isMine : Bool, isSeller : Bool, user : User.WithName, body : String, createdAt : Time.Posix })
    -> Html.Styled.Html msg
view nowMaybe commentListMaybe =
    Html.Styled.div
        [ Html.Styled.Attributes.css
            [ Style.displayGridAndGap 16 ]
        ]
        (case commentListMaybe of
            Just comments ->
                comments
                    |> List.reverse
                    |> List.map
                        (commentView nowMaybe)

            Nothing ->
                [ Html.Styled.text "コメント読み込み中"
                , Icon.loading { size = 48, color = Css.rgb 0 0 0 }
                ]
        )


commentView :
    Maybe ( Time.Posix, Time.Zone )
    -> { isMine : Bool, isSeller : Bool, user : User.WithName, body : String, createdAt : Time.Posix }
    -> Html.Styled.Html msg
commentView nowMaybe comment =
    Html.Styled.div
        [ Html.Styled.Attributes.css
            [ Style.displayGridAndGap 0
            , Css.property "grid-template-columns" "1fr"
            ]
        ]
        [ Html.Styled.a
            [ Html.Styled.Attributes.css
                [ Css.displayFlex
                , Css.justifyContent
                    (if comment.isSeller then
                        Css.flexStart

                     else
                        Css.flexEnd
                    )
                , Css.alignItems Css.center
                , Css.textDecoration Css.none
                ]
            , Html.Styled.Attributes.href
                (PageLocation.toUrlAsString
                    (PageLocation.User (User.withNameGetId comment.user))
                )
            ]
            [ Style.userImage 48 (User.withNameGetImageId comment.user)
            , Html.Styled.text (User.withNameGetDisplayName comment.user)
            ]
        , Html.Styled.div
            [ Html.Styled.Attributes.css
                [ Css.displayFlex
                , Css.justifyContent
                    (if comment.isSeller then
                        Css.flexStart

                     else
                        Css.flexEnd
                    )
                ]
            ]
            ((if comment.isSeller then
                [ commentTriangleLeft comment.isMine ]

              else
                []
             )
                ++ Html.Styled.div
                    [ Html.Styled.Attributes.css
                        [ Css.backgroundColor
                            (if comment.isMine then
                                mineColor

                             else
                                Css.rgb 221 221 221
                            )
                        , Css.padding (Css.px 8)
                        , if comment.isSeller then
                            Css.borderRadius4 Css.zero (Css.px 8) (Css.px 8) (Css.px 8)

                          else
                            Css.borderRadius4 (Css.px 8) Css.zero (Css.px 8) (Css.px 8)
                        ]
                    ]
                    [ Html.Styled.text comment.body ]
                :: (if comment.isSeller then
                        []

                    else
                        [ commentTriangleRight comment.isMine ]
                   )
            )
        , Html.Styled.div
            [ Html.Styled.Attributes.css
                [ Css.displayFlex
                , Css.fontSize (Css.rem 0.8)
                , Css.color (Css.rgb 102 102 102)
                , Css.justifyContent Css.flexEnd
                ]
            ]
            [ Html.Styled.text (Data.DateTime.toDiffString nowMaybe comment.createdAt) ]
        ]


commentTriangleLeft : Bool -> Html.Styled.Html msg
commentTriangleLeft isMine =
    S.svg
        [ A.viewBox "0 0 10 10"
        , A.css
            [ triangleStyle isMine ]
        ]
        [ S.polygon
            [ A.points "10 0 0 0 10 10" ]
            []
        ]


commentTriangleRight : Bool -> Html.Styled.Html msg
commentTriangleRight isMine =
    S.svg
        [ A.viewBox "0 0 10 10"
        , A.css [ triangleStyle isMine ]
        ]
        [ S.polygon
            [ A.points "0 0 10 0 0 10" ]
            []
        ]


triangleStyle : Bool -> Css.Style
triangleStyle isMine =
    Css.batch
        [ Css.fill
            (if isMine then
                mineColor

             else
                Css.rgb 221 221 221
            )
        , Css.width (Css.px 16)
        , Css.height (Css.px 16)
        ]


mineColor : Css.Color
mineColor =
    Css.rgb 200 162 219


commentSendButtonStyle : Css.Style
commentSendButtonStyle =
    Css.batch
        [ Css.padding2 (Css.px 16) (Css.px 32)
        , Css.width (Css.pct 100)
        , Css.borderRadius (Css.px 8)
        ]
