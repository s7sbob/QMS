// src/components/Notifications.tsx
import React, { useEffect, useState, useRef, useCallback } from "react";
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
  Stack,
  Tooltip
} from "@mui/material";
import { IconBellRinging, IconWifi, IconWifiOff } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import axiosServices from "src/utils/axiosServices";
import Scrollbar from "./Scrollbar";
import socket from "src/socket";
import { useSopNavigation } from "src/hooks/useSopNavigation";

interface NotificationItem {
  id: string;
  userId: string;
  message: string;
  data?: { sopHeaderId?: string; [key: string]: any };
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// Polling interval when WebSocket is disconnected (in milliseconds)
const FALLBACK_POLLING_INTERVAL = 30000; // 30 seconds

const Notifications: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { navigateToSop } = useSopNavigation();

  // Connection status tracking
  const [isSocketConnected, setIsSocketConnected] = useState(socket.connected);

  // Refs for managing polling and requests
  const abortControllerRef = useRef<AbortController | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Fetch notifications with AbortController support
  const fetchNotifications = useCallback(async () => {
    // Cancel any previous pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await axiosServices.get<NotificationItem[]>(
        "/api/notifications/getNotifications",
        { signal: controller.signal }
      );
      // Only update state if request wasn't cancelled
      if (!controller.signal.aborted) {
        setNotifications(res.data);
      }
    } catch (error: any) {
      // Ignore cancelled request errors (they're intentional)
      if (error.name === 'CanceledError' || error.name === 'AbortError') {
        return;
      }
      console.error("Error fetching notifications:", error);
    }
  }, []);

  // Start polling fallback
  const startPolling = useCallback(() => {
    // Don't start if already polling
    if (pollingIntervalRef.current) return;

    console.log('📡 WebSocket disconnected - Starting fallback polling (every 30s)');
    pollingIntervalRef.current = setInterval(() => {
      fetchNotifications();
    }, FALLBACK_POLLING_INTERVAL);
  }, [fetchNotifications]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      console.log('🔌 WebSocket connected - Stopping fallback polling');
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    // ============================================================
    // WEBSOCKET EVENT HANDLERS
    // ============================================================

    // Handle incoming notifications via WebSocket (real-time)
    const handleNotification = (notif: NotificationItem) => {
      setNotifications((prev) => [notif, ...prev]);
    };

    // Handle socket connection
    const handleConnect = () => {
      console.log('✅ WebSocket connected - Real-time notifications active');
      setIsSocketConnected(true);
      stopPolling(); // Stop polling when connected
      fetchNotifications(); // Fetch to catch any missed notifications
    };

    // Handle socket disconnection
    const handleDisconnect = (reason: string) => {
      console.log('❌ WebSocket disconnected:', reason);
      setIsSocketConnected(false);
      startPolling(); // Start polling as fallback
    };

    // Handle reconnection
    const handleReconnect = (attemptNumber: number) => {
      console.log('🔄 WebSocket reconnected after', attemptNumber, 'attempts');
      setIsSocketConnected(true);
      stopPolling();
      fetchNotifications(); // Fetch to catch any missed during disconnect
    };

    // Handle connection error
    const handleConnectError = (error: Error) => {
      console.error('⚠️ WebSocket connection error:', error.message);
      setIsSocketConnected(false);
      startPolling(); // Start polling as fallback
    };

    // ============================================================
    // REGISTER EVENT LISTENERS
    // ============================================================
    socket.on("notification", handleNotification);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("reconnect", handleReconnect);
    socket.on("connect_error", handleConnectError);

    // ============================================================
    // INITIAL SETUP
    // ============================================================

    // Fetch notifications on mount
    fetchNotifications();

    // Check initial connection status and start polling if needed
    if (!socket.connected) {
      console.log('📡 WebSocket not connected on mount - Starting fallback polling');
      startPolling();
    } else {
      console.log('✅ WebSocket already connected on mount');
      setIsSocketConnected(true);
    }

    // ============================================================
    // CLEANUP ON UNMOUNT
    // ============================================================
    return () => {
      socket.off("notification", handleNotification);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("reconnect", handleReconnect);
      socket.off("connect_error", handleConnectError);
      stopPolling();
      // Cancel any pending request on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchNotifications, startPolling, stopPolling]);

  // حساب عدد الإشعارات غير المقروءة فقط
  const unreadCount = notifications.filter(notification => !notification.isRead).length;

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

    const sopHeaderId = notification.data?.sopHeaderId;

    console.log('Notification click - sopHeaderId:', sopHeaderId);

    // Use the navigation hook to determine where to open based on current SOP status
    if (sopHeaderId) {
      await navigateToSop(sopHeaderId);
    }
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <Tooltip
        title={isSocketConnected ? "Real-time notifications active" : "Using polling (every 30s)"}
        arrow
      >
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
      </Tooltip>
      {/* Connection status indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: isSocketConnected ? '#4caf50' : '#ff9800',
          border: '1px solid white',
          boxShadow: '0 0 2px rgba(0,0,0,0.3)',
        }}
        title={isSocketConnected ? 'Connected (Real-time)' : 'Disconnected (Polling)'}
      />

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
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6">Notifications</Typography>
            {/* Connection status in header */}
            <Tooltip title={isSocketConnected ? "Real-time" : "Polling mode"} arrow>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {isSocketConnected ? (
                  <IconWifi size={16} color="#4caf50" />
                ) : (
                  <IconWifiOff size={16} color="#ff9800" />
                )}
              </Box>
            </Tooltip>
          </Stack>
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
