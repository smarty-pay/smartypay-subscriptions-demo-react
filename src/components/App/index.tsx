'use client';
import {
  addSubscriptionsGlobalListener,
  restoreOldWalletConnectionFromAny,
  useWalletConnected,
} from 'smartypay-client-subscriptions-react';
import {SmartyPayMetamaskProvider} from 'smartypay-client-metamask';
import {SmartyPayWalletConnectProvider} from 'smartypay-client-wallet-connect';
import {TopMenu} from '@/components/top/TopMenu';
import classes from './style.module.css';
import {useEffect, useState} from 'react';
import {MetamaskConnectButton} from '@/components/connect/MetamaskConnectButton';
import {WalletConnect_ConnectButton} from '@/components/connect/WalletConnect_ConnectButton';
import {SubscriptionsList} from '@/components/subscriptions/SubscriptionsList';
import useSWR from 'swr';
import {SubscriptionPlan} from 'smartypay-client-model';
import {getJsonFetcher, noUpdatesConfig} from '@/util/fetch-util';


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
    ).catch(console.error);
  }, []);

  // plans
  const {
    data: initData,
    isLoading: isDataLoading,
    error: getDataError
  } = useGetInitData();


  return (
    <div className={`${classes.root} flex-col`}>

      <TopMenu
        plans={initData?.plans}
        showConnectOptions={()=>{
          setShowConnectButtons(true);
        }}
      />

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

        <SubscriptionsList
          plans={initData?.plans}
          customerId={initData?.customerId}
          isPlansLoading={isDataLoading}
          getPlansError={getDataError}
        />

      </div>

    </div>
  )
}

interface InitData {
  plans: SubscriptionPlan[],
  customerId: string,
}

function useGetInitData(){
  return useSWR<InitData>(
    '/api/init-data', getJsonFetcher, noUpdatesConfig());
}