// src/components/Credentials/CredentialItem.jsx
import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  FormControlLabel,
  Checkbox,
  Stack
} from '@mui/material'
import { Visibility, VisibilityOff, Lock, LockOpen, Edit, Delete } from '@mui/icons-material'

export default function CredentialItem({
  cred,
  onTogglePassword,
  onEdit,
  onDelete,
  onSensitiveChange
}) {
  return (
    <Card
      sx={{
        backgroundColor: '#21262d',
        color: 'white',
        borderRadius: 2,
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        p: 1,
        minHeight: 70,
      }}
    >
      <CardContent sx={{ py: 1 }}>
        <Stack direction="column" spacing={1}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            spacing={2}
          >
            <Stack
              direction="row"
              alignItems="center"
              flexWrap="wrap"
              spacing={2}
              sx={{ flex: 1, minWidth: 0 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: '#8b949e', mr: 0.5 }}>
                  Nom:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {cred.name}
                </Typography>
              </Box>

              {cred.website && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#8b949e', mr: 0.5 }}>
                    Site:
                  </Typography>
                  <Typography variant="body2">{cred.website}</Typography>
                </Box>
              )}

              {cred.email && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#8b949e', mr: 0.5 }}>
                    Email:
                  </Typography>
                  <Typography variant="body2">{cred.email}</Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: '#8b949e', mr: 0.5 }}>
                  Password:
                </Typography>
                <Typography variant="body2">
                  {cred.unlocked ? cred.password : '••••••••••'}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => onTogglePassword(cred)}
                  sx={{ color: 'white', ml: 1 }}
                >
                  {cred.unlocked ? <VisibilityOff /> : <Visibility />}
                </IconButton>
                {/* Icône lock/unlock si is_sensitive */}
                {cred.is_sensitive &&
                  (cred.unlocked ? <LockOpen sx={{ ml: 1 }} /> : <Lock sx={{ ml: 1 }} />)}
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={cred.is_sensitive}  // <-- important
                    onChange={(e) => onSensitiveChange(cred, e.target.checked)}
                    sx={{
                      color: '#8b949e',
                      '&.Mui-checked': { color: '#58a6ff' },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: '#8b949e' }}>
                    Sensible
                  </Typography>
                }
                sx={{ ml: 1 }}
              />
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton size="small" onClick={() => onEdit(cred)} sx={{ color: 'white' }}>
                <Edit />
              </IconButton>
              <IconButton size="small" onClick={() => onDelete(cred)} sx={{ color: 'white' }}>
                <Delete />
              </IconButton>
            </Stack>
          </Stack>

          {cred.note && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ color: '#8b949e' }}>
                Note: {cred.note}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
