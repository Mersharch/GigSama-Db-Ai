import { createContext, ReactNode, useState } from "react";

export interface Conversation {
  userInput: string;
  schemaCode: string | null;
  aiResponse: string;
}

interface Project {
  id: string;
  userID: string;
  title: string;
  conversation: Conversation[];
  createAt: Date | undefined;
  updatedAt: Date | undefined;
}

interface AppStateProps {
  user: string;
  token: string;
  setUser: (user: string) => void;
  setToken: (token: string) => void;
  project: Project | null;
  projects: Project[] | null;
  setProject: (data: Project | null) => void;
  setProjects: (data: Project[]) => void;
}

const AppState = createContext<AppStateProps>({
  user: "",
  token: "",
  setUser: () => {},
  setToken: () => {},
  project: null,
  projects: null,
  setProject: () => {},
  setProjects: () => {},
});

const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [project, setProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  const values = {
    user,
    token,
    setUser,
    setToken,
    project,
    projects,
    setProject,
    setProjects,
  };

  return <AppState.Provider value={values}>{children}</AppState.Provider>;
};

export { AppState, AppStateProvider };
