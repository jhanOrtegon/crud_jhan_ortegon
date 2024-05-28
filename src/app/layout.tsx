import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme";
import { CustomProvider } from "@/provider";

export default function RootLayout(props: { children: React.ReactNode; }) {
  return (
    <html lang="es">
      <body>
        <CustomProvider>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {props.children}
            </ThemeProvider>
          </AppRouterCacheProvider>
        </CustomProvider>
      </body>
    </html>
  );
}
