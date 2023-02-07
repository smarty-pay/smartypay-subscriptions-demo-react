import {SmartyPayWalletConnectProvider} from 'smartypay-client-wallet-connect';
import {useConnectToWalletCallback, useSmartyApiLocked} from 'smartypay-client-subscrptions-react';


export function WalletConnect_ConnectButton(){

  const isSmartyApiLocked = useSmartyApiLocked();
  const connectToWalletConnect = useConnectToWalletCallback(SmartyPayWalletConnectProvider);

  return (
    <>
      <button
        className="btn btn-outline-secondary btn-lg"
        disabled={isSmartyApiLocked}
        onClick={connectToWalletConnect}
      >
        WalletConnect
      </button>
    </>
  )
}