/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  Rating,
  TextField,
  Typography,
} from '@mui/material';
import { Form, Formik, Field } from 'formik';
import * as Yup from 'yup';
import AddReviewIcon from '@mui/icons-material/PostAdd';
import { ErrorResponse } from '../../models/error';
import { CreateReview } from '../../models/review';
import {
  createVolunteerLogPost,
  useFetchEventTasksForVolunteer,
} from '../../service/api/volunteer';
import VolunteerTaskLogTable from './VolunteerTaskLogTable';
import { VolunteerTask, VolunteerLog } from '../../models/volunteer';
import { NotificationMessage } from '../../models/notification';
import { sendNotificationMessagePost } from '../../service/api/notification';
import { createVolunteerReviewPost } from '../../service/api/review';
import { evaluationMessage } from '../../utils/notificationMessages';
import { monogram } from '../../utils/helpers';

interface ReviewFormVolunteerProps {
  volunteerId: number;
  firstName: string;
  lastName: string;
  profilePictureUri: string | undefined;
  eventId: number | undefined;
  eventName: string | undefined;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutatePendingReviewees: () => Promise<void>;
  mutateNumOfNotifications: () => Promise<void>;
}

interface TaskData {
  taskId: number;
  participated: boolean;
  hours: number | null;
}

function ReviewFormVolunteer({
  volunteerId,
  firstName,
  lastName,
  profilePictureUri,
  eventId,
  eventName,
  isOpen,
  setIsOpen,
  mutatePendingReviewees,
  mutateNumOfNotifications,
}: ReviewFormVolunteerProps) {
  const { data: participatedTasks } = useFetchEventTasksForVolunteer(
    volunteerId,
    eventId || 0,
  );

  const [tasksData, setTasksData] = useState<TaskData[]>([]);

  const validationSchema = Yup.object().shape({
    rating: Yup.number().required(),
  });

  const initialValues = {
    rating: 0,
    comment: '',
  };

  const initials = monogram(firstName, lastName);

  return (
    <Box>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, { setSubmitting }) => {
            let totalHours = 0;
            let changed = false;

            const volunteerTasks: VolunteerTask[] = tasksData.reduce<
              VolunteerTask[]
            >((accumulator, currentTask) => {
              if (currentTask.participated) {
                changed = true;
                if (currentTask.hours !== null) {
                  totalHours += currentTask.hours;
                }
                accumulator.push({
                  taskId: currentTask.taskId,
                  hours: currentTask.hours,
                });
              }
              return accumulator;
            }, [] as VolunteerTask[]);

            if (changed && volunteerTasks.length > 0) {
              createVolunteerLogPost({
                volunteerId,
                eventId,
                hours: totalHours || null,
                volunteerTasks,
              } as VolunteerLog)
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                .then(() => {})
                .catch((err) => {
                  err.json().then((errorResponse: ErrorResponse) => {
                    alert(errorResponse.errors[0]);
                  });
                });
            }

            const notificationMessage: NotificationMessage = {
              volunteerId,
              message: evaluationMessage(eventName || '', values.rating),
            };

            createVolunteerReviewPost({
              volunteerId,
              eventId,
              rating: values.rating,
              comment: values.comment,
            } as CreateReview)
              .then(() => {
                void mutatePendingReviewees();

                sendNotificationMessagePost(notificationMessage)
                  .then(() => {
                    void mutateNumOfNotifications();
                  })
                  .catch(() => {});
                setIsOpen(false);
              })
              .catch((err) => {
                err.json().then((errorResponse: ErrorResponse) => {
                  alert(errorResponse.errors[0]);
                });
              });

            setSubmitting(false);
          }}
          validationSchema={validationSchema}
        >
          {({ dirty }) => (
            <Form>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  pt: '10px',
                }}
              >
                <AddReviewIcon fontSize="large" />
                <DialogTitle variant="h5">Add Review</DialogTitle>
              </Box>

              <Grid
                container
                spacing={2}
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: '5px',
                  mb: '15px',
                }}
              >
                <Grid item xs={10}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 2,
                      alignItems: 'center',
                    }}
                  >
                    <Avatar
                      src={profilePictureUri}
                      sx={{ bgcolor: 'primary.main' }}
                    >
                      {initials}
                    </Avatar>

                    <Typography>
                      {firstName} &nbsp;
                      {lastName}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={10}>
                  <Field as={Rating} name="rating" precision={0.5} />
                </Grid>
                <Grid item xs={10}>
                  <Field
                    as={TextField}
                    id="comment"
                    name="comment"
                    label="Comment"
                    fullWidth
                    multiline
                    minRows={3}
                    maxRows={8}
                    inputProps={{ maxLength: 1000 }}
                  />
                </Grid>

                <Grid item xs={10} sx={{ mt: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Fill the volunteer log
                  </Typography>
                  <VolunteerTaskLogTable
                    participatedTasks={participatedTasks}
                    tasksData={tasksData}
                    setTasksData={setTasksData}
                  />
                </Grid>

                <Grid item xs={10}>
                  <DialogActions
                    sx={{
                      mt: '10px',
                      mb: '10px',
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
                      onClick={() => setIsOpen(false)}
                    >
                      <Typography>Cancel</Typography>
                    </Button>
                    <Button type="submit" variant="contained" disabled={!dirty}>
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

export default ReviewFormVolunteer;
