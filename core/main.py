import json
from sentence_transformers import SentenceTransformer
import sys

if __name__ == '__main__':
    model_id = sys.argv[1]
    sentences = json.loads(sys.argv[2])

    model = SentenceTransformer(model_id)
    embeddings = model.encode(sentences)
    print(json.dumps(embeddings.tolist()))
