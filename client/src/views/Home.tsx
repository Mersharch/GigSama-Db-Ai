import ChatContent from "@/components/ChatContent";
import ChatInput from "@/components/ChatInput";
import XMLRenderer from "@/components/XMLRenderer";
import { useAppState } from "@/hooks/useAppState";
import { useLayoutEffect } from "react";

export default function Home() {
  const { project, setProject } = useAppState();
  useLayoutEffect(() => {
    setProject(null);
  }, [setProject]);
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-between pt-16 overflow-y-auto scrollbar-hide">
      {/* ERD SCHEMA DISPLAY */}
      <section className="flex items-center justify-center p-4 w-full">
        {project && <XMLRenderer />}
      </section>

      {/* CHAT SECTION */}
      <section
        className={`flex-1 flex flex-col items-center ${
          project === null ? "justify-evenly" : "justify-end"
        }  overflow-y-auto w-full max-w-4xl`}
      >
        <ChatContent />
        <ChatInput />
      </section>
    </div>
  );
}
