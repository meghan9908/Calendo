// booking.ts
// This file defines the Booking model for MongoDB using Mongoose.
import mongoose, { model, models, Schema } from "mongoose";

interface Ibooking extends mongoose.Document{
    guestName:string,
    guestEmail:string,
    guestNotes:string,
    when:Date,
    eventTypeId:string
}

const BookingSchema =new Schema<Ibooking>({
    guestName:String,
    guestEmail:String,
    guestNotes:String,
    when:Date,
    eventTypeId:String

})

export const BookingModel = models?.Booking || model("Booking",BookingSchema)