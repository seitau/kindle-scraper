#!/usr/bin/env python
# -*- coding: utf-8 -*- 

import time
import os
import re
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import requests
from bs4 import BeautifulSoup

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate("./service_account/kindle-7ef16-firebase-adminsdk-ksy3r-3fde325273.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

email = os.environ['AMAZON_EMAIL']
password = os.environ['AMAZON_PASSWORD']
#options = Options()
#options.add_argument('--headless')
#options.add_argument('--disable-gpu')
#driver = webdriver.Chrome(chrome_options=options)

driver = webdriver.Chrome("/usr/local/bin/chromedriver")

driver.get("https://www.amazon.co.jp/ap/signin?clientContext=357-6962270-7432721&openid.return_to=https%3A%2F%2Fread.amazon.co.jp%2Fkp%2Fnotebook%3Fpurpose%3DNOTEBOOK%26amazonDeviceType%3DA2CLFWBIMVSE9N%26appName%3Dnotebook&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=amzn_kp_jp&openid.mode=checkid_setup&marketPlaceId=A1VC38T7YXB528&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&pageId=amzn_kp_notebook_us&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.pape.max_auth_age=1209600&siteState=clientContext%3D355-5895142-4373139%2CsourceUrl%3Dhttps%253A%252F%252Fread.amazon.co.jp%252Fkp%252Fnotebook%253Fpurpose%253DNOTEBOOK%2526amazonDeviceType%253DA2CLFWBIMVSE9N%2526appName%253Dnotebook%2Csignature%3DAKjePsRJ1oCrL9r4ZcbuxhfKZokj3D&language=ja_JP&auth=Customer+is+not+authenticated")

driver.find_element_by_id("ap_email").send_keys(email)
driver.find_element_by_id("ap_password").send_keys(password)
driver.find_element_by_id("signInSubmit").click()
driver.find_element_by_id("ap_password").send_keys(password)
driver.find_element_by_id("signInSubmit").click()
contents = driver.find_elements_by_xpath("//div/span/a/h2[contains(@class, 'kp-notebook-searchable')]")
book_cover_image_url = driver.find_element_by_class_name("kp-notebook-cover-image").get_attribute("src")

books = driver.find_elements_by_class_name("kp-notebook-library-each-book")
for book in books:
    book_cover_image_url = book.find_element_by_class_name("kp-notebook-cover-image").get_attribute("src")
    print book_cover_image_url
    title = book.find_element_by_class_name("kp-notebook-searchable")
    print title.text

for c in contents:
    batch = db.batch()
    bookRef = db.collection(u'books').document(c.text)

    book_cover_image_url = re.sub(r'\._SY160', "", book_cover_image_url)

    batch.set(bookRef, {
        u'title': c.text,
        u'book_cover_image_url': book_cover_image_url
    })

    time.sleep(1.0)
    c.click()
    time.sleep(2.5)

    annotations = driver.find_element_by_id("kp-notebook-annotations")
    yellow_highlights = annotations.find_elements_by_xpath("//div/div/div/div/div[contains(@class, 'kp-notebook-highlight-yellow')]/span[@id='highlight']") 
    blue_highlights = annotations.find_elements_by_xpath("//div/div/div/div/div[contains(@class, 'kp-notebook-highlight-blue')]/span[@id='highlight']") 

    dataStoredInFireStore = []

    linesRef = bookRef.collection('lines')
    linesDocs = linesRef.get()
    for doc in linesDocs:
        dataStoredInFireStore.append(doc.id)

    wordsRef = bookRef.collection('words')
    wordsDocs = wordsRef.get()
    for doc in wordsDocs:
        dataStoredInFireStore.append(doc.id)

    lines = []
    words = []

    for yh in yellow_highlights:
        Japanese = re.search(u'[ァ-ンぁ-ん一-龥]', yh.text)
        English = re.search(r'[a-zA-Z]', yh.text)
        if not yh.text in dataStoredInFireStore:
            if Japanese:
                lines.append(yh.text)
            elif English:
                if not re.match('.+[\s].+', yh.text):
                    highlighted_word = re.sub(r'[^a-zA-Z]', "", yh.text)
                    matched = re.search(r'[a-zA-Z]', highlighted_word)
                    if matched and not highlighted_word in dataStoredInFireStore:
                        print 'new word: %s' % highlighted_word
                        words.append(highlighted_word)
                    continue
                print 'new line: %s' % yh.text
                lines.append(yh.text)

    for bh in blue_highlights:
        highlighted_word = re.sub(r'[^a-zA-Z]', "", bh.text)
        matched = re.search(r'[a-zA-Z]', highlighted_word)
        if matched:
            if not highlighted_word in dataStoredInFireStore:
                print 'new word: %s' % highlighted_word
                words.append(highlighted_word)

    for line in lines:
        lineRef = bookRef.collection('lines').document(line)
        batch.set(lineRef, {
            u'line': line
        })

    for word in words:
        wordRef = bookRef.collection('words').document(word)

        url = 'https://ejje.weblio.jp/content/'
        page = requests.get(url + word)
        definition = "definition not found"

        try:
            soup = BeautifulSoup(page.content, 'html.parser')
            definition = soup.find(class_='content-explanation ej').get_text()
        except:
            definition = "definition not found"

        batch.set(wordRef, {
            u'word': word,
            u'definition': definition
        })

    batch.commit()
    print 'saved: %s' % c.text

driver.quit()
