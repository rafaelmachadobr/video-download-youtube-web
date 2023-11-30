import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { MdContentPaste } from "react-icons/md";
import { toast } from "react-toastify";
import Logo from "./assets/logo.jpeg";
import Loader from "./components/Loader";
import VideoDetails from "./components/VideoDetails";
import { api } from "./services/api";
import { Video } from "./types/Video";
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

  if (loading) return <Loader />;

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
          <VideoDetails
            videoInfo={videoInfo}
            format={format}
            setFormat={setFormat}
            handleDownload={handleDownload}
          />
        )}
      </div>
    </main>
  );
}
