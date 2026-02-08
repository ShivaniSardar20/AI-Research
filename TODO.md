# TODO: Implement JWT Authentication for Full-Stack App

- [x] Update backend/requirements.txt: Add djangorestframework and djangorestframework-simplejwt
- [x] Update backend/AI_backend/settings.py: Add rest_framework and rest_framework_simplejwt to INSTALLED_APPS, configure JWT settings
- [x] Modify backend/papers/views.py: Replace session auth with JWT token obtain and refresh views
- [x] Update backend/papers/urls.py: Add JWT token endpoints
- [x] Add auth API functions to frontend/src/utils/api.js: Functions for login, signup, token refresh
- [x] Create frontend/src/contexts/AuthContext.jsx: React context for auth state management
- [x] Create frontend/src/pages/LoginPage.jsx: UI component for login
- [x] Create frontend/src/pages/SignupPage.jsx: UI component for signup
- [x] Update frontend/src/App.jsx: Integrate auth context, add protected routes, and auth flow
- [x] Install backend dependencies
- [x] Test authentication endpoints
- [x] Test frontend auth flow
