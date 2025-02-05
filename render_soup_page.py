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
THUMBNAIL_WIDTH = 800  # Desired width for thumbnails
THUMBNAIL_HEIGHT = 800  # Desired height for thumbnails

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

import glob

grid_item_html = """        <div class="grid-item">
            <img src="{src}" alt="{alt}">
        </div>"""

soup_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>I love soup.</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }
        .grid-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            padding: 20px;
        }
        .grid-item {
            text-align: center;
            border: 0px solid #ffffff;
            border-radius: 4px;
            padding: 10px;
            background-color: #fff;
            transition: box-shadow 0.2s;
        }
        .grid-item:hover {
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }
        .grid-item img {
            max-width: 100%;
            max-height: 200px;
            margin-bottom: 10px;
            border-radius: 4px;
        }
        h1 {
            text-align: center;
            margin: 20px;
        }
        p {
            text-align: center;
            margin: 20px;
        }
    </style>
</head>
<body>
    <h1>I love <a href="https://github.com/celine-lee/soup">soup</a>.</h1>
    <div class="grid-container" id="imageGrid">""" + "\n".join(grid_item_html.format(src=img_path, alt=img_path) for img_path in glob.glob("soup/thumbnails/*.png")) + """
    </div>

</body>
<footer>
  <p>Method: Ask "can you draw me a soup?"<br>
</footer>
</html>
"""

with open("soup.html", 'w') as wf:
    wf.write(soup_html)