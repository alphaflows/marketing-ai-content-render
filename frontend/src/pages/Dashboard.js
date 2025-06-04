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
  Divider,
  Box,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';
import api from '../services/api';

function Dashboard() {
  const [contents, setContents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await api.get('/api/v1/content');
      setContents(response.data);
    } catch (error) {
      setError('Failed to fetch content history');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/v1/content/${id}`);
      setContents(contents.filter((content) => content.id !== id));
    } catch (error) {
      setError('Failed to delete content');
    }
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content.content);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Content History
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <Paper>
        <List>
          {contents.map((content, index) => (
            <React.Fragment key={content.id}>
              <ListItem>
                <ListItemText
                  primary={content.title}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Type: {content.content_type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Purpose: {content.purpose}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Created: {new Date(content.created_at).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="copy"
                    onClick={() => handleCopy(content)}
                    sx={{ mr: 1 }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(content.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              {index < contents.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default Dashboard; 