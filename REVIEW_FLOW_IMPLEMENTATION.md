# Review Flow Implementation

## Overview

This document describes the Worker Review Flow implemented in the Nexaro Poster module. After a Poster successfully releases payment for a completed task, they are automatically redirected to a dedicated Review Page where they can rate and write a review for the Worker. The backend validates the review, enforces authorization, prevents duplicates, and stores the data.

---

## User Flow

```
Poster on WorkProgress page
        ↓
Clicks "Release Payment" → ReleasePaymentModal opens
        ↓
Confirms → POST /api/payment/orders/:bidId/payout
        ↓
Payment API returns { success: true }
        ↓
onSuccess(taskId) called
        ↓
Navigate to /poster/review/:taskId
        ↓
ReviewPage loads — fetches task + worker info
        ↓
Poster fills star rating (1–5) + review text (10–1000 chars)
        ↓
Submit → POST /api/poster/review
        ↓
Backend validates + stores Review document
        ↓
Success response (201)
        ↓
Success message shown → redirect to /poster/completed-task/:taskId
```

---

## Frontend Changes

### New Pages

#### `pages/poster/ReviewPage.jsx`
- Route: `/poster/review/:taskId` (protected, poster only)
- Fetches task and worker data via the existing `useGetCompletedTaskPosterSideQuery` hook (no new backend endpoint needed for data fetch)
- Displays a payment-success banner matching the reference image
- Handles already-reviewed state gracefully (shows "Already Reviewed" card)
- Two-column layout on desktop: `ReviewForm` (left, 2/3) + `WorkerReviewCard` sidebar (right, 1/3)
- Collapses to single-column on mobile
- Uses same `PosterNavBar` + `PosterHeader` + scrollable body shell as all other poster pages
- Redirects to `/poster/completed-task/:taskId` 1.5 seconds after successful review submission

### New Components

#### `components/Poster/Review/RatingInput.jsx`
- Reusable interactive 5-star rating input
- Hover scale animation, accessible `aria-label` attributes
- Shows validation error below the stars

#### `components/Poster/Review/WorkerReviewCard.jsx`
- Dark sidebar card (matches reference image)
- Displays: worker avatar/initial, name, category badge, total earned, task status
- Task details section: date completed, location, worker rating
- Feedback tip section at bottom

#### `components/Poster/Review/ReviewForm.jsx`
- Built with **React Hook Form** (`useForm`, `Controller`, `useWatch`)
- `RatingInput` integrated via `Controller`
- Textarea for review text with `useWatch` for live char count
- Field-level validation messages
- API error displayed below form (via `setError('root', ...)`)
- Submit button shows loading spinner and is disabled during submission
- Shows success state inline before redirect

### Routing Changes

#### `App.jsx`
Added inside the poster `PrivateRoute` block:
```jsx
<Route path="review/:taskId" element={<ReviewPage />} />
```

### ReleasePaymentModal Changes

#### `components/sharedComponents/poster/ReleasePaymentModal.jsx`
- Added `taskId` prop (passed from `WorkProgress`)
- Added `onSuccess(taskId)` prop callback — **only called when payment API returns `success: true`**
- Added loading state on Confirm button (prevents double submissions)
- Added inline API error display — modal stays open on failure
- Backdrop click disabled during payment processing
- If payment fails, modal shows the error and allows retry or cancel

### WorkProgress Changes

#### `pages/poster/WorkProgress.jsx`
- Passes `taskId` prop to `ReleaseModal`
- Passes `onSuccess` handler that:
  1. Closes the modal (`setShowReleaseModal(false)`)
  2. Sets `released(true)` (backward compat)
  3. Navigates to `/poster/review/:taskId`

### Validation

#### Client-side (ReviewForm)
| Field | Rules |
|-------|-------|
| Rating | Required, must be 1–5 (validated via Controller rules) |
| Review text | Required, min 10 chars, max 1000 chars, non-whitespace |

- Submit button disabled while API call is in progress
- Duplicate submission prevented by `isLoading` guard

### API Integration

#### `store/services/posterApi.js`
Added `submitReview` mutation:
- `POST /poster/review`
- Invalidates `Poster_Completed_Task` and `Poster_Profile` cache tags on success

#### `constants/urls.js`
Added:
```js
export const REVIEWS = {
  CREATE_REVIEW: '/poster/review',
};
```

---

## Backend Changes

### Model

#### `models/reviewSchema.js` (unchanged — already existed)
```js
{
  taskId: ObjectId (ref: Task)
  reviewer: ObjectId (ref: User)
  reviewee: ObjectId (ref: User)
  rating: Number (1–5)
  review: String
  adminResponse: String (default: "")
  isDeleted: Boolean (default: false)
  timestamps: true  (createdAt used as postedAt)
}
```

### New Files

#### `services/reviewServices.js`
Business logic for creating a review. Full authorization chain:
1. Validates `taskId` and `reviewee` ObjectId formats
2. Validates `rating` (integer, 1–5)
3. Validates `review` text (non-null, 10–1000 chars after trim)
4. Fetches task from DB
5. Verifies `task.posterId === reviewerId` (authenticated user must be the poster)
6. Verifies `task.status === 'completed'` AND `task.update === 'payment'` (payment released)
7. Verifies `task.workerId === reviewee` from request body
8. Checks for existing `Review` with same `taskId + reviewer` (duplicate guard)
9. Creates the `Review` document with `isDeleted: false`

#### `controller/PosterControllers/reviewController.js`
- Follows same pattern as `posterController.js`
- Extracts `reviewer` from `req.user._id` (JWT) — never from request body
- Maps service errors to appropriate HTTP status codes:
  - `unauthorized: true` → 401
  - `duplicate: true` → 409
  - Other errors → 400
  - Catch-all → 500

### Modified Files

#### `constants/messages.js`
Added review-specific constants:
- `REVIEW_SUBMITTED`
- `REVIEW_ALREADY_EXISTS`
- `TASK_NOT_ELIGIBLE_FOR_REVIEW`
- `UNAUTHORIZED_REVIEWER`
- `INVALID_RATING`
- `REVIEW_TOO_SHORT`
- `REVIEW_TOO_LONG`
- `REVIEWEE_MISMATCH`
- `REVIEW_REQUIRED`

#### `routes/posterRouter.js`
Added:
```js
router.post('/review', verifyToken, createReview);
```

---

## API Contract

**Endpoint:** `POST /api/poster/review`  
**Authentication:** Bearer token (JWT via `verifyToken` middleware)  
**Content-Type:** `application/json`

### Request Body
```json
{
  "taskId": "687d1a2b3c4e5f6a7b8c9d0e",
  "reviewee": "687d1a2b3c4e5f6a7b8c9d0f",
  "rating": 5,
  "review": "Excellent work! Very professional and on time."
}
```

### Success Response (201)
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "reviewId": "687d1a2b3c4e5f6a7b8c9d10"
  }
}
```

### Error Responses

| Status | Condition | Message |
|--------|-----------|---------|
| 400 | Task not found | "Task not found" |
| 400 | Task not completed / payment not released | "This task is not eligible for a review..." |
| 400 | Reviewee does not match task worker | "The reviewee does not match the worker assigned to this task" |
| 400 | Rating out of range | "Rating must be a number between 1 and 5" |
| 400 | Review too short | "Review must be at least 10 characters" |
| 400 | Review too long | "Review must not exceed 1000 characters" |
| 401 | Authenticated user is not the task poster | "You are not authorized to review this task" |
| 409 | Review already submitted for this task | "You have already submitted a review for this task" |
| 500 | Unexpected error | "Internal server error" |

---

## Security

### How the Backend Verifies Authorization

1. **JWT authentication** — `verifyToken` middleware sets `req.user` from the signed JWT. The `reviewer` field in the review document is set to `req.user._id` — never from the request body.

2. **Poster ownership check** — `task.posterId.toString() === reviewerId.toString()` ensures only the poster who created the task can submit a review. A poster cannot review a worker for someone else's task.

3. **Worker association check** — `task.workerId.toString() === reviewee.toString()` ensures the `reviewee` in the request matches the worker actually assigned to the task. A poster cannot review an arbitrary worker.

4. **Task state check** — `task.status === 'completed' && task.update === 'payment'` ensures the review can only be submitted after the full workflow is complete and payment has been released.

5. **Duplicate prevention** — MongoDB query checks for an existing `Review` with the same `taskId + reviewer` combination before inserting. If found, returns 409.

---

## File Structure

### New Files
```
back-end/src/
  services/
    reviewServices.js          ← Business logic + authorization
  controller/
    PosterControllers/
      reviewController.js      ← HTTP handler

front-end/src/
  components/
    Poster/
      Review/
        RatingInput.jsx        ← Interactive star rating
        WorkerReviewCard.jsx   ← Dark sidebar card
        ReviewForm.jsx         ← react-hook-form review form
  pages/
    poster/
      ReviewPage.jsx           ← Dedicated review page
```

### Modified Files
```
back-end/src/
  constants/messages.js        ← Added review message constants
  routes/posterRouter.js       ← Added POST /review route

front-end/src/
  App.jsx                      ← Added review/:taskId route
  constants/urls.js            ← Added REVIEWS constant
  store/services/posterApi.js  ← Added submitReview mutation
  components/sharedComponents/poster/
    ReleasePaymentModal.jsx    ← Added loading state + onSuccess
  pages/poster/
    WorkProgress.jsx           ← Passes taskId + onSuccess to modal
```

---

## Testing

### Payment Release Flow
| Test Case | Expected | Result |
|-----------|----------|--------|
| Successful payment release | Redirects to `/poster/review/:taskId` | ✅ |
| Failed payment release | Modal shows error, no redirect | ✅ |
| Double-click Confirm button | Button disabled during loading | ✅ |
| Payment success message | Modal stays open during API call | ✅ |

### Review Page
| Test Case | Expected | Result |
|-----------|----------|--------|
| Page loads with correct data | Worker name, task details visible | ✅ |
| Submit with no rating | "Please select a rating." shown | ✅ |
| Submit with empty review | "Please enter your review." shown | ✅ |
| Submit with whitespace review | Min-chars validation triggers | ✅ |
| Submit with <10 char review | Min-chars validation triggers | ✅ |
| Submit with >1000 char review | Max-chars validation triggers | ✅ |
| Char counter | Updates live as user types | ✅ |
| Submit loading state | Button shows spinner, disabled | ✅ |
| Successful submission | Success message shown, redirects | ✅ |
| Backend error (e.g. duplicate) | Error message displayed in form | ✅ |
| Already reviewed state | "Already Reviewed" card shown | ✅ |

### Authorization
| Test Case | Expected | Result |
|-----------|----------|--------|
| Different poster tries to review | Backend returns 401 | ✅ |
| Wrong reviewee sent | Backend returns 400 | ✅ |
| Task not in completed+payment state | Backend returns 400 | ✅ |
| Duplicate review submission | Backend returns 409 | ✅ |
| reviewer from request body ignored | reviewer always from JWT | ✅ |

### Responsive UI
| Breakpoint | Layout |
|------------|--------|
| Desktop (lg+) | Two-column: form (2/3) + worker sidebar (1/3) |
| Tablet (md) | Single column, full width |
| Mobile (sm) | Single column, full width |
