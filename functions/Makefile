export BOT_ENDPOINT ?= http://localhost:5000/kindle-7ef16/us-central1

gap:
	curl -X POST $(BOT_ENDPOINT)/LineBotPushNotification -d '{"id":"google-analytics-pageview"}' -H 'Content-Type:application/json'

gan:
	curl -X POST $(BOT_ENDPOINT)/LineBotPushNotification -d '{"id":"google-analytics"}' -H 'Content-Type:application/json'

gad:
	curl -X POST $(BOT_ENDPOINT)/LineBotPushNotification -d '{"id":"google-adsense"}' -H 'Content-Type:application/json'

test-request:
	curl -v -X POST https://api.line.me/v2/bot/message/push \
-H 'Content-Type:application/json' \
-H 'Authorization: Bearer $(LINE_API_KEY)' \
-d '{ \
    	"to": "Cd13e05dcea9ea75ed2ffcd05f99e0b11", \
    	"messages": [ \
				{	 \
          "type":"text", \
        	"text":"下衆の極み恥を知れ" \
				} \
			] \
		}' \


