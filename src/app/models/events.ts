
import { Schema,model, models } from "mongoose";
import { Weekday,timeSchema,eventType } from "../libs/type";

const TimeSchema =new Schema({
    From:String,
    To:String,
    active:Boolean
})

const EventTypeSchema = new Schema({
    email:String,
    uri:String,
    title:String,
    description:String,
    duration:Number,
    createdAt:String,
    bookingTime: new Schema<Record<Weekday,timeSchema>>({
        Monday:TimeSchema,
        Tuesday:TimeSchema,
        Wednesday:TimeSchema,
        Thursday:TimeSchema,
        Friday:TimeSchema,
        Saturday:TimeSchema,
        Sunday:TimeSchema
    })

},{
    timestamps:true
})


export const EventTypeModel = models?.EventType || model<eventType>('EventType', EventTypeSchema);
