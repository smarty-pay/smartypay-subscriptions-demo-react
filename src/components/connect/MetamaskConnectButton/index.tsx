import {SmartyPayMetamaskProvider} from 'smartypay-client-metamask';
import {useConnectToWalletCallback, useSmartyApiLocked} from 'smartypay-client-subscriptions-react';


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
        {SmartyPayMetamaskProvider.name()}
      </button>
    </>
  )
}