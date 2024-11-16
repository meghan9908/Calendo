import { session } from "@/app/libs/session";
import { EventTypeModel } from "@/app/models/events";
import mongoose from "mongoose";
import { NextRequest } from "next/server";
function URIFromTitle(title:string){
 return title.toLowerCase().replaceAll(/[^a-z0-9]/g,'-')
}
export async function POST(req:NextRequest){
    await mongoose.connect(process.env.MONGODB_URI ?? 'No URL');
    const sessionData = await session()
    const email =await sessionData?.get('email');
    const data =await req.json();
    data.uri = URIFromTitle(data?.title);
    const EventTypeDoc = await EventTypeModel.create({email, ...data});

    return Response.json(EventTypeDoc);
}
export async function PUT(req:NextRequest){
    await mongoose.connect(process.env.MONGODB_URI ?? 'No URL');
    const sessionData = await session();
    const email =await sessionData?.get('email');
    const data =await req.json();
    data.uri = URIFromTitle(data?.title);
    await mongoose.connect(process.env.MONGODB_URI ?? 'No URL');

    const EventTypeDoc = await EventTypeModel.updateOne({email,_id:data.id},{ ...data});

    return Response.json(EventTypeDoc);
}
export async function DELETE(req:NextRequest){
    console.log("logged for deletion")
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    await mongoose.connect(process.env.MONGODB_URI ?? 'No URL');
    await EventTypeModel.deleteOne({_id:id})
    return Response.json(true);



    
    
}