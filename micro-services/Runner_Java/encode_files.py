import json
import base64 
import os

files = os.listdir("output")
files_to_write = []

for file in files:
    f = open("output/" + file, "rb")
    files_to_write.append(
        {
            "name": file,
            "content": base64.b64encode(f.read()).decode("ascii")
        }
    )
    f.close()

f = open("files.txt", "w")
f.write(json.dumps({ "files": files_to_write}))
f.close()