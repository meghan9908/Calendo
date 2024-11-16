export type timeSchema ={
    From:string,
    To:string,
    active:boolean
}
export type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

export type BookingType = Record<Weekday,timeSchema>

export type eventType = {
    _id:string,
    email:string,
    uri:string,
    title:string,
    description:string,
    duration:number,
    createdAt:string,
    bookingTime:Record<Weekday,timeSchema>
}
export type profileType ={
    email: string;
    username: string;
    grantId:string;
}
