import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Divider,
  Box,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import api from '../services/api';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    full_name: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/v1/users');
      setUsers(response.data);
    } catch (error) {
      setError('Failed to fetch users');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/v1/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      setError('Failed to delete user');
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await api.post('/api/v1/users', newUser);
      setUsers([...users, response.data]);
      setOpenDialog(false);
      setNewUser({ email: '', password: '', full_name: '' });
    } catch (error) {
      setError('Failed to create user');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add User
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <List>
          {users.map((user, index) => (
            <React.Fragment key={user.id}>
              <ListItem>
                <ListItemText
                  primary={user.full_name}
                  secondary={
                    <Box>
                      <Typography component="span" variant="body2" color="text.secondary" display="block">
                        Email: {user.email}
                      </Typography>
                      <Typography component="span" variant="body2" color="text.secondary" display="block">
                        Role: {user.is_admin ? 'Admin' : 'User'}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  {!user.is_admin && (
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(user.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
              {index < users.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newUser.email}
            onChange={(e) =>
              setNewUser({ ...newUser, email: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Full Name"
            fullWidth
            value={newUser.full_name}
            onChange={(e) =>
              setNewUser({ ...newUser, full_name: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateUser} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default UserManagement; 