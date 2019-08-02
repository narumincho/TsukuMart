module Page.Notification exposing
    ( Cmd(..)
    , Model
    , Msg
    , initModel
    , update
    , view
    )

{-
   通知をするタイミング。
   出品した商品にコメントが付いた
   取引が開始された
   取引にコメントが付いた
   取り引きが終了した
-}

import BasicParts
import Html
import Html.Attributes
import Html.Styled


type Msg
    = Msg


type Model
    = Model


type Cmd
    = Cmd


initModel : ( Model, List Cmd )
initModel =
    ( Model, [] )


update : Msg -> Model -> ( Model, List Cmd )
update msg model =
    ( model, [] )


view :
    Model
    ->
        { title : Maybe String
        , tab : BasicParts.Tab Msg
        , html : List (Html.Styled.Html Msg)
        , bottomNavigation : Maybe BasicParts.BottomNavigationSelect
        }
view model =
    { title = Just "通知"
    , tab = BasicParts.tabSingle "通知"
    , html =
        [ Html.Styled.text "通知は、作り途中♪"
        ]
    , bottomNavigation = Just BasicParts.Notification
    }
