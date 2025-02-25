# Elmstronaut 🌳👨‍🚀

> That's one small step for (a) man, one giant leap for Elm-kind.

An Astro integration that enables rendering of Elm modules as Astro components.

## Table of contents

- [Installation](#installation)
- [Setup](#setup)
- [Basic usage](#basic-usage)
- [Fallback slot](#fallback-slot)
- [Passing flags](#passing-flags)
- [Using ports](#using-ports)
- [Tailwind support](#tailwind-support)
- [Examples](#examples)
- [Limitations](#limitations)
- [Future plans](#future-plans)
- [Contributing](#contributing)


## Installation

```sh
pnpm add elmstronaut
```

## Setup

This guide assumes you already have an Astro project set up. If not, please run `pnpm create astro@latest` first and come back when you're ready.

- Create a folder called `elm` under the `src` directory. Your Elm files will live here.
- Make sure there is an _elm.json_ file in the root directory. Run `pnpm elm init` if you haven't initialized your Elm project yet.
- Modify `"source-directories"` from `src` to `src/elm` in the _elm.json_

  ```diff
    "source-directories": [
  -   "src"
  +   "src/elm"
    ],
  ```
- Add `elmstronaut` to Astro integrations in the _astro.config.mts_

  ```diff
  + import elmstronaut from "elmstronaut";

    export default defineConfig({
  +    integrations: [elmstronaut()],
    });
  ```

## Basic usage

Let's start with a canonical "Hello, world" example.

_src/elm/Hello.elm_
```elm
module Hello exposing (main)

import Html exposing (Html, text)


main : Html msg
main =
    text "Hello, Astro 👋"
```

_src/pages/index.astro_
```jsx
---
import Hello from "../elm/Hello.elm";
import Layout from "../layouts/Layout.astro";
---

<Layout>
  <Hello client:load />
</Layout>
```

> [!IMPORTANT]
> Notice the `client:load` directive. This is essential as we don't support SSR yet. Hopefully, some day in the near future 🤞.

Congratulations!
We can now use Elm components in Astro! 🎉

## Fallback slot

You can also pass an optional "fallback" slot to display while the component is loading.

```jsx
---
import Hello from "../elm/Hello.elm";
import Layout from "../layouts/Layout.astro";
---

<Layout>
  <Hello client:load>
    <p slot="fallback">Loading...</p>
  </Hello>
</Layout>
```

This will improve the user experience, and decrease the [CLS](https://web.dev/articles/cls) score of your page.

## Passing flags

Component props are automatically passed as flags to your Elm app. Although you can access them directly (don't do this – there is a reason you're using Elm after all), the proper way is to decode them.

Let's take a look at another widely known example – the Counter!

_src/pages/counter.astro_
```jsx
---
import Counter from "../elm/Counter.elm";
import Layout from "../layouts/Layout.astro";
---

<Layout>
  <Counter client:load initial={29} />
</Layout>
```

_src/elm/Counter.elm_
```elm
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
```

Let's walk trough the important bits:

- First, we pass `Json.Decode.Value` as the type of the second argument of the `main` function.

- Then, we define the `Flags` type and its decoder.

  > [!TIP]
  > Feel free to use the amazing [NoRedInk/elm-json-decode-pipeline](https://package.elm-lang.org/packages/NoRedInk/elm-json-decode-pipeline/) package if you want.

- Lastly, we pass the decoder we defined above and the `flags` argument of the `init` function to the `Json.Decode.decodeValue` function. If the decoding succeeds, the `initialCount` would get the value of the `initial` prop. Otherwise, it will be set to `0`. No runtime errors. Beauty!

## Using ports

To use ports we need to define `window.onElmInit`. It receives a callback, which will be called each time an Elm app is initialized. For each initialization it's corresponding Elm module name and the app will be passed as arguments.

_src/elm/interop.ts_ (or other)
```ts
window.onElmInit = (elmModuleName: string, app: ElmApp) => {
  if (elmModuleName === "Hello") {
    // Subscribe to messages from Elm
    app.ports?.foo.subscribe?.((message) => console.log(message));

    // Send messages to Elm
    app.ports?.bar.send?.("baz");
  }
};
```

The `elmModuleName` is the module name provided in the Elm file.

For example, if `Hello.elm` would have been located at `src/elm/Greeting/Hello.elm` instead of `src/elm/Hello.elm` as mentioned in the examples above, the `elmModuleName` would be `Greeting.Hello`.

## Tailwind support

If you're using [Tailwind](https://tailwindcss.com/) in your Elm files, make sure to add the following spinnet to your CSS:

```diff
  @import "tailwindcss";

+ @source "../../src/elm";
```

This ensures that the classes used in the Elm files would be included in the final bundle.

## Examples
The [examples](https://github.com/feedbackone/elmstronaut/tree/main/examples) folder could be a useful place to start. Altough it currently only contains a few basic examples, we're planning to add more in the near future.

## Limitations
- Can't render nested components (POC is ready)
- No SSR support (yet)
- Only `Browser.element` is supported. **This is by design.** The routing part will always be handled by Astro.

## Future plans
- [ ] Add support for rendering named slots.
- [ ] "Go to definition" should open the Elm file instead of the `elmstronaut.d.ts`.
- [ ] Add SSR support.
- [ ] Figure out a way to compile multiple Elm modules into one bundle.
- [ ] Remove the constraint of having the `elm` folder.
- [ ] Add an `optimize` option to the config to force production builds when needed.
- [ ] Add an `elmJsonPath` option to be able to specify the path to the _elm.json_ file.
- [ ] Generate an Elm custom type with all possible routes based on the `pages` folder, so that we can use `href` safely (similar to Elm Land).
- [ ] Generate a type union of all Elm module names. We can then use that type instead of `string` for `elmModuleName`.
- [ ] Parse Elm files and generate proper types for ports.

## Contributing
Please check out our contributing guidelines [here](/CONTRIBUTING.md).
