import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Button,
  Grid,
  Container,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Fade,
  Skeleton
} from '@mui/material';
import { 
  Add as AddIcon, 
  School as SchoolIcon,
  Timer as TimerIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

const LearningPlanList = ({ userId }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8085/api/learningplans/${userId}`)
      .then((res) => {
        setPlans(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch learning plans:', err);
        setLoading(false);
      });
  }, [userId]);

  // Helper function to get a random pastel color
  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 90%)`;
  };

  // Calculate the estimated time for each plan (mock function)
  const getEstimatedTime = (plan) => {
    // This would be replaced with actual logic based on your data model
    return `${Math.floor(Math.random() * 10) + 1} hours`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Your Learning Plans
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
              <Skeleton variant="text" height={40} sx={{ mt: 1 }} />
              <Skeleton variant="text" height={20} width="60%" />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Your Learning Plans
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/create"
          startIcon={<AddIcon />}
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1,
            boxShadow: 3,
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 4
            }
          }}
        >
          Create New Plan
        </Button>
      </Box>

      {plans.length === 0 ? (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 5, 
            textAlign: 'center',
            borderRadius: 4,
            backgroundColor: '#f8f9fa',
            border: '1px dashed #ccc'
          }}
        >
          <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No learning plans found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Create your first learning plan to get started on your educational journey.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to="/create"
            startIcon={<AddIcon />}
            sx={{ mt: 2, borderRadius: 2 }}
          >
            Create Your First Plan
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {plans.map((plan, index) => (
            <Grid item xs={12} sm={6} md={4} key={plan.id}>
              <Fade in={true} timeout={500 + index * 100}>
                <Card 
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.07)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      height: 8, 
                      backgroundColor: getRandomPastelColor()
                    }} 
                  />
                  <CardContent sx={{ pt: 3, pb: 2, px: 3, flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {plan.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {(plan.background || '').slice(0, 120)}
                    {(plan.background || '').length > 120 ? '...' : ''}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TimerIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {getEstimatedTime(plan)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      
                      <Chip 
                        label="In Progress" 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ backgroundColor: 'rgba(25, 118, 210, 0.05)' }}
                      />
                    </Box>
                  </CardContent>
                  <CardActionArea 
                    onClick={() => navigate(`/plan/${plan.id}`)}
                    sx={{ 
                      p: 2, 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      borderTop: '1px solid rgba(0,0,0,0.08)'
                    }}
                  >
                    <Typography variant="button" color="primary" fontWeight="medium">
                      View Details
                    </Typography>
                    <ArrowForwardIcon fontSize="small" color="primary" />
                  </CardActionArea>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default LearningPlanList;