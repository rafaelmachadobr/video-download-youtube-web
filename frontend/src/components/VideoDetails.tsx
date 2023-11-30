import React from "react";
import { FaDownload, FaPlay } from "react-icons/fa";
import { Video } from "../types/Video";
import { formatVideoLength } from "../utils/formatVideoLength";

interface VideoDetailsProps {
  videoInfo: Video;
  format: string;
  setFormat: React.Dispatch<React.SetStateAction<string>>;
  handleDownload: () => void;
}

function VideoDetails({
  videoInfo,
  format,
  setFormat,
  handleDownload,
}: VideoDetailsProps) {
  return (
    <>
      <div className="mt-8 flex justify-center items-center gap-4 md:flex-row flex-col border border-gray-300 rounded-md p-2">
        <div className="flex justify-center items-center w-full md:w-[50%] h-full relative">
          <img
            src={videoInfo.thumbnail}
            className="rounded-md object-cover w-full"
            alt="Thumbnail"
          />

          <a
            className="absolute flex justify-center items-center bg-gray-100 rounded-full w-12 h-12 shadow-md hover:bg-gray-200 transition-all duration-200 cursor-pointer"
            title="Reproduzir"
            href={videoInfo.url}
            target="_blank"
          >
            <FaPlay className="text-2xl text-gray-400" />
          </a>
        </div>

        <div className="md:w-[50%] flex flex-col gap-2">
          <div className="flex flex-col gap-4 justify-between items-start align-center">
            <p>
              <span className="font-bold">Título: </span> {videoInfo.title}
            </p>
            <p>
              <span className="font-bold">Canal: </span>{" "}
              <a
                href={`https://www.youtube.com/@${videoInfo.author}`}
                target="_blank"
                className="text-primary hover:underline"
              >
                {videoInfo.author}
              </a>
            </p>
            <p>
              <span className="font-bold">Duração: </span>{" "}
              {formatVideoLength(videoInfo.length)}
            </p>
            <div className="flex flex-row gap-2 items-center justify-between">
              <label className="font-bold" htmlFor="format">
                Formato de saída:
              </label>
              <select
                name="format"
                id="format"
                className="border border-gray-300 shadow-sm rounded-md p-2 w-full md:w-[100%] lg:w-[200px] focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent focus:ring-opacity-50 transition-all duration-200"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="mp4">MP4</option>
                <option value="mp3">MP3</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-center items-center">
        <button
          className="mt-4 bg-accent text-white rounded-md p-3 w-full transition-all duration-200 hover:scale-105 flex justify-center items-center gap-3 text-lg mx-4"
          onClick={() => handleDownload()}
        >
          <FaDownload className="inline-block" /> Baixar
        </button>
      </div>
    </>
  );
}

export default VideoDetails;
