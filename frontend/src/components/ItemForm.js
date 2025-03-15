import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Box, Typography } from '@mui/material';

const ItemForm = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Fetch items from the backend
  useEffect(() => {
    axios.get('http://localhost:3000/items')
      .then(response => setItems(response.data))
      .catch(error => console.error(error));
  }, []);

  // Handle adding/updating items
  const handleSubmit = () => {
    const item = { name };
    
    if (editingId) {
      axios.put(`http://localhost:3000/items/${editingId}`, item)
        .then(() => window.location.reload());
    } else {
      axios.post('http://localhost:3000/items', item)
        .then(() => window.location.reload());
    }
  };

  // Handle deleting items
  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/items/${id}`)
      .then(() => window.location.reload());
  };

  // Handle editing items
  const handleEdit = (id, name) => {
    setEditingId(id);
    setName(name);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">Item Manager</Typography>
      
      <Box sx={{ my: 2, display: 'flex', gap: 2 }}>
        <TextField 
          label="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {editingId ? 'Update' : 'Add'}
        </Button>
      </Box>

      <Typography variant="h5">Items List:</Typography>
      {items.map((item) => (
        <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
          <Typography>{item.name}</Typography>
          <Button variant="outlined" color="secondary" onClick={() => handleEdit(item.id, item.name)}>Edit</Button>
          <Button variant="outlined" color="error" onClick={() => handleDelete(item.id)}>Delete</Button>
        </Box>
      ))}
    </Box>
  );
};

export default ItemForm;
