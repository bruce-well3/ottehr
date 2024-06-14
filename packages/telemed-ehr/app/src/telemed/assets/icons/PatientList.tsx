import React, { FC } from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

export const PatientListIcon: FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 14C15.1667 14 14.4583 13.7083 13.875 13.125C13.2917 12.5417 13 11.8333 13 11C13 10.1667 13.2917 9.45833 13.875 8.875C14.4583 8.29167 15.1667 8 16 8C16.8333 8 17.5417 8.29167 18.125 8.875C18.7083 9.45833 19 10.1667 19 11C19 11.8333 18.7083 12.5417 18.125 13.125C17.5417 13.7083 16.8333 14 16 14ZM10 20V18.1C10 17.75 10.0833 17.4167 10.25 17.1C10.4167 16.7833 10.65 16.5333 10.95 16.35C11.7 15.9 12.4958 15.5625 13.3375 15.3375C14.1792 15.1125 15.0667 15 16 15C16.9333 15 17.8208 15.1125 18.6625 15.3375C19.5042 15.5625 20.3 15.9 21.05 16.35C21.35 16.5333 21.5833 16.7833 21.75 17.1C21.9167 17.4167 22 17.75 22 18.1V20H10ZM12.15 18H19.85C19.2667 17.6667 18.65 17.4167 18 17.25C17.35 17.0833 16.6833 17 16 17C15.3167 17 14.65 17.0833 14 17.25C13.35 17.4167 12.7333 17.6667 12.15 18ZM16 12C16.2833 12 16.5208 11.9042 16.7125 11.7125C16.9042 11.5208 17 11.2833 17 11C17 10.7167 16.9042 10.4792 16.7125 10.2875C16.5208 10.0958 16.2833 10 16 10C15.7167 10 15.4792 10.0958 15.2875 10.2875C15.0958 10.4792 15 10.7167 15 11C15 11.2833 15.0958 11.5208 15.2875 11.7125C15.4792 11.9042 15.7167 12 16 12ZM3 14V12H11V14H3ZM3 6V4H15V6H3ZM11.1 10H3V8H12C11.7667 8.28333 11.5792 8.59167 11.4375 8.925C11.2958 9.25833 11.1833 9.61667 11.1 10Z" />
      </svg>
    </SvgIcon>
  );
};
