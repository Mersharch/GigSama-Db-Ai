import KeymapLogo from "../assets/keymap-logo.svg";
import HistoryIcon from "../assets/history-icon.svg";
import { NavLink } from "react-router";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useAppState } from "@/hooks/useAppState";

export default function Header() {
  const { user, project } = useAppState();
  return (
    <header className="fixed top-0 left-0 w-full border shadow-md px-5 pt-0 flex items-center justify-between bg-white z-10">
      <NavLink to={"/"}>
        <img src={KeymapLogo} alt="KeyMap Logo" className="w-16 h-16" />
      </NavLink>

      {project && (
        <h1 className="text-xs md:text-base font-bold text-slate-700">
          {project?.title}
        </h1>
      )}

      <div className="flex items-center space-x-2">
        <NavLink to={"/projects"}>
          <img
            src={HistoryIcon}
            alt="KeyMap Logo"
            className="w-5 h-5 hover:scale-70 cursor-pointer transition-all ease-in"
          />
        </NavLink>
        {/* Avatar */}
        <Avatar className="w-5 h-5">
          <AvatarFallback className="bg-slate-300">
            {user.charAt(0).toLocaleUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
