from io import BytesIO
from typing import Dict, Optional

from fastapi import HTTPException
from pytube import YouTube
from pytube.exceptions import VideoUnavailable

YOUTUBE_BASE_URL: str = "https://www.youtube.com/watch?v="


def build_video_url(video_id: str) -> str:
    """
    Constrói a URL completa do vídeo do YouTube a partir do ID.

    Parameters:
    - video_id (str): O ID do vídeo do YouTube.

    Returns:
    - str: A URL completa do vídeo.
    """
    return f"{YOUTUBE_BASE_URL}{video_id}"


def get_video_info(url: str) -> Dict[str, str]:
    """
    Obtém informações sobre um vídeo do YouTube.

    Parameters:
    - url (str): A URL do vídeo do YouTube.

    Returns:
    - Dict[str, str]: um dicionário contendo informações sobre o vídeo, incluindo título, thumbnail, autor, descrição,
    duração (em segundos), visualizações e classificação.
    """
    yt = YouTube(url)
    return {
        "title": yt.title.encode('utf-8').decode('latin-1'),
        "thumbnail": yt.thumbnail_url,
        "author": yt.author,
        "length": yt.length,
    }


def handle_exceptions(exception: Exception) -> Optional[HTTPException]:
    """
    Lida com exceções específicas e converte-as em HTTPExceptions.

    Parameters:
    - exception (Exception): A exceção a ser tratada.

    Returns:
    - Optional[HTTPException]: uma instância de HTTPException, se a exceção for tratada, caso contrário, None.
    """
    if isinstance(exception, VideoUnavailable):
        return HTTPException(status_code=404, detail=f"Vídeo não disponível: {str(exception)}")
    elif isinstance(exception, KeyError):
        return HTTPException(status_code=404, detail=f"Vídeo não encontrado: {str(exception)}")
    else:
        return HTTPException(status_code=500, detail=f"Erro ao obter informações do vídeo: {str(exception)}")


def download_video_logic(video_url: str, video_format: str):
    """
    Download do vídeo do YouTube

    Parameters:
    - video_url (str): A URL do vídeo do YouTube.
    - video_format (str): O formato do vídeo a ser baixado. Pode ser "mp3" ou "mp4".

    Returns:
    - Tuple[bytes, str]: uma tupla contendo o conteúdo do vídeo e a extensão do arquivo.
    """
    yt = YouTube(video_url)

    if video_format == "mp3":
        stream = yt.streams.get_audio_only()
        file_extension = "mp3"
    else:
        stream = yt.streams.get_highest_resolution()
        file_extension = "mp4"

    buffer = BytesIO()
    stream.stream_to_buffer(buffer=buffer)

    if not buffer.getvalue():
        raise HTTPException(
            status_code=500, detail="Erro ao obter o conteúdo do vídeo.")

    content = buffer.getvalue()
    return content, file_extension
