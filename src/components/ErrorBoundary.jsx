import React from 'react';
import { BiErrorCircle, BiRefresh, BiHome, BiCopy, BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { MdBugReport } from 'react-icons/md';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            showDetails: false,
            copied: false
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });

        // You can also log the error to an error reporting service here
        // logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            showDetails: false,
            copied: false
        });
        window.location.href = '/';
    };

    handleReload = () => {
        window.location.reload();
    };

    handleCopyError = () => {
        const errorText = `
Error: ${this.state.error?.toString()}

Stack Trace:
${this.state.error?.stack}

Component Stack:
${this.state.errorInfo?.componentStack}
        `.trim();

        navigator.clipboard.writeText(errorText).then(() => {
            this.setState({ copied: true });
            setTimeout(() => this.setState({ copied: false }), 2000);
        });
    };

    toggleDetails = () => {
        this.setState(prev => ({ showDetails: !prev.showDetails }));
    };

    render() {
        if (this.state.hasError) {
            const isDev = import.meta.env.DEV;

            return (
                <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 py-8 overflow-auto">
                    <div className="max-w-4xl w-full">
                        {/* Error Icon and Title */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-red-500/10 rounded-full mb-6 animate-pulse">
                                <BiErrorCircle className="w-12 h-12 text-red-500" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-dark-text1 mb-4">
                                Oops! Something Went Wrong
                            </h1>
                            <p className="text-lg text-dark-text2 max-w-2xl mx-auto">
                                We're sorry, but something unexpected happened. Don't worry, 
                                your data is safe and we're here to help you get back on track.
                            </p>
                        </div>

                        {/* Error Message Card */}
                        <div className="bg-dark-bg2 border border-dark-stroke rounded-button p-6 mb-6">
                            <div className="flex items-start gap-3 mb-4">
                                <MdBugReport className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold text-dark-text1 mb-2">
                                        Error Details
                                    </h2>
                                    <p className="text-red-400 font-mono text-sm bg-dark-active p-3 rounded-button border border-dark-stroke break-all">
                                        {this.state.error?.toString() || 'Unknown error occurred'}
                                    </p>
                                </div>
                            </div>

                            {/* Developer Info Toggle */}
                            {isDev && (
                                <>
                                    <button
                                        onClick={this.toggleDetails}
                                        className="flex items-center gap-2 text-dark-text2 hover:text-dark-text1 transition-colors mb-3 text-sm font-medium"
                                    >
                                        {this.state.showDetails ? (
                                            <>
                                                <BiChevronUp className="w-5 h-5" />
                                                Hide Technical Details
                                            </>
                                        ) : (
                                            <>
                                                <BiChevronDown className="w-5 h-5" />
                                                Show Technical Details
                                            </>
                                        )}
                                    </button>

                                    {this.state.showDetails && (
                                        <div className="space-y-3">
                                            {/* Stack Trace */}
                                            <div>
                                                <h3 className="text-sm font-semibold text-dark-text1 mb-2">
                                                    Stack Trace:
                                                </h3>
                                                <pre className="text-xs text-dark-text2 bg-dark-active p-3 rounded-button border border-dark-stroke overflow-x-auto max-h-48 overflow-y-auto">
                                                    {this.state.error?.stack}
                                                </pre>
                                            </div>

                                            {/* Component Stack */}
                                            {this.state.errorInfo?.componentStack && (
                                                <div>
                                                    <h3 className="text-sm font-semibold text-dark-text1 mb-2">
                                                        Component Stack:
                                                    </h3>
                                                    <pre className="text-xs text-dark-text2 bg-dark-active p-3 rounded-button border border-dark-stroke overflow-x-auto max-h-48 overflow-y-auto">
                                                        {this.state.errorInfo.componentStack}
                                                    </pre>
                                                </div>
                                            )}

                                            {/* Copy Error Button */}
                                            <button
                                                onClick={this.handleCopyError}
                                                className="flex items-center gap-2 px-4 py-2 bg-dark-active hover:bg-dark-hover text-dark-text1 rounded-button transition-all border border-dark-stroke text-sm font-medium"
                                            >
                                                <BiCopy className="w-4 h-4" />
                                                {this.state.copied ? 'Copied!' : 'Copy Error Details'}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <button
                                onClick={this.handleReload}
                                className="flex-1 group relative px-6 py-4 bg-white hover:bg-gray-100 text-black rounded-button font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                <BiRefresh className="text-2xl relative z-10" />
                                <span className="relative z-10">Reload Page</span>
                            </button>

                            <button
                                onClick={this.handleReset}
                                className="flex-1 px-6 py-4 bg-dark-bg2 hover:bg-dark-active text-dark-text1 rounded-button font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 border border-dark-stroke hover:border-dark-text2"
                            >
                                <BiHome className="text-2xl" />
                                <span>Go to Dashboard</span>
                            </button>
                        </div>

                        {/* Help Section */}
                        <div className="bg-dark-bg2 border border-dark-stroke rounded-button p-6">
                            <h3 className="text-lg font-semibold text-dark-text1 mb-3">
                                What can you do?
                            </h3>
                            <ul className="space-y-2 text-dark-text2">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>Try reloading the page - sometimes a simple refresh fixes the issue</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>Go back to the dashboard and try a different route</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>Clear your browser cache and cookies</span>
                                </li>
                                {isDev && (
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 mt-1">•</span>
                                        <span>Check the technical details above for debugging information</span>
                                    </li>
                                )}
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>If the problem persists, contact support with the error details</span>
                                </li>
                            </ul>
                        </div>

                        {/* Environment Badge */}
                        {isDev && (
                            <div className="mt-6 text-center">
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-button text-sm font-medium border border-yellow-500/20">
                                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                                    Development Mode
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

