import json
from sentence_transformers import SentenceTransformer
import sys

if __name__ == '__main__':
    sentences = json.loads(sys.argv[1])

    model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')

    embeddings = model.encode(sentences)
    print(json.dumps(embeddings.tolist()))
