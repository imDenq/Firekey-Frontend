// src/components/accsettings/StatisticsSection.jsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StatisticsSectionPaper = styled(Paper)(({ theme }) => ({
  padding: 24,
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  marginBottom: 24,
  background: '#1e1e1e',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.25)',
    transform: 'translateY(-2px)'
  }
}));

const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  height: '100%',
  backgroundColor: '#2a2a2a',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
    transform: 'translateY(-4px)'
  }
}));

const StyledButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 8,
  padding: '10px 20px',
  textTransform: 'none',
  fontWeight: 500,
  boxShadow: variant === 'contained' ? '0 2px 10px rgba(0, 0, 0, 0.2)' : 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: variant === 'contained' ? '0 4px 15px rgba(0, 0, 0, 0.3)' : 'none',
    transform: 'translateY(-2px)'
  }
}));

const StatisticsSection = ({ stats }) => {
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h3" sx={{ fontWeight: 600, mb: 1, color: '#90caf9' }}>
                {stats.credentialsCount}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#b0b0b0' }}>
                Credentials
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h3" sx={{ fontWeight: 600, mb: 1, color: '#90caf9' }}>
                {stats.sessionsCount}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#b0b0b0' }}>
                Sessions actives
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h3" sx={{ fontWeight: 600, mb: 1, color: '#90caf9' }}>
                3
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#b0b0b0' }}>
                Applications liées
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.5rem', mb: 1, color: '#90caf9' }}>
                {stats.storageUsed}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#b0b0b0' }}>
                Stockage utilisé
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      <StatisticsSectionPaper sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#ffffff' }}>
          Activité récente
        </Typography>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500, color: '#ffffff' }}>
                Connexion depuis Paris, France
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                Chrome sur MacOS
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
              Aujourd'hui, 15:32
            </Typography>
          </Box>
          <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500, color: '#ffffff' }}>
                Mise à jour du profil
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                Changement de l'adresse email
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
              Hier, 09:15
            </Typography>
          </Box>
          <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500, color: '#ffffff' }}>
                Ajout d'un nouveau credential
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                Credential "Projet Alpha" créé
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
              18 Mars 2025, 11:23
            </Typography>
          </Box>
          <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500, color: '#ffffff' }}>
                Connexion depuis Lyon, France
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                Safari sur iPhone
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
              15 Mars 2025, 18:45
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <StyledButton
            variant="outlined"
            color="primary"
          >
            Voir toute l'activité
          </StyledButton>
        </Box>
      </StatisticsSectionPaper>
      
      <StatisticsSectionPaper>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#ffffff' }}>
          Utilisation des services
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#ffffff' }}>
                  Stockage
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  12.8%
                </Typography>
              </Box>
              <Box sx={{ width: '100%', backgroundColor: '#444', borderRadius: 5, height: 10 }}>
                <Box
                  sx={{
                    width: '12.8%',
                    backgroundColor: '#90caf9',
                    borderRadius: 5,
                    height: 10
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#ffffff' }}>
                  API Calls (ce mois)
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  67.5%
                </Typography>
              </Box>
              <Box sx={{ width: '100%', backgroundColor: '#444', borderRadius: 5, height: 10 }}>
                <Box
                  sx={{
                    width: '67.5%',
                    backgroundColor: '#90caf9',
                    borderRadius: 5,
                    height: 10
                  }}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#ffffff' }}>
                  Limite d'authentifications
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  45.2%
                </Typography>
              </Box>
              <Box sx={{ width: '100%', backgroundColor: '#444', borderRadius: 5, height: 10 }}>
                <Box
                  sx={{
                    width: '45.2%',
                    backgroundColor: '#90caf9',
                    borderRadius: 5,
                    height: 10
                  }}
                />
              </Box>
            </Box>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#ffffff' }}>
                  Applications liées
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  30%
                </Typography>
              </Box>
              <Box sx={{ width: '100%', backgroundColor: '#444', borderRadius: 5, height: 10 }}>
                <Box
                  sx={{
                    width: '30%',
                    backgroundColor: '#90caf9',
                    borderRadius: 5,
                    height: 10
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </StatisticsSectionPaper>
    </>
  );
};

export default StatisticsSection;