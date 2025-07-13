# Local folders
pdf_folder = "creatives"
thumbnail_folder = "creatives/thumbnails"

# Thumbnail dimensions
THUMBNAIL_WIDTH = 800
THUMBNAIL_HEIGHT = 800

library_contents = [
    ("creatives/banana_store.pdf", f"{thumbnail_folder}/banana_store.jpg", "The Banana Store"),
    ("https://celine-lee.github.io/library.html", f"{thumbnail_folder}/dopamine_deficit.jpg", "Dopamine Deficit"),
    ("creatives/sausage_curve.pdf", f"{thumbnail_folder}/sausage_curve.jpg", "Why'd they curve the bun too?"),
    ("creatives/bird saturday 2.pdf", f"{thumbnail_folder}/bird saturday 2.jpg", "Bird Saturday - Milk Stage Edition"),
    ("https://medium.com/@celine.y.lee/how-to-understand-and-to-be-understood-1bd87cb31a40", f"{thumbnail_folder}/understood.jpg", "How to be understood?"),
    ("creatives/REST.pdf", f"{thumbnail_folder}/REST.jpg", "REST"),
    ("https://yalepaprika.com/folds/honeymoon/the-fussy-suitor", f"{thumbnail_folder}/fussy_suitor.jpg", "The Fussy Suitor"),
    ("https://medium.com/@celine.y.lee/the-say-yes-mindset-49e1a0b7413d", f"{thumbnail_folder}/say_yes.jpg", "The Say Yes Mindset"),
    ("https://medium.com/@celine.y.lee/irrealis-and-world-models-129aa4ae45fd", f"{thumbnail_folder}/irrealis.jpg", "Irrealis and World Models"),
    ("https://medium.com/@celine.y.lee/hosting-graphs-dc3af60f66d0", f"{thumbnail_folder}/graph_party.jpg", "The Graph-Optimized Party"),
    ("https://medium.com/@celine.y.lee/neurosymbolic-assembly-transpilation-a28a4f4ca50c", f"{thumbnail_folder}/transpile.jpg", "Neurosymbolic Assembly Transpilation"),
    ("https://medium.com/@celine.y.lee/memorme-d6814620f1cc", f"{thumbnail_folder}/memorme.jpg", "Memorme: a philosophy on writing and memory"),
    ("creatives/bird saturday_nonprint.pdf", f"{thumbnail_folder}/bird_saturday.jpg", "Bird Saturday"),
    ("creatives/reminis-zine_email.pdf", f"{thumbnail_folder}/playlists.jpg", "Playlists (on Nostalgia)"),
    ("creatives/googly_not_nonprint.pdf", f"{thumbnail_folder}/googly.jpg", "So You Want To Stick Googly Eyes On There"),
    ("creatives/donut_wheel_nonprint.pdf", f"{thumbnail_folder}/donut.jpg", "Donut Wheel"),
    ("creatives/gizmos.pdf", f"{thumbnail_folder}/trinkets.jpg", "Trinkets"),
    ("creatives/please_be_seated.pdf", f"{thumbnail_folder}/seated.jpg", "Please Be Seated"),
    ("https://yalepaprika.com/folds/farewells/dear-kohlrabi", f"{thumbnail_folder}/kohlrabi.jpg", "Dear Kohlrabi"),
    ("https://medium.com/@celine.y.lee/fast-earley-parsing-2216fb0909a3", f"{thumbnail_folder}/earley.jpg", "Fast Earley Parsing"),
    ("https://yalepaprika.com/folds/transient-intimacy/sidewalk-politics", f"{thumbnail_folder}/sidewalk.jpg", "Sidewalk Politics"),
    ("https://medium.com/@celine.y.lee/smelly-colors-87145ec70582", f"{thumbnail_folder}/smelly.jpg", "Smelly Colors"),
    ("https://medium.com/@celine.y.lee/the-vowel-trapezoid-aa06537259f2", f"{thumbnail_folder}/vowels.jpg", "The Vowel Trapezoid"),
    ("https://medium.com/@celine.y.lee/my-first-study-of-grounding-natural-language-in-code-on-stack-overflow-64e7f4a4b20a", f"{thumbnail_folder}/grounding.jpg", "My first study of 'grounding' natural language"),
]

grid_item_html = """        <div class="grid-item">
            <a href="{url}" target="_blank">
                <img src="{src}" alt="{alt}">
            </a>
            <div>{alt}</div>
        </div>"""

library_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Essays & Zines</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }
        .grid-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 20px;
            padding: 20px;
        }
        .grid-item {
            text-align: center;
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
            border-radius: 4px;
            margin-bottom: 10px;
        }
        .grid-item div {
            font-size: 0.9em;
            color: #333;
        }
        h1 {
            text-align: center;
            margin: 20px;
        }
    </style>
</head>
<body>
    <h1>Essays, <a href="https://en.wikipedia.org/wiki/Zine">zines</a>, and other.</h1>
    <div class="grid-container">""" + "\n".join(
        grid_item_html.format(src=img_path, alt=title, url=url)
        for (url, img_path, title) in library_contents
    ) + """
    </div>
</body>
</html>
"""

with open("library.html", 'w', encoding="utf-8") as wf:
    wf.write(library_html)
