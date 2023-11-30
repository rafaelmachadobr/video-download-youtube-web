import { useState } from "react";
import { toast } from "react-toastify";
import Header from "./components/Header";
import Loader from "./components/Loader";
import VideoDetails from "./components/VideoDetails";
import VideoInput from "./components/VideoInput";
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
        <Header />

        <VideoInput
          videoLink={videoLink}
          setVideoLink={setVideoLink}
          handleSubmit={handleSubmit}
        />

        {(videoInfo && (
          <VideoDetails
            videoInfo={videoInfo}
            format={format}
            setFormat={setFormat}
            handleDownload={handleDownload}
          />
        )) || (
          <small className="text-gray-400 align-start block mt-4">
            Explore a eficiência do baixador de vídeos do YouTube, desenvolvido
            com o poderoso Pytube, uma biblioteca Python especializada em
            downloads de vídeos do YouTube. Simplifique a experiência de obter
            seus vídeos favoritos diretamente para o seu dispositivo.
            Experimente agora e descubra uma maneira fácil e rápida de baixar
            vídeos do YouTube!
          </small>
        )}
      </div>
    </main>
  );
}
