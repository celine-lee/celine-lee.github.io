# Data for papers and patents
entries = [
    ("Critical Thinking: Which Kinds of Complexity Govern Optimal Reasoning Length?",
     "Celine Lee, Alexander M. Rush, Keyon Vafa",
     "Under submission",
     "https://arxiv.org/abs/2504.01935",
     "pubs/thumbnails/complexity.jpg"),

    ("Commit0: Library Generation from Scratch",
     "Wenting Zhao, Nan Jiang, Celine Lee, Justin T. Chiu, Claire Cardie, Matthias Gallé, Alexander M. Rush",
     "ICLR 2025",
     "https://arxiv.org/pdf/2412.01769",
     "pubs/thumbnails/commit0.jpg"),

    ("Sampling Language from Latent System-2 Reasoning",
     "Celine Lee, Arafat Sultan, Tahira Naseem, Alexander M. Rush, Ramon Fernandez Astudillo",
     "NeurIPS 2024 - System 2 Reasoning at Scale",
     "https://openreview.net/pdf?id=OdUqJwu0Gr",
     "pubs/thumbnails/sys2.jpg"),

    ("The Counterfeit Conundrum: Can Code Language Models Grasp the Nuances of Their Incorrect Generations?",
     "Alex Gu, Celine Lee*, Wen-Ding Li*, Naman Jain*, Theo X. Olausson*, Koushik Sen, Armando Solar-Lezama",
     "ACL 2024 - Findings",
     "https://arxiv.org/abs/2402.19475",
     "pubs/thumbnails/counterfeit.jpg"),

    ("Guess & Sketch: Language Model Guided Transpilation",
     "Celine Lee, Abdulrahman Mahmoud, Michal Kurek, Simone Campanoni, David Brooks, Stephen Chong, Gu-Yeon Wei, Alexander Rush",
     "ICLR 2024",
     "https://arxiv.org/abs/2309.14396",
     "pubs/thumbnails/guess_sketch.jpg"),

    ("Mixture of Soft Prompts for Controllable Data Generation",
     "Derek Chen, Celine Lee, Yunan Lu, Domenic Rosati, Zhou Yu",
     "EMNLP 2023 - Findings",
     "https://arxiv.org/abs/2303.01580",
     "pubs/thumbnails/soft_prompts.jpg"),

    ('<a href="https://medium.com/@celine.y.lee/fast-earley-parsing-2216fb0909a3">Batched Vectorized Earley Parsing</a>',
     "Celine Lee, Alexander M. Rush",
     "MASC-SLL 2023",
     "pubs/Batched Vectorized Earley Parsing (MASC Poster).pdf",
     "pubs/thumbnails/earley.jpg"),

    ("A Survey on Semantic Parsing for Machine Programming",
     "Celine Lee, Justin Gottschlich, Dan Roth",
     "KDD Workshop 2021 - PLP",
     "https://arxiv.org/abs/2105.03317",
     "pubs/thumbnails/semantic_survey.jpg")
]

patents = [
    "METHODS AND APPARATUS TO IMPROVE DATA QUALITY FOR ARTIFICIAL INTELLIGENCE (USPTO App. No. 17/540050)",
    "METHODS AND APPARATUS TO TRAIN MODELS FOR PROGRAM SYNTHESIS (USPTO App. No. 17/551170)",
    "METHODS AND APPARATUS TO DETERMINE REFINED CONTEXT FOR SOFTWARE BUG DETECTION AND CORRECTION (USPTO App. No. 17/554918)",
    "METHODS, APPARATUS, AND ARTICLES OF MANUFACTURE TO GENERATE COMMAND LISTS TO BE OFFLOADED TO ACCELERATOR CIRCUITRY (USPTO App. No. 17/559556)"
]

# HTML generation
pub_item_template = '''
<div style="display: flex; align-items: flex-start; margin-bottom: 20px;">
  <img src="{img}" alt="pub thumbnail" width="60" height="60" style="margin-right: 15px; border-radius: 5px;">
  <div>
    <b>{title}</b><br>
    <i>{authors}</i><br>
    {venue}<br>
    <a href="{url}" target="_blank">Link</a>
  </div>
</div>
'''

html_output = '<h2>Publications</h2>\n'
for title, authors, venue, url, img in entries:
    authors_bolded = authors.replace("Celine Lee", "<b>Celine Lee</b>")
    html_output += pub_item_template.format(title=title, authors=authors_bolded, venue=venue, url=url, img=img)

html_output += '<h2>Patents</h2>\n<ul>'
for patent in patents:
    html_output += f'<li>{patent}</li>'
html_output += '</ul>'

html_output = """<html>
<head>
  <title>Celine Lee</title>
</head>
<body bgcolor="#f9f9f9" text="#000000" style="margin:10px; padding:10px; font-family: Helvetica, sans-serif;">
  <div class="image-txt-container">
    <a href="https://celine-lee.github.io">
      <img src="https://avatars2.githubusercontent.com/u/22714518?v=3&s=400" style="float: left; margin-right: 15px; padding: 3px;" width="150" height="150" alt="a recent pic">
    </a>
    <table style="table-layout: fixed; width: 70%;">
      <tbody>
        <tr>
          <td>
            <h1>Celine Lee</h1>
          </td>
        </tr>
        <tr>
          <td>PhD candidate @ Cornell University, advised by <a href="http://rush-nlp.com">Sasha Rush</a>. I work on language modeling, with a special focus on code reasoning and generation.</td>
        </tr>
        <tr>
          <td>Currently (Spring 2025): Adjunct Instructor @ <a href="https://mbzuai.ac.ae/">Mohamed Bin Zayed University of Artificial Intelligence</a> in Abu Dhabi, UAE.</td>
        </tr>
        <tr>
          <td>Previously: BSE & MSE @ University of Pennsylvania, 2020, where I worked with <a href="https://www.cis.upenn.edu/~danroth/">Dan Roth</a> and <a href="https://sites.google.com/view/gottschlich">Justin Gottschlich</a>.</td>
        </tr>
        <tr>
          <td>My <a href="CV.pdf">CV</a> and my <a href="https://scholar.google.com/citations?user=F27S1VcAAAAJ&hl=en">Google Scholar</a>.</td>
        </tr>
      </tbody>
    </table>
  </div>
""" + html_output + """
   <h2>News</h2>
    <ul>
      <li><i>April 2025</i> - I co-organized the <a href="https://verifai-workshop.github.io/">VerifAI: AI Verification in the Wild</a> workshop @ ICLR 2025.</li>
      <li><i>March 2025</i> - I am honored to be recognized as an ML & Systems Rising Star!</li>
      <li><i>June 2024</i> - I was interviewed by Jennifer Sheffield for the Cognitive Computation Group Blog. <a href="https://ccgblog.seas.upenn.edu/2024/06/interview-with-celine-lee-ccg-2019-2020/">Interview link.</a></li>
      <li><i>October 2021</i> - I was interviewed by Dr. Justin Gottschlich on the Machine Programming & Technology channel. <a href="https://www.youtube.com/watch?v=1BMIbFXG2r8">Video</a></li>
    </ul>
    
    <h2>Software</h2>
    <ul>
      <li>Semantic Role Labeling <a href="https://cogcomp.seas.upenn.edu/page/demo_view/SRLEnglish">(English)</a> <a href="https://cogcomp.seas.upenn.edu/page/demo_view/SRLSpanish">(Spanish)</a></li>
    </ul>

    <h2>Misc.</h2>
      <ul><a href="library.html">Libary of writings, zines, some arts and crafts.</a></ul>
      <ul>Slides from past presentations <a href="https://drive.google.com/drive/folders/1AUmpPifg2lq_C-YDBizPyFxFYDsJBVgf?usp=share_link">here</a>.</ul>
      <ul>A running <a href="party.html">list of what-to-do ideas when you need some inspiration</a>. Use them if that's fun for you</ul>
      <ul>I like <a href="soup.html">soup a lot</a>.</ul>
  </body>
</html>
"""

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html_output)

print("HTML written to index.html")
