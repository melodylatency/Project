import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  // set jwt as an http only cookie
  res.cookie("operation", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 1296000000,
  });
};

export default generateToken;
