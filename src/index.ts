export interface Options {
  attrs?: Record<string, string>
  src?: string
  code?: string
  body?: boolean
}

export default function simpleScriptLoading({
  attrs,
  src,
  code,
  body = false,
}: Options) {
  return new Promise((resolve, reject) => {
    const { id } = attrs || {}
    const existingScript = document.getElementById(id)

    if (existingScript) {
      resolve(existingScript)
      return
    }

    const script = document.createElement("script")
    script.id = id

    if (src && code) {
      reject(new Error("Cannot have both src and code"))
      return
    }

    if (attrs && typeof attrs === "object") {
      for (const attr of Object.keys(attrs)) {
        script.setAttribute(attr, attrs[attr])
      }
    }

    if (src) {
      script.src = src

      script.addEventListener("load", () => {
        resolve(script)
      })

      script.addEventListener("error", () => {
        reject(new Error("Failed to load script"))
      })
    }

    if (code) {
      script.appendChild(document.createTextNode(code))
      resolve(script)
    }

    const target = body ? document.body : document.head
    target.appendChild(script)
  })
}
