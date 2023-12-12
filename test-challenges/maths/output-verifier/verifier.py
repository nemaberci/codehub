def verify(input_file_contents, output_file_contents):
    try:
        numbers = []
        for line in input_file_contents[1:]:
            numbers.append(int(line))
        output_numbers = []
        if output_file_contents != None:
            for line in output_file_contents:
                output_numbers.append(int(line))
        if len(output_numbers) != len(numbers):
            return False
        # We check if the output numbers are sorted
        if output_numbers != sorted(output_numbers):
            return False
        # We check if every number in the input is present in the output
        number_count = {}
        for number in numbers:
            if number not in number_count:
                number_count[number] = 1
            else:
                number_count[number] += 1
        for number in output_numbers:
            if number not in number_count:
                return False
            else:
                number_count[number] -= 1
        for number in number_count:
            if number_count[number] != 0:
                return False
        return True
    except:
        return False