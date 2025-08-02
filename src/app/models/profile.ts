// profile.ts
// This file defines the Profile model for MongoDB using Mongoose.
import mongoose, { models, Schema, model } from "mongoose";

export interface Iprofile extends mongoose.Document {
    email: string;
    username: string;
    grantId:string;
}

const ProfileSchema = new Schema<Iprofile>({
    email: { type: String, required: true, unique: true }, 
    username: { type: String, required: false, unique: true },
    grantId: { type:String, required:true}
});

// Check if the model already exists, otherwise create a new one
export const ProfileModel = models?.Profile || model<Iprofile>('Profile', ProfileSchema);
