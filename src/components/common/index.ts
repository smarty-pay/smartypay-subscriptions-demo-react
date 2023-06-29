


export function getAddressLabel(address: string|undefined){
  return address? `${address.substring(0, 5)}...${address.substring(address.length-4)}` : '';
}