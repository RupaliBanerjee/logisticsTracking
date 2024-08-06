import { Alert, Snackbar } from "@mui/material";

interface NotificationProps {
  open: boolean;
  severity: "error" | "info" | "success" | "warning" | undefined;
  message: string;
  onClose: (event: React.SyntheticEvent | Event, reason?: string) => void;
}
const Notifications = ({
  open,
  severity,
  message,
  onClose,
}: NotificationProps) => {
  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={onClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={severity} variant="filled" onClose={onClose}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Notifications;
