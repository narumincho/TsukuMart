module School exposing
    ( Graduate
    , School
    , SchoolAndDepartment
    , departmentAllValue
    , departmentToJapaneseString
    , departmentToSchool
    , graduateAllValue
    , graduateToJapaneseString
    , schoolAllValue
    , schoolAndDepartmentToJapaneseString
    , schoolToIdString
    , schoolToJapaneseString
    , schoolToOnlyOneDepartment
    )

{-| 学群
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


{-| 学群と学類
-}
type SchoolAndDepartment
    = DHumcul HumculDepartment -- 人文・文化学群
    | DSocint SocintDepartment -- 社会・国際学群
    | DHuman HumanDepartment -- 人間学群
    | DLife LifeDepartment -- 生命環境学群
    | DSse SseDepartment -- 理工学群
    | DInfo InfoDepartment -- 情報学群
    | DMed MedDepartment -- 医学群
    | DAandd -- 芸術専門学群
    | DSport -- 体育専門学群


{-| 人文・文化学群
-}
type HumculDepartment
    = HumculHumanity -- 人文学類
    | HumculCulture -- 比較文化学類
    | HumculJapanese -- 日本語・日本文化学類


{-| 社会・国際学群
-}
type SocintDepartment
    = SocintSocial -- 社会学類
    | SocintCis -- 国際総合学類


{-| 人間学群
-}
type HumanDepartment
    = HumanEducation -- 教育学類
    | HumanPsyche -- 心理学類
    | HumanDisability -- 障害科学類


{-| 生命環境学群
-}
type LifeDepartment
    = LifeBiol -- 生物学類
    | LifeBres -- 生物資源学類
    | LifeEarth -- 地球学類


{-| 理工学群
-}
type SseDepartment
    = SseMath -- 数学類
    | SsePhys -- 物理学類
    | SseChem -- 化学類
    | SseCoens -- 応用理工学類
    | SseEsys -- 工学システム学類
    | SsePandps -- 社会工学類


{-| 情報学群
-}
type InfoDepartment
    = InfoCoins -- 情報科学類
    | InfoMast -- 情報メディア創成学類
    | InfoKlis -- 知識情報・図書館科学類


{-| 医学群
-}
type MedDepartment
    = MedMed -- 医学類
    | MedNurse -- 看護学類
    | MedMs -- 医療科学類


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


schoolAllValue : List School
schoolAllValue =
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


departmentAllValue : School -> List SchoolAndDepartment
departmentAllValue school =
    case school of
        SHumcul ->
            [ HumculHumanity
            , HumculCulture
            , HumculJapanese
            ]
                |> List.map DHumcul

        SSocint ->
            [ SocintSocial
            , SocintCis
            ]
                |> List.map DSocint

        SHuman ->
            [ HumanEducation
            , HumanPsyche
            , HumanDisability
            ]
                |> List.map DHuman

        SLife ->
            [ LifeBiol
            , LifeBres
            , LifeEarth
            ]
                |> List.map DLife

        SSse ->
            [ SseMath
            , SsePhys
            , SseChem
            , SseCoens
            , SseEsys
            , SsePandps
            ]
                |> List.map DSse

        SInfo ->
            [ InfoCoins
            , InfoMast
            , InfoKlis
            ]
                |> List.map DInfo

        SMed ->
            [ MedMed
            , MedNurse
            , MedMs
            ]
                |> List.map DMed

        SAandd ->
            []

        SSport ->
            []


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


schoolToOnlyOneDepartment : School -> Maybe SchoolAndDepartment
schoolToOnlyOneDepartment school =
    case school of
        SAandd ->
            Just DAandd

        SSport ->
            Just DSport

        _ ->
            Nothing


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


departmentToSchool : SchoolAndDepartment -> School
departmentToSchool schoolAndDepartment =
    case schoolAndDepartment of
        DHumcul _ ->
            SHumcul

        DSocint _ ->
            SSocint

        DHuman _ ->
            SHuman

        DLife _ ->
            SLife

        DSse _ ->
            SSse

        DInfo _ ->
            SInfo

        DMed _ ->
            SMed

        DAandd ->
            SAandd

        DSport ->
            SSport


departmentToJapaneseString : SchoolAndDepartment -> Maybe String
departmentToJapaneseString =
    schoolAndDepartmentToJapaneseString >> .department


schoolAndDepartmentToJapaneseString : SchoolAndDepartment -> { school : String, department : Maybe String }
schoolAndDepartmentToJapaneseString schoolAndDepartment =
    (case schoolAndDepartment of
        DHumcul humculDepartment ->
            ( SHumcul
            , Just (humculDepartmentToJapaneseString humculDepartment)
            )

        DSocint socintDepartment ->
            ( SSocint
            , Just (socintDepartmentToJapaneseString socintDepartment)
            )

        DHuman humanDepartment ->
            ( SHuman
            , Just (humanDepartmentToJapaneseString humanDepartment)
            )

        DLife lifeDepartment ->
            ( SLife
            , Just (lifeDepartmentToJapanseString lifeDepartment)
            )

        DSse sseDepartment ->
            ( SSse
            , Just (sseDepartmentToJapaneseString sseDepartment)
            )

        DInfo infoDepartment ->
            ( SInfo
            , Just (infoDepartmentToJapaneseString infoDepartment)
            )

        DMed medDepartment ->
            ( SMed
            , Just (medDepartmentToJapaneseString medDepartment)
            )

        DAandd ->
            ( SAandd
            , Nothing
            )

        DSport ->
            ( SSport
            , Nothing
            )
    )
        |> (\( s, d ) ->
                { school = schoolToJapaneseString s
                , department = d
                }
           )


humculDepartmentToIdString : HumculDepartment -> String
humculDepartmentToIdString department =
    case department of
        HumculHumanity ->
            "humanity"

        HumculCulture ->
            "culture"

        HumculJapanese ->
            "japanese"


humculDepartmentToJapaneseString : HumculDepartment -> String
humculDepartmentToJapaneseString department =
    case department of
        HumculHumanity ->
            "人文学類"

        HumculCulture ->
            "比較文化学類"

        HumculJapanese ->
            "日本語・日本文化学類"


socintDepartmentToIdString : SocintDepartment -> String
socintDepartmentToIdString department =
    case department of
        SocintSocial ->
            "social"

        SocintCis ->
            "cis"


socintDepartmentToJapaneseString : SocintDepartment -> String
socintDepartmentToJapaneseString department =
    case department of
        SocintSocial ->
            "社会学類"

        SocintCis ->
            "国際総合学類"


humanDepartmentToIdString : HumanDepartment -> String
humanDepartmentToIdString department =
    case department of
        HumanEducation ->
            "education"

        HumanPsyche ->
            "psyche"

        HumanDisability ->
            "disability"


humanDepartmentToJapaneseString : HumanDepartment -> String
humanDepartmentToJapaneseString department =
    case department of
        HumanEducation ->
            "教育学類"

        HumanPsyche ->
            "心理学類"

        HumanDisability ->
            "障害科学類"


lifeDepartmentToIdString : LifeDepartment -> String
lifeDepartmentToIdString department =
    case department of
        LifeBiol ->
            "biol"

        LifeBres ->
            "bres"

        LifeEarth ->
            "earth"


lifeDepartmentToJapanseString : LifeDepartment -> String
lifeDepartmentToJapanseString department =
    case department of
        LifeBiol ->
            "生物学類"

        LifeBres ->
            "生物資源学類"

        LifeEarth ->
            "地球学類"


sseDepartmentToIdString : SseDepartment -> String
sseDepartmentToIdString department =
    case department of
        SseMath ->
            "math"

        SsePhys ->
            "phys"

        SseChem ->
            "chem"

        SseCoens ->
            "coens"

        SseEsys ->
            "esys"

        SsePandps ->
            "pandps"


sseDepartmentToJapaneseString : SseDepartment -> String
sseDepartmentToJapaneseString department =
    case department of
        SseMath ->
            "数学類"

        SsePhys ->
            "物理学類"

        SseChem ->
            "化学類"

        SseCoens ->
            "応用理工学類"

        SseEsys ->
            "工学システム学類"

        SsePandps ->
            "社会工学類"


infoDepartmentToIdString : InfoDepartment -> String
infoDepartmentToIdString department =
    case department of
        InfoCoins ->
            "coins"

        InfoMast ->
            "mast"

        InfoKlis ->
            "klis"


infoDepartmentToJapaneseString : InfoDepartment -> String
infoDepartmentToJapaneseString department =
    case department of
        InfoCoins ->
            "情報科学類"

        InfoMast ->
            "情報メディア創成学類"

        InfoKlis ->
            "知識情報・図書館科学類"


medDepartmentToIdString : MedDepartment -> String
medDepartmentToIdString department =
    case department of
        MedMed ->
            "med"

        MedNurse ->
            "nurse"

        MedMs ->
            "ms"


medDepartmentToJapaneseString : MedDepartment -> String
medDepartmentToJapaneseString department =
    case department of
        MedMed ->
            "医学類"

        MedNurse ->
            "看護学類"

        MedMs ->
            "医療科学類"


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
