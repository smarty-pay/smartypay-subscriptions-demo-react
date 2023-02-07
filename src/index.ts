import {SmartyPayAPI} from 'smartypay-node-sdk';


export const smartyPayAPI = new SmartyPayAPI({
  host:       process.env.API_URL || 'https://ncps-api.staging.mnxsc.tech',
  publicKey:  process.env.API_KEY || 's5FGH1xnRMs6WGPEFX9oIlxYDYEYX4Sg',
  secretKey:  process.env.API_SECRET || 'ltbUjBfqXqwJLf3hToVTTvHho5YRaR3SnL2Dh20x3P3f0A462gmMlUa4pfYq1ScM',
});