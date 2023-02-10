import {NextApiRequest, NextApiResponse} from 'next';
import {smartyPayAPI} from '@/index';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const {payer} = req.query;
  if( ! payer){
    res.status(400).send({ message: 'query param "payer" required'});
    return;
  }

  let subscriptions = await smartyPayAPI.subscriptions.getSubscriptionsByPayer(payer.toString());

  // ignore Draft and Cancelled subscriptions
  subscriptions = subscriptions.filter(sub =>
    sub.status !== 'Draft'
    && sub.status !== 'Cancelled'
    && sub.status !== 'PendingCancel');

  res.status(200).json(subscriptions);
}