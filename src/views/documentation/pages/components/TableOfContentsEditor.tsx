// src/components/TableOfContentsEditor.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Checkbox,
} from '@mui/material';
import { IconPlus, IconTrash, IconArrowUp, IconArrowDown } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

// Define the structure for table of contents entries
export interface TableOfContentsEntry {
  serial: string;
  contentEn: string;
  contentAr: string;
  pageNumber: number;
  isSubItem?: boolean;
}

interface TableOfContentsEditorProps {
  value: TableOfContentsEntry[];
  onChange: (entries: TableOfContentsEntry[]) => void;
  language?: 'ar' | 'en';
}

const TableOfContentsEditor: React.FC<TableOfContentsEditorProps> = ({
  value,
  onChange,
  language = 'en',
}) => {
  const { i18n } = useTranslation();
  const isArabic = language === 'ar' || i18n.language === 'ar';

  const [entries, setEntries] = useState<TableOfContentsEntry[]>(value || []);

  useEffect(() => {
    setEntries(value || []);
  }, [value]);

  const handleAddEntry = () => {
    const nextSerial = entries.filter(e => !e.isSubItem).length + 1;
    const newEntry: TableOfContentsEntry = {
      serial: nextSerial.toString(),
      contentEn: '',
      contentAr: '',
      pageNumber: 1,
      isSubItem: false,
    };
    const newEntries = [...entries, newEntry];
    setEntries(newEntries);
    onChange(newEntries);
  };

  const handleAddSubItem = (parentIndex: number) => {
    const newEntry: TableOfContentsEntry = {
      serial: '-',
      contentEn: '',
      contentAr: '',
      pageNumber: 1,
      isSubItem: true,
    };
    const newEntries = [...entries];
    newEntries.splice(parentIndex + 1, 0, newEntry);
    setEntries(newEntries);
    onChange(newEntries);
  };

  const handleRemoveEntry = (index: number) => {
    const newEntries = entries.filter((_, i) => i !== index);
    // Recalculate serial numbers for non-sub-items
    let serial = 1;
    newEntries.forEach(entry => {
      if (!entry.isSubItem) {
        entry.serial = serial.toString();
        serial++;
      }
    });
    setEntries(newEntries);
    onChange(newEntries);
  };

  const handleEntryChange = (index: number, field: keyof TableOfContentsEntry, value: string | number | boolean) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [field]: value };

    // If changing isSubItem, update serial
    if (field === 'isSubItem') {
      if (value) {
        newEntries[index].serial = '-';
      } else {
        // Recalculate serial numbers
        let serial = 1;
        newEntries.forEach(entry => {
          if (!entry.isSubItem) {
            entry.serial = serial.toString();
            serial++;
          }
        });
      }
    }

    setEntries(newEntries);
    onChange(newEntries);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newEntries = [...entries];
    [newEntries[index - 1], newEntries[index]] = [newEntries[index], newEntries[index - 1]];
    // Recalculate serial numbers
    let serial = 1;
    newEntries.forEach(entry => {
      if (!entry.isSubItem) {
        entry.serial = serial.toString();
        serial++;
      }
    });
    setEntries(newEntries);
    onChange(newEntries);
  };

  const handleMoveDown = (index: number) => {
    if (index === entries.length - 1) return;
    const newEntries = [...entries];
    [newEntries[index], newEntries[index + 1]] = [newEntries[index + 1], newEntries[index]];
    // Recalculate serial numbers
    let serial = 1;
    newEntries.forEach(entry => {
      if (!entry.isSubItem) {
        entry.serial = serial.toString();
        serial++;
      }
    });
    setEntries(newEntries);
    onChange(newEntries);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          {isArabic ? 'قائمة المحتويات' : 'Table of Contents'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<IconPlus size={18} />}
          onClick={handleAddEntry}
          size="small"
        >
          {isArabic ? 'إضافة عنصر' : 'Add Entry'}
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', width: '5%' }}>#</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>Content (EN)</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '25%', direction: 'rtl' }}>المحتوى (AR)</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Page</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Sub-item</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow key={index} sx={{ backgroundColor: entry.isSubItem ? '#f5f5f5' : 'inherit' }}>
                <TableCell>
                  {entry.isSubItem ? '-' : entry.serial}
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    fullWidth
                    value={entry.contentEn}
                    onChange={(e) => handleEntryChange(index, 'contentEn', e.target.value)}
                    placeholder="Content in English"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    fullWidth
                    value={entry.contentAr}
                    onChange={(e) => handleEntryChange(index, 'contentAr', e.target.value)}
                    placeholder="المحتوى بالعربية"
                    inputProps={{ dir: 'rtl' }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={entry.pageNumber}
                    onChange={(e) => handleEntryChange(index, 'pageNumber', parseInt(e.target.value) || 1)}
                    inputProps={{ min: 1 }}
                    sx={{ width: 70 }}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={entry.isSubItem || false}
                    onChange={(e) => handleEntryChange(index, 'isSubItem', e.target.checked)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" onClick={() => handleMoveUp(index)} disabled={index === 0}>
                      <IconArrowUp size={16} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleMoveDown(index)} disabled={index === entries.length - 1}>
                      <IconArrowDown size={16} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleAddSubItem(index)} title="Add sub-item">
                      <IconPlus size={16} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleRemoveEntry(index)} color="error">
                      <IconTrash size={16} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {entries.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    {isArabic ? 'لا توجد عناصر. انقر على "إضافة عنصر" لإضافة محتوى.' : 'No entries. Click "Add Entry" to add content.'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TableOfContentsEditor;
