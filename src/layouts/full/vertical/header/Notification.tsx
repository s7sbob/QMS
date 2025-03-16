// src/components/Notifications.tsx
import React, { useEffect, useState } from "react";
import { IconButton, Box, Badge, Menu, MenuItem, Avatar, Typography, Button, Chip, Stack } from "@mui/material";
import { IconBellRinging } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import axiosServices from "src/utils/axiosServices";
import Scrollbar from "./Scrollbar";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

interface NotificationItem {
  id: string;
  userId: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

const Notifications: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

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
    const newSocket = io("http://localhost:3000", {
      query: {
        token: Cookies.get("token"),
      },
    });
    setSocket(newSocket);

    newSocket.on("notification", (notif: NotificationItem) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    fetchNotifications();

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const unreadCount = notifications.length;

  return (
    <Box>
      <IconButton
        size="large"
        color="inherit"
        sx={{ color: anchorEl ? "primary.main" : "text.secondary" }}
        onClick={handleClick}
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
          "& .MuiMenu-paper": {
            width: "360px",
          },
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
              <MenuItem key={notification.id} sx={{ py: 2, px: 4 }}>
                <Stack direction="row" spacing={2}>
                  <Avatar sx={{ width: 48, height: 48 }} />
                  <Box>
                    <Typography variant="subtitle2" color="textPrimary" fontWeight={600} noWrap sx={{ width: "240px" }}>
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
