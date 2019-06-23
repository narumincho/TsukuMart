module Page.SiteMap exposing (view)

import Html
import Html.Attributes
import BasicParts
import SiteMap


{-| Google Search Console に提出する
-}
view : { title : String, tab : BasicParts.Tab msg, html : List (Html.Html msg) }
view =
    { title = "sitemap.xml"
    , tab = BasicParts.tabSingle "sitemap.xml"
    , html =
        [ Html.div
            [ Html.Attributes.style "white-space" "pre-wrap" ]
            [ Html.text SiteMap.siteMapXml ]
        ]
    }
