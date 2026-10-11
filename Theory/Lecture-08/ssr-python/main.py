from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import uvicorn

app = FastAPI()

# Jinja2 looks for templates inside the "templates" folder.
templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    # The server passes "name" to the template. Jinja2 replaces {{ name }}
    # with this value and sends finished HTML to the browser.
    # request comes first: Starlette 1.x removed the old
    # TemplateResponse("home.html", {"request": request, ...}) style.
    return templates.TemplateResponse(request, "home.html", {"name": "Aarav"})


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
