import json
import base64 
import os
import stat
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
    st = os.stat("/work/" + file_to_create['name'][file_to_create['name'].find('/') + 1:])
    os.chmod("/work/" + file_to_create['name'][file_to_create['name'].find('/') + 1:], st.st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
    print("Executable file created: " + "/work/" + file_to_create['name'][file_to_create['name'].find('/') + 1:])
f.close()

# f = open("/work/downloaded_helloworld.txt", "r")

# # some JSON:
# x =  f.readlines()[0]

# # parse x:
# y = json.loads(x)

# # the result is a Python dictionary:
# for file_to_create in y:
#     print(file_to_create)
#     f_t = open("/work/" + file_to_create['name'][file_to_create['name'].find('/') + 1:], "wb")
#     f_t.write(base64.b64decode(file_to_create['content']))
#     f_t.close()
#     st = os.stat("/work/" + file_to_create['name'][file_to_create['name'].find('/') + 1:])
#     os.chmod("/work/" + file_to_create['name'][file_to_create['name'].find('/') + 1:], st.st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
#     print("Executable file created: " + "/work/" + file_to_create['name'][file_to_create['name'].find('/') + 1:])
# f.close()