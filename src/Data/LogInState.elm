module Data.LogInState exposing (LogInState(..))

import Api
import Data.User


type LogInState
    = LogInStateOk
        { access : Api.Token
        , refresh : Api.Token
        , profile : Data.User.User
        }
    | LogInStateNone
