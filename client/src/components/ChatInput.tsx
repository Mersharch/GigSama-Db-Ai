import { FormEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Arrow from "@/assets/arrow.svg";
import { useAppState } from "@/hooks/useAppState";
import BlocksShuffle from "@/assets/blocks-shuffle-3.svg";
import {
  continueProjectConversation,
  createProject,
} from "@/services/ProjectService";
import { useNavigate } from "react-router";

export default function ChatInput() {
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { project, setProject, token } = useAppState();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!newMessage.trim()) {
      alert("Message cannot be empty");
      return;
    }

    try {
      let response;
      if (project === null) {
        response = await createProject(newMessage, token);
        setProject(response.project);
        navigate(`/${response?.project?.id}`);
      } else {
        response = await continueProjectConversation(
          newMessage,
          project?.id,
          token
        );
        setProject(response.project);
      }
      console.log(response);
      setNewMessage("");
    } catch (error) {
      console.log("Error creating Project: ", error);
      return alert("Error creating Project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      {loading && (
        <div className="w-full flex justify-center mb-2">
          <img
            src={BlocksShuffle}
            alt="Send"
            className="w-6 h-6 align-middle"
          />
        </div>
      )}
      <form
        className="flex items-center w-full border rounded-xl px-4 py-3 shadow-lg space-x-2"
        onSubmit={handleSubmit}
      >
        <Input
          placeholder="Ask anything"
          className="placeholder:text-gray-300 text-slate-500 shadow-none focus:ring-0 focus:outline-none border-none flex-1 focus-visible:ring-0"
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <Button
          variant="ghost"
          className="cursor-pointer p-0 hover:bg-transparent hover:scale-110 transition-all ease-in-out"
          type="submit"
        >
          <img src={Arrow} alt="Send" className="w-6 h-6" />
        </Button>
      </form>
    </div>
  );
}
