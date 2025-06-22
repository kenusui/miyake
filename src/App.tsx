import {
  Box,
  Stack,
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton,
} from "@mui/material";
import MiyakeMap from "./MiyakeMap";
import { useMemo, useState } from "react";
import DarkMode from "@mui/icons-material/DarkMode";
import LightMode from "@mui/icons-material/LightMode";

function App() {
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#1976d2" },
          secondary: { main: "#388e3c" },
          background: {
            default: mode === "dark" ? "#181a1b" : "#f5f5f5",
            paper: mode === "dark" ? "#23272a" : "#fff",
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack
        direction="column"
        spacing={2}
        sx={{
          alignItems: "stretch",
          width: "100vw",
          minHeight: "100vh",
          p: 2,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={2}
        >
          <h1 style={{ textAlign: "center", margin: 0, flex: 1 }}>
            三宅島旅行 工程表マップ
          </h1>
          <Box>
            <IconButton
              onClick={() => setMode(mode === "light" ? "dark" : "light")}
            >
              {mode === "light" ? <DarkMode /> : <LightMode />}
            </IconButton>
          </Box>
        </Box>
        <MiyakeMap />
      </Stack>
    </ThemeProvider>
  );
}

export default App;
