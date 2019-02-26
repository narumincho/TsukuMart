module EmailAddress exposing (EmailAddress(..), fromCharList, toString)

import Regex


{-| メールアドレス
制約: メールアドレスの文字列であること
-}
type EmailAddress
    = EmailAddress String


fromCharList : List Char -> Maybe EmailAddress
fromCharList charList =
    charList
        |> String.fromList
        |> Regex.find emailRegex
        |> List.head
        |> Maybe.map (.match >> EmailAddress)


emailRegex : Regex.Regex
emailRegex =
    Regex.fromString "^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
        |> Maybe.withDefault Regex.never


toString : EmailAddress -> String
toString (EmailAddress string) =
    String.toLower string
