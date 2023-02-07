'use client';
import useSWR from 'swr';
import {
  addSubscriptionsListener,
  removeSubscriptionsListener,
  SubscriptionsEvent,
  useSmartyApiLocked,
  useUpdatingSubscriptionsPlans,
  useWalletAddress
} from 'smartypay-client-subscrptions-react';
import {Subscription, SubscriptionPlan} from 'smartypay-client-model';
import classes from './style.module.css';
import {getJsonFetcher, noUpdatesConfig} from '@/util/fetch-util';
import {SubscriptionItem} from '@/components/subscriptions/SubscriptionItem';
import {useEffect, useMemo, useState} from 'react';

export function SubscriptionsList(){

  const apiLocked = useSmartyApiLocked();
  const payerAddress = useWalletAddress();

  // plans
  const {
    data: plans,
    isLoading: isPlansLoading,
    error: getPlansError
  } = useGetSubscriptionPlans();

  // user's subscriptions
  const {
    data: userSubs,
    isLoading: isUserSubsLoading,
    outdatedSubscriptionPlan,
  } = useGetUserSubscriptions(payerAddress);

  // plan ids of updating user's subscriptions
  const updatingSubscriptionsPlans = useUpdatingSubscriptionsPlans();

  const canUpdateAnyItem = !!payerAddress && !apiLocked && !isUserSubsLoading;

  return (
    <>
      <h6>All Subscriptions:</h6>
      <div className={`${classes.list} flex-row flex-gap-24 panel border rounded flex-wrap`}>
        {isPlansLoading &&
          <span>
            <i className="bi bi-hourglass-split"></i> Loading subscriptions...
          </span>
        }
        {getPlansError &&
          <span>
            <i className="bi bi-exclamation-triangle"></i>
            {' '}
            Subscriptions loading error:
            {' '}
            {getPlansError.message || getPlansError.toString()}
          </span>
        }
        {plans && plans.map(plan =>
          <SubscriptionItem
            key={plan.id}
            payerAddress={payerAddress}
            plan={plan}
            subscription={userSubs && userSubs.find(s => plan.id === s.planId)}
            hideOperations={!userSubs}
            canUpdate={canUpdateAnyItem}
            isUpdating={!!updatingSubscriptionsPlans.find(planId => plan.id === planId) // wait result from blockchain
              || plan.id === outdatedSubscriptionPlan} // wait server data to hidden reload
          />
        )}
      </div>
    </>
  )
}



function useGetSubscriptionPlans(){
  return useSWR<SubscriptionPlan[]>(
    '/api/subscription-plans', getJsonFetcher, noUpdatesConfig());
}


function useGetUserSubscriptions(payerAddress: string|undefined){

  const [startLoad, setStartLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Subscription[]|undefined>(undefined);
  const [error, setError] = useState<any>(undefined);
  const [hiddenUpdate, setHiddenUpdate] = useState(false);
  const [outdatedSubscriptionPlan, setOutdatedSubscriptionPlan] = useState<string|undefined>();

  const out = useMemo(()=> ({
    data,
    isLoading: loading && !hiddenUpdate,
    error,
    outdatedSubscriptionPlan,
  }), [data, loading, hiddenUpdate, error, outdatedSubscriptionPlan]);

  // force to load on input changed
  useEffect(()=>{
    setStartLoad(true);
  }, [payerAddress, setStartLoad]);


  // force to load on updated subscription
  useEffect(()=>{

    function listener({data: [contractAddress, planId]}: SubscriptionsEvent){
      console.log('subscription updated', contractAddress);
      setOutdatedSubscriptionPlan(planId);
      setHiddenUpdate(true);
      setStartLoad(true);
    }

    addSubscriptionsListener('subscription-updated', listener)
    return ()=>{
      removeSubscriptionsListener(listener);
    }
  }, [])

  // load logic
  useEffect(()=>{

    // skip duplicate loads
    if(!startLoad || loading){
      return;
    }

    setStartLoad(false);
    setError(undefined);

    if( ! payerAddress){
      setData(undefined);
    } else {
      // async
      loadSubscriptions().catch(console.error);
    }

    async function loadSubscriptions(){
      setLoading(true);
      try {
        const subs = await getJsonFetcher<Subscription[]>(`/api/subscriptions?payer=${payerAddress}`);
        setData(subs);
      } catch (e){
        console.error('can not load subscriptions', e);
        if( ! hiddenUpdate){
          setError(e);
          setData([]);
        }
      } finally {
        setOutdatedSubscriptionPlan(undefined);
        setHiddenUpdate(false);
        setLoading(false);
      }
    }
  }, [
    payerAddress,
    startLoad,
    setStartLoad,
    setData,
    loading,
    setLoading,
    setError,
    hiddenUpdate,
    setHiddenUpdate,
  ]);

  return out;
}