import React from 'react';

function Footer(props) {
    return (
        <>
            {/* Responsive Footer */}
            <footer className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 px-4 sm:px-8 border-t border-dark-stroke bg-dark-bg2 gap-4 sm:gap-0">
                {/* Left Section - Navigation */}
                <div className="flex flex-wrap gap-4 sm:gap-6">
                    <button className="text-sm hover:text-white transition-colors duration-200">
                        Home
                    </button>
                    <button className="text-sm hover:text-white transition-colors duration-200">
                        Reports
                    </button>
                </div>
                
               
            </footer>
        </>
    );
}

export default Footer;
