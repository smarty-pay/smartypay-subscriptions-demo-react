import {TopMenuConnectButton, TopMenuConnectButtonProps} from '@/components/top/TopMenuConnectButton';
import {TopStatus} from '@/components/top/TopStatus';
import classes from './style.module.css';
import {useEffect, useMemo, useState} from 'react';
import {useWalletConnected} from 'smartypay-client-subscriptions-react';
import {Currency, parseMoney, SubscriptionPlan} from 'smartypay-client-model';
import {TopAddCurrenciesPanel} from '@/components/top/TopAddCurrenciesPanel';


export interface TopMenuProps extends TopMenuConnectButtonProps {
  plans: SubscriptionPlan[]|undefined,
}

export function TopMenu(
  {
    showConnectOptions,
    plans,
  }: TopMenuProps
){

  const walletConnected = useWalletConnected();
  const [showMenu, setShowMenu] = useState(false);

  // for view in browser only (hide server init html)
  useEffect(()=>{
    setShowMenu(true);
  }, []);

  const targetCurrencies = useMemo<Currency[]>(()=>{
    return (plans || []).map(p => parseMoney(p.amount).currency);
  }, [plans])

  return (
    <div>
      <div className={`${classes.topMenu} ${showMenu? '' : 'invisible'} flex-row panel flex-gap-8`}>
        <TopStatus/>
        <TopMenuConnectButton showConnectOptions={showConnectOptions}/>
      </div>
      {walletConnected &&
        <TopAddCurrenciesPanel currencies={targetCurrencies}/>
      }
    </div>
  )
}