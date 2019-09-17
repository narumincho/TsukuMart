module Data.SearchCondition exposing
    ( CategoryCondition(..)
    , Condition
    , UniversityCondition(..)
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
