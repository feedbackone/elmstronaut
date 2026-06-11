module Gallery exposing (main)

import Html exposing (Html, div, node)
import Html.Attributes exposing (name)


main : Html msg
main =
    div []
        [ node "slot" [ name "photo1" ] []
        , node "slot" [ name "photo2" ] []
        ]
