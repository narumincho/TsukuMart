module Data.SAddress exposing (SAddress, fromCharList, fromStundetId, toEmailAddressString)

import Data.StudentId as StudentId exposing (StudentId)


{-| いわゆる"sアド"
s1712345@s.tsukuba.ac.jp
s1832414@lab.tsukuba.acjp
のようなもの
制約:Stringは1文字以上63文字以下で、アルファベット小文字と数字(/[0-9a-z]/)のみで構成される
-}
type SAddress
    = SAddress StudentId String


{-| sアドをメールアドレスの文字列にする
-}
toEmailAddressString : SAddress -> String
toEmailAddressString (SAddress studentId subDomain) =
    "s"
        ++ StudentId.toString studentId
        ++ "@"
        ++ subDomain
        ++ ".tsukuba.ac.jp"


{-| 文字のListから、sアドを生成する
-}
fromCharList : List Char -> Maybe SAddress
fromCharList charList =
    case charList of
        s :: i0 :: i1 :: i2 :: i3 :: i4 :: i5 :: i6 :: at :: rest ->
            if (s == 's' || s == 'S') && (at == '@') then
                case StudentId.fromCharListNo20Head [ i0, i1, i2, i3, i4, i5, i6 ] of
                    Just studentId ->
                        let
                            restString =
                                String.fromList rest
                        in
                        if
                            (restString |> String.right 14 |> String.toLower)
                                == ".tsukuba.ac.jp"
                                && ((restString |> String.dropRight 14) /= "")
                                && (restString |> String.dropRight 14 |> String.toList |> List.all Char.isAlphaNum)
                        then
                            Just (SAddress studentId (restString |> String.dropRight 14 |> String.toLower))

                        else
                            Nothing

                    _ ->
                        Nothing

            else
                Nothing

        _ ->
            Nothing


{-| 学籍番号をsアドのsに変換する
201712345 → s1712345@s.tsukuba.ac.jp
-}
fromStundetId : StudentId -> SAddress
fromStundetId studentId =
    SAddress studentId "s"
