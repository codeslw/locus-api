import { Role } from "src/common/enum/roles.enum";
import * as bcrypt from 'bcryptjs';



export const usersMock = [
  {
    id: crypto.randomUUID(),
    email: 'test-normal1@test.com',
    role: Role.NORMAL,
    password: bcrypt.hashSync('password123'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    email: 'test-limited1@test.com',
    role: Role.LIMITED,
    password: bcrypt.hashSync('password123'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    email: 'test-admin1@test.com',
    role: Role.ADMIN,
    password: bcrypt.hashSync('password123'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
];