import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import csv
import os

from IPython.display import Audio
from scipy.io import wavfile
from pydub import AudioSegment

# Load the model.
model = hub.load('https://tfhub.dev/google/yamnet/1')

# Find the name of the class with the top score when mean-aggregated across frames.
def class_names_from_csv(class_map_csv_text):
  """Returns list of class names corresponding to score vector."""
  class_names = []
  with tf.io.gfile.GFile(class_map_csv_text) as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
      class_names.append(row['display_name'])

  return class_names

class_map_path = model.class_map_path().numpy()
class_names = class_names_from_csv(class_map_path)

def convert_audio(file_path):
    sound = AudioSegment.from_file(file_path)
    # Ensure mono channel
    sound = sound.set_channels(1)
    # Ensure 16kHz sample rate
    sound = sound.set_frame_rate(16000)
    # Save the converted audio
    converted_file_path = 'uploads/converted_' + os.path.basename(file_path)
    sound.export(converted_file_path, format="wav")
    return converted_file_path

wav_file_name = '/home/mdv/programming/personal/Pickhacks2024/Screaming girl on slingshot-[AudioTrimmer.com].wav'
conv_file_path = convert_audio(wav_file_name)

sample_rate, wav_data = wavfile.read(conv_file_path, 'rb')

waveform = wav_data / tf.int16.max

# Run the model, check the output.
scores, embeddings, spectrogram = model(waveform)

# Convert scores to numpy array
scores_np = scores.numpy()

# Get the indices of top 10 labels with highest scores
top_10_indices = scores_np.mean(axis=0).argsort()[-10:][::-1]

labels = []
for i in top_10_indices:
    labels.append(class_names[i])

if "Screaming" in labels:
    print("AHHHHHHHHHHH")