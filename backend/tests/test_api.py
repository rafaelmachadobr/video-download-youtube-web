import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from httpx import AsyncClient

from app.api import router

app = FastAPI()
app.include_router(router)
client = TestClient(app)

BASE_URL = "http://127.0.0.1:8000/"


@pytest.mark.asyncio
async def test_get_video_info_route():
    video_id = "S9uPNppGsGo"
    url = f"/video/info/{video_id}"

    async with AsyncClient(app=app, base_url=BASE_URL) as ac:
        response = await ac.get(url)

    assert response.status_code == 200
    data = response.json()
    assert "title" in data
    assert "thumbnail" in data
    assert "author" in data
    assert "length" in data


@pytest.mark.asyncio
async def test_get_video_info_route_with_invalid_id():
    invalid_video_id = "invalid_id"
    url = f"/video/info/{invalid_video_id}"

    async with AsyncClient(app=app, base_url=BASE_URL) as ac:
        response = await ac.get(url)

    assert response.status_code == 500
    assert response.json() == {
        "detail": f"Erro ao obter informações do vídeo: regex_search: could not find match for "
                  f"(?:v=|\\/)([0-9A-Za-z_-]{{11}}).*"}


@pytest.mark.asyncio
async def test_get_video_info_route_with_unavailable_video():
    unavailable_video_id = "unavailable_id"
    url = f"/video/info/{unavailable_video_id}"

    async with AsyncClient(app=app, base_url=BASE_URL) as ac:
        response = await ac.get(url)

    assert response.status_code == 404
    assert response.json() == {"detail": "Vídeo não disponível: unavailable is unavailable"}


@pytest.mark.asyncio
async def test_get_video_info_route_with_invalid_url():
    invalid_url = "/video/info/invalid_url"

    async with AsyncClient(app=app, base_url=BASE_URL) as ac:
        response = await ac.get(invalid_url)

    assert response.status_code == 404
    assert response.json() == {"detail": f"Vídeo não disponível: invalid_url is unavailable"}


@pytest.mark.asyncio
async def test_get_video_info_route_with_invalid_method():
    invalid_url = "/video/info/invalid_url"

    async with AsyncClient(app=app, base_url=BASE_URL) as ac:
        response = await ac.post(invalid_url)

    assert response.status_code == 405
    assert response.json() == {"detail": "Method Not Allowed"}


@pytest.mark.asyncio
async def test_get_video_info_route_with_invalid_path():
    invalid_url = "/video/invalid_path/invalid_url"

    async with AsyncClient(app=app, base_url=BASE_URL) as ac:
        response = await ac.get(invalid_url)

    assert response.status_code == 404
    assert response.json() == {"detail": "Not Found"}


if __name__ == "__main__":
    pytest.main(["-vv", "-s", "test_api.py"])
