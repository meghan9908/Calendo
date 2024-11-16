import { ProfileModel } from "@/app/models/profile";
import mongoose from "mongoose";
import { NextRequest } from "next/server";
import {nylas} from "@/app/libs/nylas";
import { TimeSlot } from "nylas";

export async function GET(req:NextRequest){
    const url = new URL(req.url)
    const username = url.searchParams.get('username')
    const from  = new Date(url.searchParams.get('from') as string)
    const to  = new Date(url.searchParams.get('to') as string)

    await mongoose.connect(process.env.MONGODB_URI as string)
    const profileDoc = await ProfileModel.findOne({username})
    if(!profileDoc){
        return Response.json('invalid username and/or bookingURI',{status:404})
    }
    try {
        const calendar = await nylas.calendars.getFreeBusy({
          identifier: profileDoc.grantId as string,
          requestBody: {
            startTime: Math.round(from.getTime()/1000),
            endTime: Math.round(to.getTime()/1000),
            emails: [profileDoc.email as string]
          }
        })
        console.log('Calendar:', calendar)
        if(calendar?.data?.[0]){
            //@ts-ignore
            const slots = calendar.data?.[0]?.timeSlots as TimeSlot
             //@ts-ignore
            const busySlots = slots?.filter((slot) =>slot.status == 'busy')
            return  Response.json(busySlots,{status:200})
        }
      } catch (error) {
          console.error('Error to create calendar:', error)
          return  Response.json('Error to create calendar:',{status:404})
      }
    

}