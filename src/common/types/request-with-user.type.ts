import { Role } from "../enum/roles.enum";
import { Request } from "express";

export interface RequestWithUser extends Request {
    user: {
        userId: string;
        email: string;
        role: Role;
        [key: string]: any;
    };
}