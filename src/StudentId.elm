module StudentId exposing
    ( PartStudentId
    , StudentId
    , fromCharList
    , partStudentIdFromCharList
    , partStudentIdToString
    , partStudentIdToStringWith20
    , toString
    , toStringWith20
    , fromCharListNo20Head)

{-| 学籍番号
201712345のようなもの
20は固定。209999999のような番号を指定することもできる。実際にその番号に人がいるかわからない
-}


type StudentId
    = StudentId Digit Digit Digit Digit Digit Digit Digit


type PartStudentId
    = P0
    | P1 Digit
    | P2 Digit Digit
    | P3 Digit Digit Digit
    | P4 Digit Digit Digit Digit
    | P5 Digit Digit Digit Digit Digit
    | P6 Digit Digit Digit Digit Digit Digit


{-| 学籍番号を構成する数
-}
type Digit
    = D0
    | D1
    | D2
    | D3
    | D4
    | D5
    | D6
    | D7
    | D8
    | D9


{-| 201712345のような文字のListを学籍番号に変換する
-}
fromCharList : List Char -> Maybe StudentId
fromCharList charList =
    case charList of
        h0 :: h1 :: hs ->
            if is20 h0 h1 then
                fromCharListNo20Head hs

            else
                Nothing

        _ ->
            Nothing


{-| 20の部分を省略した学籍番号の文字のListを学籍番号に変換する
-}
fromCharListNo20Head : List Char -> Maybe StudentId
fromCharListNo20Head charList =
    case charList |> List.map digitFromChar of
        (Just i0) :: (Just i1) :: (Just i2) :: (Just i3) :: (Just i4) :: (Just i5) :: (Just i6) :: [] ->
            Just
                (StudentId i0 i1 i2 i3 i4 i5 i6)

        _ ->
            Nothing


partStudentIdFromCharList : List Char -> Maybe PartStudentId
partStudentIdFromCharList charList =
    case charList of
        h0 :: h1 :: hs ->
            if is20 h0 h1 then
                case hs |> List.map digitFromChar of
                    [] ->
                        Just P0

                    (Just i0) :: [] ->
                        Just (P1 i0)

                    (Just i0) :: (Just i1) :: [] ->
                        Just (P2 i0 i1)

                    (Just i0) :: (Just i1) :: (Just i2) :: [] ->
                        Just (P3 i0 i1 i2)

                    (Just i0) :: (Just i1) :: (Just i2) :: (Just i3) :: [] ->
                        Just (P4 i0 i1 i2 i3)

                    (Just i0) :: (Just i1) :: (Just i2) :: (Just i3) :: (Just i4) :: [] ->
                        Just (P5 i0 i1 i2 i3 i4)

                    (Just i0) :: (Just i1) :: (Just i2) :: (Just i3) :: (Just i4) :: (Just i5) :: [] ->
                        Just (P6 i0 i1 i2 i3 i4 i5)

                    _ ->
                        Nothing

            else
                Nothing

        _ ->
            Nothing


is20 : Char -> Char -> Bool
is20 c0 c1 =
    case ( digitFromChar c0, digitFromChar c1 ) of
        ( Just D2, Just D0 ) ->
            True

        ( _, _ ) ->
            False


{-| 文字を学籍番号を構成する数に変換する
-}
digitFromChar : Char -> Maybe Digit
digitFromChar char =
    case char of
        '0' ->
            Just D0

        '０' ->
            Just D0

        '1' ->
            Just D1

        '１' ->
            Just D1

        '2' ->
            Just D2

        '２' ->
            Just D2

        '3' ->
            Just D3

        '３' ->
            Just D3

        '4' ->
            Just D4

        '４' ->
            Just D4

        '5' ->
            Just D5

        '５' ->
            Just D5

        '6' ->
            Just D6

        '６' ->
            Just D6

        '7' ->
            Just D7

        '７' ->
            Just D7

        '8' ->
            Just D8

        '８' ->
            Just D8

        '9' ->
            Just D9

        '９' ->
            Just D9

        _ ->
            Nothing


{-| 学籍番号を文字列にする。先頭の20は含まない
-}
toString : StudentId -> String
toString (StudentId i0 i1 i2 i3 i4 i5 i6) =
    [ i0, i1, i2, i3, i4, i5, i6 ]
        |> List.map digitToChar
        |> String.fromList


{-| 学籍番号を文字列にする。先頭の20を含む
-}
toStringWith20 : StudentId -> String
toStringWith20 studentId =
    "20" ++ toString studentId


{-| 入力途中の学籍番号を文字列にする。先頭の20は含まない
-}
partStudentIdToString : PartStudentId -> String
partStudentIdToString partStudentId =
    (case partStudentId of
        P0 ->
            []

        P1 i0 ->
            [ i0 ]

        P2 i0 i1 ->
            [ i0, i1 ]

        P3 i0 i1 i2 ->
            [ i0, i1, i2 ]

        P4 i0 i1 i2 i3 ->
            [ i0, i1, i2, i3 ]

        P5 i0 i1 i2 i3 i4 ->
            [ i0, i1, i2, i3, i4 ]

        P6 i0 i1 i2 i3 i4 i5 ->
            [ i0, i1, i2, i3, i4, i5 ]
    )
        |> listGrow 7
        |> List.map
            (\numMaybe ->
                numMaybe |> Maybe.map digitToChar |> Maybe.withDefault '?'
            )
        |> String.fromList


{-| 指定した長さのListにする。足りないところはNothingで埋める
-}
listGrow : Int -> List a -> List (Maybe a)
listGrow length list =
    let
        listLength =
            List.length list
    in
    if length < listLength then
        list
            |> List.take length
            |> List.map Just

    else
        (list
            |> List.map Just
        )
            ++ List.repeat (length - listLength) Nothing


{-| 入力途中の学籍番号を文字列にする。先頭の20を含む
-}
partStudentIdToStringWith20 : PartStudentId -> String
partStudentIdToStringWith20 partStudentId =
    "20" ++ partStudentIdToString partStudentId


digitToChar : Digit -> Char
digitToChar i =
    case i of
        D0 ->
            '0'

        D1 ->
            '1'

        D2 ->
            '2'

        D3 ->
            '3'

        D4 ->
            '4'

        D5 ->
            '5'

        D6 ->
            '6'

        D7 ->
            '7'

        D8 ->
            '8'

        D9 ->
            '9'
