export interface User {
    access_token : String;
    token_type: String;
    user : UserDetail;
}

export interface UserDetail {
    id : Number;
    name : String;
    email : String;
    role : String;
}
