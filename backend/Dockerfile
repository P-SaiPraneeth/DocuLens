FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .

# Use extra-index-url so pip can still find normal packages on PyPI!
RUN pip install torch --extra-index-url https://download.pytorch.org/whl/cpu
RUN pip install -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Start FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
