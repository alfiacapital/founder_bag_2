# Error Handling Guide

This project includes a comprehensive error handling system to catch and display errors beautifully.

## Components

### 1. ErrorBoundary (Class Component)
**Location:** `src/components/ErrorBoundary.jsx`

**Purpose:** Catches all React component errors automatically (syntax errors, runtime errors, etc.)

**Features:**
- ✅ Automatic error catching for the entire app
- ✅ Beautiful error display with theme support
- ✅ Shows technical details in development mode
- ✅ Copy error details to clipboard
- ✅ Reload page or go to dashboard options
- ✅ Stack trace and component stack for debugging

**Setup:**
Already wrapped around your entire app in `main.jsx`:
```jsx
<ErrorBoundary>
  <UserProvider>
    <App />
  </UserProvider>
</ErrorBoundary>
```

**When it triggers:**
- JavaScript errors in components
- Errors in render methods
- Errors in lifecycle methods
- Errors in constructors

---

### 2. ErrorFallback (Functional Component)
**Location:** `src/components/ErrorFallback.jsx`

**Purpose:** Reusable component for handling data loading errors, API failures, network issues

**Features:**
- ✅ Different error types (general, network, data, auth)
- ✅ Custom messages and titles
- ✅ Retry functionality
- ✅ Smaller, inline error display
- ✅ Perfect for query errors

**Usage Examples:**

#### With React Query:
```jsx
import ErrorFallback from '@/components/ErrorFallback';

const MyComponent = () => {
  const { data, isError, error, refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks
  });

  if (isError) {
    return (
      <ErrorFallback 
        error={error} 
        resetError={refetch}
        type="data"
        title="Failed to load tasks"
      />
    );
  }

  return <div>{/* Your component */}</div>;
};
```

#### With Axios/Fetch:
```jsx
import { useState, useEffect } from 'react';
import ErrorFallback from '@/components/ErrorFallback';

const MyComponent = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClient.get('/api/data');
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    return (
      <ErrorFallback 
        error={error}
        resetError={fetchData}
        type="network"
      />
    );
  }

  if (loading) return <div>Loading...</div>;

  return <div>{/* Your component */}</div>;
};
```

#### Error Types:
```jsx
// General error (default)
<ErrorFallback type="general" />

// Network/connection error
<ErrorFallback type="network" />

// Data loading error
<ErrorFallback type="data" />

// Authentication/permission error
<ErrorFallback type="auth" />
```

#### Custom Messages:
```jsx
<ErrorFallback 
  title="Custom Title"
  message="Custom error message explaining what went wrong"
  error={error}
  resetError={retry}
  type="data"
/>
```

#### Without Retry Button:
```jsx
<ErrorFallback 
  error={error}
  showRetry={false}
  type="auth"
/>
```

---

## Error Types Comparison

| Scenario | Use This | Example |
|----------|----------|---------|
| Component crashes | ErrorBoundary (automatic) | Syntax error, undefined variable |
| API fetch fails | ErrorFallback | Network error, 500 response |
| No permission | ErrorFallback (type="auth") | 401/403 errors |
| Data not found | ErrorFallback (type="data") | Empty response, malformed data |
| Network offline | ErrorFallback (type="network") | No internet connection |

---

## Testing

### Test Page
Visit `/test-error` to see both error types in action:
- Click "Throw Error" to test ErrorBoundary
- Click "Simulate Data Error" to test ErrorFallback

**Note:** Remove or hide this page in production!

### Testing in Your Components

#### Test ErrorBoundary:
Add a button that throws an error:
```jsx
<button onClick={() => { throw new Error('Test error!') }}>
  Break Component
</button>
```

#### Test ErrorFallback:
Simulate a failed query or API call in your component.

---

## Best Practices

### 1. Use ErrorFallback for Expected Errors
```jsx
// ✅ Good - Handle expected API errors
if (isError) {
  return <ErrorFallback error={error} resetError={refetch} />;
}

// ❌ Bad - Let errors crash the entire app
// (Don't do this - ErrorBoundary will catch it, but it's not user-friendly)
```

### 2. Provide Context in Error Messages
```jsx
// ✅ Good
<ErrorFallback 
  title="Failed to load your tasks"
  message="We couldn't fetch your tasks from the server. Please check your connection."
  type="data"
/>

// ❌ Bad - Generic message
<ErrorFallback error={error} />
```

### 3. Always Provide a Retry Option
```jsx
// ✅ Good
<ErrorFallback 
  error={error}
  resetError={refetch}  // User can try again
/>

// ❌ Bad - No way to recover
<ErrorFallback 
  error={error}
  showRetry={false}  // Only use this if retry doesn't make sense
/>
```

### 4. Use Appropriate Error Types
```jsx
// ✅ Good - Specific error type
if (error.response?.status === 401) {
  return <ErrorFallback type="auth" />;
}
if (error.message.includes('network')) {
  return <ErrorFallback type="network" />;
}

// ❌ Bad - Always using default
return <ErrorFallback error={error} />;
```

---

## Development vs Production

### Development Mode:
- ErrorBoundary shows full stack traces
- Technical details are visible
- Copy error button available
- "Development Mode" badge shown

### Production Mode:
- Clean, user-friendly error messages
- No technical details exposed
- Focus on recovery options

This is automatically detected using `import.meta.env.DEV`

---

## Error Logging

To add error logging to an external service (like Sentry, LogRocket, etc.):

### In ErrorBoundary.jsx:
```jsx
componentDidCatch(error, errorInfo) {
  console.error('Error caught by boundary:', error, errorInfo);
  
  // Add your error logging service here
  // Example:
  // Sentry.captureException(error, { extra: errorInfo });
  // LogRocket.captureException(error);
  
  this.setState({ error, errorInfo });
}
```

### In ErrorFallback:
Wrap your API calls with try-catch and log errors:
```jsx
try {
  await axiosClient.get('/api/data');
} catch (err) {
  // Log to service
  // Sentry.captureException(err);
  setError(err);
}
```

---

## Styling

All error components use your theme colors:
- `bg-dark-bg` - Background
- `bg-dark-bg2` - Card backgrounds
- `border-dark-stroke` - Borders
- `text-dark-text1` - Primary text
- `text-dark-text2` - Secondary text

Works seamlessly with both light and dark modes!

---

## Summary

✅ **ErrorBoundary** - Catches all React errors automatically (already set up)
✅ **ErrorFallback** - Use for API/data errors (add to your components)
✅ **Test at** `/test-error` (remove in production)
✅ **Theme-aware** - Works with light/dark mode
✅ **Developer-friendly** - Shows details in dev, clean in production
✅ **User-friendly** - Clear messages and recovery options

Happy error handling! 🎉

