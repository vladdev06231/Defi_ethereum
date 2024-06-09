import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { HashRouter } from "react-router-dom";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import AddressContainer from "../Children/AddressContainer";

const { chains, provider } = configureChains(
  [polygonMumbai],
  [
    alchemyProvider({ apiKey: "9MFVlO2p9rDZ9L3NDEhCBQEgwl_JfQPk" }),
    publicProvider(),
  ]
);
const { connectors } = getDefaultWallets({
  appName: "Stream Hub",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

ReactDOM.createRoot(document.getElementById("root") as Element).render(
  <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider
      chains={chains}
      coolMode //<<<<<<<< coolMode
    >
      <HashRouter>
        <AddressContainer>
          <App />
        </AddressContainer>
      </HashRouter>
    </RainbowKitProvider>
  </WagmiConfig>
);
