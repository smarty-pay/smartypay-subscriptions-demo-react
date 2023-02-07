import {NextApiRequest, NextApiResponse} from 'next';
import {smartyPayAPI} from '@/index';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const plans = await smartyPayAPI.subscriptions.getActivePlans();

  res.status(200).json(plans)
}