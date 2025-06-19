import { Chip } from '@mui/material';
import { Skill } from '../../models/skill';

interface SkillChipProps {
  skill: Skill;
}

function SkillChip({ skill }: SkillChipProps) {
  return <Chip label={skill.name} />;
}

export default SkillChip;
