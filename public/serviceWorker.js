/* global clients */

self.addEventListener('push', async event => {
  const noti = event.data.json()
  switch (noti.type) {
    case 'mani': {
      return event.waitUntil(self.registration.showNotification(`Nueva Mani: ${noti.title}`, {
        actions: [
          {
            action: 'Aprobar',
            title: 'Aprobar'
          },
          {
            action: 'Eliminar',
            title: 'Eliminar'
          }
        ],
        icon: '/favicon.ico',
        image: noti.cover,
        requireInteraction: true,
        body: noti.description,
        vibrate: [100],
        data: { maniId: noti.maniId, hash: noti.hash }
      }))
    }
    default: {
      console.log(noti)
    }
  }
})

self.addEventListener('notificationclick', async event => {
  event.notification.close()
  switch (event.action) {
    case 'Eliminar':
    case 'Aprobar': {
      const r = await fetch('/api/adminnotis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: event.action,
          maniId: event.notification.data.maniId,
          hash: event.notification.data.hash
        })
      })
      const j = await r.json()

      self.registration.showNotification(j.data.ok ? 'Exito' : 'Error', {
        icon: '/favicon.ico',
        body: `La manificación ${j.data.ok ? 'ha sido' : 'no ha podido ser'} ${event.action === 'Eliminar' ? 'Eliminada' : 'Aprobada'}`
      })
      break
    }
    default: {
      event.waitUntil(clients.openWindow(`/mani/${event.notification.data.maniId}`))
    }
  }
})
