// src/components/apps/users/UserList.tsx

import React from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider } from '@mui/material';
import { IUser } from 'src/services/userService';

type Props = {
  users: IUser[];
  onSelectUser: (user: IUser) => void; // استبدل showrightSidebar
};

const UserList: React.FC<Props> = ({ users, onSelectUser }) => {
  return (
    <List>
      {users.map((user) => (
        <React.Fragment key={user.Id}>
          <ListItem button onClick={() => onSelectUser(user)}>
            <ListItemAvatar>
              <Avatar src={user.userImg_Url || ''} alt={`${user.FName} ${user.LName}`} />
            </ListItemAvatar>
            <ListItemText
              primary={`${user.FName} ${user.LName}`}
              secondary={user.Email}
            />
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
};

export default UserList;
