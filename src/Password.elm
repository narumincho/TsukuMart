module Password exposing (Password, errorMessage, passwordFromString)

import Set exposing (Set)


type Password
    = Password (List PasswordChar)


{-| パスワードに使える文字
-}
type PasswordChar
    = Pa
    | Pb
    | Pc
    | Pd
    | Pe
    | Pf
    | Pg
    | Ph
    | Pi
    | Pj
    | Pk
    | Pl
    | Pm
    | Pn
    | Po
    | Pp
    | Pq
    | Pr
    | Ps
    | Pt
    | Pu
    | Pv
    | Pw
    | Px
    | Py
    | Pz
    | PA
    | PB
    | PC
    | PD
    | PE
    | PF
    | PG
    | PH
    | PI
    | PJ
    | PK
    | PL
    | PM
    | PN
    | PO
    | PP
    | PQ
    | PR
    | PS
    | PT
    | PU
    | PV
    | PW
    | PX
    | PY
    | PZ
    | P0
    | P1
    | P2
    | P3
    | P4
    | P5
    | P6
    | P7
    | P8
    | P9
    | PExclamationMark -- !
    | PQuotationMark -- "
    | PNumberSign -- #
    | PDollarSign -- $
    | PercentSign -- %
    | PAmpersand -- &
    | PApostrophe -- '
    | PLeftParenthesis -- (
    | PRightParenthesis -- )
    | PAsterisk -- *
    | PPlusSign -- +
    | PComma -- ,
    | PHyphenMinus -- -
    | PFullStop -- .
    | PSolidus -- /
    | PColon -- :
    | PSemicolon -- ;
    | PLessThanSign -- <
    | PEqualsSign -- =
    | PGreaterThanSign -- >
    | PQuestionMark -- ?
    | PCommercialAt -- @
    | PLeftSquareBracket -- [
    | PReverseSolidus -- \
    | PRightSquareBracket -- ]
    | PCircumflexAccent -- ^
    | PLowLine -- _
    | PGraveAccent -- `
    | PLeftCurlyBracket -- {
    | PVerticalLine -- |
    | PRightCurlyBracket -- }
    | PTilde -- ~


type Error
    = GeneralError GeneralError
    | AllNumberError


type GeneralError
    = GLengthError LengthError
    | GInvalidCharError InvalidCharError
    | GBoth LengthError InvalidCharError


type LengthError
    = Short
    | Long


type InvalidCharError
    = InvalidCharError (Set Char)


passwordFromString : String -> Result Error Password
passwordFromString string =
    let
        charList =
            string
                |> String.trim
                |> String.toList

        result =
            charListToPasswordCharList charList
    in
    case result of
        Ok passwordCharList ->
            if passwordCharList |> List.all passwordCharIsNumber then
                Err AllNumberError

            else
                case lengthErrorFromLength (passwordCharList |> List.length) of
                    Just lengthError ->
                        Err (GeneralError (GLengthError lengthError))

                    Nothing ->
                        Ok (Password passwordCharList)

        Err invalidCharError ->
            case lengthErrorFromLength (charList |> List.length) of
                Just lengthError ->
                    Err (GeneralError (GBoth lengthError invalidCharError))

                Nothing ->
                    Err (GeneralError (GInvalidCharError invalidCharError))


{-| 文字のListをパスワードの文字のListか、エラーの文字のSetを返す
-}
charListToPasswordCharList : List Char -> Result InvalidCharError (List PasswordChar)
charListToPasswordCharList list =
    case list of
        x :: xs ->
            case ( passwordCharFromChar x, charListToPasswordCharList xs ) of
                ( Just pChar, Ok passwordCharList ) ->
                    Ok (pChar :: passwordCharList)

                ( Just _, Err invalidCharList ) ->
                    Err invalidCharList

                ( Nothing, Ok _ ) ->
                    Err (Set.singleton x)

                ( Nothing, Err invalidCharList ) ->
                    Err (invalidCharList |> Set.insert x)

        [] ->
            Ok []


passwordCharFromChar : Char -> Maybe PasswordChar
passwordCharFromChar char =
    case char of
        '!' ->
            Just PExclamationMark

        '！' ->
            Just PExclamationMark

        '"' ->
            Just PQuotationMark

        '”' ->
            Just PQuotationMark

        '#' ->
            Just PNumberSign

        '＃' ->
            Just PNumberSign

        '$' ->
            Just PDollarSign

        '＄' ->
            Just PDollarSign

        '&' ->
            Just PAmpersand

        '＆' ->
            Just PAmpersand

        '\'' ->
            Just PApostrophe

        '’' ->
            Just PApostrophe

        '(' ->
            Just PLeftParenthesis

        '（' ->
            Just PLeftParenthesis

        ')' ->
            Just PRightParenthesis

        '）' ->
            Just PRightParenthesis

        '*' ->
            Just PAsterisk

        '＊' ->
            Just PAsterisk

        '+' ->
            Just PPlusSign

        '＋' ->
            Just PPlusSign

        ',' ->
            Just PComma

        '、' ->
            Just PComma

        '，' ->
            Just PComma

        '-' ->
            Just PHyphenMinus

        'ー' ->
            Just PHyphenMinus

        '.' ->
            Just PFullStop

        '．' ->
            Just PFullStop

        '/' ->
            Just PSolidus

        '／' ->
            Just PSolidus

        ':' ->
            Just PColon

        '：' ->
            Just PColon

        ';' ->
            Just PSemicolon

        '；' ->
            Just PSemicolon

        '<' ->
            Just PLessThanSign

        '＜' ->
            Just PLessThanSign

        '=' ->
            Just PEqualsSign

        '＝' ->
            Just PEqualsSign

        '>' ->
            Just PGreaterThanSign

        '＞' ->
            Just PGreaterThanSign

        '?' ->
            Just PQuestionMark

        '？' ->
            Just PQuestionMark

        '@' ->
            Just PCommercialAt

        '＠' ->
            Just PCommercialAt

        '[' ->
            Just PLeftSquareBracket

        '［' ->
            Just PLeftSquareBracket

        '\\' ->
            Just PReverseSolidus

        '￥' ->
            Just PReverseSolidus

        ']' ->
            Just PRightSquareBracket

        '］' ->
            Just PRightSquareBracket

        '^' ->
            Just PCircumflexAccent

        '＾' ->
            Just PCircumflexAccent

        '_' ->
            Just PLowLine

        '＿' ->
            Just PLowLine

        '`' ->
            Just PGraveAccent

        '{' ->
            Just PLeftCurlyBracket

        '｛' ->
            Just PLeftCurlyBracket

        '|' ->
            Just PVerticalLine

        '｜' ->
            Just PVerticalLine

        '}' ->
            Just PRightCurlyBracket

        '｝' ->
            Just PRightCurlyBracket

        'a' ->
            Just Pa

        'ａ' ->
            Just Pa

        'b' ->
            Just Pb

        'ｂ' ->
            Just Pb

        'c' ->
            Just Pc

        'ｃ' ->
            Just Pc

        'd' ->
            Just Pd

        'ｄ' ->
            Just Pd

        'e' ->
            Just Pe

        'ｅ' ->
            Just Pe

        'f' ->
            Just Pf

        'ｆ' ->
            Just Pf

        'g' ->
            Just Pg

        'ｇ' ->
            Just Pg

        'h' ->
            Just Ph

        'ｈ' ->
            Just Ph

        'i' ->
            Just Pi

        'ｉ' ->
            Just Pi

        'j' ->
            Just Pj

        'ｊ' ->
            Just Pj

        'k' ->
            Just Pk

        'ｋ' ->
            Just Pk

        'l' ->
            Just Pl

        'ｌ' ->
            Just Pl

        'm' ->
            Just Pm

        'ｍ' ->
            Just Pm

        'n' ->
            Just Pn

        'ｎ' ->
            Just Pn

        'o' ->
            Just Po

        'ｏ' ->
            Just Po

        'p' ->
            Just Pp

        'ｐ' ->
            Just Pp

        'q' ->
            Just Pq

        'ｑ' ->
            Just Pq

        'r' ->
            Just Pr

        'ｒ' ->
            Just Pr

        's' ->
            Just Ps

        'ｓ' ->
            Just Ps

        't' ->
            Just Pt

        'ｔ' ->
            Just Pt

        'u' ->
            Just Pu

        'ｕ' ->
            Just Pu

        'v' ->
            Just Pv

        'ｖ' ->
            Just Pv

        'w' ->
            Just Pw

        'ｗ' ->
            Just Pw

        'x' ->
            Just Px

        'ｘ' ->
            Just Px

        'y' ->
            Just Py

        'ｙ' ->
            Just Py

        'z' ->
            Just Pz

        'ｚ' ->
            Just Pz

        'A' ->
            Just PA

        'Ａ' ->
            Just PA

        'B' ->
            Just PB

        'Ｂ' ->
            Just PB

        'C' ->
            Just PC

        'Ｃ' ->
            Just PC

        'D' ->
            Just PD

        'Ｄ' ->
            Just PD

        'E' ->
            Just PE

        'Ｅ' ->
            Just PE

        'F' ->
            Just PF

        'Ｆ' ->
            Just PF

        'G' ->
            Just PG

        'Ｇ' ->
            Just PG

        'H' ->
            Just PH

        'Ｈ' ->
            Just PH

        'I' ->
            Just PI

        'Ｉ' ->
            Just PI

        'J' ->
            Just PJ

        'Ｊ' ->
            Just PJ

        'K' ->
            Just PK

        'Ｋ' ->
            Just PK

        'L' ->
            Just PL

        'Ｌ' ->
            Just PL

        'M' ->
            Just PM

        'Ｍ' ->
            Just PM

        'N' ->
            Just PN

        'Ｎ' ->
            Just PN

        'O' ->
            Just PO

        'Ｏ' ->
            Just PO

        'P' ->
            Just PP

        'Ｐ' ->
            Just PP

        'Q' ->
            Just PQ

        'Ｑ' ->
            Just PQ

        'R' ->
            Just PR

        'Ｒ' ->
            Just PR

        'S' ->
            Just PS

        'Ｓ' ->
            Just PS

        'T' ->
            Just PT

        'Ｔ' ->
            Just PT

        'U' ->
            Just PU

        'Ｕ' ->
            Just PU

        'V' ->
            Just PV

        'Ｖ' ->
            Just PV

        'W' ->
            Just PW

        'Ｗ' ->
            Just PW

        'X' ->
            Just PX

        'Ｘ' ->
            Just PX

        'Y' ->
            Just PY

        'Ｙ' ->
            Just PY

        'Z' ->
            Just PZ

        'Ｚ' ->
            Just PZ

        '0' ->
            Just P0

        '０' ->
            Just P0

        '1' ->
            Just P1

        '１' ->
            Just P1

        '2' ->
            Just P2

        '２' ->
            Just P2

        '3' ->
            Just P3

        '３' ->
            Just P3

        '4' ->
            Just P4

        '４' ->
            Just P4

        '5' ->
            Just P5

        '５' ->
            Just P5

        '6' ->
            Just P6

        '６' ->
            Just P6

        '7' ->
            Just P7

        '７' ->
            Just P7

        '8' ->
            Just P8

        '８' ->
            Just P8

        '9' ->
            Just P9

        '９' ->
            Just P9

        _ ->
            Nothing


passwordCharIsNumber : PasswordChar -> Bool
passwordCharIsNumber passwordChar =
    case passwordChar of
        P0 ->
            True

        P1 ->
            True

        P2 ->
            True

        P3 ->
            True

        P4 ->
            True

        P5 ->
            True

        P6 ->
            True

        P7 ->
            True

        P8 ->
            True

        P9 ->
            True

        _ ->
            False


lengthErrorFromLength : Int -> Maybe LengthError
lengthErrorFromLength length =
    if length < 9 then
        Just Short

    else if 50 < length then
        Just Long

    else
        Nothing


errorMessage : Error -> String
errorMessage error =
    case error of
        GeneralError generalError ->
            generalErrorMessage generalError

        AllNumberError ->
            "数字のみは不可"


generalErrorMessage : GeneralError -> String
generalErrorMessage generalError =
    case generalError of
        GLengthError lengthError ->
            lengthErrorMessage lengthError

        GInvalidCharError invalidCharError ->
            invalidCharErrorMessage invalidCharError

        GBoth lengthError invalidCharError ->
            lengthErrorMessage lengthError
                ++ " "
                ++ invalidCharErrorMessage invalidCharError


lengthErrorMessage : LengthError -> String
lengthErrorMessage lengthError =
    (case lengthError of
        Short ->
            "文字数が足りません。"

        Long ->
            "文字数が多いです。"
    )
        ++ "文字数は9文字以上50文字以内である必要があります"


invalidCharErrorMessage : InvalidCharError -> String
invalidCharErrorMessage (InvalidCharError charSet) =
    "使えない文字"
        ++ String.fromList (Set.toList charSet)
        ++ "が含まれています。使える文字は英数字と記号(!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~)です"
