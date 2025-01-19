import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#FCB212",
    },
    secondary: {
      main: "#178257",
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
