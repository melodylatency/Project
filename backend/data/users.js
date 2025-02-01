import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin user",
    email: "admin@mail.com",
    password: bcrypt.hashSync("123456789", 10),
    is_admin: true,
    is_blocked: false,
  },
  {
    name: "John Genji user",
    email: "johngenji@mail.com",
    password: bcrypt.hashSync("123456789", 10),
    is_admin: false,
    is_blocked: false,
  },
  {
    name: "Ching Chang",
    email: "chingchang@mail.com",
    password: bcrypt.hashSync("123456789", 10),
    is_admin: false,
    is_blocked: false,
  },
];

export default users;
