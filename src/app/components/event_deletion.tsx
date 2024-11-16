'use client'

import axios from "axios";
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation";
import { useState } from "react"


export default function EventDeletion({id}:{id:string}){
    
    const router = useRouter()
    async function handleDeletion(){
        await axios.delete("/api/event-types?id="+id)
        await router.push("/dashboard/dashboard-events")
        await router.refresh()
    }
    const [showConfirmation,setShowConfirmation] = useState(false);
    return (
        <>
        <div className="col-span-3 flex text-center  my-3">
                        {showConfirmation?(
                              <>
                              <button type="button" className="btn-blue mr-3 !bg-red-600 flex items-center text-center"
                              onClick={async ()=>handleDeletion()}
                              aria-label="Delete event details">
                                 <Trash size={16}  className='mr-1'/>
                                 ARE U SURE
                             </button>
                             <button type="button" className="btn-blue flex items-center text-center "
                             onClick={()=>setShowConfirmation(false)}
                             aria-label="Delete event details">
                                <Trash size={16}  className='mr-1'/>
                                CANCEL
                            </button>
                            </>
                        ):(
                            <button type="button" className="btn-blue !bg-red-600 flex items-center text-center "
                             onClick={()=>setShowConfirmation(true)}
                             aria-label="Delete event details">
                                <Trash size={16}  className='mr-1'/>
                                Delete Events
                            </button>
                        )}
                        </div>
        </>
    )
}
// 04:45:00 