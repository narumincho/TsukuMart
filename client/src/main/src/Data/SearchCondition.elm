module Data.SearchCondition exposing
    ( CategorySelect(..)
    , Condition
    , UniversitySelect(..)
    , getCategory
    , getQuery
    , getUniversitySelect
    , init
    )

import Data.Category
import Data.University


type Condition
    = Condition
        { query : String
        , category : CategorySelect
        , university : UniversitySelect
        }


init : String -> CategorySelect -> UniversitySelect -> Condition
init query category university =
    Condition
        { query = query
        , category = category
        , university = university
        }


getQuery : Condition -> String
getQuery (Condition { query }) =
    query


getCategory : Condition -> CategorySelect
getCategory (Condition { category }) =
    category


getUniversitySelect : Condition -> UniversitySelect
getUniversitySelect (Condition { university }) =
    university


type CategorySelect
    = CategorySelectNone
    | CategorySelectGroup Data.Category.Group
    | CategorySelectCategory Data.Category.Category


type UniversitySelect
    = UniversitySelectNone
    | UniversitySelectDepartment Data.University.Department
    | UniversitySelectSchool Data.University.School
    | UniversitySelectGraduate Data.University.Graduate
