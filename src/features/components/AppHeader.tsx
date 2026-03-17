import { useUserStore } from "@/features/auth/store/userStore";
import { mockNotifications } from "@/mocks/notifications";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
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

export default function AppHeader() {
  const { user } = useUserStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const renderNotification = ({
    item,
  }: {
    item: (typeof mockNotifications)[0];
  }) => (
    <View
      style={[styles.notificationItem, !item.read && styles.notificationUnread]}
    >
      <View style={styles.notificationDot} />
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationBody}>{item.body}</Text>
        <Text style={styles.notificationTime}>
          {new Date(item.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );

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
        <Pressable onPress={toggleNotifications} style={styles.bellContainer}>
          <MaterialCommunityIcons name="bell" size={24} color="#fff" />
          {/* Unread badge */}
          {mockNotifications.some((n) => !n.read) && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>•</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Modal Overlay */}
      <Modal
        transparent={true}
        visible={showNotifications}
        onRequestClose={toggleNotifications}
        animationType="fade"
      >
        {/* Touchable area to close modal */}
        <Pressable onPress={toggleNotifications} style={styles.modalBackdrop}>
          {/* Modal Content */}
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notificaciones</Text>
              <Pressable
                onPress={toggleNotifications}
                style={styles.modalClose}
              >
                <MaterialCommunityIcons name="close" size={20} color="#666" />
              </Pressable>
            </View>
            <FlatList
              data={mockNotifications}
              keyExtractor={(item) => item.id}
              renderItem={renderNotification}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No tienes notificaciones</Text>
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
  container: {
    backgroundColor: "#fff",
  },
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
  bellContainer: {
    marginLeft: 12,
    padding: 8,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#ff0000",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  modalClose: {
    padding: 8,
  },
  notificationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  notificationUnread: {
    backgroundColor: "#f8f9ff",
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#339c92",
    marginRight: 12,
    marginTop: 4,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
  },
  emptyState: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
  },
});
