import {Assets, Currency} from 'smartypay-client-model';
import {useMemo} from 'react';
import {useAddCurrencyTokenToWalletCallback, useSmartyApiLocked} from 'smartypay-client-subscriptions-react';
import classes from './style.module.css';


export interface TopAddCurrenciesPanelProps {
  currencies: Currency[]
}

export function TopAddCurrenciesPanel(
  {
    currencies
  }: TopAddCurrenciesPanelProps
){

  const list = useMemo(()=>{
    const validList = currencies.filter(c => c !== 'UNKNOWN');
    return Array.from(new Set(validList));
  }, [currencies])

  if(list.length === 0){
    return <></>;
  }

  return (
    <div className={`${classes.menu}`}>
      Show currencies in your wallet: {list.map(currency =>
        <span key={currency}>
          <ShowCurrencyButton currency={currency}/>
          {' '}
        </span>
    )}
    </div>
  )
}


interface ShowCurrencyProp {
  currency: Currency
}

function ShowCurrencyButton({currency}: ShowCurrencyProp){

  const apiLocked = useSmartyApiLocked();
  const addCurrencyCallback = useAddCurrencyTokenToWalletCallback(currency);

  return (
    <button
      disabled={apiLocked}
      onClick={addCurrencyCallback}>
      Show {Assets[currency].abbr}
    </button>
  )
}