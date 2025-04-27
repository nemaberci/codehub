#include <iostream>
#include <vector>
#include <algorithm>

int main(int args, char** argv) {

    // Read the number of inputs
    int n;
    std::cin >> n;
    // Read the numbers into a vector
    std::vector<int> numbers(n);
    for (int i = 0; i < n; i++) {
        std::cin >> numbers[i];
    }
    // Sort the numbers
    std::sort(numbers.begin(), numbers.end());
    // Print the numbers
    for (int i = 0; i < n; i++) {
        std::cout << numbers[i] << "\n";
    }

    return 0;
}