import { useState } from "react";
import { FaArrowRight, FaDownload, FaPlay } from "react-icons/fa";
import { MdContentPaste } from "react-icons/md";
import { toast } from "react-toastify";
import Logo from "./assets/logo.jpeg";
import { api } from "./services/api";
import { Video } from "./types/Video";
import { formatVideoLength } from "./utils/formatVideoLength";
import { getVideoIdFromUrl } from "./utils/getVideoIdFromUrl";

export default function App() {
  const [videoLink, setVideoLink] = useState("");
  const [format, setFormat] = useState("mp4");
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<Video | null>();

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const videoId = getVideoIdFromUrl(videoLink);

      const response = await api.get<Video>(`/api/video/info/${videoId}`);
      setVideoInfo(response.data);
      toast.success("Vídeo encontrado com sucesso!");
    } catch (error: any) {
      if (error.response && error.response.status === 500) {
        toast.error(
          "Ocorreu um erro ao tentar encontrar o vídeo. Verifique se o link está correto."
        );
      } else {
        toast.error("Ocorreu um erro ao tentar encontrar o vídeo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!videoInfo) {
      toast.info("Por favor, primeiro encontre e selecione um vídeo.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.get(
        `/api/video/download/${getVideoIdFromUrl(videoInfo.url)}/${format}`,
        { responseType: "arraybuffer" }
      );

      const blob = new Blob([response.data], { type: `video/${format}` });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${videoInfo.title}.${format}`;
      a.click();
      toast.success("Vídeo baixado com sucesso!");
    } catch (error) {
      toast.error("Ocorreu um erro ao tentar baixar o vídeo.");
    } finally {
      setVideoInfo(null);
      setVideoLink("");
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center bg-gray-100">
        <div role="status" className="flex justify-center items-center">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );

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
        )}
      </div>
    </main>
  );
}
