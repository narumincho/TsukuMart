module Utility exposing (getFirstIndex, getAt)

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
