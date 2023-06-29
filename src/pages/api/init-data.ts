import {NextApiRequest, NextApiResponse} from 'next';
import {smartyPayAPI} from '@/index';
import {getFakeCustomerId, withErrorHandler} from '@/pages/api/api-util';

export default withErrorHandler(handler);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const customerId = getFakeCustomerId(req);
  const plans = await smartyPayAPI.subscriptions.getActivePlans();

  res.status(200).json({
    customerId,
    plans
  })
}