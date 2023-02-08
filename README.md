# SmartyPay Subscriptions React Demo

Demo Next.js project with 
- [SmartyPay Node SDK for backend side](https://github.com/smarty-pay/smartypay-node-sdk)
- [SmartyPay Subscriptions SDK for React](https://github.com/smarty-pay/smartypay-client-subscriptions-react)

## Load and fast start on localhost:3000
```
> npm install
> npm run dev
```

## Live demo
[server demo link](https://ncps-subs-demo.staging.mnxsc.tech/)

## Api config
```
file: ./src/index.js

API_URL - SmartyPay server api url
API_KEY - Merchant api key
API_SECRET - Merchant api secret
```

## Common actions examples:
### Backend side (with Node SDK)
- Get subscriptions plans: [example](https://github.com/smarty-pay/smartypay-subscriptions-demo-react/blob/main/src/pages/api/subscription-plans.ts#L10)
- Get users subscriptions by its address: [example](https://github.com/smarty-pay/smartypay-subscriptions-demo-react/blob/main/src/pages/api/subscriptions.ts#L16)
- Create subscription: [example](https://github.com/smarty-pay/smartypay-subscriptions-demo-react/blob/main/src/pages/api/create-subscription.ts#L26)

### Frontend side
- Connect to Metamask button: [example](https://github.com/smarty-pay/smartypay-subscriptions-demo-react/blob/main/src/components/connect/MetamaskConnectButton/index.tsx)
- Disconnect from wallet button: [example](https://github.com/smarty-pay/smartypay-subscriptions-demo-react/blob/main/src/components/top/TopMenuConnectButton/index.tsx)
- Activate subscription: [example](https://github.com/smarty-pay/smartypay-subscriptions-demo-react/blob/main/src/components/subscriptions/SubscriptionOperations/index.tsx#L120)
- Pause subscription: [example](https://github.com/smarty-pay/smartypay-subscriptions-demo-react/blob/main/src/components/subscriptions/SubscriptionOperations/index.tsx#L80)
- UnPause subscription: [example](https://github.com/smarty-pay/smartypay-subscriptions-demo-react/blob/main/src/components/subscriptions/SubscriptionOperations/index.tsx#L93)
- Cancel subscription: [example](https://github.com/smarty-pay/smartypay-subscriptions-demo-react/blob/main/src/components/subscriptions/SubscriptionOperations/index.tsx#L106)
- Monitoring subscriptions events: [example](https://github.com/smarty-pay/smartypay-subscriptions-demo-react/blob/main/src/components/subscriptions/SubscriptionsList/index.tsx#L116)

