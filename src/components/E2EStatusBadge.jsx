import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import { alpha } from '@mui/material/styles';

const E2EStatusBadge = ({ credential }) => {
  if (credential._source === 'e2e') {
    return (
      <Tooltip title="Credential chiffré de bout en bout">
        <Chip
          icon={<SecurityIcon />}
          label="E2E"
          size="small"
          sx={{
            backgroundColor: alpha('#4caf50', 0.2),
            color: '#4caf50',
            borderColor: '#4caf50',
            fontSize: '0.7rem',
            height: 20
          }}
        />
      </Tooltip>
    );
  } else if (credential._source === 'legacy') {
    return (
      <Tooltip title="Credential legacy (peut être migré vers E2E)">
        <Chip
          icon={<LockIcon />}
          label="Legacy"
          size="small"
          sx={{
            backgroundColor: alpha('#ff9800', 0.2),
            color: '#ff9800',
            borderColor: '#ff9800',
            fontSize: '0.7rem',
            height: 20
          }}
        />
      </Tooltip>
    );
  }
  
  return null;
};

export default E2EStatusBadge;