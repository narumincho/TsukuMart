module Icon exposing (deleteIcon, editIcon)

import Html
import Svg as S
import Svg.Attributes as Sa


editIcon : Html.Html msg
editIcon =
    S.svg
        [ Sa.viewBox "0 0 24 24"
        , Sa.class "icon"
        ]
        [ S.path
            [ Sa.d
                "M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
            ]
            []
        ]


deleteIcon : Html.Html msg
deleteIcon =
    S.svg
        [ Sa.viewBox "0 0 24 24"
        , Sa.class "icon"
        ]
        [ S.path
            [ Sa.d "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z" ]
            []
        ]
