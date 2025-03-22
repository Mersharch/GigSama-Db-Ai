import { Route, Routes } from "react-router";
import Header from "./components/Header";
import AuthScreen from "./views/AuthScreen";
import Home from "./views/Home";
import { useAppState } from "./hooks/useAppState";
import UniqueProject from "./views/UniqueProject";
import ProjectHistory from "./views/ProjectHistory";

export default function App() {
  const { token } = useAppState();

  return (
    <main className="w-full flex-1 min-h-screen h-full flex flex-col overflow-auto scrollbar-hide">
      <Header />
      <Routes>
        {!token ? (
          <Route path="/" element={<AuthScreen />} />
        ) : (
          <Route path="/">
            <Route index element={<Home />} />
            <Route path=":projectId" element={<UniqueProject />} />
            <Route path="projects" element={<ProjectHistory />} />
          </Route>
        )}
      </Routes>
    </main>
  );
}
