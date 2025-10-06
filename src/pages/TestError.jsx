import React, { useState } from 'react';
import ErrorFallback from '../components/ErrorFallback';

/**
 * Component that will crash when rendered
 */
const CrashingComponent = () => {
    // This will throw an error during render
    throw new Error('💥 This component intentionally crashed during render!');
};

/**
 * This page is for testing error boundaries and error displays
 * Remove or hide this in production
 */
function TestError() {
    const [showDataError, setShowDataError] = useState(false);
    const [showCrashingComponent, setShowCrashingComponent] = useState(false);

    // This will trigger the ErrorBoundary
    const throwError = () => {
        throw new Error('This is a test error from TestError component!');
    };

    // Simulate a data loading error
    const simulateDataError = () => {
        setShowDataError(true);
    };

    // Show a component that will crash
    const triggerComponentCrash = () => {
        setShowCrashingComponent(true);
    };

    // This will trigger the error boundary
    if (showCrashingComponent) {
        return <CrashingComponent />;
    }

    if (showDataError) {
        return (
            <ErrorFallback
                error={new Error('Failed to fetch data from API')}
                resetError={() => setShowDataError(false)}
                title="Data Loading Failed"
                type="data"
            />
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-dark-text1 mb-6">
                    Error Testing Page
                </h1>
                
                <div className="bg-dark-bg2 border border-dark-stroke rounded-button p-6 mb-6">
                    <p className="text-dark-text2 mb-4">
                        This page is for testing error handling. Click the buttons below to see different error states.
                    </p>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-button p-3 mt-3">
                        <p className="text-blue-400 text-sm">
                            ℹ️ <strong>Note:</strong> Errors are caught by React Router's errorElement first, 
                            which shows the RouterErrorPage. This is the expected behavior and provides 
                            a better UX than the default ErrorBoundary for most cases.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Test Error Boundary - Event Handler */}
                    <div className="bg-dark-bg2 border border-dark-stroke rounded-button p-6">
                        <h2 className="text-xl font-semibold text-dark-text1 mb-3">
                            1. Test Error Boundary (Event Handler)
                        </h2>
                        <p className="text-dark-text2 mb-4">
                            This will throw an error in an event handler. Note: This might not be caught by ErrorBoundary 
                            because it happens outside React's render cycle. Check browser console.
                        </p>
                        <button
                            onClick={throwError}
                            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-button font-semibold transition-all duration-300"
                        >
                            Throw Error (Click Handler)
                        </button>
                    </div>

                    {/* Test Error Boundary - Render Error */}
                    <div className="bg-dark-bg2 border border-dark-stroke rounded-button p-6">
                        <h2 className="text-xl font-semibold text-dark-text1 mb-3">
                            2. Test Error Boundary (Render Error) ✅ BEST TEST
                        </h2>
                        <p className="text-dark-text2 mb-4">
                            This will render a component that crashes during render. This WILL trigger the ErrorBoundary!
                        </p>
                        <button
                            onClick={triggerComponentCrash}
                            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-button font-semibold transition-all duration-300"
                        >
                            Crash Component (Render Error)
                        </button>
                    </div>

                    {/* Test Data Error */}
                    <div className="bg-dark-bg2 border border-dark-stroke rounded-button p-6">
                        <h2 className="text-xl font-semibold text-dark-text1 mb-3">
                            3. Test Data Error Fallback
                        </h2>
                        <p className="text-dark-text2 mb-4">
                            This will show the ErrorFallback component for data loading errors.
                        </p>
                        <button
                            onClick={simulateDataError}
                            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-button font-semibold transition-all duration-300"
                        >
                            Simulate Data Error
                        </button>
                    </div>

                    {/* What ErrorBoundary Can/Cannot Catch */}
                    <div className="bg-dark-bg2 border border-dark-stroke rounded-button p-6">
                        <h2 className="text-xl font-semibold text-dark-text1 mb-3">
                            What ErrorBoundary Can Catch
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div>
                                <h3 className="font-semibold text-green-500 mb-2">✅ Can Catch:</h3>
                                <ul className="space-y-1 text-dark-text2 ml-4">
                                    <li>• Errors during rendering</li>
                                    <li>• Errors in lifecycle methods</li>
                                    <li>• Errors in constructors</li>
                                    <li>• Errors in useEffect (during render phase)</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-red-500 mb-2">❌ Cannot Catch:</h3>
                                <ul className="space-y-1 text-dark-text2 ml-4">
                                    <li>• Syntax errors (like missing brackets)</li>
                                    <li>• Errors in event handlers (onClick, onChange, etc.)</li>
                                    <li>• Async errors (setTimeout, promises without proper handling)</li>
                                    <li>• Server-side rendering errors</li>
                                    <li>• Errors thrown in ErrorBoundary itself</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Usage Examples */}
                    <div className="bg-dark-bg2 border border-dark-stroke rounded-button p-6">
                        <h2 className="text-xl font-semibold text-dark-text1 mb-3">
                            Usage Examples
                        </h2>
                        <div className="space-y-3 text-sm text-dark-text2">
                            <div>
                                <h3 className="font-semibold text-dark-text1 mb-1">Error Boundary (Automatic):</h3>
                                <p>Catches React component render errors automatically. Already set up in main.jsx</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-dark-text1 mb-1">ErrorFallback Component:</h3>
                                <pre className="bg-dark-active p-3 rounded mt-2 overflow-x-auto">
{`import ErrorFallback from '@/components/ErrorFallback';

// In your component:
if (isError) {
  return <ErrorFallback 
    error={error} 
    resetError={refetch}
    type="data"
  />;
}`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-button">
                    <p className="text-yellow-500 text-sm font-medium">
                        ⚠️ Note: Remove or hide this test page in production
                    </p>
                </div>
            </div>
        </div>
    );
}

export default TestError;

