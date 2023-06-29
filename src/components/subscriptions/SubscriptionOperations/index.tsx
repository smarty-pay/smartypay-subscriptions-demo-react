'use client';
import {Subscription, SubscriptionPlan} from 'smartypay-client-model';
import {
  activateSubscriptionInWallet,
  cancelSubscriptionInWallet,
  isValidBalanceToPay,
  pauseSubscriptionInWallet,
  TokenMaxAbsoluteAmount,
  unPauseSubscriptionInWallet,
  isEndingSubscription,
} from 'smartypay-client-subscriptions-react';
import {postJsonFetcher} from '@/util/fetch-util';
import {getAddressLabel} from '@/components/common';
import './index.css'


export interface SubscriptionOperationsProp {
  payerAddress: string|undefined,
  plan: SubscriptionPlan,
  subscription: Subscription|undefined
  hideOperations: boolean,
  canUpdate: boolean,
  isUpdating: boolean,
}

export function SubscriptionOperations(
  {
    payerAddress,
    plan,
    subscription,
    hideOperations,
    canUpdate,
    isUpdating,
  }: SubscriptionOperationsProp
){

  const canShowStatus = payerAddress && !hideOperations;

  const status = subscription?.status;
  const canActivate = !status || status === 'Draft';
  const canDeactivate = !canActivate;
  const canPause = status === 'Active';
  const canUnPause = status === 'Paused';

  // show Draft as 'Not Activated' because user need to activate this sub
  const statusLabel = canActivate? 'Not Activated' : status;

  const isWrongAddress =  !!payerAddress
    && !!subscription?.payer
    && subscription.payer !== payerAddress
    && (canDeactivate || canPause || canUnPause);

  const actionsDisabled = !canUpdate || isUpdating || isWrongAddress;

  const isEnding = isEndingSubscription(subscription);

  return (
    <>
      <div className='flex-row flex-gap-8 flex-align-baseline'>
        <span>status:</span>
        <span className='fs-5'>
          <span className={`badge ${statusLabel === 'Active'? 'bg-success' : 'bg-light text-dark'}`}>
            {statusLabel}
          </span>

          {isEnding &&
            <span className="ending-status badge bg-warning text-dark">Ending</span>
          }
        </span>
      </div>

      {subscription && isWrongAddress &&
        <div className="wrong-address">
          Please select wallet {getAddressLabel(subscription.payer)} to update the subscription
        </div>
      }

      {canShowStatus && canActivate &&
        <button
          className="btn btn-outline-primary"
          disabled={actionsDisabled}
          onClick={()=>{
            // create if need and activate subscription
            activateSubscription(payerAddress, plan.id, subscription)
              .catch(console.error);
          }}
        >
          Activate
        </button>
      }
      {subscription && canPause &&
        <button
          disabled={actionsDisabled}
          className="btn btn-outline-primary"
          onClick={()=>{
            // pause subscription
            pauseSubscriptionInWallet(async ()=> subscription)
              .catch(console.error);
          }}
        >
          Pause
        </button>
      }
      {subscription && canUnPause &&
        <button
          disabled={actionsDisabled}
          className="btn btn-outline-primary"
          onClick={()=>{
            // unpause subscription
            unPauseSubscriptionInWallet(async ()=> subscription)
              .catch(console.error);
          }}
        >
          Unpause
        </button>
      }
      {subscription && !isEnding && canDeactivate &&
        <button
          disabled={actionsDisabled}
          className="btn btn-outline-warning"
          onClick={()=>{
            // cancel subscription
            cancelSubscriptionInWallet(async ()=> subscription)
              .catch(console.error);
          }}
        >
          Deactivate
        </button>
      }
    </>
  )
}


async function activateSubscription(payer: string, planId: string, oldSubscription: Subscription|undefined){
  try {
    await activateSubscriptionInWallet(async ()=>{

      let subscription = oldSubscription;

      // create new draft subscription for the plan
      if( ! subscription){
        subscription = await postJsonFetcher<Subscription>('/api/create-subscription', {planId, payer});
      }

      const isValidBalance = await isValidBalanceToPay(subscription);
      if( ! isValidBalance){
        throw new Error('Not enough token funds to activate the subscription');
      }


      return subscription;
    }, {
      approveAbsoluteAmount: TokenMaxAbsoluteAmount
    });
  } catch (e: any){
    console.error('can not activate subscription:', e.message);
  }
}
