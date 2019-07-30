module Page.Component.Category exposing
    ( Emission(..)
    , Model
    , Msg
    , Select(..)
    , categorySelectId
    , categoryView
    , getCategory
    , getSelect
    , groupSelectId
    , groupView
    , initModel
    , initModelWithCategorySelect
    , initModelWithSearchCondition
    , update
    , view
    )

import Data.Category as Category
import Data.SearchCondition
import Html.Styled
import Html.Styled.Keyed
import Page.Style


type Model
    = Model Select


type Msg
    = SelectCategoryGroup (Maybe Int)
    | SelectCategory (Maybe Int)


type Emission
    = EmissionChangeSelectedIndex { id : String, index : Int }


type Select
    = None
    | GroupSelect Category.Group
    | CategorySelect Category.Category


initModel : ( Model, List Emission )
initModel =
    ( Model None
    , [ EmissionChangeSelectedIndex
            { id = groupSelectId
            , index = 0
            }
      ]
    )


initModelWithCategorySelect : Category.Category -> ( Model, List Emission )
initModelWithCategorySelect category =
    ( Model (CategorySelect category)
    , [ EmissionChangeSelectedIndex
            { id = groupSelectId
            , index = Category.groupToIndex (Category.groupFromCategory category) + 1
            }
      , EmissionChangeSelectedIndex
            { id = categorySelectId
            , index = Category.toIndexInGroup category + 1
            }
      ]
    )


initModelWithSearchCondition : Data.SearchCondition.CategorySelect -> ( Model, List Emission )
initModelWithSearchCondition categorySelect =
    case categorySelect of
        Data.SearchCondition.CategorySelectNone ->
            initModel

        Data.SearchCondition.CategorySelectGroup group ->
            ( Model (GroupSelect group)
            , [ EmissionChangeSelectedIndex
                    { id = groupSelectId
                    , index = Category.groupToIndex group + 1
                    }
              ]
            )

        Data.SearchCondition.CategorySelectCategory category ->
            initModelWithCategorySelect category


getSelect : Model -> Data.SearchCondition.CategorySelect
getSelect (Model select) =
    case select of
        None ->
            Data.SearchCondition.CategorySelectNone

        GroupSelect group ->
            Data.SearchCondition.CategorySelectGroup group

        CategorySelect category ->
            Data.SearchCondition.CategorySelectCategory category


getCategory : Model -> Maybe Category.Category
getCategory (Model select) =
    case select of
        None ->
            Nothing

        GroupSelect _ ->
            Nothing

        CategorySelect category ->
            Just category


update : Msg -> Model -> Model
update msg (Model select) =
    case msg of
        SelectCategoryGroup maybe ->
            Model (selectCategoryGroup maybe select)

        SelectCategory maybe ->
            Model (selectCategory maybe select)


selectCategoryGroup : Maybe Int -> Select -> Select
selectCategoryGroup index categorySelect =
    case index |> Maybe.andThen Category.groupFromIndex of
        Just group ->
            case categorySelect of
                None ->
                    GroupSelect group

                GroupSelect _ ->
                    GroupSelect group

                CategorySelect category ->
                    if Category.groupFromCategory category == group then
                        categorySelect

                    else
                        GroupSelect group

        Nothing ->
            None


selectCategory : Maybe Int -> Select -> Select
selectCategory index categorySelect =
    case categorySelect of
        None ->
            None

        GroupSelect group ->
            case
                index
                    |> Maybe.andThen
                        (Category.fromIndexInGroup group)
            of
                Just category ->
                    CategorySelect category

                Nothing ->
                    GroupSelect group

        CategorySelect category ->
            case
                index
                    |> Maybe.andThen (Category.fromIndexInGroup (Category.groupFromCategory category))
            of
                Just newCategory ->
                    CategorySelect newCategory

                Nothing ->
                    GroupSelect (Category.groupFromCategory category)


view : Model -> Html.Styled.Html Msg
view (Model select) =
    Html.Styled.Keyed.node "div"
        []
        (case select of
            None ->
                [ groupView Nothing ]

            GroupSelect group ->
                [ groupView
                    (Just group)
                , categoryView
                    group
                    Nothing
                ]

            CategorySelect category ->
                [ groupView
                    (Just (Category.groupFromCategory category))
                , categoryView
                    (Category.groupFromCategory category)
                    (Just category)
                ]
        )


groupView : Maybe Category.Group -> ( String, Html.Styled.Html Msg )
groupView categoryGroup =
    ( "selectCategoryGroup"
    , Page.Style.formItem
        "カテゴリ グループ"
        groupSelectId
        [ Page.Style.selectMenu
            groupSelectId
            (Category.groupAll |> List.map Category.groupToJapaneseString)
        ]
        |> Html.Styled.map SelectCategoryGroup
    )


groupSelectId : String
groupSelectId =
    "select-category-group"


categoryView : Category.Group -> Maybe Category.Category -> ( String, Html.Styled.Html Msg )
categoryView group category =
    ( "selectCategory" ++ Category.groupToIdString group
    , Page.Style.formItem
        "カテゴリ"
        categorySelectId
        [ Page.Style.selectMenu
            categorySelectId
            (Category.groupToCategoryList group
                |> List.map Category.toJapaneseString
            )
        ]
        |> Html.Styled.map SelectCategory
    )


categorySelectId : String
categorySelectId =
    "select-category"
