module Page.Component.Comment exposing (view)

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
            [ Html.text (createdAtToString nowMaybe comment.createdAt) ]
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


createdAtToString : Maybe ( Time.Posix, Time.Zone ) -> Time.Posix -> String
createdAtToString nowMaybe createdTime =
    case nowMaybe of
        Just ( nowPosix, zone ) ->
            if (nowPosix |> Time.Extra.diff Time.Extra.Month zone createdTime) == 0 then
                let
                    diffDay =
                        nowPosix
                            |> Time.Extra.diff Time.Extra.Day zone createdTime

                    diffHour =
                        nowPosix
                            |> Time.Extra.diff Time.Extra.Hour zone createdTime

                    diffMinute =
                        nowPosix
                            |> Time.Extra.diff Time.Extra.Minute zone createdTime

                    diffSecond =
                        nowPosix
                            |> Time.Extra.diff Time.Extra.Second zone createdTime
                in
                if diffDay /= 0 then
                    String.fromInt diffDay ++ "日前"

                else if diffHour /= 0 then
                    String.fromInt diffHour ++ "時間前"

                else if diffMinute /= 0 then
                    String.fromInt diffMinute ++ "分前"

                else
                    String.fromInt diffSecond ++ "秒前"

            else
                posixAndZoneToString createdTime zone

        Nothing ->
            posixAndZoneToString createdTime Time.utc ++ "(UTC)"


posixAndZoneToString : Time.Posix -> Time.Zone -> String
posixAndZoneToString posix zone =
    timeToString
        { year = Time.toYear zone posix
        , month = Time.toMonth zone posix
        , day = Time.toDay zone posix
        , hour = Time.toHour zone posix
        , minute = Time.toMinute zone posix
        , second = Time.toSecond zone posix
        }


timeToString : { year : Int, month : Time.Month, day : Int, hour : Int, minute : Int, second : Int } -> String
timeToString { year, month, day, hour, minute, second } =
    String.concat
        [ year |> String.fromInt |> String.padLeft 4 '0'
        , "/"
        , month |> monthToString |> String.padLeft 2 '0'
        , "/"
        , day |> String.fromInt |> String.padLeft 2 '0'
        , " "
        , hour |> String.fromInt |> String.padLeft 2 '0'
        , ":"
        , minute |> String.fromInt |> String.padLeft 2 '0'
        , ":"
        , second |> String.fromInt |> String.padLeft 2 '0'
        ]


monthToString : Time.Month -> String
monthToString month =
    case month of
        Time.Jan ->
            "1"

        Time.Feb ->
            "2"

        Time.Mar ->
            "3"

        Time.Apr ->
            "4"

        Time.May ->
            "5"

        Time.Jun ->
            "6"

        Time.Jul ->
            "7"

        Time.Aug ->
            "8"

        Time.Sep ->
            "9"

        Time.Oct ->
            "10"

        Time.Nov ->
            "11"

        Time.Dec ->
            "12"
