module Utility exposing (getAt, getFirstIndex, removeAt)

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
