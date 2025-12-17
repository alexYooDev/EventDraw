
"""
You are given an integer array nums. We consider an array good if it is a permutation of an array base[n].

base[n] = [1, 2, ..., n - 1, n, n] (in other words, it is an array of length n + 1 which contains 1 to n - 1 exactly once, plus two occurrences of n). For example, base[1] = [1, 1] and base[3] = [1, 2, 3, 3].

Return true if the given array is good, otherwise return false.

Note: A permutation of integers represents an arrangement of these numbers.
"""


def isGood(nums):
    """
    Check if array is good (a permutation of base[n])
    
    Strategy:
    1. Length must be n + 1 where n is the max element
    2. Max element (n) must appear exactly twice
    3. All numbers from 1 to n-1 must appear exactly once
    """
    # Sort the array to make it easier to check
    nums.sort()
    
    # The last element should be n (the maximum)
    n = nums[-1]
    
    # Length should be n + 1
    if len(nums) != n + 1:
        return False
    
    # Count occurrences of each number
    count = {}
    for num in nums:
        count[num] = count.get(num, 0) + 1
    
    # Check if n appears exactly twice
    if count.get(n, 0) != 2:
        return False
    
    # Check if all numbers from 1 to n-1 appear exactly once
    for i in range(1, n):
        if count.get(i, 0) != 1:
            return False
    
    return True


# Test cases
print(isGood([2, 1, 3]))        # Expected: False (should be [1, 2, 3, 3])
print(isGood([1, 3, 3, 2]))     # Expected: True (permutation of [1, 2, 3, 3])
print(isGood([1, 1]))           # Expected: True (permutation of [1, 1])
print(isGood([3, 4, 4, 1, 2, 1])) # Expected: False
