import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin user",
    email: "admin@mail.com",
    password: bcrypt.hashSync("123456789", 10),
    isAdmin: true,
    isBlocked: false,
  },
  {
    name: "John Genji user",
    email: "johngenji@mail.com",
    password: bcrypt.hashSync("123456789", 10),
    isAdmin: false,
    isBlocked: false,
  },
  {
    name: "Ching Chang",
    email: "chingchang@mail.com",
    password: bcrypt.hashSync("123456789", 10),
    isAdmin: false,
    isBlocked: false,
  },
];

export default users;
