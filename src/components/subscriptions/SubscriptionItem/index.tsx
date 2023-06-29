'use client';
import {Assets, getAmountWithTokenLabel, Subscription, SubscriptionPlan} from 'smartypay-client-model';
import {changeSubscriptionAllowanceInWallet} from 'smartypay-client-subscriptions-react';
import './index.css'
import {SubscriptionOperations} from '@/components/subscriptions/SubscriptionOperations';
import moment from 'moment';

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

  const {description, amount, periodSeconds, name} = plan;

  const [price, asset] = amount.split(' ');
  const {abbr} = Assets[asset];
  const periodDays = periodSeconds / (60 * 60 * 24);
  const roundedPeriodDays = Math.round (periodDays * 10000) / 10000;

  const actionDisabled = !canUpdate || isUpdating;
  const nameLabel = name || description.split(' ')[0];

  return (
    <div className="sub-item card shadow">

      <h5 className="card-header">
        <div>
          {nameLabel}
        </div>
        <div className="subscription-description">
          {description}
        </div>
      </h5>

      <div className="card-body">
        <h5 className="card-title info-row price-row">
          <span>Price</span>
          <span>{price} {abbr}</span>
        </h5>
        <p className="card-text flex-col flex-gap-16">
          <span className="info-row">
            <span>Pay period</span>
            <span>{roundedPeriodDays} days</span>
          </span>
          {subscription &&
            <>
              <span className="info-row">
                <span>Next payment</span>
                <span>{moment(subscription.nextChargeAt).format('YYYY-MM-DD HH:mm')}</span>
              </span>
              <span className="info-row">
                <span>
                  Allowance
                </span>
                <span>
                  {getAmountWithTokenLabel(subscription.allowance)}
                  {' '}
                  <a
                    className={`${actionDisabled? 'no-change' : ''}`}
                    href="#"
                    onClick={()=>{
                      if(subscription && !actionDisabled){
                        changeSubscriptionAllowanceInWallet(async()=> subscription)
                          .catch(console.error)
                      }
                    }}
                  >
                    Change
                  </a>
                </span>
              </span>
            </>
          }

        </p>
      </div>
      <div className="sub-footer card-footer flex-col flex-gap-8">
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