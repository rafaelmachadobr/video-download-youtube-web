from typing import Dict, Optional

from fastapi import HTTPException
from pytube import YouTube
from pytube.exceptions import VideoUnavailable, AgeRestrictedError, VideoPrivate

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
        "title": yt.title,
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
