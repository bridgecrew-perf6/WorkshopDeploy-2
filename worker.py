import icalendar
from datetime import datetime, timezone
import requests
from urllib.parse import unquote
import json

def ret_data(request):
  if request.method == 'OPTIONS':
    # Allows GET requests from any origin with the Content-Type
    # header and caches preflight response for an 3600s
    headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '3600'
    }

    return ('', 204, headers)

  # Set CORS headers for the main request
  headers = {
    'Access-Control-Allow-Origin': '*'
  }

  if not request.args:
    return ("No data given", 400, headers)
  if "url" not in request.args:
    return ("No URL given", 400, headers)
  url = unquote(request.args["url"])
  if not url.startswith("https://brightspace.vanderbilt.edu/d2l/le/calendar/feed/user/feed.ics?token="):
    return ("Invalid URL -- only Brightspace calendar URLs are allowed!", 400, headers)
  
  cal = icalendar.Calendar.from_ical(requests.get(url).text)
  ret = []
  n = datetime.now(tz=timezone.utc)
  for v in cal.subcomponents:
    if "SUMMARY" in v and v["SUMMARY"].endswith(" - Due") and v["DTEND"].dt > n:
      summary = v["SUMMARY"].replace(" - Due", "")
      ret.append({
        "name": f"{summary} | {v['LOCATION']}",
        "time": v["DTEND"].dt.timestamp()
      })

  return (json.dumps(ret), 200, headers)
