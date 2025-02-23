import { Grid, Card, CardContent, Typography, Box, styled, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import SystemUpdateAltOutlinedIcon from '@mui/icons-material/SystemUpdateAltOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';

const DashboardCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: theme.shadows[10],
  },
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.shape.borderRadius,
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  fontSize: '3rem',
  marginBottom: theme.spacing(2),
}));

const Dashboard = () => {
  const theme = useTheme();
  
  const modules = [
    {
      title: 'DOCUMENTATION CONTROL',
      icon: ArticleOutlinedIcon,
      path: '/documentation-control'
    },
    {
      title: 'DEVIATION, NON-CONFORMITY AND CAPA SYSTEM',
      icon: ErrorOutlineOutlinedIcon,
      path: '/deviation-system'
    },
    {
      title: 'RISK ASSESSMENT MANAGEMENT',
      icon: AssessmentOutlinedIcon,
      path: '/risk-management'
    },
    {
      title: 'TRAINING EMPLOYEES',
      icon: SchoolOutlinedIcon,
      path: '/training'
    },
    {
      title: 'VALIDATION & QUALIFICATION',
      icon: VerifiedUserOutlinedIcon,
      path: '/validation'
    },
    {
      title: 'CHANGE CONTROL',
      icon: SystemUpdateAltOutlinedIcon,
      path: '/change-control'
    },
    {
      title: 'VENDOR QUALIFICATION',
      icon: BusinessOutlinedIcon,
      path: '/vendor'
    },
    {
      title: "GUIDELINE'S LIBRARIES",
      icon: LibraryBooksOutlinedIcon,
      path: '/guidelines'
    },
    {
      title: 'AUDITING INTERNAL/EXTERNAL',
      icon: FindInPageOutlinedIcon,
      path: '/audit'
    },
    {
      title: 'AI SUPPORT',
      icon: SmartToyOutlinedIcon,
      path: 'https://chatgpt.com'
    },
  ];
  return (
    <Box sx={{ p: theme.spacing(3) }}>
      <Typography 
        variant="h1" 
        align="center" 
        sx={{ 
          mb: theme.spacing(4), 
          color: theme.palette.text.primary 
        }}
      >
        WELCOME TO QMS
      </Typography>
      
      <Grid container spacing={3}>
        {modules.map((module, index) => {
          const Icon = module.icon;
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Link 
                to={module.path} 
                style={{ textDecoration: 'none' }}
                target={module.path.startsWith('http') ? '_blank' : undefined}
              >
                <DashboardCard>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <IconWrapper>
                      <Icon sx={{ fontSize: 'inherit' }} />
                    </IconWrapper>
                    <Typography variant="h6" component="div">
                      {module.title}
                    </Typography>
                  </CardContent>
                </DashboardCard>
              </Link>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Dashboard;