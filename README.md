<img height="80" width="304" alt="Sprout.ai Engineering logo" src="https://github.com/sprout-ai/simple-script-loading/assets/10632532/cb7ff795-30cd-4a14-840d-7fb3c7591594" />

# Simple Script Loading

A simple code and script loading.

## Installation

```bash
npm install @sproutai/simple-script-loading
```

## Usage

### Loading an external script

By default, supplying a URL to `src` will add <script> tag to the document's head.

```js
import simpleScriptLoading from "@sproutai/simple-script-loading"

simpleScriptLoading({
  id: "script-id",
  src: "https://example.com/script.js"
}).then((node) => {
    // returns the script node
    console.log(node)
    console.log("script loaded")
}).catch((error) => {
    console.error(error)
})
```

### Inserting a script tag with JavaScript code

```js
import simpleScriptLoading from "@sproutai/simple-script-loading"

simpleScriptLoading({
  id: "script-id",
  code: "console.log('Hello, World!')"
})
```

### Options

```js
const options = {
  attrs: {}, // object, attributes to add to the script tag
  code: undefined, // string, JavaScript code to insert
  src: '', // string, URL of the script to load
  body: false, // boolean, insert the script tag in the body
}
```