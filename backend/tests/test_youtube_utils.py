from fastapi import HTTPException
from pytube.exceptions import VideoUnavailable

from app.utils.youtube_utils import build_video_url, get_video_info, handle_exceptions

VALID_VIDEO_ID = "S9uPNppGsGo"
VALID_VIDEO_URL = f"https://www.youtube.com/watch?v={VALID_VIDEO_ID}"
EXPECTED_VIDEO_INFO = {
    "title": "Curso Python #01 - Seja um Programador",
    "thumbnail": "https://i.ytimg.com/vi/S9uPNppGsGo/hq720.jpg",
    "author": "Curso em Vídeo",
    "length": 1747,
}


def test_build_video_url():
    result = build_video_url(VALID_VIDEO_ID)
    assert result == VALID_VIDEO_URL


def test_get_video_info():
    result = get_video_info(VALID_VIDEO_URL)
    assert result == EXPECTED_VIDEO_INFO


def test_handle_exceptions_video_unavailable():
    exception = VideoUnavailable("Video not available")
    result = handle_exceptions(exception)
    assert isinstance(result, HTTPException)
    assert result.status_code == 404
    assert result.detail == "Vídeo não disponível: Video not available is unavailable"


def test_handle_exceptions_key_error():
    exception = KeyError("Video not found")
    result = handle_exceptions(exception)
    assert isinstance(result, HTTPException)
    assert result.status_code == 404
    assert result.detail == "Vídeo não encontrado: 'Video not found'"


def test_handle_exceptions_generic_error():
    exception = Exception("Generic error")
    result = handle_exceptions(exception)
    assert isinstance(result, HTTPException)
    assert result.status_code == 500
    assert result.detail == "Erro ao obter informações do vídeo: Generic error"
