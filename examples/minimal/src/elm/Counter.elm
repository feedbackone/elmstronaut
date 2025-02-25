module Counter exposing (main)

import Browser
import Html exposing (Html, button, div, p, text)
import Html.Events exposing (onClick)
import Json.Decode



-- MAIN


main : Program Json.Decode.Value Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , subscriptions = \_ -> Sub.none
        , view = view
        }



-- FLAGS


type alias Flags =
    { initial : Int }


flagsDecoder : Json.Decode.Decoder Flags
flagsDecoder =
    Json.Decode.map Flags
        (Json.Decode.field "initial" Json.Decode.int)



-- MODEL


type alias Model =
    { count : Int }


init : Json.Decode.Value -> ( Model, Cmd Msg )
init flags =
    let
        initialCount =
            Json.Decode.decodeValue flagsDecoder flags
                |> Result.map .initial
                |> Result.withDefault 0
    in
    ( { count = initialCount }, Cmd.none )



-- UPDATE


type Msg
    = Increment
    | Decrement


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Increment ->
            ( { model | count = model.count + 1 }, Cmd.none )

        Decrement ->
            ( { model | count = model.count - 1 }, Cmd.none )



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ button [ onClick Increment ] [ text "+" ]
        , p [] [ text (String.fromInt model.count) ]
        , button [ onClick Decrement ] [ text "-" ]
        ]
