# Youtube Video Summarizer
A chrome extension to summarize YouTube videos.

## Requirements
The following dependencies are required in order to run this project
- Flask ```pip install flask```
- Youtube Transcript API ```pip install youtube-transcript-api```
- HuggingFace Transformers ```pip install transformers```
- Tensorflow ```pip install tensorflow```
- Keras ```pip install tf-keras```
- Pytorch ```pip install torch```

## Instructions
- Run ```app.py```
  ```
  python app.py
  ```
- Load the extension on any Chromium based browser
  - Open ```Extensions```.
  - Turn on ```Developer Mode```.
  - Select ```Load Unpacked``` and select the extension folder ```ext```.
- Navigate to any youtube video and click on the Extension icon and click ```Summarize```, done.
