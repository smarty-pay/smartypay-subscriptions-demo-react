'use client';
import {Subscription, SubscriptionPlan} from 'smartypay-client-model';
import {
  activateSubscriptionInWallet,
  cancelSubscriptionInWallet,
  pauseSubscriptionInWallet,
  TokenMaxAbsoluteAmount,
  unPauseSubscriptionInWallet
} from 'smartypay-client-subscriptions-react';
import {postJsonFetcher} from '@/util/fetch-util';


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

  const actionsDisabled = !canUpdate || isUpdating;

  return (
    <>
      <div className='flex-row flex-gap-8 flex-align-baseline'>
        <span>status:</span>
        <span className='fs-5'>
          {!canShowStatus &&
            <span className='badge bg-light text-dark'>-</span>
          }
          {canShowStatus &&
            <span className={`badge ${statusLabel === 'Active'? 'bg-success' : 'bg-light text-dark'}`}>
              {statusLabel}
            </span>
          }
        </span>
      </div>

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
      {subscription && canDeactivate &&
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

      return subscription;
    }, {
      approveAbsoluteAmount: TokenMaxAbsoluteAmount
    });
  } catch (e: any){
    console.error('can not activate subscription:', e.message);
  }
}
