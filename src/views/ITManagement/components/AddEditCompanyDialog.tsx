// src/views/ITManagement/components/AddEditCompanyDialog.tsx

import React, { FormEvent } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography, Checkbox, FormControlLabel
} from '@mui/material';
import { ICompany, SelectedItemType } from '../types';
import axiosServices from 'src/utils/axiosServices';

interface Props {
  open: boolean;
  onClose: () => void;
  fetchCompanies: () => void;
  companyData: Partial<ICompany>;
  setCompanyData: React.Dispatch<React.SetStateAction<Partial<ICompany>>>;
  selectedItem: ICompany | null | undefined;
  selectedType: SelectedItemType;
  companies: ICompany[];
  setCompanies: React.Dispatch<React.SetStateAction<ICompany[]>>;
}

const AddEditCompanyDialog: React.FC<Props> = ({
  open,
  onClose,
  fetchCompanies,
  companyData,
  setCompanyData,
}) => {
  const handleCommercialFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyData((prev) => ({
          ...prev,
          Commercial_Img_Url: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTaxFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyData((prev) => ({
          ...prev,
          TaxId_Img_Url: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCompany = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axiosServices.post('/api/companies/addEditCompany', {
        ...companyData,
        Is_Active: companyData.Is_Active ?? 1,
      });
      fetchCompanies();
      onClose();
    } catch (error) {
      console.error('Error saving company:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {companyData.Id ? 'Edit Company' : 'Add Company'}
      </DialogTitle>
      <form onSubmit={handleSaveCompany}>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            required
            value={companyData.Name || ''}
            onChange={(e) => setCompanyData({ ...companyData, Name: e.target.value })}
          />
          <TextField
            label="Address"
            fullWidth
            margin="normal"
            value={companyData.address || ''}
            onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
          />
          <TextField
            label="GPS Lat"
            fullWidth
            margin="normal"
            value={companyData.Gps_Lat || ''}
            onChange={(e) => setCompanyData({ ...companyData, Gps_Lat: e.target.value })}
          />
          <TextField
            label="GPS Long"
            fullWidth
            margin="normal"
            value={companyData.Gps_long || ''}
            onChange={(e) => setCompanyData({ ...companyData, Gps_long: e.target.value })}
          />
          <TextField
            label="Commercial Reg #"
            fullWidth
            margin="normal"
            value={companyData.Commercial_Reg_Number || ''}
            onChange={(e) => setCompanyData({ ...companyData, Commercial_Reg_Number: e.target.value })}
          />
          <TextField
            label="Tax ID #"
            fullWidth
            margin="normal"
            value={companyData.Tax_Id_Number || ''}
            onChange={(e) => setCompanyData({ ...companyData, Tax_Id_Number: e.target.value })}
          />

          {/* رفع صورة Commercial */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">Commercial Image (Upload)</Typography>
            <Button variant="outlined" component="label" sx={{ mt: 1 }}>
              Select File
              <input
                type="file"
                hidden
                onChange={handleCommercialFileChange}
              />
            </Button>
          </Box>

          {/* رفع صورة Tax */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">Tax Image (Upload)</Typography>
            <Button variant="outlined" component="label" sx={{ mt: 1 }}>
              Select File
              <input
                type="file"
                hidden
                onChange={handleTaxFileChange}
              />
            </Button>
          </Box>

          <TextField
            label="CEO ID"
            fullWidth
            margin="normal"
            value={companyData.Ceo_id || ''}
            onChange={(e) => setCompanyData({ ...companyData, Ceo_id: e.target.value })}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={(companyData.Is_Active ?? 1) === 1}
                onChange={(e) =>
                  setCompanyData({ ...companyData, Is_Active: e.target.checked ? 1 : 0 })
                }
              />
            }
            label="Active?"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddEditCompanyDialog;
