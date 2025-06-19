/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react/jsx-key */
/* eslint-disable no-param-reassign */
import React from 'react';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { Checkbox, InputLabel, MenuItem, Select } from '@mui/material';
import { Skill } from '../../models/skill';
import EditToolbar from './EditToolbar';

interface AddTasksTableProps {
  skills: Skill[];
  rows: readonly GridValidRowModel[];
  setRows: React.Dispatch<React.SetStateAction<readonly GridValidRowModel[]>>;
}

function AddTasksTable({ skills, rows, setRows }: AddTasksTableProps) {
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {},
  );

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow?.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      headerAlign: 'center',
      width: 120,
      editable: true,
    },
    {
      field: 'description',
      headerName: 'Description',
      type: 'string',
      width: 250,
      align: 'left',
      headerAlign: 'center',
      editable: true,
    },
    {
      field: 'capacity',
      headerName: 'Capacity',
      type: 'number',
      align: 'center',
      headerAlign: 'center',
      width: 80,
      editable: true,
    },
    {
      field: 'needApproval',
      headerName: 'Need Approval',
      type: 'boolean',
      align: 'center',
      headerAlign: 'center',
      width: 120,
      editable: true,
      renderCell: (params) => <Checkbox checked={params.value} />,
    },
    {
      field: 'requiredSkills',
      headerName: 'Required Skills',
      headerAlign: 'center',
      width: 200,
      renderCell: (params) => (
        <Select
          multiple
          fullWidth
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          value={params.value || []}
          onChange={(event) => {
            const requiredSkills = event.target.value as string[];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const updatedRow = { ...params.row, requiredSkills };
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            params.api.updateRows([updatedRow]);
          }}
          renderValue={(selected) => (
            <InputLabel>
              {(selected as number[])
                .map(
                  (skillId) =>
                    skills.find((skill) => skill.id === skillId)?.name,
                )
                .join(', ')}
            </InputLabel>
          )}
          MenuProps={{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
          }}
        >
          {skills.map((skill) => (
            <MenuItem key={skill.id} value={skill.id}>
              <Checkbox
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                checked={params.value?.includes(skill.id) || false}
                color="primary"
              />
              {skill.name}
            </MenuItem>
          ))}
        </Select>
      ),
    },

    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 80,
      cellClassName: 'actions',
      headerAlign: 'left',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 300,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        hideFooter
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { rows, setRows, setRowModesModel },
        }}
      />
    </Box>
  );
}

export default AddTasksTable;
