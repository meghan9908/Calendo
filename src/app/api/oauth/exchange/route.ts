import { nylas, nylasConfig } from "@/app/libs/nylas";
import { session } from "@/app/libs/session";
import { ProfileModel } from "@/app/models/profile";
import mongoose from "mongoose";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log("Received callback from Nylas");
  const url = new URL(req.url ?? "");
  const code = url.searchParams.get('code');


  if (!code) {
    return Response.json("No Authorization code Returned from Nylas", { status: 400 });
  }

  const response = await nylas.auth.exchangeCodeForToken({
    clientSecret: nylasConfig.apiKey,
    clientId: nylasConfig.clientId, // Note this is *different* from your API key
    redirectUri: nylasConfig.callbackUri, // URI you registered with Nylas in the previous step
    code,
  });
  const { grantId, email } = response;
  
  await mongoose.connect(process.env.MONGODB_URI ?? 'No URL');
  const profileDoc = await ProfileModel.findOne({
    email:email
  })
  if(profileDoc){
    profileDoc.grantId = grantId
    await profileDoc.save()
  }
  else{
    await ProfileModel.create({email,grantId})
  }
  
  await session().set('email', email);
  console.log("debuging....");
  console.log("received from nylas",email)
  const session_email  = session().get("email");
  console.log("session_email",session_email);




  // You'll use this grantId to make API calls to Nylas perform actions on 
  // behalf of this account. Store this in a database, associated with a user
  process.env.NYLAS_GRANT_ID = grantId
  // This depends on implementation. If the browser is hitting this endpoint
  // you probably want to use res.redirect('/some-successful-frontend-url')
  await redirect('/');


}