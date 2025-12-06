// src/utils/iconUtils.ts
import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
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

type IconComponent = FC<SvgIconProps>;

interface IconMap {
  [key: string]: IconComponent;
}

const iconMap: IconMap = {
  ArticleOutlinedIcon,
  ErrorOutlineOutlinedIcon,
  AssessmentOutlinedIcon,
  SchoolOutlinedIcon,
  VerifiedUserOutlinedIcon,
  SystemUpdateAltOutlinedIcon,
  BusinessOutlinedIcon,
  LibraryBooksOutlinedIcon,
  FindInPageOutlinedIcon,
  SmartToyOutlinedIcon,
};

export const getIconComponent = (iconName: string): IconComponent => {
  return iconMap[iconName] || ArticleOutlinedIcon;
};
