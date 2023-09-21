import {
  useSmartyApiLastError,
  useSmartyApiLocked,
  useWalletAddress,
  useWalletConnected
} from 'smartypay-client-subscriptions-react';
import {SmartyPayMetamaskProvider} from 'smartypay-client-metamask';
import classes from './style.module.css';
import {useEffect, useState} from 'react';
import {getAddressLabel} from '@/components/common';

type StatusStyle = 'alert-primary' | 'alert-warning';

export function TopStatus(){


  const apiLastError = useSmartyApiLastError();
  const walletConnected = useWalletConnected();
  const isApiLocked = useSmartyApiLocked();

  const [showCustomStatus, setShowCustomStatus] = useState(false);

  // special message if Metamask browser extension not installed yet
  const [noMetamaskStatus, setNoMetamaskStatus] = useState(false);

  // show last api error
  useEffect(()=>{
    if( apiLastError){
      setShowCustomStatus(true);
      setNoMetamaskStatus(SmartyPayMetamaskProvider.isNoMetamaskError(apiLastError));
    }
    else if(SmartyPayMetamaskProvider.isMultiApiState()){
      setShowCustomStatus(true);
    }
  }, [apiLastError]);

  // hide last api error on connected event
  useEffect(()=>{
    if(walletConnected){
      setShowCustomStatus(false);
    }
  }, [walletConnected])


  let statusElem;
  let closeCustomEvent = false;
  let statusStyle: StatusStyle = 'alert-primary';

  if(showCustomStatus && noMetamaskStatus){
    statusElem = <NeedMetamaskStatus/>;
    statusStyle = 'alert-warning';
    closeCustomEvent = true;
  }
  else if(showCustomStatus && apiLastError){
    statusElem = <ApiErrorStatus error={apiLastError.message || apiLastError}/>;
    statusStyle = 'alert-warning';
    closeCustomEvent = true;
  }
  else if(showCustomStatus && SmartyPayMetamaskProvider.isMultiApiState()){
    statusElem = <MultiEthereumApiWarning />;
    statusStyle = 'alert-warning';
    closeCustomEvent = true;
  }
  else if(isApiLocked){
    statusElem = <ApiLockedStatus/>;
  }
  else if(walletConnected){
    statusElem = <WalletAddressStatus/>;
  }
  else if(!walletConnected){
    statusElem = <ConnectWalletStatus/>;
  }

  return (
    <>
      {statusElem &&
        <div className={`${classes.topStatus} alert ${statusStyle} flex-row flex-gap-8`}>
          {statusElem}
          {closeCustomEvent &&
            <button
              type="button"
              className="btn-close"
              onClick={()=>{
                setShowCustomStatus(false);
              }}
            ></button>
          }
        </div>
      }
    </>
  )
}


function ApiLockedStatus(){
  return (
    <span>
      <i className="bi bi-hourglass-split"></i> Please wait...
    </span>
  )
}


function ApiErrorStatus({error}){
  return (
    <span>
      <i className="bi bi-exclamation-triangle"></i> Got error: <span className='msg'>{error || 'Unknown'}</span>
    </span>
  )
}


function NeedMetamaskStatus(){
  return (
    <span data-closable='true'>
      <i className="bi bi-exclamation-triangle"></i> Metamask not found.
      {' '}
      <a target='_blank' href='https://metamask.io/download/' rel="noreferrer">
        You can install it here.
      </a>
    </span>
  )
}

function MultiEthereumApiWarning(){
  return (
    <span data-closable='true'>
      Many crypto wallets have been discovered.
      {' '}
      There may be a conflict between them.
      {' '}
      We recommend disabling unnecessary wallets through your browser settings.
    </span>
  )
}


function ConnectWalletStatus(){
  return (
    <span>
      <i className="bi bi-info-circle"></i> Connect your Wallet to use subscriptions
    </span>
  )
}

function WalletAddressStatus(){
  const address = useWalletAddress();
  return (
    <span>
      <i className="bi bi-person-circle"></i>
      {' '}
      <span className='address'>{address? getAddressLabel(address) : 'Unknown address'}</span>
    </span>
  )
}
