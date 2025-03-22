import { AppState } from "@/state/AppContext";
import { useContext } from "react";

export const useAppState = () => {
  return useContext(AppState);
};
