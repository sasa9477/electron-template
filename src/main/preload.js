/// @ts-check
/// <reference path="../@types/global.d.ts"/>
'use strict'
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * @param {Channel} channel
   * @param {any} args
   */
  invoke(channel, args) {
    ipcRenderer.invoke(channel, args)
  },

  /**
   * @param {Channel} channel
   * @param {(...args: any[]) => void} callback
   */
  on(channel, callback) {
    /**
     * @type {(event: import('electron').IpcRendererEvent, ...args: any[]) => void}
     * */
    const listener = (_event, ...args) => callback(...args)
    ipcRenderer.on(channel, listener)

    return () => {
      ipcRenderer.removeListener(channel, listener)
    }
  },
  /**
   * @param {Channel} channel
   * @param {(...args: any[]) => void} callback
   */
  once(channel, callback) {
    ipcRenderer.once(channel, (_event, ...args) => callback(...args))
  },
})

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (/** @type {string} */ selector, /** @type {string | undefined} */ text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text ?? ''
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
