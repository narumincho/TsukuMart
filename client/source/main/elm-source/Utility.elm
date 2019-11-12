module Utility exposing (getAt, getFirstIndex, removeAt, takeAllFromMaybeList)

import Array


getFirstIndex : a -> List a -> Maybe Int
getFirstIndex element list =
    case list of
        x :: xs ->
            if element == x then
                Just 0

            else
                getFirstIndex element xs
                    |> Maybe.map ((+) 1)

        [] ->
            Nothing


getAt : Int -> List a -> Maybe a
getAt index list =
    list
        |> Array.fromList
        |> Array.get index


removeAt : Int -> List a -> List a
removeAt index list =
    List.take index list ++ List.drop (index + 1) list


{-| List (Maybe a)の中身が全てJust aならJust [a,a,a]にして1つでもNothingが入っていればNothing
-}
takeAllFromMaybeList : List (Maybe a) -> Maybe (List a)
takeAllFromMaybeList list =
    case list of
        (Just x) :: xs ->
            case takeAllFromMaybeList xs of
                Just xss ->
                    Just (x :: xss)

                Nothing ->
                    Nothing

        Nothing :: _ ->
            Nothing

        [] ->
            Just []
