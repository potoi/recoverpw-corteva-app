import JWT from "jsonwebtoken";

export const createTokens = (email) => {
  const token = JWT.sign(
    { email },
    process.env.JWT_SECRET,
    { expiresIn: 60 * 5 } // 5 minutes
  );
  return token;
};

export const validateToken = (token) => {
  if (!token) return false;

  try {
    const decodeToken = JWT.decode(token, process.env.JWT_SECRET);
    if (decodeToken) {
      return decodeToken;
    }
  } catch (err) {
    console.log({ err });
    return false;
  }
};
