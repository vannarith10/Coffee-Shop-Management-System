// pages/admin/StaffTab.tsx
//

import DisplayStaff from "../../components/DisplayStaff";




export default function StaffTab () {


    return (
        <div className="w-full h-full mt-20 md:mt-0 p-4 flex flex-col gap-4">
            <div>
                <h1 className="text-2xl xl:text-4xl font-extrabold">Staff Management</h1>
                <p className="text-sm text-text-secondary">Oversee your team and manage shift schedules.</p>
            </div>
            <DisplayStaff/>
        </div>
    )
}