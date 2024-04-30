export interface Options {
  attrs?: Record<string, string>
  id: string
  src?: string
  code?: string
  inBody?: boolean
}

export default function simpleScriptLoading({
  attrs,
  id,
  src,
  code,
  inBody = false,
}: Options) {
  return new Promise((resolve, reject) => {
    if (typeof id !== "string" || !id) {
      reject(new Error("id is required"))
      return
    }

    const existingScript = document.getElementById(id)

    if (existingScript) {
      return resolve(existingScript)
    }

    const script = document.createElement("script")
    script.id = id

    if (src && code) {
      reject(new Error("Cannot have both src and code"))
      return
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
    }

    if (attrs && typeof attrs === "object") {
      for (const attr of Object.keys(attrs)) {
        script.setAttribute(attr, attrs[attr])
      }
    }

    const target = inBody ? document.body : document.head
    target.appendChild(script)
  })
}
