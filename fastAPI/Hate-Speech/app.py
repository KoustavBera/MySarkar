# import streamlit as st
import warnings

# This will ignore all warnings, regardless of their type
warnings.filterwarnings("ignore")

warnings.warn("This is a UserWarning.", UserWarning)
warnings.warn("This is a DeprecationWarning.", DeprecationWarning)

import pickle
import string
from nltk.corpus import stopwords
import nltk
from nltk.stem.porter import PorterStemmer

ps = PorterStemmer()


def transform_text(text):
    if('!' in text):
      if(':' in text):
            wrd = text[text.index('!'):text.index(':')+1]
            text = text.replace(wrd,'')


    text = text.lower()
    text = nltk.word_tokenize(text)

    y = []
    for i in text:
        if i.isalpha():
            y.append(i)

    text = y[:]
    y.clear()

    for i in text:
        if i not in stopwords.words('english') and i not in string.punctuation:
            y.append(i)

    text = y[:]
    y.clear()

    for i in text:
        y.append(ps.stem(i))

    if 'rt' in y:
      y.remove('rt')

    for i in y:
      if (i == 'http' or i == 'like'):
        y.remove(i)

    return " ".join(y)

tfidf = pickle.load(open('vectorizer.pkl','rb'))
model = pickle.load(open('model.pkl','rb'))

# st.title("Hate Speech Classifier")

input_sms = input("Enter the message: ")

# if st.button('Predict'):

    # 1. preprocess
transformed_sms = transform_text(input_sms)
    # 2. vectorize
vector_input = tfidf.transform([transformed_sms])
    # 3. predict
result = model.predict(vector_input)[0]
print(result)
    # 4. Display
if result == 1:
    print("Hate")
else:
    print("Not Hate")