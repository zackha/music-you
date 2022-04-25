import { useIpcRenderer } from '@vueuse/electron'
import { once } from 'lodash-es'

import { useAppStore } from '@/store/app'
import { usePlayerStore } from '@/store/player'

export function useElectron() {
  if (process.env.IS_ELECTRON) {
    registerIpcRenderer()
  }
}

function registerIpcRenderer() {
  const playerStore = usePlayerStore()
  const appStore = useAppStore()
  const ipcRenderer = useIpcRenderer()
  console.log('registerIpcRenderer', playerStore, ipcRenderer)
  const showDownloadComplete = once((name) => {})

  ipcRenderer.on('open-settings', () => {
    appStore.$state.showSetting = !appStore.$state.showSetting
  })
  ipcRenderer.on('search', () => {
    appStore.$state.showSearch = !appStore.$state.showSearch
  })
  // ipcRenderer.on('next', () => {
  //   player.next()
  // })
  // ipcRenderer.on('prev', () => {
  //   window?.app?.$player.prev()
  // })
  ipcRenderer.on('playOrPause', () => {
    playerStore.$state.playing = !playerStore.$state.playing
  })
  ipcRenderer.on('volumeUp', () => {
    const volume = playerStore.$state.volume
    const tem = volume + 0.05
    if (tem < 1) {
      playerStore.$state.volume = tem
    }
  })
  ipcRenderer.on('volumeDown', () => {
    const volume = playerStore.$state.volume
    const tem = volume - 0.05
    if (tem >= 0) {
      playerStore.$state.volume = tem
    }
  })
  ipcRenderer.on('fullscreen', (e, fullscreen) => {
    // appStore.$state.showLyricsPage = fullscreen
  })
  ipcRenderer.on('startDownload', (e, data) => {
    console.log('startDownload', e, data)
    // window?.app?.$toast(`开始下载 ${data.name}`, {
    //   color: 'info',
    // })
  })
  ipcRenderer.on('downloadProgress', (e, data) => {
    const { percent } = data
    console.log(percent)
    // playerStore.commit('app/downloadprogress', percent)
  })
  ipcRenderer.on('downloadCompleted', (e, file) => {
    const { fileName } = file
    console.log(file)
    // showDownloadComplete(fileName)
    // playerStore.commit('app/downloadprogress', 0)
  })
  ipcRenderer.on('windowState', (e, state) => {
    appStore.$state.windowState = state
  })
}
