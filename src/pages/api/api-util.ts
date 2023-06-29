import {NextApiRequest, NextApiResponse} from 'next';
import {uuid} from '@walletconnect/utils';
import crypto from 'crypto';


export function withErrorHandler(hander: (req: NextApiRequest, res: NextApiResponse)=> Promise<any>){
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {

      return await hander(req, res);

    } catch (err: any){

      const errData = err.response || err;

      console.error('got error', errData);

      if(errData.status){
        res.status(errData.status).json(errData);
      } else {
        res.status(500).send("Internal server error");
      }
    }
  }
}



export function getFakeCustomerId(req: NextApiRequest): string {
  // we use fake customer id in our demo
  const idSeed = req.headers['user-agent'] || 'some-user';
  return crypto.createHash('md5').update(idSeed).digest("hex");
}

export function getFakeSubscriptionMetaData(){
  return `metadata-${uuid()}`;
}