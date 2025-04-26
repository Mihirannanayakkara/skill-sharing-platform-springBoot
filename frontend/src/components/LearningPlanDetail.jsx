import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Button, CircularProgress, Typography, TextField,
  Chip, Autocomplete, Checkbox, FormControlLabel, Dialog,
  DialogTitle, DialogContent, DialogActions, Card, Divider, Grid,
  IconButton, Stack, Alert, Paper, Tooltip, Avatar, LinearProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  CalendarMonth as CalendarIcon,
  Link as LinkIcon,
  School as SchoolIcon,
  BookmarkBorder as BookmarkIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon
} from '@mui/icons-material';
import axios from 'axios';

const LearningPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editablePlan, setEditablePlan] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [suggestedCoursesForSkill, setSuggestedCoursesForSkill] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await axios.get(`http://localhost:8085/api/learningplans/plan/${id}`);
        setPlan(res.data);
        setEditablePlan(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching plan:', err);
        setError('Failed to load learning plan. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchPlan();
  }, [id]);

  const handleEditToggle = () => setEditMode(true);
  
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditablePlan(plan);
    setNewSkill('');
    setSelectedCourses([]);
    setSuggestedCoursesForSkill([]);
  };

  const handleInputChange = (field, value) => {
    setEditablePlan(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillRemove = (skillToRemove) => {
    const updatedSkills = editablePlan.skills.filter(skill => skill !== skillToRemove);
    const updatedCourses = editablePlan.suggestedCourses.filter(course => course.skill !== skillToRemove);
    setEditablePlan({ ...editablePlan, skills: updatedSkills, suggestedCourses: updatedCourses });
  };

  const fetchSuggestedCourses = async (skillName) => {
    if (!skillName) return;

    try {
      const res = await axios.get(`http://localhost:8085/api/learningplans/skill/${skillName}`);
      setSuggestedCoursesForSkill(res.data.map(courseName => ({ name: courseName })));
    } catch (err) {
      console.error('Error fetching suggested courses:', err);
      setSuggestedCoursesForSkill([]);
    }
  };

  const handleAddSkillAndCourses = () => {
    if (!newSkill.trim()) return;

    const newSkills = [...(editablePlan.skills || []), newSkill];
    const newCourses = [
      ...(editablePlan.suggestedCourses || []),
      ...selectedCourses.map(course => ({ name: course.name, skill: newSkill }))
    ];

    setEditablePlan(prev => ({
      ...prev,
      skills: newSkills,
      suggestedCourses: newCourses
    }));

    setNewSkill('');
    setSuggestedCoursesForSkill([]);
    setSelectedCourses([]);
  };

  const handleCourseChange = (index, value) => {
    const updatedCourses = [...editablePlan.suggestedCourses];
    updatedCourses[index].name = value;
    setEditablePlan({ ...editablePlan, suggestedCourses: updatedCourses });
  };

  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...editablePlan.tasks];
    updatedTasks[index][field] = value;
    setEditablePlan({ ...editablePlan, tasks: updatedTasks });
  };

  const handleAddTask = () => {
    const newTask = {
      name: 'New Task',
      description: 'Task description',
      completed: false
    };
    
    setEditablePlan(prev => ({
      ...prev,
      tasks: [...(prev.tasks || []), newTask]
    }));
  };

  const handleRemoveTask = (index) => {
    const updatedTasks = [...editablePlan.tasks];
    updatedTasks.splice(index, 1);
    setEditablePlan({ ...editablePlan, tasks: updatedTasks });
  };

  const handleSaveEdit = async () => {
    setSaveLoading(true);
    try {
      const res = await axios.put(`http://localhost:8085/api/learningplans/${id}`, editablePlan);
      setPlan(res.data);
      setEditMode(false);
      setSaveLoading(false);
    } catch (err) {
      console.error('Error saving plan:', err);
      setSaveLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8085/api/learningplans/${id}`);
      navigate('/');
    } catch (err) {
      console.error('Error deleting plan:', err);
    }
  };

  const calculateProgress = () => {
    if (!plan?.tasks || plan.tasks.length === 0) return 0;
    const completedTasks = plan.tasks.filter(task => task.completed).length;
    return (completedTasks / plan.tasks.length) * 100;
  };

  // Color array for skills
  const skillColors = ['#2196f3', '#f50057', '#ff9800', '#4caf50', '#9c27b0', '#795548', '#00bcd4'];

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="50vh">
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" mt={2}>Loading learning plan...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Alert severity="error" sx={{ maxWidth: 600 }}>{error}</Alert>
      </Box>
    );
  }

  if (!plan) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Alert severity="warning" sx={{ maxWidth: 600 }}>
          <Typography variant="h6">Learning plan not found</Typography>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Return to dashboard
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 4 } }}>
      {!editMode ? (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/')}
              variant="outlined"
              sx={{ mr: 'auto' }}
            >
              Back
            </Button>
            <Tooltip title="Edit plan">
              <Button 
                variant="outlined" 
                startIcon={<EditIcon />} 
                onClick={handleEditToggle}
              >
                Edit
              </Button>
            </Tooltip>
            <Tooltip title="Delete plan">
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteConfirmOpen(true)}
              >
                Delete
              </Button>
            </Tooltip>
          </Box>

          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              mb: 4, 
              borderRadius: 2,
              background: 'linear-gradient(to right, #f5f7fa, #e4e8f0)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                sx={{ 
                  width: 56, 
                  height: 56, 
                  bgcolor: 'primary.main',
                  mr: 2
                }}
              >
                <BookmarkIcon />
              </Avatar>
              <Typography 
                variant="h4" 
                fontWeight="700" 
                color="primary.dark"
              >
                {plan.title}
              </Typography>
            </Box>
            
            <LinearProgress 
              variant="determinate" 
              value={calculateProgress()} 
              sx={{ 
                height: 10, 
                borderRadius: 5, 
                mb: 3, 
                mt: 2,
                bgcolor: 'background.paper'
              }} 
            />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Background</Typography>
                  <Typography variant="body1">{plan.background}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Scope</Typography>
                  <Typography variant="body1">{plan.scope}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mr: 1 }}>Duration:</Typography>
                  <Typography variant="body1">
                    {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LinkIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mr: 1 }}>Resource:</Typography>
                  <Typography variant="body1">
                    <a 
                      href={plan.resourceLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#1976d2', textDecoration: 'none' }}
                    >
                      {plan.resourceLink}
                    </a>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Enhanced Skills Section */}
          <Paper 
            elevation={3}
            sx={{ 
              p: 3, 
              mb: 4, 
              borderRadius: 2,
              background: '#ffffff',
              border: '1px solid #e0e0e0'
            }}
          >
            <Typography 
              variant="h5" 
              fontWeight="600" 
              sx={{ 
                mb: 3,
                pb: 1,
                borderBottom: '2px solid #1976d2',
                display: 'inline-block'
              }}
            >
              Skills to Acquire
            </Typography>
            
            {plan.skills && plan.skills.length > 0 ? (
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 2,
                justifyContent: {xs: 'center', sm: 'flex-start'}
              }}>
                {plan.skills.map((skill, idx) => (
                  <Card 
                    key={idx} 
                    elevation={2}
                    sx={{ 
                      minWidth: 120,
                      maxWidth: 170,
                      p: 2,
                      mb: 1,
                      borderRadius: 2,
                      borderTop: `4px solid ${skillColors[idx % skillColors.length]}`,
                      textAlign: 'center',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <SchoolIcon 
                      sx={{ 
                        fontSize: 36, 
                        color: skillColors[idx % skillColors.length],
                        mb: 1
                      }} 
                    />
                    <Typography 
                      variant="subtitle1" 
                      fontWeight="600"
                      color="text.primary"
                    >
                      {skill}
                    </Typography>
                    
                    {/* Show related courses count if any */}
                    {plan.suggestedCourses && 
                     plan.suggestedCourses.filter(course => course.skill === skill).length > 0 && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ mt: 1 }}
                      >
                        {plan.suggestedCourses.filter(course => course.skill === skill).length} course(s)
                      </Typography>
                    )}
                  </Card>
                ))}
              </Box>
            ) : (
              <Box sx={{ 
                p: 4, 
                textAlign: 'center', 
                border: '2px dashed #e0e0e0',
                borderRadius: 2
              }}>
                <SchoolIcon sx={{ fontSize: 48, color: '#9e9e9e', mb: 2 }} />
                <Typography color="text.secondary">No skills have been added to this learning plan yet.</Typography>
              </Box>
            )}
          </Paper>

         

          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mt: 3 }}>
            <Typography variant="h6" fontWeight="600" mb={2}>Tasks</Typography>
            {plan.tasks && plan.tasks.length > 0 ? (
              plan.tasks.map((task, idx) => (
                <Paper 
                  key={idx} 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    borderLeft: task.completed ? '4px solid #4caf50' : '4px solid #ff9800',
                    backgroundColor: task.completed ? 'rgba(76, 175, 80, 0.04)' : 'transparent'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'start' }}>
                    {task.completed ? (
                      <CheckCircleIcon color="success" sx={{ mr: 1, mt: 0.5 }} />
                    ) : (
                      <UncheckedIcon color="warning" sx={{ mr: 1, mt: 0.5 }} />
                    )}
                    <Box>
                      <Typography variant="subtitle1" fontWeight="500">{task.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{task.description}</Typography>
                    </Box>
                  </Box>
                </Paper>
              ))
            ) : (
              <Typography color="text.secondary">No tasks added yet.</Typography>
            )}
          </Paper>

          <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography>Are you sure you want to delete this learning plan? This action cannot be undone.</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
              <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Dialog 
          open={editMode} 
          onClose={handleCancelEdit} 
          fullWidth 
          maxWidth="md"
          PaperProps={{ sx: { borderRadius: 2 } }}
        >
          <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EditIcon sx={{ mr: 1 }} />
              Edit Learning Plan
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              value={editablePlan.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              sx={{ mb: 3, mt: 1 }}
            />
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Background"
                  variant="outlined"
                  multiline
                  rows={2}
                  value={editablePlan.background}
                  onChange={(e) => handleInputChange('background', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Scope"
                  variant="outlined"
                  multiline
                  rows={2}
                  value={editablePlan.scope}
                  onChange={(e) => handleInputChange('scope', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Resource Link"
                  variant="outlined"
                  value={editablePlan.resourceLink}
                  onChange={(e) => handleInputChange('resourceLink', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={editablePlan.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={editablePlan.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Skills</Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {editablePlan.skills?.map((skill, idx) => (
                    <Chip 
                      key={idx} 
                      label={skill} 
                      onDelete={() => handleSkillRemove(skill)} 
                      color="primary"
                      sx={{ 
                        borderRadius: '16px',
                        fontWeight: 500,
                        backgroundColor: 'rgba(25, 118, 210, 0.8)',
                        color: 'white'
                      }}
                    />
                  ))}
                  {(!editablePlan.skills || editablePlan.skills.length === 0) && (
                    <Typography color="text.secondary" variant="body2">No skills added yet</Typography>
                  )}
                </Box>
                <TextField
                  fullWidth
                  label="New Skill"
                  value={newSkill}
                  onChange={(e) => {
                    setNewSkill(e.target.value);
                    fetchSuggestedCourses(e.target.value);
                  }}
                  sx={{ mb: 2 }}
                />
                
                <Button 
                  onClick={handleAddSkillAndCourses} 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  disabled={!newSkill.trim()}
                >
                  Add Skill
                </Button>
              </Paper>
            </Box>

            

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Tasks</Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={handleAddTask}
                  size="small"
                >
                  Add Task
                </Button>
              </Box>
              
              {editablePlan.tasks?.map((task, idx) => (
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }} key={idx}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={10}>
                      <TextField
                        label="Task Name"
                        fullWidth
                        value={task.name}
                        onChange={(e) => handleTaskChange(idx, 'name', e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        label="Task Description"
                        fullWidth
                        multiline
                        rows={2}
                        value={task.description}
                        onChange={(e) => handleTaskChange(idx, 'description', e.target.value)}
                        sx={{ mb: 1 }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={task.completed} 
                            onChange={(e) => handleTaskChange(idx, 'completed', e.target.checked)} 
                          />
                        }
                        label="Completed"
                      />
                    </Grid>
                    <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <IconButton 
                        color="error" 
                        onClick={() => handleRemoveTask(idx)}
                        sx={{ alignSelf: 'center' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
              
              {(!editablePlan.tasks || editablePlan.tasks.length === 0) && (
                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography color="text.secondary" variant="body2">No tasks added yet</Typography>
                  <Button 
                    variant="outlined" 
                    startIcon={<AddIcon />}
                    onClick={handleAddTask}
                    sx={{ mt: 1 }}
                  >
                    Add First Task
                  </Button>
                </Paper>
              )}
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={handleCancelEdit}
              startIcon={<CloseIcon />}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEdit} 
              variant="contained"
              startIcon={<CheckIcon />}
              disabled={saveLoading}
            >
              {saveLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default LearningPlanDetail;