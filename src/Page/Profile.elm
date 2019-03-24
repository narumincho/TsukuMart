module Page.Profile exposing
    ( Emit(..)
    , Model
    , Msg(..)
    , initModel
    , update
    , view
    )

import Data.University
import Data.User as Profile
import Html
import Html.Attributes
import Page.Component.LogInOrSignUp as LogInOrSignUp
import Tab


type Model
    = Model
        { editMode : EditMode
        , logInOrSignUpModel : LogInOrSignUp.Model
        }


type EditMode
    = EditMode


type Emit
    = EmitLogInOrSignUp LogInOrSignUp.Emit


type Msg
    = MsgLogInOrSignUp LogInOrSignUp.Msg


initModel : Model
initModel =
    Model
        { editMode = EditMode
        , logInOrSignUpModel = LogInOrSignUp.initModel
        }



{- ====== Update ====== -}


update : Msg -> Model -> ( Model, Maybe Emit )
update msg (Model rec) =
    case msg of
        MsgLogInOrSignUp logInOrSignUpMsg ->
            let
                ( newModel, emitMaybe ) =
                    LogInOrSignUp.update logInOrSignUpMsg rec.logInOrSignUpModel
            in
            ( Model { rec | logInOrSignUpModel = newModel }
            , emitMaybe |> Maybe.map EmitLogInOrSignUp
            )



{- ====== View ====== -}


view : Maybe Profile.User -> Model -> ( String, Tab.Tab Msg, List (Html.Html Msg) )
view profileMaybe (Model { logInOrSignUpModel }) =
    ( "プロフィール"
    , Tab.single "プロフィール"
    , [ Html.div
            [ Html.Attributes.class "profile-container" ]
            [ Html.div
                [ Html.Attributes.class "profile" ]
                (case profileMaybe of
                    Just profile ->
                        [ nickNameView (Profile.getNickName profile)
                        , introductionView (Profile.getIntroduction profile)
                        ]
                            ++ universityView (Profile.getUniversity profile)

                    Nothing ->
                        [ LogInOrSignUp.view logInOrSignUpModel
                            |> Html.map MsgLogInOrSignUp
                        ]
                )
            ]
      ]
    )


nickNameView : String -> Html.Html msg
nickNameView nickName =
    Html.div
        []
        [ Html.text ("表示名:" ++ nickName) ]


introductionView : String -> Html.Html msg
introductionView introduction =
    Html.div
        []
        [ Html.text ("紹介文:" ++ introduction) ]


universityView : Data.University.University -> List (Html.Html msg)
universityView university =
    let
        { graduate, school, department } =
            Data.University.universityToJapaneseString university
    in
    (case graduate of
        Just g ->
            [ Html.div [] [ Html.text ("研究科:" ++ g) ] ]

        Nothing ->
            []
    )
        ++ (case school of
                Just s ->
                    [ Html.div [] [ Html.text ("学群:" ++ s) ] ]

                Nothing ->
                    []
           )
        ++ (case department of
                Just d ->
                    [ Html.div [] [ Html.text ("学類:" ++ d) ] ]

                Nothing ->
                    []
           )
