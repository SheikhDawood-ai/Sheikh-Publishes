# Security Specification - LancerIntel Pro

## Data Invariants
1. A User document can only be created by the user themselves, and their `uid` must match their Auth UID.
2. `subscriptionStatus` must be either 'free' or 'pro'.
3. A BusinessProfile must belong to a User and can only be accessed by that User.
4. Opportunities must belong to a specific BusinessProfile.

## The "Dirty Dozen" Payloads (Denial Tests)
1. **Identity Spoofing**: Attempt to create a user document with a different UID.
2. **Privilege Escalation**: A 'guest' (unauthenticated) user attempting to write to `users` collection.
3. **Cross-User Leak**: User A attempting to read User B's profile.
4. **Invalid State**: Attempting to set `subscriptionStatus` to 'god_mode'.
5. **Shadow Field**: Adding a `isAdmin: true` field to a user document.
6. **Immutable Violation**: Attempting to change `createdAt` on an update.
7. **Orphaned Write**: Creating a profile for a user ID that doesn't exist.
8. **Resource Poisoning**: Injecting a 2MB string into a profile `name`.
9. **ID Poisoning**: Using `../` or junk characters in a document ID.
10. **Auth Bypass**: Attempting to update a user profile without being authenticated.
11. **Bulk Scraping**: Attempting to list all users in the system.
12. **PII Leak**: Attempting to read another user's email address.

## The Test Runner
(This would be a firestore.rules.test.ts file)
