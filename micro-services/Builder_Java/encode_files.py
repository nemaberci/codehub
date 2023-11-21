import json
import binascii 
import os

files = os.listdir("output")
files_to_write = []

for file in files:
    f = open("output/" + file, "rb")
    files_to_write.append(
        {
            "name": file,
            "content": binascii.b2a_base64(f.read()).decode("utf-8")
        }
    )
    f.close()

f = open("files.txt", "w")
f.write(json.dumps({ "files": files_to_write}))
f.close()