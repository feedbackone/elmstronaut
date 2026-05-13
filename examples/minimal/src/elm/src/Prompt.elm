port module Prompt exposing (main)

import Browser
import Html exposing (Html, button, dd, div, dl, dt, text)
import Html.Events exposing (onClick)



-- MAIN


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        }



-- PORTS


port fromElm : String -> Cmd msg


port fromJs : (String -> msg) -> Sub msg



-- MODEL


type alias Model =
    { answer : Maybe String }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { answer = Nothing }, Cmd.none )



-- UPDATE


type Msg
    = ShowPrompt
    | GotAnswer String


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ShowPrompt ->
            ( model, fromElm "SHOW_PROMPT" )

        GotAnswer answer_ ->
            ( { model | answer = Just answer_ }, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    fromJs GotAnswer



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ button [ onClick ShowPrompt ] [ text "Show prompt" ]
        , case model.answer of
            Just answer ->
                dl []
                    [ dt [] [ text "What is your favorite programming language? And why is it Elm?" ]
                    , dd [] [ text answer ]
                    ]

            Nothing ->
                text ""
        ]
