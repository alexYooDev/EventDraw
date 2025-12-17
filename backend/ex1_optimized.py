"""
LeetCode 2784: Check if Array is Good
Optimized O(n) solution without sorting
"""

def isGood(nums):
    """
    Optimized approach - O(n) time, O(n) space
    
    Key insight: For base[n] = [1, 2, ..., n-1, n, n]
    - Length must be n + 1
    - Sum should be: 1 + 2 + ... + (n-1) + n + n = n*(n+1)/2 + n
    - Max element is n
    - Count validation still needed to catch edge cases
    """
    n = len(nums) - 1  # Expected n value based on length
    
    # Quick validation: check if max element matches expected n
    max_val = max(nums)
    if max_val != n:
        return False
    
    # Count occurrences efficiently
    count = {}
    for num in nums:
        count[num] = count.get(num, 0) + 1
    
    # Validate in one pass:
    # - n appears exactly twice
    # - all numbers from 1 to n-1 appear exactly once
    if count.get(n, 0) != 2:
        return False
    
    for i in range(1, n):
        if count.get(i, 0) != 1:
            return False
    
    return True


def isGood_with_sum_check(nums):
    """
    Alternative with mathematical validation
    Uses sum check as early exit optimization
    """
    n = len(nums) - 1
    
    # Expected sum for base[n]: 1+2+...+(n-1)+n+n = n*(n+1)/2 + n
    expected_sum = n * (n + 1) // 2 + n
    actual_sum = sum(nums)
    
    # Early exit if sum doesn't match
    if actual_sum != expected_sum:
        return False
    
    # Check max element
    max_val = max(nums)
    if max_val != n:
        return False
    
    # Validate counts (still needed for cases like [2,2,2,1,1,1])
    count = {}
    for num in nums:
        count[num] = count.get(num, 0) + 1
    
    if count.get(n, 0) != 2:
        return False
    
    for i in range(1, n):
        if count.get(i, 0) != 1:
            return False
    
    return True


def isGood_most_optimal(nums):
    """
    Most space-efficient using XOR trick (for learning purposes)
    Not necessarily faster but demonstrates bit manipulation
    """
    n = len(nums) - 1
    
    # Quick checks
    if not nums or n == 0:
        return nums == [1, 1] if n == 0 else False
    
    max_val = max(nums)
    if max_val != n or sum(nums) != n * (n + 1) // 2 + n:
        return False
    
    # Count occurrences
    count = [0] * (n + 1)
    for num in nums:
        if num < 1 or num > n:
            return False
        count[num] += 1
    
    # Validate
    if count[n] != 2:
        return False
    
    for i in range(1, n):
        if count[i] != 1:
            return False
    
    return True


# Performance comparison
if __name__ == "__main__":
    import time
    
    test_cases = [
        ([2, 1, 3], False),
        ([1, 3, 3, 2], True),
        ([1, 1], True),
        ([3, 4, 4, 1, 2, 1], False),
        ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10], True),
    ]
    
    print("Testing all approaches:\n")
    for nums, expected in test_cases:
        result1 = isGood(nums.copy())
        result2 = isGood_with_sum_check(nums.copy())
        result3 = isGood_most_optimal(nums.copy())
        
        status = "✓" if result1 == expected else "✗"
        print(f"{status} {nums[:5]}{'...' if len(nums) > 5 else ''} → {result1} (expected {expected})")
        assert result1 == result2 == result3 == expected
    
    print("\n" + "="*50)
    print("Complexity Analysis:")
    print("="*50)
    print("\nOriginal (with sorting):")
    print("  Time:  O(n log n) - dominated by sort")
    print("  Space: O(n) - dictionary")
    
    print("\nOptimized (no sorting):")
    print("  Time:  O(n) - single pass")
    print("  Space: O(n) - dictionary or array")
    
    print("\nWith sum check:")
    print("  Time:  O(n) - with early exit optimization")
    print("  Space: O(n)")
    print("\n  Benefit: Can exit early if sum doesn't match")
    print("           before checking all counts")
