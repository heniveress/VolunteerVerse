import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  TextField,
} from '@mui/material';
import React, { useEffect } from 'react';
import { TaskPreview } from '../../models/task';

interface TaskData {
  taskId: number;
  participated: boolean;
  hours: number | null;
}

interface VolunteerTaskLogTableProps {
  participatedTasks: TaskPreview[] | undefined;
  tasksData: TaskData[];
  setTasksData: React.Dispatch<React.SetStateAction<TaskData[]>>;
}

function VolunteerTaskLogTable({
  participatedTasks,
  tasksData,
  setTasksData,
}: VolunteerTaskLogTableProps) {
  useEffect(() => {
    if (participatedTasks) {
      const initialTasksData: TaskData[] = participatedTasks.map((task) => ({
        taskId: task.id,
        participated: false,
        hours: null,
      }));
      setTasksData(initialTasksData);
    }
  }, [participatedTasks, setTasksData]);

  const handleHoursChange = (taskId: number, hours: number | null) => {
    setTasksData((prevTasksData) =>
      prevTasksData.map((task) =>
        task.taskId === taskId ? { ...task, hours } : task,
      ),
    );
  };

  const handleCheckboxChange = (taskId: number, checked: boolean) => {
    setTasksData((prevTasksData) =>
      prevTasksData.map((task) =>
        task.taskId === taskId ? { ...task, participated: checked } : task,
      ),
    );
    if (!checked) {
      handleHoursChange(taskId, null);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Task name</b>
            </TableCell>
            <TableCell align="right">
              <b>Participated</b>
            </TableCell>
            <TableCell align="right">
              <b>Hours</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {participatedTasks?.map((task: TaskPreview) => (
            <TableRow key={task.id}>
              <TableCell>{task.name}</TableCell>
              <TableCell align="right">
                <Checkbox
                  name="participated"
                  size="small"
                  checked={
                    tasksData.find((data) => data.taskId === task.id)
                      ?.participated || false
                  }
                  onChange={(e) =>
                    handleCheckboxChange(task.id, e.target.checked)
                  }
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  type="number"
                  name="hours"
                  value={
                    tasksData.find((data) => data.taskId === task.id)?.hours ??
                    ''
                  }
                  onChange={(e) =>
                    handleHoursChange(
                      task.id,
                      e.target.value !== ''
                        ? parseInt(e.target.value, 10)
                        : null,
                    )
                  }
                  disabled={
                    !tasksData.find((data) => data.taskId === task.id)
                      ?.participated
                  }
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                  sx={{ width: '80px' }}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default VolunteerTaskLogTable;
