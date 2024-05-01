import type { PreviewServer } from "vite"
import type { Browser, BrowserContext, Page } from "@playwright/test"
import { chromium, expect } from "@playwright/test"
import { afterAll, beforeAll, test } from "vitest"
import { preview } from "vite"

let page: Page
let browser: Browser
let context: BrowserContext
let server: PreviewServer

beforeAll(async () => {
  browser = await chromium.launch()
  context = await browser.newContext()
  page = await context.newPage()
  server = await preview()
})

afterAll(async () => {
  await browser.close()
  await server.close()
})

test("script loads from src", async () => {
  await page.goto("http://localhost:4173")

  const script = await page.evaluate(async () => {
    return await window.simpleScriptLoading({
      id: "lib",
      src: "http://localhost:4173/test.js",
    })
  })

  expect(script).toBeDefined()
})

test("script fails to load with id", async () => {
  await page.goto("http://localhost:4173")

  try {
    await page.evaluate(async () => {
      return await window.simpleScriptLoading({
        src: "http://localhost:4173/test.js",
      })
    })
  } catch (error) {
    expect((error as Error).message).toContain("Error: id is required")
  }
})

test("script fails to load with invalid src", async () => {
  await page.goto("http://localhost:4173")

  try {
    await page.evaluate(async () => {
      return await window.simpleScriptLoading({
        id: "lib",
        src: "http://localhost:4173/unknown.js",
      })
    })
  } catch (error) {
    expect((error as Error).message).toContain("Error: Failed to load script")
  }
})

test("script fails to load with both src and code arguments given", async () => {
  await page.goto("http://localhost:4173")

  try {
    await page.evaluate(async () => {
      return await window.simpleScriptLoading({
        id: "lib",
        src: "http://localhost:4173/test.js",
        code: "console.log('Hello from code')",
      })
    })
  } catch (error) {
    expect((error as Error).message).toContain(
      "Error: Cannot have both src and code",
    )
  }
})

test("script loads with code", async () => {
  await page.goto("http://localhost:4173")

  await page.evaluate(async () => {
    window.simpleScriptLoading({
      id: "lib",
      code: "console.log('Hello from code')",
    })
  })

  const node = await page.$('head script[id="lib"]')
  const text = await node?.evaluate((element) => element.textContent, node)
  expect(text).toBe("console.log('Hello from code')")
})

test("script insert into head", async () => {
  await page.goto("http://localhost:4173")

  await page.evaluate(async () => {
    window.simpleScriptLoading({
      id: "lib",
      src: "http://localhost:4173/test.js",
    })
  })

  const node = await page.$('head script[id="lib"]')
  const id = await node?.evaluate((element) => element.id, node)
  expect(id).toBe("lib")
})

test("script insert into body", async () => {
  await page.goto("http://localhost:4173")

  await page.evaluate(async () => {
    window.simpleScriptLoading({
      id: "lib",
      src: "http://localhost:4173/test.js",
      inBody: true,
    })
  })

  const node = await page.$('body script[id="lib"]')
  const id = await node?.evaluate((element) => element.id, node)
  expect(id).toBe("lib")
})

test("script contains attrs", async () => {
  await page.goto("http://localhost:4173")

  await page.evaluate(async () => {
    window.simpleScriptLoading({
      id: "lib",
      src: "http://localhost:4173/test.js",
      attrs: { defer: true, async: true },
    })
  })

  const node = await page.$('head script[id="lib"]')
  const defer = await node?.evaluate(
    (element) => element.getAttribute("defer"),
    node,
  )
  const async = await node?.evaluate(
    (element) => element.getAttribute("async"),
    node,
  )

  expect(defer).toBe("true")
  expect(async).toBe("true")
})
