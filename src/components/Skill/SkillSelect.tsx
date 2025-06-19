import React from 'react';
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { Skill } from '../../models/skill';

interface SkillSelectProps {
  skills: Skill[];
  selectedSkills: number[];
  setSelectedSkills: React.Dispatch<React.SetStateAction<number[]>>;
}

function SkillSelect({
  skills,
  selectedSkills,
  setSelectedSkills,
}: SkillSelectProps) {
  const handleChange = (event: SelectChangeEvent<number[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedSkills(value as number[]);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="select-label">Skills</InputLabel>
      <Select
        labelId="select-label"
        input={<OutlinedInput label="Skills" />}
        fullWidth
        multiple
        value={selectedSkills}
        onChange={handleChange}
        renderValue={(selected) =>
          selected
            .map((selectedId) => {
              const skill = skills.find((s) => s.id === selectedId);
              return skill ? skill.name : '';
            })
            .join(', ')
        }
        sx={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
      >
        {skills.map((skill) => (
          <MenuItem key={skill.id} value={skill.id}>
            <Checkbox checked={selectedSkills.includes(skill.id)} />
            <ListItemText primary={skill.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SkillSelect;
