import { Window } from 'happy-dom'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'

const window = new Window({ url: 'http://localhost:5173/' })
globalThis.window = window
globalThis.document = window.document
Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true })
globalThis.localStorage = window.localStorage
Object.defineProperty(globalThis, 'crypto', { value: window.crypto, configurable: true })
globalThis.HTMLElement = window.HTMLElement

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })

try {
  const { default: App } = await vite.ssrLoadModule('/src/App.jsx')
  const html = renderToString(React.createElement(App))
  if (!html.includes('PocketPlan')) throw new Error('App rendered without its main interface')
  console.log('PocketPlan rendered successfully.')
} finally {
  await vite.close()
  await window.close()
}
