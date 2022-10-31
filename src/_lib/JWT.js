import JWT from "jsonwebtoken";

export const createTokens = (email) => {
  const token = JWT.sign(
    { email },
    process.env.JWT_SECRET,
    { expiresIn: 60 * 20 * 60 * 60 } // 20 minutes
  );
  console.log(token);
  return token;
};

export const validateToken = (token) => {
  if (!token) return false;

  try {
    const validToken = JWT.verify(token, process.env.JWT_SECRET);
    if (validToken) {
      return validToken;
    }
  } catch (err) {
    console.log({ err });
    return false;
  }
};
