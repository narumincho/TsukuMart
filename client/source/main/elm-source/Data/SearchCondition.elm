module Data.SearchCondition exposing
    ( CategoryCondition(..)
    , Condition
    , UniversityCondition(..)
    , getCategory
    , getQuery
    , getUniversitySelect
    , init
    , search
    )

import Data.Category
import Data.Product
import Data.University


type Condition
    = Condition
        { query : String
        , category : CategoryCondition
        , university : UniversityCondition
        }


init : String -> CategoryCondition -> UniversityCondition -> Condition
init query category university =
    Condition
        { query = query
        , category = category
        , university = university
        }


getQuery : Condition -> String
getQuery (Condition { query }) =
    query


getCategory : Condition -> CategoryCondition
getCategory (Condition { category }) =
    category


getUniversitySelect : Condition -> UniversityCondition
getUniversitySelect (Condition { university }) =
    university


type CategoryCondition
    = CategoryNone
    | CategoryGroup Data.Category.Group
    | CategoryCategory Data.Category.Category


type UniversityCondition
    = UniversityNone
    | UniversityDepartment Data.University.Department
    | UniversitySchool Data.University.School
    | UniversityGraduate Data.University.Graduate


search : Condition -> List Data.Product.Product -> List Data.Product.Id
search condition =
    List.filter (satisfyCondition condition)
        >> List.map Data.Product.getId


satisfyCondition : Condition -> Data.Product.Product -> Bool
satisfyCondition (Condition record) product =
    satisfyCategoryCondition record.category product
        && satisfyUniversityCondition record.university product
        && satisfyQuery record.query product


satisfyCategoryCondition : CategoryCondition -> Data.Product.Product -> Bool
satisfyCategoryCondition condition product =
    case condition of
        CategoryNone ->
            True

        CategoryGroup group ->
            (product |> Data.Product.getCategory |> Data.Category.groupFromCategory) == group

        CategoryCategory category ->
            Data.Product.getCategory product == category


{-| TODO ユーザーの情報を事前にDL
-}
satisfyUniversityCondition : UniversityCondition -> Data.Product.Product -> Bool
satisfyUniversityCondition condition product =
    case condition of
        UniversityNone ->
            True

        UniversityDepartment department ->
            True

        UniversitySchool school ->
            True

        UniversityGraduate graduate ->
            True


satisfyQuery : String -> Data.Product.Product -> Bool
satisfyQuery query product =
    (product
        |> Data.Product.getName
        |> normalization
        |> String.contains (normalization query)
    )
        || (product
                |> Data.Product.getDescription
                |> normalization
                |> String.contains (normalization query)
           )


{-| 検索用に正規化する。カタカナをひらがなに、アルファベットの大文字を小文字に
-}
normalization : String -> String
normalization text =
    text
        |> String.toList
        |> List.map
            (\c ->
                let
                    charCode =
                        Char.toCode c
                in
                (if Char.toCode 'ァ' <= charCode && charCode <= Char.toCode 'ン' then
                    Char.fromCode (charCode - 0x06)

                 else
                    c
                )
                    |> Char.toLower
            )
        |> String.fromList
