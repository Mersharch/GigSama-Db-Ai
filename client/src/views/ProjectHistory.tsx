import { useAppState } from "@/hooks/useAppState";
import { allProjects } from "@/services/ProjectService";
import { useCallback, useEffect, useState } from "react";
import BlocksShuffle from "@/assets/blocks-shuffle-3.svg";
import { NavLink } from "react-router";

export default function ProjectHistory() {
  const [loading, setLoading] = useState<boolean>(false);
  const { projects, token, setProjects, setProject } = useAppState();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await allProjects(token);
      console.log(response);
      setProjects(response);
    } catch (error) {
      console.log("Error fetching Projects: ", error);
      alert("Error fetching Projects");
    } finally {
      setLoading(false);
    }
  }, [token, setProjects]);

  useEffect(() => {
    setProject(null);
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return (
      <div className="w-full flex justify-center mt-5">
        <img src={BlocksShuffle} alt="Loading" className="w-6 h-6 " />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full mt-40 lg:mt-60 space-y-5 px-4">
      {projects && projects.length > 0 ? (
        projects
          .slice()
          .reverse()
          .map((project) => (
            <NavLink
              key={project.id}
              to={`/${project.id}`}
              className="text-lg text-slate-600 hover:text-blue-800 hover:scale-110 transition-all ease-in-out duration-200 w-full text-center"
            >
              {project.title}
            </NavLink>
          ))
      ) : (
        <div className="text-center">
          <p className="text-lg text-slate-600">No projects available.</p>
        </div>
      )}
      <NavLink
        to="/"
        className="mt-4 inline-block bg-black text-white px-4 py-2 rounded hover:bg-slate-700 transition-colors duration-200"
      >
        + New Project
      </NavLink>
    </div>
  );
}
