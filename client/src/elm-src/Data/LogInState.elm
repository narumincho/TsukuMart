module Data.LogInState exposing (LogInState(..))

import Api
import Data.User


type LogInState
    = LogInStateOk
        { access : Api.Token
        , refresh : Api.Token
        , user : Data.User.User
        }
    | LogInStateNone