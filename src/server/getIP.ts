import { NextRequest } from "next/server";

export const getIP = (req: NextRequest) => {
  return req.ip || "127.0.0.1";
};
