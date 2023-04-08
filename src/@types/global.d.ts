/**
 * ファイルに保存するユーザーコンフィグ
 */
type UserConfig = {}

/**
 * ContextBridgeで通信する mainとrendererの API
 */
type ElectronAPI = {
  onLoadSetting: (callback: (config: UserConfig) => void) => void
  saveSetting: (config: UserConfig) => void
}

type Channel = keyof ElectronAPI

/**
 * windowに APIを追加
 */
declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
