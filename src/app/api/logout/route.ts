import { session } from "@/app/libs/session";
import { redirect } from "next/navigation";

export async function GET() {
    // Clear session data
    await session().set('grantId',null); 
    await session().set('email',null); 

    // Optionally, clear the entire session object if supported
    await session().destroy();
    await redirect("/?logout=1");
    

}
