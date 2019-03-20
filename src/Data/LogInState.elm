module Data.LogInState exposing (LogInState(..))

import Api
import Data.Profile


type LogInState
    = LogInStateOk
        { access : Api.Token
        , refresh : Api.Token
        , profile : Data.Profile.Profile
        }
    | LogInStateNone
