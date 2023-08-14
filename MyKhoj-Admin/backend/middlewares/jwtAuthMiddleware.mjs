import jwt from "jsonwebtoken";
const secretKey = process.env.SECRETKEY;

const generateToken = (payload) => {
  const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let random = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const randomChar = characters[randomIndex];
    random += randomChar;
  }
  const dotIndex = token.indexOf(".");
  let modifiedToken = token;
  modifiedToken =
    modifiedToken.slice(0, dotIndex + 59) +
    random.charAt(9) +
    modifiedToken.slice(dotIndex + 59);
  modifiedToken =
    modifiedToken.slice(0, dotIndex + 49) +
    random.charAt(8) +
    modifiedToken.slice(dotIndex + 49);
  modifiedToken =
    modifiedToken.slice(0, dotIndex + 40) +
    random.charAt(7) +
    modifiedToken.slice(dotIndex + 40);
  modifiedToken =
    modifiedToken.slice(0, dotIndex + 32) +
    random.charAt(6) +
    modifiedToken.slice(dotIndex + 32);
  modifiedToken =
    modifiedToken.slice(0, dotIndex + 25) +
    random.charAt(5) +
    modifiedToken.slice(dotIndex + 25);
  modifiedToken =
    modifiedToken.slice(0, dotIndex + 19) +
    random.charAt(4) +
    modifiedToken.slice(dotIndex + 19);
  modifiedToken =
    modifiedToken.slice(0, dotIndex + 14) +
    random.charAt(3) +
    modifiedToken.slice(dotIndex + 14);
  modifiedToken =
    modifiedToken.slice(0, dotIndex + 10) +
    random.charAt(2) +
    modifiedToken.slice(dotIndex + 10);
  modifiedToken =
    modifiedToken.slice(0, dotIndex + 7) +
    random.charAt(1) +
    modifiedToken.slice(dotIndex + 7);
  modifiedToken =
    modifiedToken.slice(0, dotIndex + 5) +
    random.charAt(0) +
    modifiedToken.slice(dotIndex + 5);
  return modifiedToken;
};

const removeExtraCharacters = (token) => {
  const dotIndex = token.indexOf(".");
  let modifiedToken = token;
  modifiedToken = modifiedToken.slice(0, dotIndex + 68) + modifiedToken.slice(dotIndex + 69);
  modifiedToken = modifiedToken.slice(0, dotIndex + 57) + modifiedToken.slice(dotIndex + 58);
  modifiedToken = modifiedToken.slice(0, dotIndex + 47) + modifiedToken.slice(dotIndex + 48);
  modifiedToken = modifiedToken.slice(0, dotIndex + 38) + modifiedToken.slice(dotIndex + 39);
  modifiedToken = modifiedToken.slice(0, dotIndex + 30) + modifiedToken.slice(dotIndex + 31);
  modifiedToken = modifiedToken.slice(0, dotIndex + 23) + modifiedToken.slice(dotIndex + 24);
  modifiedToken = modifiedToken.slice(0, dotIndex + 17) + modifiedToken.slice(dotIndex + 18);
  modifiedToken = modifiedToken.slice(0, dotIndex + 12) + modifiedToken.slice(dotIndex + 13);
  modifiedToken = modifiedToken.slice(0, dotIndex + 8) + modifiedToken.slice(dotIndex + 9);
  modifiedToken = modifiedToken.slice(0, dotIndex + 5) + modifiedToken.slice(dotIndex + 6);

  return modifiedToken;
};

const authorize = (req, res, next) => {
  // Retrieve the token from the request headers
  const token = req.headers.authorization;
  // Check if the token exists
  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  try {
    // Remove the added random characters from the modified toke
    const originalToken = removeExtraCharacters(token);

    // Verify the token and extract the user details
    const decodedToken = jwt.verify(originalToken.replace("Bearer ", ""), secretKey);
    req.user = decodedToken; // Attach the decoded user details to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export { generateToken, authorize };
