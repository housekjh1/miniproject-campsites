import csv
import json

def csv_to_json(csv_file_path, json_file_path):
    # CSV 파일 읽기
    with open(csv_file_path, 'r', encoding='cp949') as csv_file:
        csv_reader = csv.DictReader(csv_file, delimiter='|')
        
        # JSON 파일 쓰기
        with open(json_file_path, 'w', encoding='utf-8') as json_file:
            json_file.write(json.dumps(list(csv_reader), ensure_ascii=False, indent=2))

# 사용 예시
csv_file_path = '전국재활용센터표준데이터-20231115.csv'
json_file_path = 'recycle_center.json'
csv_to_json(csv_file_path, json_file_path)