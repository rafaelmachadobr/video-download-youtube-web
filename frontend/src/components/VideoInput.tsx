import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { MdContentPaste } from "react-icons/md";

interface VideoInputProps {
  videoLink: string;
  setVideoLink: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: () => void;
}

function VideoInput({
  videoLink,
  setVideoLink,
  handleSubmit,
}: VideoInputProps) {
  return (
    <>
      <div className="mt-4 flex justify-center items-center flex-col md:flex-row">
        <div className="relative flex justify-center items-center gap-2 w-full md:w-[80%]">
          <label htmlFor="videoLink" className="sr-only">
            Cole ou digite o link do vídeo aqui
          </label>
          <input
            id="videoLink"
            className="border border-gray-300 shadow-sm rounded-md p-2 w-full md:w-[100%] focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent focus:ring-opacity-50 transition-all duration-200"
            type="text"
            placeholder="Cole ou digite o link do vídeo aqui"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
          />
          <div
            className="absolute text-gray-400 right-2 hover:text-gray-500 cursor-pointer hover:scale-110  transition-transform duration-200 hover:bg-gray-100 rounded-full p-2"
            title="Colar"
            onClick={() => {
              navigator.clipboard.readText().then((text) => {
                setVideoLink(text);
              });
            }}
          >
            <MdContentPaste />
          </div>
        </div>
        <button
          className="md:ml-4 bg-secondary text-white rounded-md p-3 w-full md:w-[20%] hover:bg-secondary transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50 flex justify-center items-center gap-1"
          onClick={handleSubmit}
        >
          <FaArrowRight className="inline-block" />
        </button>
      </div>
    </>
  );
}

export default VideoInput;
