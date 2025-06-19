/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ApprovalIcon from '@mui/icons-material/OfflinePinOutlined';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AlertColor, Box, Button, Grid, Stack, Tooltip } from '@mui/material';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import FilledIcon from '@mui/icons-material/PeopleAltOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { Task } from '../../models/task';
import SkillChip from '../Skill/SkillChip';
import {
  applyEventTaskPost,
  resignEventTaskDelete,
} from '../../service/api/volunteer';
import EditTaskModal from './EditTaskModal';
import { Skill } from '../../models/skill';
import DeleteTaskConfirmationModal from './DeleteTaskConfirmationModal';
import LeaveTaskConfirmationModal from './LeaveTaskConfirmationModal';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface TaskCardProps {
  task: Task;
  skills: Skill[] | undefined;
  eventId: number;
  hasEnded: boolean;
  canEdit: boolean;
  isUser: boolean;
  mutate: () => Promise<void>;
  setSnackOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertType: React.Dispatch<React.SetStateAction<AlertColor>>;
  setSnackText: React.Dispatch<React.SetStateAction<string>>;
}

function TaskCard({
  task,
  skills,
  eventId,
  hasEnded,
  canEdit,
  isUser,
  mutate,
  setSnackOpen,
  setAlertType,
  setSnackText,
}: TaskCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = React.useState(false);

  const navigate = useNavigate();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      sx={{
        backdropFilter: 'blur(100px)',
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
        borderRadius: '15px',
        mb: '20px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          justifyContent: 'space-between',
          alignItems: 'center',
          ml: '15px',
          mr: '15px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AssignmentOutlinedIcon fontSize="large" />
          <CardHeader title={task.name} />
        </Box>

        {!hasEnded && (
          <Box>
            <Button
              variant={task.isApplied ? 'outlined' : 'contained'}
              sx={{ ml: '5px', mb: '5px' }}
              onClick={() => {
                if (!isUser) {
                  navigate('/login');
                } else if (!task.isApplied) {
                  applyEventTaskPost(eventId, task.id)
                    .then(() => {
                      if (!task.needApproval) {
                        setAlertType('success');
                        setSnackText(
                          'Successfully applied for this task, you are a member now!',
                        );
                      } else if (task.needApproval && !task.isApproved) {
                        setAlertType('info');
                        setSnackText(
                          'Successfully applied for this task, waiting for approval!',
                        );
                      }
                      setSnackOpen(true);
                      void mutate();
                    })
                    .catch(() => {
                      setAlertType('error');
                      setSnackText('Failed to apply for this task!');
                      setSnackOpen(true);
                    });
                } else if (task.isApplied) {
                  if (task.needApproval && task.isApproved) {
                    setIsLeaveOpen(true);
                  } else {
                    resignEventTaskDelete(eventId, task.id)
                      .then(() => {
                        setAlertType('info');
                        if (task.needApproval && !task.isApproved) {
                          setSnackText(
                            'Successfully revoked apply from this task!',
                          );
                        } else if (!task.needApproval && task.isApproved) {
                          setSnackText('Successfully resigned from this task!');
                        }
                        setSnackOpen(true);
                        void mutate();
                      })
                      .catch(() => {
                        setAlertType('error');
                        if (task.needApproval && !task.isApproved) {
                          setSnackText(
                            'Failed to revoke apply from this task!',
                          );
                        } else if (!task.needApproval && task.isApproved) {
                          setSnackText('Failed to resign from this task!');
                        }
                        setSnackOpen(true);
                      });
                  }
                }
              }}
            >
              <Typography>
                {!task.isApplied
                  ? 'Apply'
                  : task.isApplied && !task.needApproval
                  ? 'Resign'
                  : task.isApplied && task.needApproval && !task.isApproved
                  ? 'Revoke'
                  : task.isApplied && task.needApproval && task.isApproved
                  ? 'Resign'
                  : ''}
              </Typography>
            </Button>
            <LeaveTaskConfirmationModal
              eventId={eventId}
              taskId={task.id}
              isOpen={isLeaveOpen}
              setIsOpen={setIsLeaveOpen}
              mutate={mutate}
              setSnackOpen={setSnackOpen}
              setAlertType={setAlertType}
              setSnackText={setSnackText}
            />
          </Box>
        )}
      </Box>

      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'center',
        }}
      >
        {task.needApproval && (
          <Stack direction="row" gap={1} sx={{ pb: '15px' }}>
            <ApprovalIcon />
            <Typography>
              <b>Approval needed</b>
            </Typography>
          </Stack>
        )}

        <Stack direction="row" gap={1}>
          <FilledIcon />
          <Typography>
            Filled: {task.taken}/{task.capacity}
          </Typography>
        </Stack>
      </CardContent>
      <CardActions disableSpacing>
        {canEdit && !hasEnded && (
          <Box>
            <Tooltip title="Edit">
              <IconButton size="small">
                <EditIcon
                  fontSize="small"
                  onClick={() => setIsEditModalOpen(true)}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" onClick={() => setIsDeleteOpen(true)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        <EditTaskModal
          task={task}
          skills={skills}
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
          mutate={mutate}
        />

        <DeleteTaskConfirmationModal
          taskId={task.id}
          mutate={mutate}
          setSnackOpen={setSnackOpen}
          setAlertType={setAlertType}
          setSnackText={setSnackText}
          isOpen={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
        />

        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>
            <b>Description:</b>
          </Typography>
          <Typography paragraph>{task.description}</Typography>
          {task.skills?.length > 0 && (
            <Typography paragraph>
              <b>Required skills:</b>
            </Typography>
          )}
          <Grid container spacing={1}>
            {task?.skills.map((skill) => (
              <Grid item key={skill.id}>
                <SkillChip key={skill.id} skill={skill} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default TaskCard;
