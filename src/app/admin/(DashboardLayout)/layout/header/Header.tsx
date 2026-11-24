import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Button, Menu, MenuItem, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// components
import Profile from './Profile';
import { IconBellRinging, IconMenu } from '@tabler/icons-react';

interface ItemType {
  toggleMobileSidebar:  (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({toggleMobileSidebar}: ItemType) => {

  // const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  // const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const ROLE_TAB: Record<string, number> = { MEMBER: 0, DONOR: 1, PARTNER: 2 };

  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClose = () => setAnchorEl(null);
  const [pending, setPending] = useState<{ id: number; name: string; role: string }[]>([]);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setRole(d?.role ?? null))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (role !== 'OWNER') return;
    const load = () =>
      fetch('/api/partners/search?page=1&limit=5&sortBy=createdAt&order=desc&status=PENDING', {
        credentials: 'include',
      })
        .then((r) => r.json())
        .then((d) => {
          setPending(Array.isArray(d.data) ? d.data : []);
          setPendingTotal(d.total ?? 0);
        })
        .catch(console.error);

    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [role]);

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "inline",
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

        {role === 'OWNER' && (
          <>
            <IconButton
              size="large"
              aria-label={`${pendingTotal} new partner requests`}
              color="inherit"
              aria-controls="notif-menu"
              aria-haspopup="true"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <Badge badgeContent={pendingTotal} max={99} color="error">
                <IconBellRinging size="21" stroke="1.5" />
              </Badge>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              slotProps={{ paper: { sx: { ml: { xs: 1, lg: 32 }, mt: { xs: 5, lg: 5 } } } }}
            >
              {pending.length === 0 ? (
                <MenuItem disabled>No new requests</MenuItem>
              ) : (
                pending.map((p) => (
                  <MenuItem
                    key={p.id}
                    onClick={() => {
                      setAnchorEl(null);
                      router.push(`/admin/production/partners?tab=${ROLE_TAB[p.role] ?? 0}`);
                    }}
                  >
                    <Stack>
                      <Typography variant="body2" fontWeight={500}>{p.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{p.role}</Typography>
                    </Stack>
                  </MenuItem>
                ))
              )}
              {pendingTotal > pending.length && (
                <MenuItem disabled>+{pendingTotal - pending.length} more</MenuItem>
              )}
            </Menu>
          </>
        )}
        
        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          {/* <Button variant="contained" component={Link} href="/admin/authentication/login"   disableElevation color="primary" >
            Login
          </Button> */}
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;
