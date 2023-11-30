import { useState } from "react";
import { FaArrowRight, FaDownload, FaPlay } from "react-icons/fa";
import { MdContentPaste } from "react-icons/md";
import Logo from "./assets/logo.jpeg";
import { api } from "./services/api";
import { Video } from "./types/Video";
import { getVideoIdFromUrl } from "./utils/getVideoIdFromUrl";
import { formatVideoLength } from "./utils/formatVideoLength";

export default function App() {
  const [videoLink, setVideoLink] = useState("");
  const [format, setFormat] = useState("mp4");
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<Video | null>();

  const handleSubmit = async () => {
    setLoading(true);

    const videoId = getVideoIdFromUrl(videoLink);

    const response = await api.get<Video>(`/api/video/info/${videoId}`);
    setVideoInfo(response.data);
    setLoading(false);
  };

  if (loading) return <h1>Carregando...</h1>;

  return (
    <main className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white py-8 px-4 shadow-lg rounded-lg w-full max-w-3xl md:w-[90%] transition-all duration-200 hover:shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-primary">
            <div className="text-center md:text-left">
              Baixador de vídeos do YouTube
              <div className="text-sm text-accent mt-2 md:mt-0 md:text-center">
                v1.0.0
              </div>
            </div>
            <div className="animate-bounce p-2 rounded-full flex justify-center items-center w-32 h-32">
              <img
                src={Logo}
                alt="Logo"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        </h1>

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
        <small className="text-gray-400 align-start block mt-4">
          Baixe vídeos do YouTube de forma eficiente com Pytube, uma biblioteca
          Python para baixar vídeos do YouTube.
        </small>

        {videoInfo && (
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
                    <span className="font-bold">Título: </span>{" "}
                    {videoInfo.title}
                  </p>
                  <p>
                    <span className="font-bold">Canal: </span>{" "}
                    {videoInfo.author}
                  </p>
                  <p>
                    <span className="font-bold">Duração: </span>{" "} {formatVideoLength(videoInfo.length)}
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
              <button className="mt-4 bg-accent text-white rounded-md p-3 w-full transition-all duration-200 hover:scale-105 flex justify-center items-center gap-3 text-lg mx-4">
                <FaDownload className="inline-block" /> Baixar
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
