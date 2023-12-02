import sys
import os

def verify_output(input_file_contents, output_file_contents):
    return int(output_file_contents) == int(input_file_contents[0]) + int(input_file_contents[1])

