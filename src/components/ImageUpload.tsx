import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';
import React, { useRef, useState } from 'react';
import { Form, Formik } from 'formik';
import UploadIcon from '@mui/icons-material/Upload';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import pictureFetch from '../service/api/image';
import { ErrorResponse } from '../models/error';

interface UploadImageProps {
  endpoint: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutate: () => Promise<void>;
}

function UploadImage({
  endpoint,
  isOpen,
  setIsOpen,
  mutate,
}: UploadImageProps) {
  const initialValues = {
    imageFile: null,
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box>
      <Dialog open={isOpen} fullWidth onClose={() => setIsOpen(false)}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, { setFieldValue }) => {
            if (values.imageFile) {
              pictureFetch(values.imageFile, endpoint)
                .then((response) => {
                  void setFieldValue('imageFile', response.url);
                  void mutate();
                  setSelectedImage(null);
                  setIsOpen(false);
                })
                .catch((err) => {
                  err.json().then((errorResponse: ErrorResponse) => {
                    setError(errorResponse.errors[0]);
                  });
                });
            }
          }}
        >
          {({ resetForm, setFieldValue }) => (
            <Form>
              <Grid
                container
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Grid item>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      pl: '20px',
                    }}
                  >
                    <AddAPhotoIcon fontSize="medium" />
                    <DialogTitle variant="h5">Upload Picture</DialogTitle>
                  </Box>
                </Grid>
                <Grid item xs={8}>
                  <Box
                    sx={{
                      border: '2px dashed #ccc',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: '250px',
                      maxWidth: '100%',
                      mt: '10px',
                      mb: '20px',
                    }}
                  >
                    {selectedImage && (
                      <img
                        src={selectedImage}
                        alt="Preview"
                        style={{ maxWidth: '80%', maxHeight: '80%' }}
                      />
                    )}
                  </Box>
                  <Grid container justifyContent="center">
                    <input
                      type="file"
                      id="image"
                      name="imageFile"
                      value={undefined}
                      style={{ display: 'none' }}
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                      ) => {
                        const file =
                          event.currentTarget.files &&
                          event.currentTarget.files[0];
                        if (file) {
                          setSelectedImage(URL.createObjectURL(file));
                          void setFieldValue('imageFile', file);
                        }
                      }}
                    />
                    {error && (
                      <Typography color="error" variant="body2" align="center">
                        {error}
                      </Typography>
                    )}
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<UploadIcon />}
                      onClick={handleIconClick}
                      sx={{
                        margin: '0 auto',
                      }}
                    >
                      <Typography>Choose Image</Typography>
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <DialogActions
                sx={{
                  m: '15px',
                }}
              >
                <Button
                  variant="outlined"
                  type="reset"
                  onClick={() => {
                    resetForm();
                    setSelectedImage(null);
                    setIsOpen(false);
                    setError('');
                  }}
                >
                  <Typography>Cancel</Typography>
                </Button>
                <Button type="submit" variant="contained">
                  <Typography>Save</Typography>
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Box>
  );
}

export default UploadImage;
