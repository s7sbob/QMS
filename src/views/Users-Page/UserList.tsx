// src/components/apps/users/UserList.tsx

import React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Box,
  Chip,
} from '@mui/material';
import { IUser } from 'src/services/userService';

type Props = {
  users: IUser[];
  onSelectUser: (user: IUser) => void;
};

const UserList: React.FC<Props> = ({ users, onSelectUser }) => {
  return (
    <List>
      {users.map((user) => (
        <React.Fragment key={user.Id}>
          <ListItem
            button
            onClick={() => onSelectUser(user)}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <ListItemAvatar>
              <Avatar src={user.userImg_Url || ''} alt={`${user.FName} ${user.LName}`} />
            </ListItemAvatar>

            <ListItemText
              primary={`${user.FName} ${user.LName}`}
              secondary={user.Email}
            />

            {/* عرض حالة المستخدم على شكل شارة (Chip) */}
            <Box ml={2}>
              {user.is_Active === 1 ? (
                <Chip label="Active" color="success" size="small" />
              ) : (
                <Chip label="Inactive" color="default" size="small" />
              )}
            </Box>
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
};

export default UserList;
