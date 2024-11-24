import { session } from "@/app/libs/session";
import { ResponseCookies } from "@edge-runtime/cookies";

export async function GET() {
  // Log the action
  console.log("logout_api");

  // Create headers for the response
  const headers = new Headers();
  const responseCookies = new ResponseCookies(headers);

  // Delete the session cookie
  console.log("response_cookies", responseCookies);
  session.deleteSession(responseCookies);

  // Return a response with a redirect
  return new Response(null, {
    status: 302, // Redirect status code
    headers: {
      Location: "/?logout=1", // Specify the redirect location
      ...Object.fromEntries(headers), // Include the modified headers with cookies
    },
  });
}
