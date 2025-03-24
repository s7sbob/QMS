import { Box, Avatar, Typography, IconButton, Tooltip } from '@mui/material';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { IconPower } from '@tabler/icons-react';
import { UserContext } from 'src/context/UserContext';

export const Profile = () => {
  const user = useContext(UserContext);
  // يمكنك تعديل hideMenu حسب الحالة الفعلية
  const hideMenu = false;

  const profileImage = user?.userImg_Url || '/default-profile.jpg';
  const displayName = user ? `${user.FName}` : 'User';
  // استخدام الخاصية المطلوبة لاستخراج jobTitle
  const jobTitle =
    user?.Users_Departments_Users_Departments_User_IdToUser_Data?.[0]?.job_title || 'Job Title';

  return (
    <Box
      display={'flex'}
      alignItems="center"
      gap={2}
      sx={{ m: 3, p: 2, bgcolor: 'secondary.light' }}
    >
      {!hideMenu && (
        <>
          <Avatar alt={displayName} src={profileImage} />
          <Box>
            <Typography variant="h6">{displayName}</Typography>
            <Typography variant="caption">{jobTitle}</Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Tooltip title="Logout" placement="top">
              <IconButton
                color="primary"
                component={Link}
                to="/auth/login"
                aria-label="logout"
                size="small"
              >
                <IconPower size="20" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      )}
    </Box>
  );
};
