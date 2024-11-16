import { nylas, nylasConfig } from "@/app/libs/nylas";
import { redirect } from "next/navigation";
export async function GET(){
    const authUrl = nylas.auth.urlForOAuth2({
        clientId: nylasConfig.clientId, // Note this is *different* from your API key. Make sure to put these in environment variables
        redirectUri: nylasConfig.callbackUri, // URI you registered with Nylas in the previous step
      });
      return redirect(authUrl) 
    
      // This is one way to redirect the user to the auth screen. Depending on your architecture you may want to pass
      // the url back to your frontend for redirection, that's up to you    
    
}