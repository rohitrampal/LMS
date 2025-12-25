'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useStore } from '@/store/useStore';
import { generateId } from '@/utils/helpers';

export default function LoanCategoriesPage() {
  const { loanCategories, currentUser, addLoanCategory, updateLoanCategory, deleteLoanCategory } = useStore();
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [error, setError] = useState('');

  const filteredCategories = useMemo(() => {
    if (currentUser?.role === 'regulator') {
      return loanCategories;
    }
    if (currentUser?.role === 'bank' || currentUser?.role === 'bank_employee') {
      return loanCategories.filter(
        (cat) => !cat.bankId || cat.bankId === currentUser.bankId
      );
    }
    return loanCategories;
  }, [loanCategories, currentUser]);

  const canEdit = currentUser?.role !== 'regulator';

  const handleOpen = (category?: any) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
      });
    }
    setError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCategory(null);
    setError('');
  };

  const handleSubmit = () => {
    if (!formData.name) {
      setError('Please fill in the category name');
      return;
    }

    if (editingCategory) {
      updateLoanCategory(editingCategory.id, formData);
    } else {
      addLoanCategory({
        id: generateId(),
        ...formData,
        bankId: currentUser?.role === 'bank' || currentUser?.role === 'bank_employee' 
          ? currentUser.bankId 
          : undefined,
        createdAt: new Date().toISOString(),
      });
    }

    handleClose();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteLoanCategory(id);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Loan Categories
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
          >
            Add Category
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              {canEdit && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                {canEdit && (
                  <TableCell>
                    <IconButton onClick={() => handleOpen(category)} size="small">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(category.id)} size="small" color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Category Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCategory ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


