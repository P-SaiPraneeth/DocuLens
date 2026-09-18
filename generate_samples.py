from reportlab.pdfgen import canvas
import os

docs = {
    "Document_A.pdf": [
        "Machine learning models require large datasets for effective training.",
        "The process of feature engineering is critical to model success.",
        "Deep learning architectures like transformers have revolutionized natural language processing.",
        "Overfitting occurs when a model learns the training data too well."
    ],
    "Document_B.pdf": [
        "ML systems generally need substantial amounts of data to train properly.",
        "Creating good features is an essential step in building successful predictive models.",
        "Transformer-based deep neural networks have completely changed the field of NLP.",
        "When an algorithm memorizes the training set, we call this overfitting."
    ],
    "Document_C.pdf": [
        "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water.",
        "Chlorophyll is the green pigment responsible for capturing light energy.",
        "Oxygen is released as a byproduct of this crucial biological process.",
        "The Amazon rainforest produces about 20% of the world's oxygen."
    ]
}

os.makedirs("sample_documents", exist_ok=True)

for name, paragraphs in docs.items():
    c = canvas.Canvas(os.path.join("sample_documents", name))
    c.setFont("Helvetica", 12)
    y = 800
    for p in paragraphs:
        c.drawString(50, y, p)
        y -= 30
    c.save()

print("Sample documents generated.")
