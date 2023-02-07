import {TopMenuConnectButton, TopMenuConnectButtonProps} from '@/components/top/TopMenuConnectButton';
import {TopStatus} from '@/components/top/TopStatus';
import classes from './style.module.css';
import {useEffect, useState} from 'react';


export interface TopMenuProps extends TopMenuConnectButtonProps {}

export function TopMenu(
  {
    showConnectOptions
  }: TopMenuProps
){

  const [showMenu, setShowMenu] = useState(false);

  // for view in browser only (hide server init html)
  useEffect(()=>{
    setShowMenu(true);
  }, []);

  return (
    <div className={`${classes.topMenu} ${showMenu? '' : 'invisible'} flex-row panel flex-gap-8`}>
      <TopStatus/>
      <TopMenuConnectButton showConnectOptions={showConnectOptions}/>
    </div>
  )
}