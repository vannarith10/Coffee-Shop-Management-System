// types/status.ts
//



export type Status = "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "SUSPENDED";


export const STATUSES: Status[] = [
    "ACTIVE", "INACTIVE", "ON_LEAVE", "SUSPENDED"
];


export const USER_STATUS_COLOR_CONFIG = {
    ACTIVE: {
        background_color: "bg-green-600",
    },
    INACTIVE: {
         background_color: "bg-amber-600",
    },
    ON_LEAVE: {
         background_color: "bg-blue-600",
    },
    SUSPENDED: {
         background_color: "bg-red-800",
    }
}
