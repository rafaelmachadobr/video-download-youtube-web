from typing import Dict, Optional

from fastapi import FastAPI, HTTPException
from pytube import YouTube
from pytube.exceptions import VideoUnavailable, AgeRestrictedError, VideoPrivate

app = FastAPI()

YOUTUBE_BASE_URL = "https://www.youtube.com/watch?v="


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
    - Dict[str, str]: um dicionário contendo informações sobre o vídeo, incluindo título, thumbnail e autor.
    """
    yt = YouTube(url)
    return {
        "title": yt.title,
        "thumbnail": yt.thumbnail_url,
        "author": yt.author,
        "description": yt.description,
        "length": yt.length,
        "views": yt.views,
        "rating": yt.rating,
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
    elif isinstance(exception, AgeRestrictedError):
        return HTTPException(status_code=403, detail=f"Vídeo restrito por idade: {str(exception)}")
    elif isinstance(exception, KeyError):
        return HTTPException(status_code=404, detail=f"Vídeo não encontrado: {str(exception)}")
    elif isinstance(exception, VideoPrivate):
        return HTTPException(status_code=403, detail=f"Vídeo privado: {str(exception)}")
    else:
        return HTTPException(status_code=500, detail=f"Erro ao obter informações do vídeo: {str(exception)}")


@app.get("/api/video/info/{video_id}", response_model=dict)
def get_video_info_route(video_id: str):
    """
    Rota para obter informações sobre um vídeo do YouTube.

    Parameters:
    - video_id (str): O ID do vídeo do YouTube.

    Returns:
    - dict: um dicionário contendo informações sobre o vídeo, conforme especificado pela função `get_video_info`.
    """
    try:
        video_url = build_video_url(video_id)
        video_info = get_video_info(video_url)
        return video_info
    except Exception as e:
        exception_response = handle_exceptions(e)
        if exception_response:
            raise exception_response from e
