import json
import binascii 
f = open("downloaded.txt", "r")

# some JSON:
x = f.readlines()[0]

# parse x:
y = json.loads(x)

# the result is a Python dictionary:
for file_to_create in y:
    print(file_to_create)
    f_t = open(file_to_create['name'][file_to_create['name'].find('/') + 1:], "w")
    f_t.write(binascii.a2b_base64(file_to_create['content']).decode("utf-8") )
    f_t.close()
f.close()