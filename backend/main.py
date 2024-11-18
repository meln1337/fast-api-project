from fastapi import FastAPI, File, UploadFile, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse

import io
from facenet_pytorch import MTCNN
from PIL import Image, ImageDraw
import torch

# device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
device = torch.device("cpu")
print(f"Available device: {device}")


mtcnn = MTCNN(image_size=160, device=device, keep_all=True)

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "this is home page!"}

@app.post("/upload")
async def upload_image(image: UploadFile = File(...)):
    print(image.file)
    # transforming uploaded image
    img = Image.open(image.file).convert("RGB")

    batch_boxes, batch_probs, batch_landmarks = mtcnn.detect(img, landmarks=True)

    if batch_boxes is not None:
        for box in batch_boxes:
            # Draw bounding boxes on the image
            draw = ImageDraw.Draw(img)
            draw.rectangle(box.tolist(), outline='red', width=5)

    if batch_landmarks is not None:
        for landmarks in batch_landmarks:
            for (x, y) in landmarks:
                draw = ImageDraw.Draw(img)
                draw.ellipse([(x - 7, y - 7), (x + 7, y + 7)], fill='green')


    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format="JPEG")
    img_byte_arr.seek(0)

    return StreamingResponse(img_byte_arr, media_type="image/jpeg")