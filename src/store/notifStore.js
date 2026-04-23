import { create } from 'zustand'

export const useNotifStore = create((set) => ({
  notifications: [],
  unread: 0,

  addNotification: (notif) =>
    set((s) => ({
      notifications: [{ ...notif, id: Date.now(), read: false }, ...s.notifications],
      unread: s.unread + 1,
    })),

  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unread: 0,
    })),

  clearAll: () => set({ notifications: [], unread: 0 }),
}))