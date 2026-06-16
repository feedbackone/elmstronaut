module Gallery exposing (main)

import Html exposing (Html, div, node)
import Html.Attributes exposing (class, name)


main : Html msg
main =
    div [ class "flex flex-wrap gap-4" ]
        [ node "slot" [ name "photo-1" ] []
        , node "slot" [ name "photo-2" ] []
        ]
