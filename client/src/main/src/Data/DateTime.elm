module Data.DateTime exposing
    ( toDiffString
    , toString
    )

import Time
import Time.Extra


toDiffString : Maybe ( Time.Posix, Time.Zone ) -> Time.Posix -> String
toDiffString nowMaybe createdTime =
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
                toString createdTime zone

        Nothing ->
            toString createdTime Time.utc ++ "(UTC)"


toString : Time.Posix -> Time.Zone -> String
toString posix zone =
    toStringHelper
        { year = Time.toYear zone posix
        , month = Time.toMonth zone posix
        , day = Time.toDay zone posix
        , hour = Time.toHour zone posix
        , minute = Time.toMinute zone posix
        , second = Time.toSecond zone posix
        }


toStringHelper : { year : Int, month : Time.Month, day : Int, hour : Int, minute : Int, second : Int } -> String
toStringHelper { year, month, day, hour, minute, second } =
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
