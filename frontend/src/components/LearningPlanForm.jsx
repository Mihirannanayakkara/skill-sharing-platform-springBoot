import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import debounce from 'lodash/debounce';
import {AlertTitle } from '@mui/material';


// Material UI imports
import {
  Container, TextField, Button, Box, Typography, Paper, CircularProgress,
  FormControl, InputLabel, Select, MenuItem, Stepper, Step, StepLabel,
  Chip, IconButton, Card, CardContent, Divider, FormControlLabel, Checkbox,
  Dialog, DialogTitle, DialogContent, DialogActions, Fade, Alert
} from '@mui/material';

// Icons
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TopicIcon from '@mui/icons-material/Topic';
import TaskIcon from '@mui/icons-material/Task';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const LearningPlanCreation = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [noCoursesMessage, setNoCoursesMessage] = useState('');
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [formValidation, setFormValidation] = useState({
    title: true,
    background: true,
    skills: true
  });
  
  // State for task dialog
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  
  // State for inputs
  const [skillInput, setSkillInput] = useState('');
  const [topicInput, setTopicInput] = useState('');
  
  // Main state
  const [learningPlan, setLearningPlan] = useState({
    userId: '12345',
    title: '',
    background: '',
    scope: '',
    resourceLink: '',
    skills: [],
    suggestedCourses: [],
    deadlineEnabled: false,
    startDate: '',
    endDate: '',
    topics: [],
  });
  
  const [tasks, setTasks] = useState([]);
  const [aiGeneratedTasks, setAiGeneratedTasks] = useState([]);
  const [taskOption, setTaskOption] = useState('manual');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);

  const steps = ['Basic Info', 'Skills & Courses', 'Topics', 'Tasks', 'Timeline'];

  const validateStep = () => {
    if (activeStep === 0) {
      const titleValid = !!learningPlan.title.trim();
      const backgroundValid = !!learningPlan.background.trim();
      
      setFormValidation({
        ...formValidation,
        title: titleValid,
        background: backgroundValid
      });
      
      return titleValid && backgroundValid;
    }
    
    if (activeStep === 1) {
      const skillsValid = learningPlan.skills.length > 0;
      setFormValidation({
        ...formValidation,
        skills: skillsValid
      });
      return skillsValid;
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLearningPlan({ ...learningPlan, [name]: value });
    
    if (name === 'title' || name === 'background') {
      setFormValidation({
        ...formValidation,
        [name]: !!value.trim()
      });
    }
  };

  const fetchCourses = debounce((skill) => {
    if (skill) {
      axios.get(`http://localhost:8085/api/courses/skill/${skill}`)
        .then((response) => {
          setCourses(response.data);
          setNoCoursesMessage('');
        })
        .catch(() => {
          setCourses([]);
          setNoCoursesMessage('No courses found for this skill.');
        });
    } else {
      setCourses([]);
      setNoCoursesMessage('');
    }
  }, 500);

  const handleSkillChange = (e) => {
    const value = e.target.value;
    setSkillInput(value);
    fetchCourses(value);
  };

  const handleTopicChange = (e) => {
    setTopicInput(e.target.value);
  };

  const addSkill = () => {
    if (skillInput && !learningPlan.skills.includes(skillInput)) {
      const newSkills = [...learningPlan.skills, skillInput];
      setLearningPlan({
        ...learningPlan,
        skills: newSkills
      });
      setSkillInput('');
      setCourses([]);
      setFormValidation({
        ...formValidation,
        skills: newSkills.length > 0
      });
    }
  };

  const removeSkill = (skillToRemove) => {
    const newSkills = learningPlan.skills.filter(skill => skill !== skillToRemove);
    setLearningPlan({
      ...learningPlan,
      skills: newSkills
    });
    setFormValidation({
      ...formValidation,
      skills: newSkills.length > 0
    });
  };

  const addTopic = () => {
    if (topicInput && !learningPlan.topics.includes(topicInput)) {
      setLearningPlan({
        ...learningPlan,
        topics: [...learningPlan.topics, topicInput]
      });
      setTopicInput('');
    }
  };

  const removeTopic = (topicToRemove) => {
    setLearningPlan({
      ...learningPlan,
      topics: learningPlan.topics.filter(topic => topic !== topicToRemove)
    });
  };

  const handleAddTask = () => {
    if (taskName && taskDescription) {
      const newTask = { name: taskName, description: taskDescription };
      setTasks([...tasks, newTask]);
      setTaskName('');
      setTaskDescription('');
      setOpenTaskDialog(false);
    }
  };

  const removeTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const addCourse = (course) => {
    if (!learningPlan.suggestedCourses.includes(course)) {
      setLearningPlan({
        ...learningPlan,
        suggestedCourses: [...learningPlan.suggestedCourses, course]
      });
    }
  };

  const removeCourse = (courseToRemove) => {
    setLearningPlan({
      ...learningPlan,
      suggestedCourses: learningPlan.suggestedCourses.filter(course => course !== courseToRemove)
    });
  };

  const handleGenerateAITasks = () => {
    setIsGeneratingAI(true);
    
    // Simulate AI task generation with a timeout
    setTimeout(() => {
      const generatedTasks = [
        { name: 'Research fundamentals', description: 'Study the core concepts of selected topics' },
        { name: 'Practice application', description: 'Apply learned skills in a small project' },
        { name: 'Create documentation', description: 'Document your learning progress and insights' },
        { name: 'Peer review', description: 'Get feedback from others on your work' }
      ];
      setAiGeneratedTasks(generatedTasks);
      setIsGeneratingAI(false);
      setAiGenerated(true);
    }, 1500);
  };

  const handleSubmit = () => {
    const learningPlanWithTasks = {
      ...learningPlan,
      tasks: taskOption === 'manual' ? tasks : aiGeneratedTasks,
    };

    setIsLoading(true);

    axios.post('http://localhost:8085/api/learningplans', learningPlanWithTasks)
      .then(() => {
        toast.success('Learning plan created successfully!');
        navigate('/');
      })
      .catch(() => {
        toast.error('Something went wrong. Please try again.');
        setIsLoading(false);
      });
  };

  // Step content rendering
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Fade in={activeStep === 0}>
            <Box>
              <Typography variant="h6" sx={{ mb: 3 }}>Basic Information</Typography>
              
              <TextField 
                fullWidth 
                label="Title" 
                name="title" 
                value={learningPlan.title} 
                onChange={handleInputChange} 
                sx={{ mb: 3 }}
                required
                error={!formValidation.title}
                helperText={!formValidation.title ? "Title is required" : ""}
              />
              
              <TextField 
                fullWidth 
                label="Background" 
                name="background" 
                value={learningPlan.background} 
                onChange={handleInputChange} 
                multiline
                rows={3}
                sx={{ mb: 3 }}
                required
                error={!formValidation.background}
                helperText={!formValidation.background ? "Background is required" : ""}
              />
              
              <TextField 
                fullWidth 
                label="Scope" 
                name="scope" 
                value={learningPlan.scope} 
                onChange={handleInputChange} 
                multiline
                rows={2}
                sx={{ mb: 3 }} 
              />
              
              <TextField 
                fullWidth 
                label="Resource Link" 
                name="resourceLink" 
                value={learningPlan.resourceLink} 
                onChange={handleInputChange} 
                sx={{ mb: 3 }} 
              />
            </Box>
          </Fade>
        );
      
      case 1:
        return (
          <Fade in={activeStep === 1}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PsychologyIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Skills</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', mb: 2 }}>
                <TextField 
                  fullWidth 
                  label="Add Skill" 
                  value={skillInput} 
                  onChange={handleSkillChange}
                  error={!formValidation.skills && learningPlan.skills.length === 0}
                  helperText={!formValidation.skills && learningPlan.skills.length === 0 ? "At least one skill is required" : ""}
                />
                <Button 
                  variant="contained" 
                  onClick={addSkill} 
                  sx={{ ml: 1 }}
                  disabled={!skillInput}
                >
                  <AddIcon />
                </Button>
              </Box>
              
              <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {learningPlan.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={() => removeSkill(skill)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SchoolIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Suggested Courses</Typography>
              </Box>
              
              {courses.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Select courses to add to your learning plan:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {courses.map((course, index) => (
                      <Chip
                        key={index}
                        label={course}
                        onClick={() => addCourse(course)}
                        icon={<AddIcon />}
                        clickable
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              {noCoursesMessage && (
                <Alert severity="info" sx={{ mb: 3 }}>{noCoursesMessage}</Alert>
              )}
              
              {learningPlan.suggestedCourses.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Added Courses:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {learningPlan.suggestedCourses.map((course, index) => (
                      <Chip
                        key={index}
                        label={course}
                        onDelete={() => removeCourse(course)}
                        color="secondary"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Fade>
        );
      
      case 2:
        return (
          <Fade in={activeStep === 2}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TopicIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Topics</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', mb: 2 }}>
                <TextField 
                  fullWidth 
                  label="Add Topic" 
                  value={topicInput} 
                  onChange={handleTopicChange} 
                />
                <Button 
                  variant="contained" 
                  onClick={addTopic} 
                  sx={{ ml: 1 }}
                  disabled={!topicInput}
                >
                  <AddIcon />
                </Button>
              </Box>
              
              <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {learningPlan.topics.map((topic, index) => (
                  <Chip
                    key={index}
                    label={topic}
                    onDelete={() => removeTopic(topic)}
                    color="info"
                  />
                ))}
              </Box>
              
              {learningPlan.topics.length === 0 && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  Adding topics will help you organize your learning plan better.
                </Alert>
              )}
            </Box>
          </Fade>
        );
      
      case 3:
        return (
          <Fade in={activeStep === 3}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TaskIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Tasks</Typography>
              </Box>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Task Creation Method</InputLabel>
                <Select value={taskOption} onChange={(e) => setTaskOption(e.target.value)}>
                  <MenuItem value="manual">Manual Task Creation</MenuItem>
                  <MenuItem value="ai">AI-Generated Tasks</MenuItem>
                </Select>
              </FormControl>
              
              {taskOption === 'manual' && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1">Manual Tasks</Typography>
                    <Button 
                      variant="contained" 
                      startIcon={<AddIcon />} 
                      onClick={() => setOpenTaskDialog(true)}
                    >
                      Add Task
                    </Button>
                  </Box>
                  
                  {tasks.length > 0 ? (
                    tasks.map((task, index) => (
                      <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                        <CardContent sx={{ pb: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle1" component="div">
                              {task.name}
                            </Typography>
                            <IconButton size="small" onClick={() => removeTask(index)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {task.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Alert severity="info">
                      No tasks added yet. Click the "Add Task" button to create your first task.
                    </Alert>
                  )}
                </Box>
              )}
              
              {taskOption === 'ai' && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                    <Button 
                      variant="contained" 
                      startIcon={<AutoAwesomeIcon />} 
                      onClick={handleGenerateAITasks}
                      disabled={isGeneratingAI || aiGenerated}
                      color="secondary"
                      sx={{ px: 3 }}
                    >
                      {isGeneratingAI ? (
                        <>
                          <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                          Generating...
                        </>
                      ) : aiGenerated ? (
                        <>
                          <CheckCircleIcon sx={{ mr: 1 }} />
                          Generated
                        </>
                      ) : (
                        'Generate AI Tasks'
                      )}
                    </Button>
                  </Box>
                  
                  {aiGeneratedTasks.length > 0 ? (
                    aiGeneratedTasks.map((task, index) => (
                      <Card key={index} variant="outlined" sx={{ mb: 2, bgcolor: 'rgba(156, 39, 176, 0.04)' }}>
                        <CardContent>
                          <Typography variant="subtitle1" component="div">
                            {task.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {task.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Alert severity="info">
                      {isGeneratingAI ? 
                        "Generating your personalized tasks..." : 
                        "Click the 'Generate AI Tasks' button to create tasks based on your skills and topics."}
                    </Alert>
                  )}
                </Box>
              )}
            </Box>
          </Fade>
        );
      
      case 4:
        return (
          <Fade in={activeStep === 4}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AccessTimeIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Timeline</Typography>
              </Box>
              
              <FormControlLabel 
                control={
                  <Checkbox 
                    checked={learningPlan.deadlineEnabled} 
                    onChange={(e) => setLearningPlan({ ...learningPlan, deadlineEnabled: e.target.checked })} 
                  />
                } 
                label="Set Deadline" 
                sx={{ mb: 2 }}
              />
              
              {learningPlan.deadlineEnabled && (
                <Fade in={learningPlan.deadlineEnabled}>
                  <Box>
                    <TextField 
                      label="Start Date" 
                      type="date" 
                      fullWidth 
                      value={learningPlan.startDate} 
                      onChange={(e) => setLearningPlan({ ...learningPlan, startDate: e.target.value })} 
                      sx={{ mb: 3 }} 
                      InputLabelProps={{ shrink: true }} 
                    />
                    
                    <TextField 
                      label="End Date" 
                      type="date" 
                      fullWidth 
                      value={learningPlan.endDate} 
                      onChange={(e) => setLearningPlan({ ...learningPlan, endDate: e.target.value })} 
                      sx={{ mb: 3 }} 
                      InputLabelProps={{ shrink: true }} 
                    />
                  </Box>
                </Fade>
              )}
              
              <Box sx={{ mt: 4 }}>
                <Alert severity="success">
                  <AlertTitle>Ready to Create</AlertTitle>
                  Your learning plan is ready to be created. Review the previous steps if needed, or click "Create Plan" to finalize.
                </Alert>
              </Box>
            </Box>
          </Fade>
        );
      
      default:
        return 'Unknown step';
    }
  };

  // Dialog components
  const TaskDialog = () => (
    <Dialog open={openTaskDialog} onClose={() => setOpenTaskDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          Add New Task
          <IconButton onClick={() => setOpenTaskDialog(false)}>
            <CloseIcon />
          </IconButton>  
        </Box>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          sx={{ mb: 3, mt: 1 }}
        />
        <TextField
          fullWidth
          label="Task Description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          multiline
          rows={3}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenTaskDialog(false)}>Cancel</Button>
        <Button variant="contained" onClick={handleAddTask} disabled={!taskName || !taskDescription}>
          Add Task
        </Button>
      </DialogActions>
    </Dialog>
  );

  const ConfirmDialog = () => (
    <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
      <DialogTitle>Confirm Submission</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to create this learning plan?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
        <Button variant="contained" onClick={() => {
          setOpenConfirmDialog(false);
          handleSubmit();
        }}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 4, textAlign: 'center', fontWeight: 500 }}>
          Create Learning Plan
        </Typography>
        
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box sx={{ p: 2 }}>
          {getStepContent(activeStep)}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={activeStep === 0 ? () => navigate('/') : handleBack}
          >
            {activeStep === 0 ? 'Cancel' : 'Back'}
          </Button>
          
          <Button
            variant="contained"
            onClick={activeStep === steps.length - 1 ? () => setOpenConfirmDialog(true) : handleNext}
            disabled={isLoading}
          >
            {activeStep === steps.length - 1 ? (
              isLoading ? <CircularProgress size={24} /> : 'Create Plan'
            ) : (
              'Next'
            )}
          </Button>
        </Box>
      </Paper>
      
      {TaskDialog()}
      {ConfirmDialog()}
    </Container>
  );
};

export default LearningPlanCreation;