module Component.Category exposing
    ( Cmd(..)
    , Model
    , Msg
    , Select(..)
    , getCategory
    , getSelect
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


type Cmd
    = CmdChangeSelectedIndex { id : String, index : Int }


type Select
    = None
    | GroupSelect Category.Group
    | CategorySelect Category.Category


initModel : ( Model, List Cmd )
initModel =
    ( Model None
    , [ CmdChangeSelectedIndex
            { id = groupSelectId
            , index = 0
            }
      ]
    )


initModelWithCategorySelect : Category.Category -> ( Model, List Cmd )
initModelWithCategorySelect category =
    ( Model (CategorySelect category)
    , [ CmdChangeSelectedIndex
            { id = groupSelectId
            , index = Category.groupToIndex (Category.groupFromCategory category) + 1
            }
      , CmdChangeSelectedIndex
            { id = categorySelectId
            , index = Category.toIndexInGroup category + 1
            }
      ]
    )


initModelWithSearchCondition : Data.SearchCondition.CategoryCondition -> ( Model, List Cmd )
initModelWithSearchCondition categorySelect =
    case categorySelect of
        Data.SearchCondition.CategoryNone ->
            initModel

        Data.SearchCondition.CategoryGroup group ->
            ( Model (GroupSelect group)
            , [ CmdChangeSelectedIndex
                    { id = groupSelectId
                    , index = Category.groupToIndex group + 1
                    }
              ]
            )

        Data.SearchCondition.CategoryCategory category ->
            initModelWithCategorySelect category


getSelect : Model -> Data.SearchCondition.CategoryCondition
getSelect (Model select) =
    case select of
        None ->
            Data.SearchCondition.CategoryNone

        GroupSelect group ->
            Data.SearchCondition.CategoryGroup group

        CategorySelect category ->
            Data.SearchCondition.CategoryCategory category


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
                [ groupView Nothing
                , categoryViewDisable
                ]

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
            False
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
            False
            categorySelectId
            (Category.groupToCategoryList group
                |> List.map Category.partToJapaneseString
            )
        ]
        |> Html.Styled.map SelectCategory
    )


categoryViewDisable : ( String, Html.Styled.Html Msg )
categoryViewDisable =
    ( "selectCategoryDisable"
    , Page.Style.formItem
        "カテゴリ"
        categorySelectId
        [ Page.Style.selectMenu
            True
            categorySelectId
            []
        ]
        |> Html.Styled.map SelectCategory
    )


categorySelectId : String
categorySelectId =
    "select-category"
