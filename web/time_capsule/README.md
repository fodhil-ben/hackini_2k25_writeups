## Insecure Deserialization lead to RCE

The challenge had an endpoint that processed user-supplied serialized data.

This allowed **RCE** (that was my first thought when I saw insecure deserialization with `pickle`; the actual solution is much simpler).

After achieving RCE by abusing the `__reduce__` method, the command output wasn’t returned directly, but I noticed the **response message differed on success versus failure**. This gave me the idea of performing a **blind RCE side‑channel** to leak the flag one character at a time.

Here is the one-liner I was using (it was used with `subprocess.run`):

```sh
tr -d "\n" < /app/app.py | head -c {len(leak)+1} | grep -q "^{leak+c}" && echo Matched || asdf
```

If it matches, it echoes ``Matched``, triggering the success response; if it doesn’t match, it tries to execute ``asdf`` and returns an error response.

Since I didn’t find the flag in ``/flag.txt`` ``(not /flag)``, I decided to leak the application’s source code, and there I found the flag.

```shellmates{TiM3_tR4vEL_D3$3RIal1ZaT10N_Hack}```

Solve Script can be found [here](./solve.py)

