'use client';

import React, { useRef, useState } from 'react';
import {
  Chip, Divider, ListItemIcon, ListItemText, Menu, MenuItem, Typography,
} from '@mui/material';
import { IconCheck, IconChevronDown, IconFilterOff, IconTags } from '@tabler/icons-react';

export interface Subcategory {
  id: number;
  name: string;
  slug: string;
}

interface SubcategoryCellProps {
  subcategories: Subcategory[];
  categoryId: number;
  activeId?: number;
  onSelect?: (categoryId: number | undefined, subcategoryId: number | undefined) => void;
}

export default function SubcategoryCell({
  subcategories,
  categoryId,
  activeId,
  onSelect,
}: SubcategoryCellProps) {
  const chipRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  if (subcategories.length === 0) {
    return <Typography variant="body2" color="text.secondary">—</Typography>;
  }

  const activeSub = subcategories.find((s) => s.id === activeId);

  // Одна підкатегорія: простий чип-перемикач без меню
  if (subcategories.length === 1) {
    const sub = subcategories[0];
    const active = activeId === sub.id;
    return (
      <Chip
        label={sub.name}
        size="small"
        variant={active ? 'filled' : 'outlined'}
        color={active ? 'primary' : 'default'}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(categoryId, active ? undefined : sub.id);
        }}
        sx={{ cursor: 'pointer', fontSize: 11, maxWidth: '100%' }}
      />
    );
  }

  const openMenu = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    setOpen(true);
  };

  const select = (subId: number | undefined) => {
    onSelect?.(categoryId, subId);
    setOpen(false);
  };

  return (
    <>
      <Chip
        ref={chipRef}
        icon={<IconTags size={14} />}
        label={activeSub ? activeSub.name : `${subcategories.length} subcategories`}
        deleteIcon={<IconChevronDown size={14} />}
        onClick={openMenu}
        onDelete={openMenu}
        size="small"
        variant={activeSub ? 'filled' : 'outlined'}
        color={activeSub ? 'primary' : 'default'}
        sx={{ cursor: 'pointer', fontSize: 11, maxWidth: '100%' }}
      />

      <Menu
        anchorEl={chipRef.current}
        open={open}
        onClose={() => setOpen(false)}
        onClick={(e) => e.stopPropagation()}
        slotProps={{ paper: { sx: { minWidth: 180, maxHeight: 300 } } }}
      >
        {subcategories.map((sub) => {
          const selected = activeId === sub.id;
          return (
            <MenuItem key={sub.id} dense selected={selected} onClick={() => select(sub.id)}>
              <ListItemText primary={sub.name} slotProps={{ primary: { fontSize: 13 } }} />
              {selected && (
                <ListItemIcon sx={{ minWidth: 'auto', ml: 1 }}>
                  <IconCheck size={16} />
                </ListItemIcon>
              )}
            </MenuItem>
          );
        })}

        {activeSub && <Divider />}
        {activeSub && (
          <MenuItem dense onClick={() => select(undefined)}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <IconFilterOff size={16} />
            </ListItemIcon>
            <ListItemText primary="Clear filter" slotProps={{ primary: { fontSize: 13 } }} />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}