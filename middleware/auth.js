import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

const supabase = createClient( 
  process.env.REACT_APP_SUPABASE_URL, 
  process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY   
);
 
 
 
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // ✅ Only allow YOUR admin email
  if (data.user.email !== "pankajnarwade.word@gmail.com") {
    return res.status(403).json({ message: "Not admin" });
  }

  req.user = data.user;
  next();
};