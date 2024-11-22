import fitz  # PyMuPDF
from PIL import Image
import os
import requests

# GitHub repository details
repo_owner = "celine-lee"  # Replace with your GitHub username
repo_name = "soup"  # Replace with your repository name
pdf_path = ""  # Path in the repository where PDFs are located (leave empty if in root)

# Local folders
pdf_folder = "soup/pdfs"  # Folder to save downloaded PDFs
thumbnail_folder = "soup/thumbnails"  # Folder to save generated thumbnails
thumbnail_size = (200, 260)  # Adjust size as needed

# GitHub API URL
api_url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/contents/{pdf_path}"

# Create local folders if they don't exist
os.makedirs(pdf_folder, exist_ok=True)
os.makedirs(thumbnail_folder, exist_ok=True)

def fetch_pdf_list():
    """Fetch the list of PDF files from the GitHub repository."""
    response = requests.get(api_url)
    if response.status_code == 200:
        files = response.json()
        pdf_files = [file for file in files if file['name'].endswith('.pdf')]
        return pdf_files
    else:
        print(f"Error fetching repository contents: {response.status_code}")
        return []

def download_pdf(pdf_url, local_path):
    """Download a PDF file from GitHub."""
    response = requests.get(pdf_url, stream=True)
    if response.status_code == 200:
        with open(local_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Downloaded: {local_path}")
    else:
        print(f"Failed to download {pdf_url}: {response.status_code}")

# # Process each PDF
# for pdf_file in pdf_files:

# Ensure thumbnail folder exists
os.makedirs(thumbnail_folder, exist_ok=True)

# Thumbnail dimensions
THUMBNAIL_WIDTH = 200  # Desired width for thumbnails
THUMBNAIL_HEIGHT = 200  # Desired height for thumbnails

# Process each PDF in the folder
for pdf_file in fetch_pdf_list():
    pdf_url = pdf_file['download_url']
    local_pdf_path = os.path.join(pdf_folder, pdf_file['name'])
    local_thumbnail_path = os.path.join(thumbnail_folder, pdf_file['name'].replace(".pdf", ".png"))

    # Download the PDF if it doesn't already exist locally
    if not os.path.exists(local_pdf_path):
        download_pdf(pdf_url, local_pdf_path)

    # Generate a thumbnail if it doesn't already exist
    if not os.path.exists(local_thumbnail_path):
        # Open PDF file
        try:
            with fitz.open(local_pdf_path) as pdf:
                # Render the first page of the PDF
                page = pdf[0]
                pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # Scale 2x for better quality

                # Convert pixmap to Pillow Image
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

                # Generate thumbnail
                img.thumbnail((THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT))
                img.save(local_thumbnail_path, "PNG")

                print(f"Thumbnail generated: {local_thumbnail_path}")
        except Exception as e:
            print(f"Error processing {pdf_file}: {e}")
