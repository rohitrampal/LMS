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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useStore } from '@/store/useStore';
import { generateId, formatCurrency } from '@/utils/helpers';

export default function LoanProductsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { loanProducts, loanCategories, currentUser, addLoanProduct, updateLoanProduct, deleteLoanProduct } = useStore();
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    productCode: '',
    name: '',
    interestRate: 0,
    loanCategoryId: '',
    minAmount: 0,
    maxAmount: 0,
    tenureMonths: 0,
  });
  const [error, setError] = useState('');

  const filteredProducts = useMemo(() => {
    if (currentUser?.role === 'bank' || currentUser?.role === 'bank_employee') {
      return loanProducts.filter(
        (prod) => !prod.bankId || prod.bankId === currentUser.bankId
      );
    }
    return loanProducts;
  }, [loanProducts, currentUser]);

  const availableCategories = useMemo(() => {
    if (currentUser?.role === 'bank' || currentUser?.role === 'bank_employee') {
      return loanCategories.filter(
        (cat) => !cat.bankId || cat.bankId === currentUser.bankId
      );
    }
    return loanCategories;
  }, [loanCategories, currentUser]);

  const canEdit = currentUser?.role !== 'regulator';

  const handleOpen = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        productCode: product.productCode,
        name: product.name,
        interestRate: product.interestRate,
        loanCategoryId: product.loanCategoryId,
        minAmount: product.minAmount,
        maxAmount: product.maxAmount,
        tenureMonths: product.tenureMonths,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        productCode: generateId().substring(0, 8).toUpperCase(),
        name: '',
        interestRate: 0,
        loanCategoryId: '',
        minAmount: 0,
        maxAmount: 0,
        tenureMonths: 0,
      });
    }
    setError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProduct(null);
    setError('');
  };

  const handleSubmit = () => {
    if (!formData.productCode || !formData.name || !formData.loanCategoryId) {
      setError('Please fill in all required fields');
      return;
    }

    const category = loanCategories.find((cat) => cat.id === formData.loanCategoryId);

    if (editingProduct) {
      updateLoanProduct(editingProduct.id, {
        ...formData,
        loanCategoryName: category?.name || '',
      });
    } else {
      addLoanProduct({
        id: generateId(),
        ...formData,
        loanCategoryName: category?.name || '',
        bankId: currentUser?.role === 'bank' || currentUser?.role === 'bank_employee' 
          ? currentUser.bankId 
          : undefined,
        createdAt: new Date().toISOString(),
      });
    }

    handleClose();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteLoanProduct(id);
    }
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 },
        mb: { xs: 2, sm: 3 } 
      }}>
        <Typography 
          variant="h4" 
          fontWeight="bold"
          sx={{ 
            fontSize: { xs: '1.5rem', sm: '2rem' },
          }}
        >
          Loan Products
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
            size={isMobile ? 'small' : 'medium'}
            sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { xs: 'auto', sm: 140 } }}
          >
            Add Product
          </Button>
        )}
      </Box>

      <TableContainer 
        component={Paper}
        sx={{ 
          overflowX: 'auto',
          width: '100%',
          '& .MuiTable-root': {
            minWidth: 800,
          },
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0,0,0,0.1)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: 4,
          },
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Interest Rate (%)</TableCell>
              <TableCell>Min Amount</TableCell>
              <TableCell>Max Amount</TableCell>
              <TableCell>Tenure (Months)</TableCell>
              {canEdit && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.productCode}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.loanCategoryName}</TableCell>
                <TableCell>{product.interestRate}%</TableCell>
                <TableCell>{formatCurrency(product.minAmount)}</TableCell>
                <TableCell>{formatCurrency(product.maxAmount)}</TableCell>
                <TableCell>{product.tenureMonths}</TableCell>
                {canEdit && (
                  <TableCell>
                    <IconButton onClick={() => handleOpen(product)} size="small">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(product.id)} size="small" color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
        sx={{
          '& .MuiDialog-paper': {
            m: { xs: 0, sm: 2 },
            maxHeight: { xs: '100%', sm: '90vh' },
          },
        }}
      >
        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Product Code"
            value={formData.productCode}
            onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Loan Category</InputLabel>
            <Select
              value={formData.loanCategoryId}
              label="Loan Category"
              onChange={(e) => setFormData({ ...formData, loanCategoryId: e.target.value })}
            >
              {availableCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Interest Rate (%)"
            type="number"
            value={formData.interestRate}
            onChange={(e) => setFormData({ ...formData, interestRate: parseFloat(e.target.value) || 0 })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Minimum Amount"
            type="number"
            value={formData.minAmount}
            onChange={(e) => setFormData({ ...formData, minAmount: parseFloat(e.target.value) || 0 })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Maximum Amount"
            type="number"
            value={formData.maxAmount}
            onChange={(e) => setFormData({ ...formData, maxAmount: parseFloat(e.target.value) || 0 })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Tenure (Months)"
            type="number"
            value={formData.tenureMonths}
            onChange={(e) => setFormData({ ...formData, tenureMonths: parseInt(e.target.value) || 0 })}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingProduct ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


