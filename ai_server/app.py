from flask import Flask, request, jsonify
from ClovaSpeech import ClovaSpeechClient
from ai_model import load_model, predict
import torch
from kobert.utils import get_tokenizer
from kobert.pytorch_kobert import get_pytorch_kobert_model
import gluonnlp as nlp
import logging


app = Flask(__name__)

# Clova Speech와 모델 초기화
invoke_url = "https://clovaspeech-gw.ncloud.com/external/v1/9546/c34c1539ae895f986a54639cb7dbd8782e877cd6a6e2b9cb1d871f06565ebefc"  # Clova API URL
secret = "6f9c765a245446deb219b4d036a9d25f"  # Clova API Secret Key
clova_client = ClovaSpeechClient(invoke_url, secret)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
bertmodel, vocab = get_pytorch_kobert_model()
model = load_model("saved_model.pt", bertmodel, device)
tokenizer = nlp.data.BERTSPTokenizer(get_tokenizer(), vocab, lower=False)

@app.route('/analyze', methods=['POST'])
def analyze():
    # 파일 수신
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    file_path = f"temp/{file.filename}"
    file.save(file_path)

    # Clova Speech 호출
    response = clova_client.req_upload(file_path, completion='sync')

    # Clova Speech 반환값 디버깅 로그 추가
    app.logger.info("Clova Speech Response: %s", response.text)

    response_data = response.json()

    # 화자 1의 텍스트 분석
    speaker_1_texts = []
    results = []

    sentence_id = 1
    for segment in response_data.get('segments', []):
        text = segment.get('text', '')
        speaker_label = segment.get('diarization', {}).get('label', '')

        if speaker_label == '1':
            speaker_1_texts.append((sentence_id, text))

        results.append({
            "id": str(sentence_id),
            "speaker_label": speaker_label,
            "text": text,
            "emotion": None
        })
        sentence_id += 1

    if speaker_1_texts:
        predictions = predict(speaker_1_texts, model, tokenizer, device)
        for prediction in predictions:
            for result in results:
                if result['id'] == prediction['id']:
                    result['emotion'] = prediction['emotion_text']

    return jsonify(results), 200

if __name__ == '__main__':
    app.logger.setLevel(logging.INFO)  # INFO 레벨로 설정
    app.run(host='0.0.0.0', port=5000)
