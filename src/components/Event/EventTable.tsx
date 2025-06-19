/* eslint-disable @typescript-eslint/no-unsafe-argument */
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import { EventPreview } from '../../models/event';
import { ErrorResponse } from '../../models/error';
import { deleteEvent } from '../../service/api/event';
import { isMinOrgAdmin, isMinOrgMember } from '../../utils/roles';

interface EventCardProps {
  events: EventPreview[] | undefined;
  currentUserRole: number | undefined;
  mutate: () => Promise<void>;
}

function EventTable({ events, currentUserRole, mutate }: EventCardProps) {
  const rows = events?.map((event, index) => ({ ...event, index })) || [];

  const showDeleteColumn = isMinOrgAdmin(currentUserRole);

  const handleDelete = (eventId: number) => {
    deleteEvent(eventId)
      .then(() => {
        void mutate();
      })
      .catch((err) => {
        err.json().then((errorResponse: ErrorResponse) => {
          alert(errorResponse.errors[0]);
        });
      });
  };

  const columns: GridColDef[] = [
    {
      field: 'startTime',
      headerName: 'Start time',
      type: 'date',
      width: 120,
      editable: false,
      valueGetter: (params) => {
        const dateString = params.value as string;
        return new Date(dateString);
      },
      renderHeader: (params) => (
        <Typography>
          <b>{params.colDef.headerName}</b>
        </Typography>
      ),
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 240,
      editable: false,
      renderCell: (params) => (
        <Link
          to={`/events/${params.id || ''}/details`}
          style={{
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          {params.row.name}
        </Link>
      ),
      renderHeader: (params) => (
        <Typography>
          <b>{params.colDef.headerName}</b>
        </Typography>
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 400,
      editable: false,
      renderHeader: (params) => (
        <Typography>
          <b>{params.colDef.headerName}</b>
        </Typography>
      ),
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 250,
      editable: false,
      renderHeader: (params) => (
        <Typography>
          <b>{params.colDef.headerName}</b>
        </Typography>
      ),
    },
  ];

  if (isMinOrgMember(currentUserRole)) {
    columns.push({
      field: 'delete',
      headerName: 'Delete',
      width: 100,
      align: 'center',
      renderCell: (params) => (
        <IconButton
          onClick={() => handleDelete(params.row.id)}
          disabled={!showDeleteColumn}
        >
          <DeleteIcon />
        </IconButton>
      ),
      renderHeader: (params) => (
        <Typography>
          <b>{params.colDef.headerName}</b>
        </Typography>
      ),
    });
  }

  return (
    <Box
      sx={{
        height: 300,
        width: '100%',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}

export default EventTable;
