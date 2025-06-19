/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Avatar, Typography } from '@mui/material';
import { OrganizationMember } from '../../models/organization';
import { monogram } from '../../utils/helpers';
import { getRoleName } from '../../utils/roles';

interface OrganizationMembersProps {
  organizationMembers: OrganizationMember[] | undefined;
}

const columns: GridColDef[] = [
  {
    field: 'avatar',
    width: 80,
    renderCell: (params) => (
      <Avatar src={params.row.profilePicture}>
        {!params.row.imageUri &&
          monogram(params.row.firstName, params.row.lastName)}
      </Avatar>
    ),
    renderHeader: (params) => (
      <Typography>
        <b>{params.colDef.headerName}</b>
      </Typography>
    ),
  },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 170,
    editable: false,
    renderHeader: (params) => (
      <Typography>
        <b>{params.colDef.headerName}</b>
      </Typography>
    ),
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 170,
    editable: false,
    renderHeader: (params) => (
      <Typography>
        <b>{params.colDef.headerName}</b>
      </Typography>
    ),
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 280,
    editable: false,
    renderHeader: (params) => (
      <Typography>
        <b>{params.colDef.headerName}</b>
      </Typography>
    ),
  },
  {
    field: 'phone',
    headerName: 'Phone number',
    width: 190,
    editable: false,
    renderHeader: (params) => (
      <Typography>
        <b>{params.colDef.headerName}</b>
      </Typography>
    ),
  },
  {
    field: 'role',
    headerName: 'Role',
    width: 200,
    editable: false,
    renderHeader: (params) => (
      <Typography>
        <b>{params.colDef.headerName}</b>
      </Typography>
    ),
  },
];

function OrganizationMembersTable({
  organizationMembers,
}: OrganizationMembersProps) {
  const rows =
    organizationMembers?.map((organizationMember, index) => {
      const roleName = getRoleName(organizationMember.role);

      return {
        ...organizationMember,
        id: index,
        role: roleName,
      };
    }) || [];

  return (
    <Box
      sx={{
        height: 320,
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

export default OrganizationMembersTable;
