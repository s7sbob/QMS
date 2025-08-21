import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';

import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import ParentCard from 'src/components/shared/ParentCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Contact List of Suppliers QA Heads',
  },
];

interface ContactEntry {
  id: string;
  supplierName: string;
  qaHeadName: string;
  emailAddress: string;
  contactNumber: string;
}

interface ContactListData {
  contacts: ContactEntry[];
}

const ContactList: React.FC = () => {
  const [formData, setFormData] = useState<ContactListData>({
    contacts: [
      {
        id: '1',
        supplierName: '',
        qaHeadName: '',
        emailAddress: '',
        contactNumber: '',
      }
    ],
  });

  const handleContactChange = (id: string, field: keyof ContactEntry, value: string) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.map(contact =>
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    }));
  };

  const addContact = () => {
    const newId = (formData.contacts.length + 1).toString();
    const newContact: ContactEntry = {
      id: newId,
      supplierName: '',
      qaHeadName: '',
      emailAddress: '',
      contactNumber: '',
    };
    
    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, newContact]
    }));
  };

  const removeContact = (id: string) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.filter(contact => contact.id !== id)
    }));
  };

  const handleSubmit = () => {
    console.log('Contact List Data:', formData);
    // Here you would typically send the data to your backend
  };

  return (
    <PageContainer title="Contact List of Suppliers QA Heads" description="Healthcare Division Contact List of Suppliers QA Heads">
      <Breadcrumb title="Contact List of Suppliers QA Heads" items={BCrumb} />
      
      <ParentCard title="Healthcare Division - Contact List of Suppliers' QA Heads">
        <Box component="form" sx={{ mt: 2 }}>
          
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'primary.main' }}>
                  Supplier QA Contacts
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addContact}
                  size="small"
                >
                  Add Contact
                </Button>
              </Box>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ minWidth: 200 }}>Supplier</TableCell>
                      <TableCell sx={{ minWidth: 200 }}>QA Head Name</TableCell>
                      <TableCell sx={{ minWidth: 250 }}>E-mail Address</TableCell>
                      <TableCell sx={{ minWidth: 150 }}>Contact #</TableCell>
                      <TableCell sx={{ minWidth: 80 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.contacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            value={contact.supplierName}
                            onChange={(e: { target: { value: string; }; }) => handleContactChange(contact.id, 'supplierName', e.target.value)}
                            placeholder="Enter supplier name"
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            value={contact.qaHeadName}
                            onChange={(e: { target: { value: string; }; }) => handleContactChange(contact.id, 'qaHeadName', e.target.value)}
                            placeholder="Enter QA head name"
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            type="email"
                            value={contact.emailAddress}
                            onChange={(e: { target: { value: string; }; }) => handleContactChange(contact.id, 'emailAddress', e.target.value)}
                            placeholder="Enter email address"
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            size="small"
                            value={contact.contactNumber}
                            onChange={(e: { target: { value: string; }; }) => handleContactChange(contact.id, 'contactNumber', e.target.value)}
                            placeholder="Enter contact number"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="error"
                            onClick={() => removeContact(contact.id)}
                            disabled={formData.contacts.length === 1}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSubmit}
            >
              Save Contact List
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              onClick={() => setFormData({
                contacts: [
                  {
                    id: '1',
                    supplierName: '',
                    qaHeadName: '',
                    emailAddress: '',
                    contactNumber: '',
                  }
                ],
              })}
            >
              Reset List
            </Button>
          </Stack>

        </Box>
      </ParentCard>
    </PageContainer>
  );
};

export default ContactList;

