<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import type { MenuItem } from 'vuetify-ctx-menu/lib/ContextMenuDefine'
import { useContextMenu } from 'vuetify-ctx-menu/lib/main'

import { deleteCloudDiskMusic } from '@/api/cloud'
import { opPlaylist } from '@/api/music'
import { useDownloadMusic } from '@/hooks/useDownload'
import { useCurrentTheme } from '@/hooks/useTheme'
import { usePlayQueueStore } from '@/store/playQueue'
import { useUserStore } from '@/store/user'
import type { PlayNowEvent, Track, TrackFrom } from '@/types'
import { specialType } from '@/util/metadata'
const userStore = useUserStore()
const playQueueStore = usePlayQueueStore()
const { themeName } = useCurrentTheme()
const contextMenu = useContextMenu()
const toast = useToast()
const { t } = useI18n()
const router = useRouter()

const props = defineProps<{
  tracks: Track[]
}>()

const emits = defineEmits<{
  (event: 'updateList', payload: Track[]): void
}>()

const eventBus = useEventBus<PlayNowEvent>('playNow')
const TrackItemHeight = 56
const needScrollNumber = 80

const playlists = computed(() => {
  return userStore.createdPlaylists
    .map((i) => {
      return {
        id: i.id,
        name: i.name,
        specialType: i.specialType,
      }
    })
    .filter((playlist) => playlist.specialType !== specialType.fav.type)
})

function openMenu(payload: { x: number; y: number; track: Track; liked: boolean }) {
  const { x, y, liked, track } = payload
  const option = {
    theme: themeName.value,
    x,
    y,
    items: genMenu(liked, track),
    offsetFooter: 64,
    customClass: 'bg-surfaceVariant',
  }
  contextMenu(option)
}
function genMenu(liked: boolean, track: Track): MenuItem[] {
  const items: MenuItem[] = [
    {
      label: t('common.add_to_queue'),
      onClick: (i) => {
        addToQueue(track)
      },
    },
    {
      label: '下载到本地',
      onClick: async (i) => {
        await useDownloadMusic(track)
      },
    },
    {
      label: t('common.add_to_playlist'),
      children: playlists.value.map((list) => {
        return {
          label: list.name,
          onClick: (i) => {
            trackToPlayList('add', list.id, track.id)
          },
        }
      }),
    },
    {
      label: t('common.delete_cloud'),
      onClick: () => {
        deleteCloudMusic(track.id)
      },
    },
  ]
  return items
}

function addToQueue(track: Track) {
  playQueueStore.addToPlayQueue(track, { type: 'cloud', id: 0 })
}
async function trackToPlayList(op: 'add' = 'add', playlistId: number, trackId: number) {
  // add to playlist
  try {
    const { code, message } = await opPlaylist(op, playlistId, trackId)
    if (code === 200) {
      toast.success(t('message.add_list_success'))
    } else {
      toast.error(message!)
    }
  } catch (e) {
    toast.error(t('message.something_wrong'))
  }
}
async function deleteCloudMusic(id: Track['id']) {
  try {
    const { code, message } = await deleteCloudDiskMusic(id)
    if (code === 200) {
      const list = [...props.tracks]
      const index = list.findIndex((i) => i.id === id)
      if (index > -1) {
        list.splice(index, 1)
        emits('updateList', list)
      }
      toast.success(t('message.remove_list_success'))
    } else {
      toast.error(message)
    }
  } catch (e) {
    toast.error(t('message.something_wrong'))
  }
}
</script>
<template>
  <v-list>
    <track-item
      v-for="(track, index) in tracks"
      :key="track.id"
      :track="track"
      :index="index + 1"
      :album="true"
      @play="
        eventBus.emit({
          id: track.id,
          setQueue: true,
          from: { id: 0, type: 'cloud' },
        })
      "
      @openctxmenu="openMenu"
    />
  </v-list>
</template>
