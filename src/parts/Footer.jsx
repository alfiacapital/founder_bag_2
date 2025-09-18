import React from 'react';

function Footer(props) {
    return (
        <>
            {/* Bottom Bar */}
            <footer className="flex justify-between items-center p-6 px-8 border-t border-dark-stroke bg-dark-bg2">
                <div className="flex space-x-6">
                    <button className="text-sm">Home</button>
                    <button className="text-sm">Reports</button>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="px-4 py-1 rounded-full bg-indigo-500 text-white hover:bg-indigo-600">
                        Add new task
                    </button>
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                        <span>3/5</span>
                        <button className="underline">Help center</button>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Footer;
