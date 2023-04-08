/// @ts-check
/// <reference path="../@types/global.d.ts"/>
'use strict'
const path = require('path')
const { app, BrowserWindow, Tray, Menu, nativeTheme, ipcMain } = require('electron')
const Store = require('electron-store')

/**
 * 多重起動しない場合のアプリ
 */
const isSingletonApp = true

/**
 * タスクトレイ常駐型のアプリ
 */
const isTrayApp = false

/**
 * アプリの多重起動防止
 */
if (isSingletonApp && !app.requestSingleInstanceLock()) {
  app.quit()
}

/** @type {BrowserWindow | null} */
let mainWindow = null

/** @type {Tray | null} */
let tray = null

/** JSON Schema ユーザーコンフィグを使用する場合はスキーマを定義する */
/** @type {Store.Schema<UserConfig>} */
const schema = {}
const store = new Store(schema)

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.resolve(__dirname, 'preload.js'),
    },
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(path.resolve(__dirname, '../../out/index.html'))
  }

  /**
   * 画面の準備が完了したときに表示する
   * see https://www.electronjs.org/docs/latest/api/browser-window/#using-the-ready-to-show-event
   */
  if (!isTrayApp) {
    mainWindow.once('ready-to-show', () => {
      mainWindow?.show()
    })
  }

  /**
   * 初期値をmainプロセスから送る時の処理
   */
  mainWindow.webContents.on('did-finish-load', () => {
    if (mainWindow?.webContents) {
      mainWindow.webContents.send('onLoadConfig', {})
    }
  })

  if (!app.isPackaged) mainWindow.webContents.openDevTools()
}

const showWindow = () => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createWindow()
    // see https://www.electronjs.org/docs/latest/api/browser-window/#using-the-ready-to-show-event
    mainWindow?.once('ready-to-show', () => {
      mainWindow?.show()
    })
  } else {
    if (mainWindow?.isClosable()) mainWindow?.show()
    else if (mainWindow?.isMinimized()) mainWindow?.restore()
    mainWindow?.focus()
  }
}

const createTray = () => {
  let imagePath = ''
  if (process.platform === 'win32') {
    imagePath = path.resolve(__dirname, './assets/tray-icon/tray-icon.ico')
  } else {
    imagePath = nativeTheme.shouldUseDarkColors
      ? path.resolve(__dirname, './assets/tray-icon/tray-icon-whiteTemplate.png')
      : path.resolve(__dirname, './assets/tray-icon/tray-iconTemplate.png')
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'ウィンドウを表示',
      click: () => showWindow(),
    },
    {
      label: '終了',
      role: 'quit',
    },
  ])

  tray = new Tray(imagePath)
  tray.setToolTip('ローカルプロキシサーバー')
  tray.setContextMenu(contextMenu)
}

app.whenReady().then(() => {
  ipcMain.on('saveConfig', (_event, config) => {
    store.set(config)
  })

  createWindow()

  if (isTrayApp) {
    createTray()
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  /**
   * app.requestSingleInstanceLock() が実行されたとき、アプリケーションの1つ目のインスタンス内で発火する
   */
  if (isSingletonApp) {
    app.on('second-instance', (_e, argv) => {
      showWindow()
    })
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // 全てのウィンドウが閉じられた時にアプリを閉じないようにする
    // タスクトレイ常駐型にする場合は、空の関数を設定する
    if (!isTrayApp) app.quit()
  }
})
