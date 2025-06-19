import { Button, Typography } from '@mui/material';
import {
  GridRowsProp,
  GridToolbarContainer,
  GridValidRowModel,
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';

interface EditToolbarProps {
  rows: GridValidRowModel[];
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
}

// eslint-disable-next-line react/prop-types
function EditToolbar({ rows, setRows }: EditToolbarProps) {
  const handleClick = () => {
    const newRow = {
      id: rows.length + 1,
      name: '',
      description: '',
      capacity: 0,
      needApproval: false,
      requiredSkills: [],
      isNew: true,
    };

    setRows((prevRows) => [...prevRows, newRow]);
  };

  return (
    <GridToolbarContainer>
      <Button startIcon={<AddIcon />} onClick={handleClick}>
        <Typography>Add Tasks</Typography>
      </Button>
    </GridToolbarContainer>
  );
}
export default EditToolbar;
