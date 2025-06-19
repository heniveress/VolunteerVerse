import React from 'react';
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
import { createEventReviewPost } from '../../service/api/review';

interface ReviewFormEventProps {
  volunteerId: number | undefined;
  eventId: number | undefined;
  eventName: string | undefined;
  imageUri: string | undefined;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function ReviewFormEvent({
  volunteerId,
  eventId,
  eventName,
  imageUri,
  isOpen,
  setIsOpen,
}: ReviewFormEventProps) {
  const validationSchema = Yup.object().shape({
    rating: Yup.number().required(),
  });

  const initialValues = {
    rating: 0,
    comment: '',
  };

  return (
    <Box>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, { setSubmitting }) => {
            createEventReviewPost(eventId || 0, {
              volunteerId,
              eventId,
              rating: values.rating,
              comment: values.comment,
            } as CreateReview)
              .then(() => {
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
                    <Avatar src={imageUri} sx={{ bgcolor: 'primary.main' }} />

                    <Typography>{eventName}</Typography>
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

export default ReviewFormEvent;
