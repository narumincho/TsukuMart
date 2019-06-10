module Page.SiteMap exposing (view)

import Html
import Html.Attributes
import Tab
import SiteMap


{-| Google Search Console に提出する
-}
view : { title : String, tab : Tab.Tab msg, html : List (Html.Html msg) }
view =
    { title = "sitemap.xml"
    , tab = Tab.single "sitemap.xml"
    , html =
        [ Html.div
            [ Html.Attributes.style "white-space" "pre-wrap" ]
            [ Html.text SiteMap.siteMapXml ]
        ]
    }
