import {NextApiRequest, NextApiResponse} from 'next';
import {smartyPayAPI} from '@/index';
import {getFakeCustomerId, getFakeSubscriptionMetaData, withErrorHandler} from '@/pages/api/api-util';

export default withErrorHandler(handler);

async function handler(
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

  const customerId = getFakeCustomerId(req);
  const metadata = getFakeSubscriptionMetaData();
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