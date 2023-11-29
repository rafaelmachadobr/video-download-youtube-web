from fastapi import APIRouter

from .utils.youtube_utils import build_video_url, get_video_info, handle_exceptions

router = APIRouter()


@router.get("/video/info/{video_id}", response_model=dict)
def get_video_info_route(video_id: str):
    """
    Rota para obter informações sobre um vídeo do YouTube.

    Parameters:
    - video_id (str): O ID do vídeo do YouTube.

    Returns:
    - dict: um dicionário contendo informações sobre o vídeo, conforme especificado pela função 'get_video_info'.
    """
    try:
        video_url = build_video_url(video_id)
        return get_video_info(video_url)
    except Exception as e:
        if exception_response := handle_exceptions(e):
            raise exception_response from e
