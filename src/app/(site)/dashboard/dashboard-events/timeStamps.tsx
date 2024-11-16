export default function Timestamps({steps=30,value,onChange}
    :{steps:30|60,value:string,onChange:(val:string)=>void}){
    const times =["00:00"];
    for(let i =0;i<24;i++){
        let hours = i.toString().padStart(2, '0');
        let minutes = "00";
        if(steps ==30){
            minutes = "30";
        }
        times.push(`${hours}:${minutes}`);
    }
    return(
        <select value={value} key ={Date()} onChange ={ev =>onChange(ev.target.value)}>
        {times.map(time=>(
        <option value={time}>{time}</option>
        ))}
    </select>
    )


}