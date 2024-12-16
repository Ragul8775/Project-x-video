import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const WalletConnectButton = () => {
  return (
    <div className="custom-wallet-button">
      <WalletMultiButton />
    </div>
  );
};

export default WalletConnectButton;
