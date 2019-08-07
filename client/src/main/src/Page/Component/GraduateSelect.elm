module Page.Component.GraduateSelect exposing
    ( Cmd(..)
    , Model
    , Msg
    , getGraduate
    , initNone
    , initSelected
    , update
    , view
    )

import Data.University as University
import Html.Styled
import Page.Style


type Model
    = None
    | Selected University.Graduate


type Msg
    = Select (Maybe Int)


type Cmd
    = CmdChangeSelectedIndex { id : String, index : Int }


initNone : ( Model, List Cmd )
initNone =
    ( None
    , [ CmdChangeSelectedIndex
            { id = graduateSelectId, index = 0 }
      ]
    )


initSelected : University.Graduate -> ( Model, List Cmd )
initSelected graduate =
    ( Selected graduate
    , [ CmdChangeSelectedIndex
            { id = graduateSelectId, index = University.graduateToIndex graduate + 1 }
      ]
    )


getGraduate : Model -> Maybe University.Graduate
getGraduate model =
    case model of
        None ->
            Nothing

        Selected graduate ->
            Just graduate


update : Msg -> Model -> Model
update msg model =
    case msg of
        Select index ->
            case index |> Maybe.andThen University.graduateFromIndex of
                Just graduate ->
                    Selected graduate

                Nothing ->
                    None


view : Model -> ( String, Html.Styled.Html Msg )
view _ =
    ( "selectGraduate"
    , Page.Style.formItem
        "研究科"
        graduateSelectId
        [ Page.Style.selectMenu
            graduateSelectId
            (University.graduateAllValue
                |> List.map University.graduateToJapaneseString
            )
        ]
        |> Html.Styled.map Select
    )


graduateSelectId : String
graduateSelectId =
    "signUp-selectGraduate"
