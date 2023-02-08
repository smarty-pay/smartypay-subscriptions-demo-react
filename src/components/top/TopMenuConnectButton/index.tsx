import {
  useDisconnectFromWalletCallback,
  useSmartyApiLocked,
  useWalletConnected,
  useWalletConnecting,
  useWalletName
} from 'smartypay-client-subscriptions-react';
import classes from './style.module.css';


export interface TopMenuConnectButtonProps {
  showConnectOptions?()
}

export function TopMenuConnectButton(
  {
    showConnectOptions
  }: TopMenuConnectButtonProps
){

  const isSmartyApiLocked = useSmartyApiLocked();
  const walletConnecting = useWalletConnecting();
  const walletConnected = useWalletConnected();
  const disconnectFromWallet = useDisconnectFromWalletCallback();
  const walletName = useWalletName();

  return (
    <>
      {!walletConnected &&
        <button
          className={`${classes.connectButton} btn btn-outline-primary btn-lg`}
          disabled={isSmartyApiLocked}
          onClick={()=>{
            showConnectOptions?.();
          }}
        >
          {!walletConnecting && 'Connect Wallet'}
          {walletConnecting && 'Connecting...'}
        </button>
      }
      {walletConnected &&
        <button
          className={`${classes.connectButton} btn btn-outline-primary btn-lg`}
          disabled={isSmartyApiLocked}
          onClick={()=>{
            disconnectFromWallet();
          }}
        >
          Disconnect {walletName}
        </button>
      }
    </>
  )
}