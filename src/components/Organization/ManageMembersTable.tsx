/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  AlertColor,
  Avatar,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { OrganizationMember } from '../../models/organization';
import { monogram } from '../../utils/helpers';
import { OrgRoles, getRoleName, isOrgAdmin, isOwner } from '../../utils/roles';
import {
  changeOrgRolePatch,
  removeVolunteerFromOrgDelete,
} from '../../service/api/organization';
import { ErrorResponse } from '../../models/error';
import { NotificationMessage } from '../../models/notification';
import {
  promotionNotification,
  removalNotification,
} from '../../utils/notificationMessages';
import { sendNotificationMessagePost } from '../../service/api/notification';

interface ManageMembersTableProps {
  orgId: number;
  orgName: string | undefined;
  currentUserRole: number | undefined;
  organizationMembers: OrganizationMember[] | undefined;
  mutate: () => Promise<void>;
  mutateNumOfNotifications: () => Promise<void>;
  setSnackOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertType: React.Dispatch<React.SetStateAction<AlertColor>>;
  setSnackText: React.Dispatch<React.SetStateAction<string>>;
}

function ManageMembersTable({
  orgId,
  orgName,
  currentUserRole,
  organizationMembers,
  mutate,
  mutateNumOfNotifications,
  setSnackOpen,
  setAlertType,
  setSnackText,
}: ManageMembersTableProps) {
  const roleOptions = [
    { value: OrgRoles.OrganizationMember, label: 'Member' },
    { value: OrgRoles.OrganizationAdmin, label: 'Org. Admin' },
    { value: OrgRoles.OrganizationOwner, label: 'Owner' },
  ];
  const handleRemoveMember = (volunteerId: number) => {
    const notificationMessage: NotificationMessage = {
      volunteerId,
      message: removalNotification(orgName || ''),
    };

    removeVolunteerFromOrgDelete(orgId, volunteerId)
      .then(() => {
        setAlertType('success');
        setSnackText('Successfully removed this member!');
        setSnackOpen(true);
        sendNotificationMessagePost(notificationMessage)
          .then(() => {
            void mutateNumOfNotifications();
          })
          .catch(() => {});
        void mutate();
      })
      .catch((err) => {
        err.json().then((errorResponse: ErrorResponse) => {
          const errorMessage = errorResponse.errors[0];
          setAlertType('error');
          setSnackText(`Failed, ${errorMessage}.`);
          setSnackOpen(true);
        });
      });
  };

  const handleRoleChange = (
    volunteerId: number,
    role: number,
    roleName: string,
  ) => {
    const notificationMessage: NotificationMessage = {
      volunteerId,
      message: promotionNotification(orgName || '', roleName),
    };
    changeOrgRolePatch(orgId, volunteerId, role)
      .then(() => {
        sendNotificationMessagePost(notificationMessage)
          .then(() => {
            void mutateNumOfNotifications();
          })
          .catch(() => {});
        void mutate();
      })
      .catch((err) => {
        err.json().then((errorResponse: ErrorResponse) => {
          alert(errorResponse.errors[0]);
        });
      });
  };

  const rows =
    organizationMembers?.map((organizationMember, index) => {
      const roleName = getRoleName(organizationMember.role);

      return {
        ...organizationMember,
        id: index,
        orgId,
        roleName,
      };
    }) || [];

  const columns: GridColDef[] = [
    {
      field: 'avatar',
      width: 70,
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
      width: 150,
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
      width: 150,
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
      width: 250,
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
      width: 150,
      editable: false,
      renderHeader: (params) => (
        <Typography>
          <b>{params.colDef.headerName}</b>
        </Typography>
      ),
    },
    {
      field: 'roleDropdown',
      headerName: 'Role',
      width: 200,
      renderCell: (params) => (
        <Select
          defaultValue={params.row.role}
          fullWidth
          value={params.row.role}
          onChange={(event) =>
            handleRoleChange(
              params.row.volunteerId,
              event.target.value,
              params.row.roleName,
            )
          }
          disabled={
            isOwner(params.row.role) ||
            (isOrgAdmin(params.row.role) &&
              currentUserRole !== OrgRoles.OrganizationOwner)
          }
        >
          {roleOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      ),
      renderHeader: (params) => (
        <Typography>
          <b>{params.colDef.headerName}</b>
        </Typography>
      ),
    },
    {
      field: 'remove',
      headerName: 'Remove',
      align: 'center',
      width: 100,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleRemoveMember(params.row.volunteerId)}
          disabled={
            isOwner(params.row.role) ||
            (isOrgAdmin(params.row.role) &&
              currentUserRole !== OrgRoles.OrganizationOwner)
          }
        >
          <ClearIcon />
        </IconButton>
      ),
      renderHeader: (params) => (
        <Typography>
          <b>{params.colDef.headerName}</b>
        </Typography>
      ),
    },
  ];

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

export default ManageMembersTable;
