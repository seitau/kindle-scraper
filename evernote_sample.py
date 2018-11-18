#!/usr/bin/env python
# -*- coding: utf-8 -*- 

from evernote.api.client import EvernoteClient
import requests
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import time

cred = credentials.Certificate("./service_account/kindle-7ef16-firebase-adminsdk-ksy3r-3fde325273.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

# dev_token = "S=s1:U=95061:E=16e7befc695:C=167243e9748:P=1cd:A=en-devtoken:V=2:H=174e37a85f15b604e7155a6ce2364a20"
# client = EvernoteClient(
#            token=dev_token,
#            sandbox=True
#         )
# userStore = client.get_user_store()
# user = userStore.getUser()
# print user.username

CONSUMER_KEY = 'seita'
CONSUMER_SECRET = '55e2694365545a34'
client = EvernoteClient(
    consumer_key=CONSUMER_KEY,
    consumer_secret=CONSUMER_SECRET,
    sandbox=True
)

#userStore = client.get_user_store()
#user = userStore.getUser()
#print user.username

request_token = client.get_request_token('http://localhost:5000/kindle-7ef16/us-central1/evernoteAuth')

print request_token
db.collection('auth').document('evernote').update({
    'oauth_token': request_token['oauth_token'],
    'oauth_token_secret': request_token['oauth_token_secret'],
    })

print client.get_authorize_url(request_token)

time.sleep(10)

auth = db.collection('auth').document('evernote').get().to_dict()
access_token = client.get_access_token(
    request_token['oauth_token'],
    request_token['oauth_token_secret'],
    auth['oauth_verifier']
)

client = EvernoteClient(token=access_token)
note_store = client.get_note_store()
notebooks = note_store.listNotebooks()
print notebooks

#client = EvernoteClient(token='seita.167256D9DDD.687474703A2F2F6C6F63616C686F73743A353030302F6B696E646C652D37656631362F75732D63656E7472616C312F657665726E6F746541757468.3F80D0327BA3AD8B7C17AAFCAFBED6B8')
#userStore = client.get_user_store()
#user = userStore.getUser()

