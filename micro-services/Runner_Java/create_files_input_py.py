import json
import base64 
f = open("/work/downloaded_input_py.txt", "r")

# some JSON:
x =  f.readlines()[0]

# parse x:
y = json.loads(x)

# the result is a Python dictionary:
for file_to_create in y:
    print(file_to_create)
    f_t = open('/work/input_py/' + file_to_create['name'][file_to_create['name'].find('/') + 1:], "w")
    f_t.write(base64.b64decode(file_to_create['content']).decode("utf-8") )
    f_t.close()
f.close()