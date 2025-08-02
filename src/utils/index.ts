/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 01 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// Generate a random username
const generateRandomUsername = (): string => {
  const userNamePrefix = 'user_';

  // This function generates a random username by appending a random string to a prefix.
  // This line generates a short random alphanumeric string by converting a random number to base-36 (digits + letters) and removing the leading `"0."`.
  // The `slice(2)` removes the first two characters, which are "0." from the string representation of the random number.
  const randomSuffix = Math.random().toString(36).slice(2);

  return `${userNamePrefix}${randomSuffix}`;
};

// Export the utility function
export { generateRandomUsername };
