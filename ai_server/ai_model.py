import torch
import numpy as np
import torch.nn as nn
import gluonnlp as nlp
from torch.utils.data import Dataset, DataLoader
from konlpy.tag import Okt


# 데이터셋 처리 클래스 정의
class BERTDataset(Dataset):
    def __init__(self, dataset, sent_idx, label_idx, bert_tokenizer, max_len, pad, pair):
        transform = nlp.data.BERTSentenceTransform(
            bert_tokenizer, max_seq_length=max_len, pad=pad, pair=pair)

        self.sentences = [transform([i[sent_idx]]) for i in dataset]
        self.labels = [np.int32(i[label_idx]) for i in dataset]

    def __getitem__(self, i):
        return (self.sentences[i] + (self.labels[i], ))

    def __len__(self):
        return len(self.labels)


# BERTClassifier 정의
class BERTClassifier(nn.Module):
    def __init__(self, bert, hidden_size=768, num_classes=7, dr_rate=None):
        super(BERTClassifier, self).__init__()
        self.bert = bert
        self.dr_rate = dr_rate
        self.classifier = nn.Linear(hidden_size, num_classes)
        if dr_rate:
            self.dropout = nn.Dropout(p=dr_rate)

    def gen_attention_mask(self, token_ids, valid_length):
        attention_mask = torch.zeros_like(token_ids)
        for i, v in enumerate(valid_length):
            attention_mask[i][:v] = 1
        return attention_mask.float()

    def forward(self, token_ids, valid_length, segment_ids):
        attention_mask = self.gen_attention_mask(token_ids, valid_length)
        pooler = self.bert(input_ids=token_ids, token_type_ids=segment_ids.long(), attention_mask=attention_mask.float().to(token_ids.device))[1]
        if self.dr_rate:
            pooler = self.dropout(pooler)
        return self.classifier(pooler)


# 모델 불러오기
def load_model(model_path, bertmodel, device):
    model = BERTClassifier(bertmodel, dr_rate=0.5).to(device)
    checkpoint = torch.load("saved_model.pt", map_location=torch.device('cpu'))
    print(checkpoint.keys())  # 저장된 키를 출력
    return model


# 키워드 추출
def get_keywords(text):
    """
    입력된 텍스트에서 명사를 추출하여 반환.
    Args:
    - text (str): 입력 문장

    Returns:
    - keywords (list): 추출된 명사 키워드 리스트
    """
    okt = Okt()
    keywords = okt.nouns(text)  # 명사 추출
    return keywords


def predict(texts, model, tokenizer, device, max_len=64, batch_size=64):
    """
    문장을 입력받아 감정 예측 및 명사 키워드 추출.

    Args:
    - texts (list of tuples): [(id, text), ...]
    - model: BERT 감정 분석 모델
    - tokenizer: 토크나이저
    - device: GPU/CPU 장치
    - max_len (int): 최대 토큰 길이
    - batch_size (int): 배치 크기

    Returns:
    - results (list): [{"id": str, "emotion_text": str, "important_words": list}, ...]
    """
    model.eval()
    results = []
    ids, texts_only = zip(*texts)  # id와 text를 분리

    # text만 사용하여 데이터셋 구성
    dataset = [[text, '0'] for text in texts_only]
    test_data = BERTDataset(dataset, 0, 1, tokenizer, max_len, True, False)
    test_loader = DataLoader(test_data, batch_size=batch_size, num_workers=4)

    emotion_dict = {0: "행복", 1: "중립", 2: "불안", 3: "당황", 4: "슬픔", 5: "분노", 6: "혐오"}

    with torch.no_grad():
        for batch_id, (token_ids, valid_length, segment_ids, label) in enumerate(test_loader):
            token_ids = token_ids.long().to(device)
            segment_ids = segment_ids.long().to(device)
            label = label.long().to(device)

            # 모델 예측
            out = model(token_ids, valid_length, segment_ids)
            batch_start_idx = batch_id * batch_size
            for i, (logits, text_id, text) in enumerate(
                zip(out, ids[batch_start_idx:batch_start_idx + len(out)], texts_only[batch_start_idx:batch_start_idx + len(out)])
            ):
                logits = logits.detach().cpu().numpy()
                predicted_emotion = np.argmax(logits)  # 예측된 감정 레이블
                predicted_emotion_str = emotion_dict.get(predicted_emotion, "알 수 없는 감정")

                # 키워드 추출 (명사 추출)
                keywords = get_keywords(text)

                # 결과 저장
                results.append({
                    "id": str(text_id),
                    "emotion_text": predicted_emotion_str,
                    "keywords": keywords
                })

    return results
