'use client';
import {
  addSubscriptionsGlobalListener,
  restoreOldWalletConnectionFromAny,
  useWalletConnected,
} from 'smartypay-client-subscrptions-react';
import {SmartyPayMetamaskProvider} from 'smartypay-client-metamask';
import {SmartyPayWalletConnectProvider} from 'smartypay-client-wallet-connect';
import {TopMenu} from '@/components/top/TopMenu';
import classes from './style.module.css';
import {useEffect, useState} from 'react';
import {MetamaskConnectButton} from '@/components/connect/MetamaskConnectButton';
import {WalletConnect_ConnectButton} from '@/components/connect/WalletConnect_ConnectButton';
import {SubscriptionsList} from '@/components/subscriptions/SubscriptionsList';


// just for demo: logs all api events
addSubscriptionsGlobalListener(({key, data})=>{
  console.log('[api event]', `"${key}"`, data);
});


export function App(){

  const walletConnected = useWalletConnected();
  const [showConnectButtons, setShowConnectButtons] = useState(false);

  // restore old connection for metamask or wallet-connect
  useEffect(()=>{
    restoreOldWalletConnectionFromAny(
      SmartyPayMetamaskProvider,
      SmartyPayWalletConnectProvider
    );
  }, []);


  return (
    <div className={`${classes.root} flex-col`}>

      <TopMenu showConnectOptions={()=>{
        setShowConnectButtons(true);
      }}/>

      <div className={classes.main}>

        { !walletConnected &&
          <div
            className={`${classes.connectMenu} ${showConnectButtons ? '' : 'hide'} flex-col flex-gap-8 panel panel-middle border rounded border-secondary`}>
            <button
              className={`${classes.connectMenuClose} btn-close`}
              aria-label="Close"
              onClick={()=>{
                setShowConnectButtons(false);
              }}
            ></button>
            <MetamaskConnectButton/>
            <WalletConnect_ConnectButton/>
          </div>
        }

        <SubscriptionsList/>

      </div>

    </div>
  )
};