import json
import base64 
import os

files_to_write = []
files = os.listdir("/work/output")

for file in files:
    f = open("/work/output/" + file, "rb")
    files_to_write.append(
        {
            "name": file,
            "content": base64.b64encode(f.read()).decode("ascii")
        }
    )
    f.close()

files = os.listdir("/work/time")

for file in files:
    f = open("/work/time/" + file, "rb")
    files_to_write.append(
        {
            "name": file,
            "content": base64.b64encode(f.read()).decode("ascii")
        }
    )
    f.close()

f = open("/work/files.txt", "w")
f.write(json.dumps({ "files": files_to_write}))
f.close()