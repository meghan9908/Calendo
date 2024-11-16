import mongoose, { models, Schema, model } from "mongoose";

interface Iprofile extends mongoose.Document {
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
