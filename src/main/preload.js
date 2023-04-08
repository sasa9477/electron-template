/// @ts-check
/// <reference path="../@types/global.d.ts"/>
'use strict'
const { contextBridge, ipcRenderer } = require('electron')

/** @type {ElectronAPI} */
const electronApiHandler = {
  onLoadConfig: (callback) => on('onLoadConfig', callback),
  saveConfig: (config) => invoke('saveConfig', config),
}

contextBridge.exposeInMainWorld('electronAPI', electronApiHandler)

/**
 * @param {Channel} channel
 * @param {any} args
 */
function invoke(channel, args) {
  ipcRenderer.invoke(channel, args)
}

/**
 * @param {Channel} channel
 * @param {(...args: any[]) => void} callback
 */
function on(channel, callback) {
  /**
   * @type {(event: import('electron').IpcRendererEvent, ...args: any[]) => void}
   * */
  const listener = (_event, ...args) => callback(...args)
  ipcRenderer.on(channel, listener)

  return () => {
    ipcRenderer.removeListener(channel, listener)
  }
}

/**
 * @param {Channel} channel
 * @param {(...args: any[]) => void} callback
 */
function once(channel, callback) {
  ipcRenderer.once(channel, (_event, ...args) => callback(...args))
}
