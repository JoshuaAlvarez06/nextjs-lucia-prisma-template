import { AuthContext } from "@/components";
import { useContext } from "react";

export function useSession() {
  const { state } = useContext(AuthContext);
  return state;
}
