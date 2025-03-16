import "@/styles/globals.css";
import React from "react";
import { ConfigProvider } from "antd";

import theme from "../theme/themeConfig";

const App = ({ Component, pageProps }) => (
  <ConfigProvider
    theme={{
      // 1. Use dark algorithm
      algorithm: theme.darkAlgorithm,

      // 2. Combine dark algorithm and compact algorithm
      // algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
    }}
  >
    <Component {...pageProps} />
  </ConfigProvider>
);

export default App;
