import React from 'react';
import { BiErrorCircle, BiRefresh } from 'react-icons/bi';
import { MdOutlineWifiOff, MdOutlineDataUsage } from 'react-icons/md';

/**
 * Reusable error fallback component for query errors, API failures, etc.
 * Use this in your pages/components when data fetching fails
 */
const ErrorFallback = ({ 
    error, 
    resetError, 
    title = "Something went wrong",
    message,
    showRetry = true,
    type = "general" // general, network, data, auth
}) => {
    const getIcon = () => {
        switch (type) {
            case 'network':
                return <MdOutlineWifiOff className="w-12 h-12 text-orange-500" />;
            case 'data':
                return <MdOutlineDataUsage className="w-12 h-12 text-blue-500" />;
            case 'auth':
                return <BiErrorCircle className="w-12 h-12 text-red-500" />;
            default:
                return <BiErrorCircle className="w-12 h-12 text-red-500" />;
        }
    };

    const getDefaultMessage = () => {
        switch (type) {
            case 'network':
                return "Unable to connect to the server. Please check your internet connection and try again.";
            case 'data':
                return "We couldn't load the data you requested. This might be a temporary issue.";
            case 'auth':
                return "You don't have permission to view this content. Please sign in or contact support.";
            default:
                return "An unexpected error occurred. Please try again or contact support if the problem persists.";
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[400px] px-4">
            <div className="text-center max-w-md w-full">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-dark-bg2 rounded-full mb-4 border border-dark-stroke">
                    {getIcon()}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-dark-text1 mb-3">
                    {title}
                </h3>

                {/* Message */}
                <p className="text-dark-text2 mb-6">
                    {message || getDefaultMessage()}
                </p>

                {/* Error Details (if available) */}
                {error && (
                    <div className="bg-dark-bg2 border border-dark-stroke rounded-button p-3 mb-6 text-left">
                        <p className="text-xs text-dark-text2 font-mono break-all">
                            {error.message || error.toString()}
                        </p>
                    </div>
                )}

                {/* Retry Button */}
                {showRetry && resetError && (
                    <button
                        onClick={resetError}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-black rounded-button font-semibold transition-all duration-300"
                    >
                        <BiRefresh className="text-xl" />
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorFallback;

/**
 * Usage Examples:
 * 
 * 1. With React Query:
 * 
 * const { data, isError, error, refetch } = useQuery({
 *     queryKey: ["tasks"],
 *     queryFn: fetchTasks
 * });
 * 
 * if (isError) {
 *     return <ErrorFallback 
 *         error={error} 
 *         resetError={refetch}
 *         type="data"
 *     />;
 * }
 * 
 * 2. With try-catch:
 * 
 * const [error, setError] = useState(null);
 * 
 * try {
 *     // your code
 * } catch (err) {
 *     setError(err);
 * }
 * 
 * if (error) {
 *     return <ErrorFallback 
 *         error={error}
 *         resetError={() => setError(null)}
 *         type="network"
 *     />;
 * }
 * 
 * 3. Custom message:
 * 
 * <ErrorFallback 
 *     title="Failed to load tasks"
 *     message="We couldn't fetch your tasks. Please check your connection."
 *     error={error}
 *     resetError={retry}
 *     type="data"
 * />
 */

