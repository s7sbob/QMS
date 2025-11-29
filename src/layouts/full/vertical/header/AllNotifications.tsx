// src/pages/AllNotifications.tsx
import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Box, CircularProgress, Button } from '@mui/material';
import { IconTrash } from '@tabler/icons-react';
import axiosServices from 'src/utils/axiosServices';
import { Link, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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

  // Status IDs that should open in Request Form
  const REQUEST_FORM_STATUS_IDS = ['8', '12', '13', '14', '15', '17'];

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

    if (notification.data?.sopHeaderId) {
      const status = String(notification.data?.status);

      // Status 16 (approved by QA Document Officer) or Status 1 (In Progress) - open in New_Creation_SOP to complete/edit data
      if (status === '16' || status === '1') {
        navigate(`/documentation-control/New_Creation_SOP?headerId=${notification.data.sopHeaderId}`);
      // Statuses 8, 12, 13, 14, 15, 17 - open in Request Form
      } else if (REQUEST_FORM_STATUS_IDS.includes(status)) {
        navigate(`/documentation-control/Request_Form?headerId=${notification.data.sopHeaderId}`);
      } else {
        navigate(`/SOPFullDocument?headerId=${notification.data.sopHeaderId}`);
      }
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
