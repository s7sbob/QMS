// src/components/Notifications.tsx
import React, { useEffect, useState } from "react";
import {
  IconButton,
  Box,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Button,
  Chip,
  Stack
} from "@mui/material";
import { IconBellRinging } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import axiosServices from "src/utils/axiosServices";
import Scrollbar from "./Scrollbar";
import socket from "src/socket";

interface NotificationItem {
  id: string;
  userId: string;
  message: string;
  data?: { sopHeaderId?: string; [key: string]: any };
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

const Notifications: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchNotifications = async () => {
    try {
      const res = await axiosServices.get<NotificationItem[]>("/api/notifications/getNotifications");
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    // استخدام socket للاستماع لحدث notification
    socket.on("notification", (notif: NotificationItem) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    fetchNotifications();

    return () => {
      socket.off("notification");
    };
  }, []);

  // حساب عدد الإشعارات غير المقروءة فقط
  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  // Status IDs that should open in Request Form
  const REQUEST_FORM_STATUS_IDS = ['8', '12', '13', '14', '15', '17'];

  const handleNotificationClick = async (notification: NotificationItem) => {
    handleClose();

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

  return (
    <Box>
      <IconButton
        size="large"
        color="inherit"
        onClick={handleClick}
        sx={{ color: anchorEl ? "primary.main" : "text.secondary" }}
      >
        <Badge color="primary" badgeContent={unreadCount}>
          <IconBellRinging size="21" stroke="1.5" />
        </Badge>
      </IconButton>

      <Menu
        id="notification-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": { width: "360px" },
        }}
      >
        <Stack direction="row" py={2} px={4} justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Notifications</Typography>
          {unreadCount > 0 && <Chip label={`${unreadCount} new`} color="primary" size="small" />}
        </Stack>
        <Scrollbar sx={{ height: "385px" }}>
          {notifications.length === 0 ? (
            <Box px={4} py={2}>
              <Typography variant="subtitle2" color="textSecondary">
                No notifications yet.
              </Typography>
            </Box>
          ) : (
            notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                sx={{ 
                  py: 2, 
                  px: 4,
                  // تمييز الإشعارات غير المقروءة بخلفية مميزة
                  backgroundColor: !notification.isRead ? "rgba(0, 0, 0, 0.08)" : "inherit" 
                }}
              >
<Stack direction="row" spacing={2}>
  <Avatar sx={{ width: 48, height: 48 }} />
  <Box>
    <Typography
      variant="subtitle2"
      color="textPrimary"
      fontWeight={600}
      // احذف noWrap وأضف أو عدّل الأسطر التالية حسب رغبتك
      sx={{
        // width: '240px', // إذا أردت تحديد العرض
        whiteSpace: 'normal',
        wordWrap: 'break-word',
      }}
    >
      {notification.message}
    </Typography>
    <Typography variant="caption" color="textDisabled">
      {new Date(notification.createdAt).toLocaleString()}
    </Typography>
  </Box>
</Stack>
              </MenuItem>
            ))
          )}
        </Scrollbar>
        <Box p={3} pb={1}>
          <Button to="/all-notifications" variant="outlined" component={Link} color="primary" fullWidth>
            See all Notifications
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Notifications;
