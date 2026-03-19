import { useUserStore } from "@/features/auth/store/userStore";
import { AppNotification } from "@/services/notificationService";

import { useNotificationStore } from "@/store/notification/usenotificationstore";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const TYPE_COLORS: Record<AppNotification["type"], string> = {
  info: "#339c92",
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
};

export default function AppHeader() {
  const { user } = useUserStore();
  const { notifications, fetchNotifications, markAllAsRead } =
    useNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpen = () => {
    setShowNotifications(true);
    if (unreadCount > 0) markAllAsRead();
  };

  const handleClose = () => setShowNotifications(false);

  const renderNotification = ({ item }: { item: AppNotification }) => {
    const dotColor = TYPE_COLORS[item.type] ?? "#339c92";
    return (
      <View
        style={[
          styles.notificationItem,
          !item.read && styles.notificationUnread,
        ]}
      >
        <View style={[styles.notificationDot, { backgroundColor: dotColor }]} />
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationBody}>{item.body}</Text>
          <Text style={styles.notificationTime}>
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user ? getInitials(user.name) : "?"}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.greeting}>Hola,</Text>
          <Text style={styles.username}>{user?.name ?? "Usuario"}</Text>
        </View>
        <Pressable onPress={handleOpen} style={styles.bellContainer}>
          <MaterialCommunityIcons name="bell" size={24} color="#fff" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      <Modal
        transparent
        visible={showNotifications}
        onRequestClose={handleClose}
        animationType="fade"
      >
        <Pressable onPress={handleClose} style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notificaciones</Text>
              <Pressable onPress={handleClose} style={styles.modalClose}>
                <MaterialCommunityIcons name="close" size={20} color="#666" />
              </Pressable>
            </View>
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id}
              renderItem={renderNotification}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No tenés notificaciones</Text>
                </View>
              }
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#339c92",
    zIndex: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { color: "#fff", fontSize: 20, fontWeight: "600" },
  userInfo: { flex: 1 },
  greeting: { color: "#fff", fontSize: 14, opacity: 0.9 },
  username: { color: "#fff", fontSize: 18, fontWeight: "600" },
  bellContainer: { marginLeft: 12, padding: 8 },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "800" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: { fontSize: 18, fontWeight: "600", color: "#333" },
  modalClose: { padding: 8 },
  notificationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  notificationUnread: { backgroundColor: "#f8f9ff" },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
    marginTop: 4,
  },
  notificationContent: { flex: 1 },
  notificationTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 3,
  },
  notificationBody: {
    fontSize: 13,
    color: "#555",
    marginBottom: 4,
    lineHeight: 19,
  },
  notificationTime: { fontSize: 11, color: "#999" },
  emptyState: { padding: 24, alignItems: "center" },
  emptyText: { color: "#999", fontSize: 15 },
});
