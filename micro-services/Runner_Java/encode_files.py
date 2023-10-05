import json
import base64 
import os

files_to_write = []
files = os.listdir("output")

for file in files:
    f = open("output/" + file, "rb")
    files_to_write.append(
        {
            "name": file,
            "content": base64.b64encode(f.read()).decode("ascii")
        }
    )
    f.close()

files = os.listdir("time")

for file in files:
    f = open("time/" + file, "rb")
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