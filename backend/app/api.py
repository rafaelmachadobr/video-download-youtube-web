from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from .utils.youtube_utils import build_video_url, get_video_info, handle_exceptions, download_video_logic

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


@router.get("/video/download/{video_id}/{video_format}")
def download_video(video_id: str, video_format: str):
    """
    Rota para baixar um vídeo do YouTube.

    Parameters:
    - video_id (str): O ID do vídeo do YouTube.
    - video_format (str): O formato do vídeo a ser baixado. Pode ser 'mp3' ou 'mp4'.

    Returns:
    - StreamingResponse: um objeto StreamingResponse contendo o conteúdo do vídeo e o cabeçalho Content-Disposition
    para forçar o download do vídeo.
    """
    try:
        video_url = build_video_url(video_id)
        video_info = get_video_info(video_url)

        if video_format not in ["mp3", "mp4"]:
            raise HTTPException(
                status_code=400, detail="Formato inválido. Use 'mp3' ou 'mp4'.")

        content, file_extension = download_video_logic(video_url, video_format)

        return StreamingResponse(
            iter([content]),
            media_type=f"video/{file_extension}",
            headers={
                "Content-Disposition": f"attachment; filename={video_info['title']}.{file_extension}"}
        )
    except Exception as e:
        if exception_response := handle_exceptions(e):
            raise exception_response from e
