import {NextApiRequest, NextApiResponse} from 'next';


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