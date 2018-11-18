#!/usr/bin/env python
# -*- coding: utf-8 -*- 

from evernote.api.client import EvernoteClient

# dev_token = "S=s1:U=95061:E=16e7befc695:C=167243e9748:P=1cd:A=en-devtoken:V=2:H=174e37a85f15b604e7155a6ce2364a20"
# client = EvernoteClient(token=dev_token)
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
request_token = client.get_request_token('http://localhost:3000/')
print client.get_authorize_url(request_token)

