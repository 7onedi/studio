'use client';

import { Button, Stack, Typography, Divider } from '@mui/material';
import { IconPlus } from '@tabler/icons-react';
import ContributorCard, { Contributor } from './ContributorCard';

interface Props {
  contributors: Contributor[];
  onChange: (contributors: Contributor[]) => void;
}

const emptyContributor = (): Contributor => ({
  name: '',
  title: '',
  text: '',
  profileImg: '',
  links: { facebook: '', instagram: '', tiktok: '' },
});

export default function ContributorsList({ contributors, onChange }: Props) {
  const handleChange = (idx: number, val: Contributor) =>
    onChange(contributors.map((c, i) => i === idx ? val : c));

  const handleRemove = (idx: number) =>
    onChange(contributors.filter((_, i) => i !== idx));

  const handleAdd = () =>
    onChange([...contributors, emptyContributor()]);

  return (
    <Stack spacing={2}>
      <Divider />
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle2" fontWeight={600}>
          Учасники ({contributors.length})
        </Typography>
        <Button size="small" startIcon={<IconPlus size={14} />} onClick={handleAdd}>
          Додати учасника
        </Button>
      </Stack>

      {contributors.map((c, idx) => (
        <ContributorCard
          key={idx}
          contributor={c}
          index={idx}
          onChange={handleChange}
          onRemove={handleRemove}
        />
      ))}
    </Stack>
  );
}