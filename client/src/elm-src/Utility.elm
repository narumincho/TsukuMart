module Utility exposing (getFirstIndex, toMapper, toMapperGetterMaybe)


toMapper : (big -> small) -> (small -> big -> big) -> (small -> small) -> big -> big
toMapper getter setter f big =
    big
        |> setter (f (getter big))


toMapperGetterMaybe : (big -> Maybe small) -> (small -> big -> big) -> (small -> small) -> big -> big
toMapperGetterMaybe getter setter f big =
    case big |> getter of
        Just value ->
            big |> setter (f value)

        Nothing ->
            big


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
