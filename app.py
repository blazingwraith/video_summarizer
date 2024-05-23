from flask import Flask, request, jsonify
from youtube_transcript_api import YouTubeTranscriptApi
from transformers import pipeline;


app = Flask(__name__)

@app.get('/summary')
def summary_api():
    url = request.args.get('url', '')
    video_id = url.split('=')[1]
    transcript = get_transcript(video_id)
    summary = get_summary(transcript)
    bullet_point_summary = format_as_bullet_points(summary)
    return bullet_point_summary, 200

def get_transcript(video_id):
    transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
    transcript = ' '.join([d['text'] for d in transcript_list])
    return transcript

def get_summary(transcript):
    summarizer = pipeline('summarization', model="facebook/bart-large-cnn", min_length=20, max_length=50)
    summary = []
    for i in range(0, (len(transcript) // 1000) + 1):
        summary_text = summarizer(transcript[i * 1000:(i + 1) * 1000])[0]['summary_text']
        summary.append(summary_text)
    return summary

def format_as_bullet_points(summary_list):
    bullet_points = "<ul>"
    for summary in summary_list:
        bullet_points += f"<li>{summary}</li>"
    bullet_points += "</ul>"
    return bullet_points



if __name__ == '__main__':
    app.run()
