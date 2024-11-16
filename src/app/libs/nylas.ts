import Nylas from "nylas";


export const nylasConfig = {
  clientId: process.env.NYLAS_CLIENT_ID ?? (() => { throw new Error("Missing NYLAS_CLIENT_ID") })(),
  callbackUri: "http://localhost:3000/api/oauth/exchange",
  apiKey: process.env.NYLAS_API_KEY ?? (() => { throw new Error("Missing NYLAS_API_KEY") })(),
  apiUri: process.env.NYLAS_API_URI ?? "https://api.nylas.com", // default Nylas API URI
};

export const nylas = new Nylas({
  apiKey: nylasConfig.apiKey,
  apiUri: nylasConfig.apiUri,
});
