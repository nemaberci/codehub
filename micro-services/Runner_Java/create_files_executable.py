import json
import base64 
f = open("/work/downloaded_executable.txt", "r")

# some JSON:
x =  f.readlines()[0]

# parse x:
y = json.loads(x)

# the result is a Python dictionary:
for file_to_create in y:
    print(file_to_create)
    f_t = open("/work/" + file_to_create['name'][file_to_create['name'].find('/') + 1:], "wb")
    f_t.write(base64.b64decode(file_to_create['content']))
    f_t.close()
f.close()

f = open("/work/downloaded_helloworld.txt", "r")

# some JSON:
x =  f.readlines()[0]

# parse x:
y = json.loads(x)

# the result is a Python dictionary:
for file_to_create in y:
    print(file_to_create)
    f_t = open("/work/" + file_to_create['name'][file_to_create['name'].find('/') + 1:], "wb")
    f_t.write(base64.b64decode(file_to_create['content']))
    f_t.close()
f.close()