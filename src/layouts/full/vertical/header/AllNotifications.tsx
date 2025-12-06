// src/pages/AllNotifications.tsx
import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Box, CircularProgress, Button } from '@mui/material';
import { IconTrash } from '@tabler/icons-react';
import axiosServices from 'src/utils/axiosServices';
import { Link } from 'react-router-dom';
import { useSopNavigation } from 'src/hooks/useSopNavigation';

interface NotificationItem {
  id: string;
  userId: string;
  message: string;
  data?: { sopHeaderId?: string; [key: string]: any };
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

const AllNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { navigateToSop } = useSopNavigation();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axiosServices.get<NotificationItem[]>("/api/notifications/getNotifications");
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification: NotificationItem) => {
    // Mark notification as read if it's unread
    if (!notification.isRead) {
      try {
        await axiosServices.patch(`/api/notifications/${notification.id}/markAsRead`);
        // Update local state to reflect the read status immediately
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }

    const sopHeaderId = notification.data?.sopHeaderId;

    console.log('Notification click - sopHeaderId:', sopHeaderId);

    // Use the navigation hook to determine where to open based on current SOP status
    if (sopHeaderId) {
      await navigateToSop(sopHeaderId);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          All Notifications
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : notifications.length === 0 ? (
          <Typography variant="body1">No notifications found.</Typography>
        ) : (
          <List>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                divider
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: !notification.isRead ? "rgba(0, 0, 0, 0.08)" : "inherit",
                  '&:hover': {
                    backgroundColor: !notification.isRead ? "rgba(0, 0, 0, 0.12)" : "rgba(0, 0, 0, 0.04)",
                  }
                }}
              >
                <ListItemText
                  primary={notification.message}
                  secondary={new Date(notification.createdAt).toLocaleString()}
                  primaryTypographyProps={{
                    fontWeight: !notification.isRead ? 600 : 400
                  }}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" color="error">
                    <IconTrash size={20} />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" component={Link} to="/">
            Back to Dashboard
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AllNotifications;
