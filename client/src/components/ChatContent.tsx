import { useAppState } from "@/hooks/useAppState";

const ChatContent = () => {
  const { user, project } = useAppState();
  console.log(project);
  return (
    <div className="w-full">
      {project === null && (
        <>
          <h1 className="text-3xl w-full text-center font-semibold text-slate-700">
            Welcome, {user}.
          </h1>
          <h2 className="text-xl w-full text-center font-medium text-slate-300 mt-2">
            What are we building today?
          </h2>
        </>
      )}

      {project?.conversation && project.conversation.length > 0 && (
        <div className="w-full flex flex-col items-center my-16 space-y-10">
          <p className="w-11/12 md:w-3/4 lg:w-2/3 text-center text-base p-3 bg-[#E8E8E880] text-slate-700 rounded-lg">
            {project?.conversation.at(-1)?.userInput}
          </p>
          <p className=" w-11/12 md:w-3/4 lg:w-2/3 text-center  text-base p-3 text-slate-500">
            {project?.conversation.at(-1)?.aiResponse}
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatContent;
