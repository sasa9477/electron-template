/**
 * ファイルに保存するユーザーコンフィグ
 */
type UserConfig = {}

/**
 * ContextBridgeで通信する mainとrendererの API
 */
type ElectronAPI = {
  onLoadConfig: (callback: (config: UserConfig) => void) => () => void
  saveConfig: (config: UserConfig) => void
}

type Channel = keyof ElectronAPI

/**
 * windowに APIを追加
 */
interface Window {
  electronAPI: ElectronAPI
}
