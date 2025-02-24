// src/components/apps/users/UserList.tsx
import React from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider } from '@mui/material';
import { User } from 'src/data/sampleUsers';
import { Link } from 'react-router-dom';

type Props = {
  users: User[];
  showrightSidebar: () => void;
};

const UserList: React.FC<Props> = ({ users, showrightSidebar }) => {
  return (
    <List>
      {users.map((user) => (
        <React.Fragment key={user.id}>
          <ListItem button onClick={showrightSidebar}>
            <ListItemAvatar>
              <Avatar src={user.userImgUrl} alt={`${user.fName} ${user.lName}`} />
            </ListItemAvatar>
            <ListItemText primary={`${user.fName} ${user.lName}`} secondary={user.email} />
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
};

export default UserList;
