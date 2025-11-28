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
  const userRole =
    user?.Users_Departments_Users_Departments_User_IdToUser_Data?.[0]?.User_Roles?.Name || '';
  const departmentName =
    user?.Users_Departments_Users_Departments_User_IdToUser_Data?.[0]?.Department_Data?.Dept_name || '';
  const companyName = user?.companyName || user?.Comp_Data?.[0]?.Name || '';

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
          <Box sx={{ overflow: 'hidden', flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: '0.9rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {displayName}
            </Typography>
            {userRole && (
              <Typography
                display="block"
                sx={{
                  fontSize: '0.6rem',
                  color: 'error.main',
                  fontWeight: 500
                }}
              >
                {userRole}
              </Typography>
            )}
            {departmentName && (
              <Typography display="block" sx={{ fontSize: '0.5rem', color: '#1976d2' }}>{departmentName}</Typography>
            )}
            {companyName && (
              <Typography display="block" sx={{ fontSize: '0.5rem', color: '#10990eff', fontWeight:'bold' }}>{companyName}</Typography>
            )}
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
