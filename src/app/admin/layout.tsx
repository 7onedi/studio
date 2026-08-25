import { baselightTheme } from "../utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import './global.css'
import SessionExpiredDialog from "./(DashboardLayout)/components/SessionExpiredDialog";
import ConnectionLostBanner from "./(DashboardLayout)/components/ConnectionLostBanner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div>
        <ThemeProvider theme={baselightTheme}>
          <CssBaseline />
          {children}
          <SessionExpiredDialog />
          <ConnectionLostBanner />
        </ThemeProvider>
      </div>
    </div>
  );
}