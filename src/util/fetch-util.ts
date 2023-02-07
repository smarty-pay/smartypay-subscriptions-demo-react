

export const getJsonFetcher = <T>(url: string): Promise<T> => fetch(url)
  .then(handleRespNotOk)
  .then((res) => res.json() as T);


export const postJsonFetcher = <T>(url: string, reqData?: any): Promise<T> =>
  fetch(url, {
    method: 'POST',
    body: reqData? JSON.stringify(reqData) : undefined,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(handleRespNotOk)
    .then((res) => res.json() as T);


export function noUpdatesConfig(){
  return {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  }
}


export async function handleRespNotOk(resp){
  if( ! resp.ok){
    let msg = resp.statusText;
    try {
      const data = await resp.json();
      msg = data.message || msg;
    } catch (e){
      // skip
    }
    throw new Error(msg);
  }
  return resp;
}