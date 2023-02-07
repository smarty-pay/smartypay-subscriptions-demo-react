import {SmartyPayMetamaskProvider} from 'smartypay-client-metamask';
import {useConnectToWalletCallback, useSmartyApiLocked} from 'smartypay-client-subscrptions-react';


export function MetamaskConnectButton(){

  const isSmartyApiLocked = useSmartyApiLocked();
  const connectToMetamask = useConnectToWalletCallback(SmartyPayMetamaskProvider);

  return (
    <>
      <button
        className="btn btn-outline-secondary btn-lg"
        disabled={isSmartyApiLocked}
        onClick={connectToMetamask}
      >
        Metamask
      </button>
    </>
  )
}