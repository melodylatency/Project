import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin user",
    email: "admin@mail.com",
    password: bcrypt.hashSync("1", 10),
    isAdmin: true,
    isBlocked: false,
  },
  {
    name: "A",
    email: "a@mail.com",
    password: bcrypt.hashSync("1", 10),
    isAdmin: false,
    isBlocked: false,
  },
  {
    name: "david",
    email: "david@mail.com",
    password: bcrypt.hashSync("1", 10),
    isAdmin: false,
    isBlocked: false,
  },
];

export default users;
