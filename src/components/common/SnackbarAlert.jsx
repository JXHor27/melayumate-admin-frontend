import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function SnackbarAlert({
  open,
  onClose,
  severity,
  message,
  autoHideDuration = 1500,
  anchorOrigin = { vertical: "bottom", horizontal: "right" },
  variant = "filled",
}) {
    return (
        <Snackbar
            open={open}
            anchorOrigin={anchorOrigin}
            autoHideDuration={autoHideDuration}
            onClose={onClose}>
            <Alert 
                severity={severity} 
                variant={variant}>
            {message}
             </Alert>
        </Snackbar>
    );
}

export default SnackbarAlert;