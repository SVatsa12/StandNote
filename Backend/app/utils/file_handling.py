# app/utils/file_handling.py

import os
from uuid import uuid4
from fastapi import UploadFile
from tempfile import gettempdir

def save_upload_file_tmp(upload_file: UploadFile) -> str:
    """
    Saves the uploaded audio file to a temporary location.
    Returns the full path of the saved file.
    """
    temp_dir = gettempdir()
    unique_filename = f"{uuid4()}_{upload_file.filename}"
    file_path = os.path.join(temp_dir, unique_filename)

    with open(file_path, "wb") as buffer:
        buffer.write(upload_file.file.read())

    return file_path
