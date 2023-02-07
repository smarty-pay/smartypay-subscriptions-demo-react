'use client';
import {Assets, Subscription, SubscriptionPlan} from 'smartypay-client-model';
import classes from './style.module.css';
import {SubscriptionOperations} from '@/components/subscriptions/SubscriptionOperations';

export interface SubscriptionItemProp {
  payerAddress: string|undefined,
  plan: SubscriptionPlan,
  subscription?: Subscription,
  hideOperations: boolean,
  canUpdate: boolean,
  isUpdating: boolean,
}

export function SubscriptionItem(
  {
    payerAddress,
    plan,
    subscription,
    hideOperations,
    canUpdate,
    isUpdating,
  }: SubscriptionItemProp
){

  const {description, amount, periodSeconds, tags} = plan;

  const [price, asset] = amount.split(' ');
  const {abbr} = Assets[asset];
  const periodDays = periodSeconds / (60 * 60 * 24);
  const roundedPeriodDays = Math.round (periodDays * 10000) / 10000;

  return (
    <div className={`${classes.item} card shadow`}>

      <h5 className="card-header">
        {description}
      </h5>

      <div className="card-body">
        <h5 className="card-title">price: {price} {abbr}</h5>
        <p className="card-text flex-col flex-gap-8">
          <span>pay period: {roundedPeriodDays} days</span>
          <span>
            tags:
            {' '}
            <span className='flex-row flex-inline flex-wrap flex-gap-4 flex-align-baseline'>
              {tags.map(tag =>
                <span key={tag} className="badge bg-light text-dark">{tag}</span>
              )}
            </span>
          </span>
        </p>
      </div>
      <div className={`${classes.footer} card-footer flex-col flex-gap-8`}>
        <SubscriptionOperations
          payerAddress={payerAddress}
          plan={plan}
          subscription={subscription}
          hideOperations={hideOperations}
          canUpdate={canUpdate}
          isUpdating={isUpdating}
        />
        {isUpdating &&
          <span>
            <i className="bi bi-hourglass-split"></i> Updating, please wait...
          </span>
        }
      </div>
    </div>
  )
}