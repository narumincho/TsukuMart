module Data.University exposing
    ( Graduate
    , School
    , SchoolAndDepartment
    , University(..)
    , departmentFromIdString
    , departmentFromIndexInSchool
    , departmentToIdString
    , departmentToIndexInSchool
    , departmentToJapaneseString
    , graduateAllValue
    , graduateFromIdString
    , graduateFromIndex
    , graduateToIdString
    , graduateToIndex
    , graduateToJapaneseString
    , schoolAll
    , schoolFromDepartment
    , schoolFromIndex
    , schoolToDepartmentList
    , schoolToIdString
    , schoolToIndex
    , schoolToJapaneseString
    , schoolToOnlyOneDepartment
    , universityFromIdString
    , universityToJapaneseString
    )

{-| 研究科、学群、学類
-}

import Utility



{- ======================================
             研究科、学群、学類
   ======================================
-}


{-| 研究科、学群、学類
-}
type University
    = GraduateTsukuba Graduate SchoolAndDepartment
    | GraduateNoTsukuba Graduate
    | NotGraduate SchoolAndDepartment


{-| 研究科、学群、学類を日本語の文字列にする
-}
universityToJapaneseString : University -> { graduate : Maybe String, school : Maybe String, department : Maybe String }
universityToJapaneseString university =
    case university of
        GraduateTsukuba graduate schoolAndDepartment ->
            { graduate = Just (graduateToJapaneseString graduate)
            , school = Just (schoolToJapaneseString (schoolFromDepartment schoolAndDepartment))
            , department = departmentToJapaneseString schoolAndDepartment
            }

        GraduateNoTsukuba graduate ->
            { graduate = Just (graduateToJapaneseString graduate)
            , school = Nothing
            , department = Nothing
            }

        NotGraduate schoolAndDepartment ->
            { graduate = Nothing
            , school = Just (schoolToJapaneseString (schoolFromDepartment schoolAndDepartment))
            , department = departmentToJapaneseString schoolAndDepartment
            }


universityFromIdString : { graduateMaybe : Maybe String, departmentMaybe : Maybe String } -> Maybe University
universityFromIdString { graduateMaybe, departmentMaybe } =
    case ( departmentMaybe |> Maybe.andThen departmentFromIdString, graduateMaybe |> Maybe.andThen graduateFromIdString ) of
        ( Just department, Just graduate ) ->
            Just (GraduateTsukuba graduate department)

        ( Nothing, Just graduate ) ->
            Just (GraduateNoTsukuba graduate)

        ( Just department, Nothing ) ->
            Just (NotGraduate department)

        ( Nothing, Nothing ) ->
            Nothing



{- ======================================
                  学群
   ======================================
-}


{-| 学群
-}
type School
    = SHumcul -- 人文・文化学群
    | SSocint -- 社会・国際学群
    | SHuman -- 人間学群
    | SLife -- 生命環境学群
    | SSse -- 理工学群
    | SInfo -- 情報学群
    | SMed -- 医学群
    | SAandd -- 芸術専門学群
    | SSport -- 体育専門学群


{-| すべての学群
-}
schoolAll : List School
schoolAll =
    [ SHumcul
    , SSocint
    , SHuman
    , SLife
    , SSse
    , SInfo
    , SMed
    , SAandd
    , SSport
    ]


schoolToIndex : School -> Int
schoolToIndex school =
    schoolAll
        |> Utility.getFirstIndex school
        |> Maybe.withDefault 0


schoolFromIndex : Int -> Maybe School
schoolFromIndex index =
    schoolAll
        |> Utility.getAt index


{-| 学群の識別用の文字列を取得する
-}
schoolToIdString : School -> String
schoolToIdString school =
    case school of
        SHumcul ->
            "humcul"

        SSocint ->
            "socint"

        SHuman ->
            "human"

        SLife ->
            "life"

        SSse ->
            "sse"

        SInfo ->
            "info"

        SMed ->
            "med"

        SAandd ->
            "aandd"

        SSport ->
            "sport"


{-| 学群の名前を取得する
-}
schoolToJapaneseString : School -> String
schoolToJapaneseString school =
    case school of
        SHumcul ->
            "人文・文化学群"

        SSocint ->
            "社会・国際学群"

        SHuman ->
            "人間学群"

        SLife ->
            "生命環境学群"

        SSse ->
            "理工学群"

        SInfo ->
            "情報学群"

        SMed ->
            "医学群"

        SAandd ->
            "芸術専門学群"

        SSport ->
            "体育専門学群"


schoolToDepartmentList : School -> List SchoolAndDepartment
schoolToDepartmentList school =
    case school of
        SHumcul ->
            [ DHumanity
            , DCulture
            , DJapanese
            ]

        SSocint ->
            [ DSocial
            , DCis
            ]

        SHuman ->
            [ DEducation
            , DPsyche
            , DDisability
            ]

        SLife ->
            [ DBiol
            , DBres
            , DEarth
            ]

        SSse ->
            [ DMath
            , DPhys
            , DChem
            , DCoens
            , DEsys
            , DPandps
            ]

        SInfo ->
            [ DCoins
            , DMast
            , DKlis
            ]

        SMed ->
            [ DMed
            , DNurse
            , DMs
            ]

        SAandd ->
            []

        SSport ->
            []


schoolToOnlyOneDepartment : School -> Maybe SchoolAndDepartment
schoolToOnlyOneDepartment school =
    case school of
        SAandd ->
            Just DAandd

        SSport ->
            Just DSport

        _ ->
            Nothing


schoolFromDepartment : SchoolAndDepartment -> School
schoolFromDepartment schoolAndDepartment =
    case schoolAndDepartment of
        DHumanity ->
            SHumcul

        DCulture ->
            SHumcul

        DJapanese ->
            SHumcul

        DSocial ->
            SSocint

        DCis ->
            SSocint

        DEducation ->
            SHuman

        DPsyche ->
            SHuman

        DDisability ->
            SHuman

        DBiol ->
            SLife

        DBres ->
            SLife

        DEarth ->
            SLife

        DMath ->
            SSse

        DPhys ->
            SSse

        DChem ->
            SSse

        DCoens ->
            SSse

        DEsys ->
            SSse

        DPandps ->
            SSse

        DCoins ->
            SInfo

        DMast ->
            SInfo

        DKlis ->
            SInfo

        DMed ->
            SMed

        DNurse ->
            SMed

        DMs ->
            SMed

        DAandd ->
            SAandd

        DSport ->
            SSport



{- ======================================
                  学類
   ======================================
-}


{-| 学類(学群の情報も含む)
-}
type SchoolAndDepartment
    = DHumanity -- 人文・文化学群 / 人文学類
    | DCulture -- 人文・文化学群 / 比較文化学類
    | DJapanese -- 人文・文化学群 / 日本語・日本文化学類
    | DSocial -- 社会・国際学群 / 社会学類
    | DCis -- 社会・国際学群 / 国際総合学類
    | DEducation -- 人間学群 / 教育学類
    | DPsyche -- 人間学群 / 心理学類
    | DDisability -- 人間学群 / 障害科学類
    | DBiol -- 生命環境学群 / 生物学類
    | DBres -- 生命環境学群 / 生物資源学類
    | DEarth -- 生命環境学群 / 地球学類
    | DMath -- 理工学群 / 数学類
    | DPhys -- 理工学群 / 物理学類
    | DChem -- 理工学群 / 化学類
    | DCoens -- 理工学群 / 応用理工学類
    | DEsys -- 理工学群 / 工学システム学類
    | DPandps -- 理工学群 / 社会工学類
    | DCoins -- 情報学群 / 情報科学類
    | DMast -- 情報学群 / 情報メディア創成学類
    | DKlis -- 情報学群 / 知識情報・図書館科学類
    | DMed -- 医学群 / 医学類
    | DNurse -- 医学群 / 看護学類
    | DMs -- 医学群 / 医療科学類
    | DAandd -- 芸術専門学群
    | DSport -- 体育専門学群


{-| すべての学類
-}
departmentAll : List SchoolAndDepartment
departmentAll =
    [ DHumanity
    , DCulture
    , DJapanese
    , DSocial
    , DCis
    , DEducation
    , DPsyche
    , DDisability
    , DBiol
    , DBres
    , DEarth
    , DMath
    , DPhys
    , DChem
    , DCoens
    , DEsys
    , DPandps
    , DCoins
    , DMast
    , DKlis
    , DMed
    , DNurse
    , DMs
    , DAandd
    , DSport
    ]


departmentToIndexInSchool : SchoolAndDepartment -> Int
departmentToIndexInSchool department =
    department
        |> schoolFromDepartment
        |> schoolToDepartmentList
        |> Utility.getFirstIndex department
        |> Maybe.withDefault 0


departmentFromIndexInSchool : School -> Int -> Maybe SchoolAndDepartment
departmentFromIndexInSchool school index =
    school
        |> schoolToDepartmentList
        |> Utility.getAt index


departmentToIdString : SchoolAndDepartment -> String
departmentToIdString department =
    case department of
        DHumanity ->
            "humanity"

        DCulture ->
            "culture"

        DJapanese ->
            "japanese"

        DSocial ->
            "social"

        DCis ->
            "cis"

        DEducation ->
            "education"

        DPsyche ->
            "psyche"

        DDisability ->
            "disability"

        DBiol ->
            "biol"

        DBres ->
            "bres"

        DEarth ->
            "earth"

        DMath ->
            "math"

        DPhys ->
            "phys"

        DChem ->
            "chem"

        DCoens ->
            "coens"

        DEsys ->
            "esys"

        DPandps ->
            "pandps"

        DCoins ->
            "coins"

        DMast ->
            "mast"

        DKlis ->
            "klis"

        DMed ->
            "med"

        DNurse ->
            "nurse"

        DMs ->
            "ms"

        DAandd ->
            "aandd"

        DSport ->
            "sport"


{-| 学類のないもの(芸術専門学群,体育専門学群)は学群IDから判断する
-}
departmentFromIdString : String -> Maybe SchoolAndDepartment
departmentFromIdString idString =
    departmentFromIdStringLoop idString departmentAll


departmentFromIdStringLoop : String -> List SchoolAndDepartment -> Maybe SchoolAndDepartment
departmentFromIdStringLoop idString departmentList =
    case departmentList of
        x :: xs ->
            if departmentToIdString x == idString then
                Just x

            else
                departmentFromIdStringLoop idString xs

        [] ->
            Nothing


departmentToJapaneseString : SchoolAndDepartment -> Maybe String
departmentToJapaneseString schoolAndDepartment =
    case schoolAndDepartment of
        DHumanity ->
            Just "人文学類"

        DCulture ->
            Just "比較文化学類"

        DJapanese ->
            Just "日本語・日本文化学類"

        DSocial ->
            Just "社会学類"

        DCis ->
            Just "国際総合学類"

        DEducation ->
            Just "教育学類"

        DPsyche ->
            Just "心理学類"

        DDisability ->
            Just "障害科学類"

        DBiol ->
            Just "生物学類"

        DBres ->
            Just "生物資源学類"

        DEarth ->
            Just "地球学類"

        DMath ->
            Just "数学類"

        DPhys ->
            Just "物理学類"

        DChem ->
            Just "化学類"

        DCoens ->
            Just "応用理工学類"

        DEsys ->
            Just "工学システム学類"

        DPandps ->
            Just "社会工学類"

        DCoins ->
            Just "情報科学類"

        DMast ->
            Just "情報メディア創成学類"

        DKlis ->
            Just "知識情報・図書館科学類"

        DMed ->
            Just "医学類"

        DNurse ->
            Just "看護学類"

        DMs ->
            Just "医療科学類"

        DAandd ->
            Nothing

        DSport ->
            Nothing



{- ======================================
                  研究科
   ======================================
-}


{-| 研究科
-}
type Graduate
    = GEducation -- 教育研究科
    | GHass -- 人文社会科学研究科
    | GGabs -- ビジネス科学研究科
    | GPas -- 数理物質科学研究科
    | GSie -- システム情報工学研究科
    | GLife -- 生命環境科学研究科
    | GChs -- 人間総合科学研究科
    | GSlis -- 図書館情報メディア研究科
    | GGlobal -- グローバル研究院


{-| すべての研究科
-}
graduateAllValue : List Graduate
graduateAllValue =
    [ GEducation
    , GHass
    , GGabs
    , GPas
    , GSie
    , GLife
    , GChs
    , GSlis
    , GGlobal
    ]


graduateToIndex : Graduate -> Int
graduateToIndex graduate =
    Utility.getFirstIndex graduate graduateAllValue
        |> Maybe.withDefault 0


graduateFromIndex : Int -> Maybe Graduate
graduateFromIndex index =
    graduateAllValue
        |> Utility.getAt index


graduateToJapaneseString : Graduate -> String
graduateToJapaneseString gradate =
    case gradate of
        GEducation ->
            "教育研究科"

        GHass ->
            "人文社会科学研究科"

        GGabs ->
            "ビジネス科学研究科"

        GPas ->
            "数理物質科学研究科"

        GSie ->
            "システム情報工学研究科"

        GLife ->
            "生命環境科学研究科"

        GChs ->
            "人間総合科学研究科"

        GSlis ->
            "図書館情報メディア研究科"

        GGlobal ->
            "グローバル研究院"


graduateToIdString : Graduate -> String
graduateToIdString graduate =
    case graduate of
        GEducation ->
            "education"

        GHass ->
            "hass"

        GGabs ->
            "gabs"

        GPas ->
            "pas"

        GSie ->
            "sie"

        GLife ->
            "life"

        GChs ->
            "chs"

        GSlis ->
            "slis"

        GGlobal ->
            "global"


graduateFromIdString : String -> Maybe Graduate
graduateFromIdString idString =
    graduateFromIdStringLoop idString graduateAllValue


graduateFromIdStringLoop : String -> List Graduate -> Maybe Graduate
graduateFromIdStringLoop idString graduateList =
    case graduateList of
        x :: xs ->
            if graduateToIdString x == idString then
                Just x

            else
                graduateFromIdStringLoop idString xs

        [] ->
            Nothing
