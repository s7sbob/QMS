// src/components/apps/users/UserSearch.tsx
import React from 'react';
import { Box, Fab, TextField, InputAdornment } from '@mui/material';
import { IconMenu2, IconSearch } from '@tabler/icons-react';

type Props = {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
};

const UserSearch: React.FC<Props> = ({ onClick }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // يمكن إرسال قيمة البحث للـ Redux أو التعامل معها محليًا
  };

  return (
    <Box display="flex" sx={{ p: 2 }}>
      <Fab
        onClick={onClick}
        color="primary"
        size="small"
        sx={{ mr: 1, flexShrink: '0', display: { xs: 'block', lg: 'none' } }}
      >
        <IconMenu2 width="16" />
      </Fab>
      <TextField
        fullWidth
        size="small"
        value={searchTerm}
        placeholder="Search Users"
        variant="outlined"
        onChange={handleSearchChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconSearch size={'16'} />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default UserSearch;
