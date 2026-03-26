import {
  AppNotification,
  NotificationService,
} from "@/services/notificationService";
import { create } from "zustand";

const notificationService = new NotificationService();

interface NotificationStore {
  notifications: AppNotification[];
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  getPendingAdjustmentNotification: () => AppNotification | null;
  clearPendingAdjustments: (notificationId: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const notifications = await notificationService.getNotifications();
      set({ notifications });
    } catch (error) {
      console.error("[NotificationStore] fetchNotifications:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await notificationService.markAsRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n,
        ),
      }));
    } catch (error) {
      console.error("[NotificationStore] markAsRead:", error);
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationService.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      }));
    } catch (error) {
      console.error("[NotificationStore] markAllAsRead:", error);
    }
  },

  getPendingAdjustmentNotification: () => {
    return (
      get().notifications.find(
        (n) => n.pendingAdjustments && n.pendingAdjustments.length > 0,
      ) ?? null
    );
  },

  clearPendingAdjustments: (notificationId: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, pendingAdjustments: null } : n,
      ),
    }));
  },
}));
