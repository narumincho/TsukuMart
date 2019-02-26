module Password exposing (Error, Password, errorMessage, passwordFromString)

import Set exposing (Set)

{-| パスワード
制約: 数字だけは不可。長さは9文字以上50文字以内
-}
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
    | ExclamationMark -- !
    | QuotationMark -- "
    | NumberSign -- #
    | DollarSign -- $
    | PercentSign -- %
    | Ampersand -- &
    | Apostrophe -- '
    | LeftParenthesis -- (
    | RightParenthesis -- )
    | Asterisk -- *
    | PlusSign -- +
    | Comma -- ,
    | HyphenMinus -- -
    | FullStop -- .
    | Solidus -- /
    | Colon -- :
    | Semicolon -- ;
    | LessThanSign -- <
    | EqualsSign -- =
    | GreaterThanSign -- >
    | QuestionMark -- ?
    | CommercialAt -- @
    | LeftSquareBracket -- [
    | ReverseSolidus -- \
    | RightSquareBracket -- ]
    | CircumflexAccent -- ^
    | LowLine -- _
    | GraveAccent -- `
    | LeftCurlyBracket -- {
    | VerticalLine -- |
    | RightCurlyBracket -- }
    | Tilde -- ~


type Error
    = EAllNumberError
    | EInvalidCharError InvalidCharError
    | ELengthError LengthError
    | EInvalidAndLengthError InvalidCharError LengthError
    | EAllNumberAndLengthError LengthError


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
            if passwordCharList /= [] && (passwordCharList |> List.all passwordCharIsNumber) then
                case lengthErrorFromLength (passwordCharList |> List.length) of
                    Just lengthError ->
                        Err (EAllNumberAndLengthError lengthError)

                    Nothing ->
                        Err EAllNumberError

            else
                case lengthErrorFromLength (passwordCharList |> List.length) of
                    Just lengthError ->
                        Err (ELengthError lengthError)

                    Nothing ->
                        Ok (Password passwordCharList)

        Err invalidCharError ->
            case lengthErrorFromLength (charList |> List.length) of
                Just lengthError ->
                    Err (EInvalidAndLengthError invalidCharError lengthError)

                Nothing ->
                    Err (EInvalidCharError invalidCharError)


{-| 文字のListをパスワードの文字のListか、エラーの文字のSetを返す
-}
charListToPasswordCharList : List Char -> Result InvalidCharError (List PasswordChar)
charListToPasswordCharList list =
    case list of
        x :: xs ->
            case ( passwordCharFromChar x, charListToPasswordCharList xs ) of
                ( Just pChar, Ok passwordCharList ) ->
                    Ok (pChar :: passwordCharList)

                ( Just _, Err invalidCharSet ) ->
                    Err invalidCharSet

                ( Nothing, Ok _ ) ->
                    Err (InvalidCharError (Set.singleton x))

                ( Nothing, Err (InvalidCharError invalidCharSet) ) ->
                    Err (InvalidCharError (invalidCharSet |> Set.insert x))

        [] ->
            Ok []


passwordCharFromChar : Char -> Maybe PasswordChar
passwordCharFromChar char =
    case char of
        '!' ->
            Just ExclamationMark

        '！' ->
            Just ExclamationMark

        '"' ->
            Just QuotationMark

        '”' ->
            Just QuotationMark

        '#' ->
            Just NumberSign

        '＃' ->
            Just NumberSign

        '$' ->
            Just DollarSign

        '＄' ->
            Just DollarSign

        '%' ->
            Just PercentSign

        '％' ->
            Just PercentSign

        '&' ->
            Just Ampersand

        '＆' ->
            Just Ampersand

        '\'' ->
            Just Apostrophe

        '’' ->
            Just Apostrophe

        '(' ->
            Just LeftParenthesis

        '（' ->
            Just LeftParenthesis

        ')' ->
            Just RightParenthesis

        '）' ->
            Just RightParenthesis

        '*' ->
            Just Asterisk

        '＊' ->
            Just Asterisk

        '+' ->
            Just PlusSign

        '＋' ->
            Just PlusSign

        ',' ->
            Just Comma

        '、' ->
            Just Comma

        '，' ->
            Just Comma

        '-' ->
            Just HyphenMinus

        'ー' ->
            Just HyphenMinus

        '.' ->
            Just FullStop

        '．' ->
            Just FullStop

        '/' ->
            Just Solidus

        '／' ->
            Just Solidus

        ':' ->
            Just Colon

        '：' ->
            Just Colon

        ';' ->
            Just Semicolon

        '；' ->
            Just Semicolon

        '<' ->
            Just LessThanSign

        '＜' ->
            Just LessThanSign

        '=' ->
            Just EqualsSign

        '＝' ->
            Just EqualsSign

        '>' ->
            Just GreaterThanSign

        '＞' ->
            Just GreaterThanSign

        '?' ->
            Just QuestionMark

        '？' ->
            Just QuestionMark

        '@' ->
            Just CommercialAt

        '＠' ->
            Just CommercialAt

        '[' ->
            Just LeftSquareBracket

        '［' ->
            Just LeftSquareBracket

        '\\' ->
            Just ReverseSolidus

        '￥' ->
            Just ReverseSolidus

        ']' ->
            Just RightSquareBracket

        '］' ->
            Just RightSquareBracket

        '^' ->
            Just CircumflexAccent

        '＾' ->
            Just CircumflexAccent

        '_' ->
            Just LowLine

        '＿' ->
            Just LowLine

        '`' ->
            Just GraveAccent

        '{' ->
            Just LeftCurlyBracket

        '｛' ->
            Just LeftCurlyBracket

        '|' ->
            Just VerticalLine

        '｜' ->
            Just VerticalLine

        '}' ->
            Just RightCurlyBracket

        '｝' ->
            Just RightCurlyBracket

        '~' ->
            Just Tilde

        '～' ->
            Just Tilde

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
    (case error of
        EAllNumberError ->
            [ allNumberErrorMessage ]

        EInvalidCharError invalidCharError ->
            [ invalidCharErrorMessage invalidCharError ]

        ELengthError lengthError ->
            [ lengthErrorMessage lengthError ]

        EInvalidAndLengthError invalidCharError lengthError ->
            [ invalidCharErrorMessage invalidCharError, lengthErrorMessage lengthError ]

        EAllNumberAndLengthError lengthError ->
            [ lengthErrorMessage lengthError, allNumberErrorMessage ]
    )
        |> String.concat


allNumberErrorMessage : String
allNumberErrorMessage =
    "数字のみは不可"


lengthErrorMessage : LengthError -> String
lengthErrorMessage lengthError =
    (case lengthError of
        Short ->
            "文字数が足りません。"

        Long ->
            "文字数が多いです。"
    )
        ++ "文字数は9文字以上50文字以内である必要があります。"


invalidCharErrorMessage : InvalidCharError -> String
invalidCharErrorMessage (InvalidCharError charSet) =
    "使えない文字"
        ++ String.fromList (Set.toList charSet)
        ++ "が含まれています。使える文字は英数字と記号(!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~)です。"
