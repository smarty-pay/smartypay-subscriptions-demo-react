import {NextApiRequest, NextApiResponse} from 'next';
import {smartyPayAPI} from '@/index';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  const {planId, payer} = req.body;

  if( ! planId || ! payer){
    res.status(400).send({ message: 'planId and payer required'});
    return;
  }

  const customerId = 'backend-customer-id' // use your own system's customer id
  const metadata = 'some usefull metadata' // optional metadata from your own system
  const startFrom = new Date().toISOString(); // minimal time to start

  const subscription = await smartyPayAPI.subscriptions.createSubscription({
    planId,
    payer,
    customerId,
    metadata,
    startFrom,
  })

  res.status(200).json(subscription);
}