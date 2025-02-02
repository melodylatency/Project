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
    name: "A",
    email: "a@mail.com",
    password: bcrypt.hashSync("1", 10),
    is_admin: false,
    is_blocked: false,
  },
  {
    name: "david",
    email: "david@mail.com",
    password: bcrypt.hashSync("123", 10),
    is_admin: false,
    is_blocked: false,
  },
];

export default users;
