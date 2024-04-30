import simpleScriptLoading from "../src"

declare global {
  interface Window {
    simpleScriptLoading: typeof simpleScriptLoading
  }
}

window.simpleScriptLoading = simpleScriptLoading

export {}
