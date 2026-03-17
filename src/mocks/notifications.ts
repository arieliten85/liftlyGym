export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: string; // ISO string
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nueva rutina disponible',
    body: 'Se ha generado una nueva rutina basada en tu progreso reciente.',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
    read: false,
    type: 'info',
  },
  {
    id: '2',
    title: 'Objetivo alcanzado',
    body: '¡Felicitaciones! Has alcanzado tu objetivo de peso.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    read: true,
    type: 'success',
  },
  {
    id: '3',
    title: 'Recordatorio de entrenamiento',
    body: 'No olvides tu sesión de hoy a las 18:00.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: false,
    type: 'warning',
  },
];