import { Guest } from "./guest";

export interface Comment {
    id? : number;
    guest_id? : number;
    comment?: string;
    created_at: string;
    updated_at: string;
    guest? : Guest
}
