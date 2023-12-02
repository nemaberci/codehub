

def verify(input_file_contents, output_file_contents):
    print(int(output_file_contents[0]), int(input_file_contents[0]) + int(input_file_contents[1]))
    print(int(output_file_contents[1]), int(input_file_contents[0]) * int(input_file_contents[1]))
    return int(output_file_contents[0]) == int(input_file_contents[0]) + int(input_file_contents[1]) and int(output_file_contents[1]) == int(input_file_contents[0]) * int(input_file_contents[1])
