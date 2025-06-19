import {
  Box,
  Dialog,
  DialogTitle,
  Grid,
  TextField,
  DialogActions,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import EditIcon from '@mui/icons-material/Edit';
import React, { useState } from 'react';
import { ErrorResponse } from '../../models/error';
import { editTaskPatch } from '../../service/api/task';
import { Task, TaskUpdate } from '../../models/task';
import { Skill } from '../../models/skill';
import SkillSelect from '../Skill/SkillSelect';

interface EditTaskModalProps {
  task: Task;
  skills: Skill[] | undefined;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutate: () => Promise<void>;
}

function EditTaskModal({
  task,
  skills,
  isOpen,
  setIsOpen,
  mutate,
}: EditTaskModalProps) {
  const [error, setError] = useState('');

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    capacity: Yup.number()
      .min(0, 'Capacity cannot be negative')
      .required('Capacity is required'),
  });

  const initialValues = {
    name: task.name,
    description: task?.description,
    capacity: task.capacity,
    needApproval: task.needApproval,
    requiredSkills: task.skills.map((skill: Skill) => skill.id),
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Dialog
        open={isOpen}
        onClose={() => {
          setError('');
          setIsOpen(false);
        }}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={(values, { setSubmitting }) => {
            const taskFieldsChanged =
              values.name !== initialValues.name ||
              values.description !== initialValues.description ||
              values.capacity !== initialValues.capacity ||
              values.needApproval !== initialValues.needApproval ||
              values.requiredSkills !== initialValues.requiredSkills;

            if (taskFieldsChanged) {
              const taskUpdate: TaskUpdate = {
                name: values.name,
                description: values.description,
                capacity: values.capacity,
                needApproval: values.needApproval,
              };

              const requiredSkillIds: number[] = values.requiredSkills;

              editTaskPatch(task.id, {
                taskUpdate,
                requiredSkillIds,
              })
                .then(() => {
                  void mutate();
                  setIsOpen(false);
                })
                .catch((err) => {
                  err.json().then((errorResponse: ErrorResponse) => {
                    alert(errorResponse.errors[0]);
                  });
                });
            }

            setSubmitting(false);
          }}
          validationSchema={validationSchema}
        >
          {({ values, dirty, errors, touched, setFieldValue }) => (
            <Form>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: '15px',
                }}
              >
                <EditIcon fontSize="large" />
                <DialogTitle variant="h5">Edit task</DialogTitle>
              </Box>
              <Grid
                container
                spacing={2}
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Grid item xs={10}>
                  <Field
                    as={TextField}
                    id="name"
                    name="name"
                    label="Name"
                    inputProps={{ maxLength: 100 }}
                    fullWidth
                    required
                    error={errors.name && touched.name}
                    helperText={errors.name}
                  />
                </Grid>
                <Grid item xs={10}>
                  <Field
                    as={TextField}
                    id="description"
                    name="description"
                    label="Description"
                    inputProps={{ maxLength: 1000 }}
                    fullWidth
                    multiline
                    minRows={3}
                    maxRows={8}
                  />
                </Grid>
                <Grid item xs={5}>
                  <Field
                    as={TextField}
                    id="capacity"
                    name="capacity"
                    label="Capacity"
                    size="medium"
                    type="number"
                    number
                    fullWidth
                    inputProps={{ maxLength: 9 }}
                    error={errors.capacity}
                    helperText={errors.capacity}
                  />
                </Grid>
                <Grid item xs={5}>
                  <Field
                    type="checkbox"
                    name="needApproval"
                    as={FormControlLabel}
                    control={<Checkbox />}
                    label="Need Approval"
                  />
                </Grid>
                <Grid item xs={10}>
                  <SkillSelect
                    skills={skills || []}
                    selectedSkills={values.requiredSkills}
                    setSelectedSkills={(selectedSkills) => {
                      void setFieldValue('requiredSkills', selectedSkills);
                    }}
                  />
                </Grid>
                <Grid item xs={10}>
                  {error && (
                    <Typography color="error" variant="body2" align="center">
                      {error}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={10}>
                  <DialogActions
                    sx={{
                      mt: '15px',
                      mb: '20px',
                      p: '0px',
                      justifyContent: {
                        xs: 'center',
                        md: 'flex-end',
                      },
                    }}
                  >
                    <Button
                      variant="outlined"
                      type="reset"
                      onClick={() => {
                        setIsOpen(false);
                        setError('');
                      }}
                    >
                      <Typography>Cancel</Typography>
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={
                        !dirty ||
                        Object.values(errors).some((x) => x.length !== 0)
                      }
                    >
                      <Typography>Save</Typography>
                    </Button>
                  </DialogActions>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Box>
  );
}

export default EditTaskModal;
