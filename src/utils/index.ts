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

/**
 * Generate a random slug from a title (e.g., my-title-abc123)
 * @param title The title to generate the slug from.
 * @returns The random slug.
 */
const genSlug = (title: string): string => {
  // This function generates a random slug from a title by removing special characters, replacing spaces with hyphens, and appending a random string.
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]\s-/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  const randomSuffix = Math.random().toString(36).slice(2);

  return `${slug}-${randomSuffix}`;
};

// Export the utility function
export { generateRandomUsername, genSlug };
