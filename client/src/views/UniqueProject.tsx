import ChatContent from "@/components/ChatContent";
import ChatInput from "@/components/ChatInput";
import { useAppState } from "@/hooks/useAppState";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import BlocksShuffle from "@/assets/blocks-shuffle-3.svg";
import { projectById } from "@/services/ProjectService";
import XMLRenderer from "@/components/XMLRenderer";

export default function UniqueProject() {
  const [loading, setLoading] = useState<boolean>(false);

  const { project, setProject, token } = useAppState();
  const { projectId } = useParams();

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    try {
      const response = await projectById(projectId || "", token);

      console.log(response);
      setProject(response);
    } catch (error) {
      console.log("Error fetching Project: ", error);
      return alert("Error fetching Project");
    } finally {
      setLoading(false);
    }
  }, [projectId, token, setProject]);

  useEffect(() => {
    if (!projectId) {
      return alert("Project ID is required.");
    }

    fetchProduct();
  }, [projectId, fetchProduct]);

  if (loading) {
    return (
      <div className="w-full flex justify-center mt-5">
        <img src={BlocksShuffle} alt="Loading" className="w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-between my-16 overflow-y-auto scrollbar-hide">
      {/* ERD SCHEMA DISPLAY */}
      <section className="flex items-center justify-center p-4 w-full">
        <XMLRenderer />
      </section>

      {/* CHAT SECTION */}
      <section
        className={`flex-1 flex flex-col items-center h-full ${
          project === null ? "justify-evenly" : "justify-end"
        }  overflow-y-auto w-full max-w-4xl`}
      >
        <ChatContent />
        <ChatInput />
      </section>
    </div>
  );
}
