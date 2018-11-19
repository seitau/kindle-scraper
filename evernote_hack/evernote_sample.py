#!/usr/bin/env python
# -*- coding: utf-8 -*- 

from evernote.api.client import EvernoteClient
import requests
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import time
import urllib
from requests_oauthlib import OAuth1Session

CONSUMER_KEY = 'seita'
CONSUMER_SECRET = '55e2694365545a34'

#def get_endpoint(self, path=None):
#    url = "https://%s" % (self.service_host)
#    if path is not None:
#        url += "/%s" % path
#    return url

#print evernote.lib.evernote.api
#EvernoteClient = evernote.lib.evernote.api.client.EvernoteClient

cred = credentials.Certificate("./functions/service_account/kindle-7ef16-firebase-adminsdk-ksy3r-3fde325273.json")
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

auth = db.collection('auth').document('evernote').get().to_dict()
#access_token = auth['access_token']
access_token = {}
client = {}

if access_token:
    client = EvernoteClient(token=access_token)
else:
    client = EvernoteClient(
        consumer_key=CONSUMER_KEY,
        consumer_secret=CONSUMER_SECRET,
        sandbox=True
    )
    callback_url = 'https://us-central1-kindle-7ef16.cloudfunctions.net/evernoteAuth'
    request_token = client.get_request_token(callback_url)
    print client.get_authorize_url(request_token)
    time.sleep(10)
    auth = db.collection('auth').document('evernote').get().to_dict()
    access_token = client.get_access_token(
        request_token['oauth_token'],
        request_token['oauth_token_secret'],
        auth['oauth_verifier']
        )
    db.collection('auth').document('evernote').update({
        'oauth_token': request_token['oauth_token'],
        'oauth_token_secret': request_token['oauth_token_secret'],
        'access_token': access_token,
        })


note_store = client.get_note_store()
notebooks = note_store.listNotebooks()
print notebooks
