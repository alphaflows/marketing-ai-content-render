import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ContentCopy as ContentCopyIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import api from '../services/api';

function Dashboard() {
  const [contents, setContents] = useState([]);
  const [error, setError] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

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

  const handleViewContent = (content) => {
    setSelectedContent(content);
    setOpenDialog(true);
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
                      <Typography component="span" variant="body2" color="text.secondary" display="block">
                        Type: {content.content_type}
                      </Typography>
                      <Typography component="span" variant="body2" color="text.secondary" display="block">
                        Purpose: {content.purpose}
                      </Typography>
                      <Typography component="span" variant="body2" color="text.secondary" display="block">
                        Created: {new Date(content.created_at).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="view"
                    onClick={() => handleViewContent(content)}
                    sx={{ mr: 1 }}
                  >
                    <VisibilityIcon />
                  </IconButton>
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

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedContent && (
          <>
            <DialogTitle>
              {selectedContent.title}
              <Typography variant="subtitle2" color="text.secondary">
                {selectedContent.content_type} - {selectedContent.purpose}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ 
                '& img': { maxWidth: '100%' },
                '& pre': { 
                  backgroundColor: '#f5f5f5',
                  padding: '1rem',
                  borderRadius: '4px',
                  overflowX: 'auto'
                },
                '& code': {
                  backgroundColor: '#f5f5f5',
                  padding: '0.2rem 0.4rem',
                  borderRadius: '4px',
                  fontSize: '0.9em'
                }
              }}>
                <ReactMarkdown>{selectedContent.content}</ReactMarkdown>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
              <Button
                onClick={() => {
                  handleCopy(selectedContent);
                  setOpenDialog(false);
                }}
                startIcon={<ContentCopyIcon />}
              >
                Copy Content
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
}

export default Dashboard; 