import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import api from '../services/api';

const CONTENT_TYPES = [
  'Blog Post',
  'Product Description',
  'Technical Article',
  'News Article',
  'Social Media Post',
];

const CONTENT_PURPOSES = [
  'Product Features',
  'Technical Sharing',
  'Event News',
  'Social Attraction',
  'Industry Trends',
  'Product Comparison',
  'Case Study',
  'Tutorial',
];

function ContentGenerator() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    content_type: '',
    purpose: '',
    reference_links: '',
    target_keywords: '',
    product_info: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        content_type: formData.content_type,
        purpose: formData.purpose,
        reference_links: formData.reference_links.split('\n').filter(Boolean),
        target_keywords: formData.target_keywords.split(',').map((k) => k.trim()),
        product_info: JSON.parse(formData.product_info),
      };

      await api.post('/api/v1/content/generate', data);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Generate Content
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Content Type</InputLabel>
            <Select
              name="content_type"
              value={formData.content_type}
              onChange={handleChange}
              required
            >
              {CONTENT_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Purpose</InputLabel>
            <Select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
            >
              {CONTENT_PURPOSES.map((purpose) => (
                <MenuItem key={purpose} value={purpose}>
                  {purpose}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Reference Links (one per line)"
            name="reference_links"
            multiline
            rows={4}
            value={formData.reference_links}
            onChange={handleChange}
            required
            helperText="Enter URLs of reference articles, one per line"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Target Keywords"
            name="target_keywords"
            value={formData.target_keywords}
            onChange={handleChange}
            required
            helperText="Enter keywords separated by commas"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Product Information (JSON)"
            name="product_info"
            multiline
            rows={4}
            value={formData.product_info}
            onChange={handleChange}
            required
            helperText="Enter product information in JSON format"
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Generate Content'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default ContentGenerator; 