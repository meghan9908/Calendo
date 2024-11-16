import EventTypeForm from "@/app/components/EventTypeform";
import { EventTypeModel } from "@/app/models/events";
import mongoose from "mongoose";

type pageparams = {
    params:{
        id:string
    };
};

export default async function editEventType({ params }: pageparams) {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const doc = await EventTypeModel.findOne({ _id:params?.id as string });

    return (
        <div>
            <EventTypeForm doc = {JSON.parse(JSON.stringify(doc))
}/>


        </div>
    );
}
