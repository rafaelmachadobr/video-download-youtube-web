import pytest
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


@pytest.mark.parametrize("video_id, expected_url", [(VALID_VIDEO_ID, VALID_VIDEO_URL)])
def test_build_video_url(video_id, expected_url):
    """
    Testa a função build_video_url.

    Verifica se a função retorna a URL correta para um vídeo do YouTube.
    """
    result = build_video_url(video_id)
    assert result == expected_url


@pytest.mark.parametrize("url, expected_info", [(VALID_VIDEO_URL, EXPECTED_VIDEO_INFO)])
def test_get_video_info(url, expected_info):
    """
    Testa a função get_video_info.

    Verifica se a função retorna as informações corretas para um vídeo do YouTube.
    """
    result = get_video_info(url)
    assert result == expected_info


def test_handle_exceptions_video_unavailable():
    """
    Testa a função handle_exceptions com VideoUnavailable.

    Verifica se a exceção VideoUnavailable é tratada corretamente.
    """
    exception = VideoUnavailable("Video not available")
    result = handle_exceptions(exception)
    assert isinstance(result, HTTPException)
    assert result.status_code == 404
    assert result.detail == "Vídeo não disponível: Video not available is unavailable"


def test_handle_exceptions_key_error():
    """
    Testa a função handle_exceptions com KeyError.

    Verifica se a exceção KeyError é tratada corretamente.
    """
    exception = KeyError("Video not found")
    result = handle_exceptions(exception)
    assert isinstance(result, HTTPException)
    assert result.status_code == 404
    assert result.detail == "Vídeo não encontrado: 'Video not found'"


def test_handle_exceptions_generic_error():
    """
    Testa a função handle_exceptions com Exception genérica.

    Verifica se uma exceção genérica é tratada corretamente.
    """
    exception = Exception("Generic error")
    result = handle_exceptions(exception)
    assert isinstance(result, HTTPException)
    assert result.status_code == 500
    assert result.detail == "Erro ao obter informações do vídeo: Generic error"


if __name__ == "__main__":
    pytest.main()
