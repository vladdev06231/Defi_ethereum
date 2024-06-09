import { ConnectButton } from "@rainbow-me/rainbowkit";
import "./styles/customButton.css";

interface yourNameProps {
  label: string;
}

export const YourApp = ({ label }: yourNameProps) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className={label === "Create Stream" ? "makeWhite" : ""}
                  >
                    {label}
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }

              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    style={{ display: "flex", alignItems: "center" }}
                    type="button"
                  >
                    {chain.name}({account.address.slice(0, 3)}...
                    {account.address.slice(39, 42)})
                  </button>
                  {/* 
                  <button onClick={openAccountModal} type="button">
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </button> */}
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
