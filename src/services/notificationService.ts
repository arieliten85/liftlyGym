import axiosClient from "@/api/axiosClient";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

interface NotificationListResponse {
  success: boolean;
  data: AppNotification[];
}

interface NotificationResponse {
  success: boolean;
  data: AppNotification;
}

export class NotificationService {
  async getNotifications(): Promise<AppNotification[]> {
    try {
      const response =
        await axiosClient.get<NotificationListResponse>("/notifications");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  async markAsRead(id: string): Promise<AppNotification> {
    try {
      const response = await axiosClient.patch<NotificationResponse>(
        `/notifications/${id}/read`,
      );
      return response.data.data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await axiosClient.patch("/notifications/read-all");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }
}
