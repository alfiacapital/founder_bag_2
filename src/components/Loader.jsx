import React from 'react';

function Loader({ progress }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#000000]">
            <img src={"/ALFIA_SYSTEM.png"} alt="logo" className="mb-4 animate-pulse w-[20rem]" loading={"lazy"} />
            <div className="w-[80%] md:w-[25%] ">
                <LinearProgressBar progress={progress} />
            </div>
        </div>
    );
}

function LinearProgressBar({ progress }) {
    return (
        <div dir={"ltr"} className="w-full bg-gray-200 rounded-full h-1 relative mt-10">
            <div
                className="h-full rounded-full "
                style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, rgb(0, 1, 226) 0%, rgba(0,162,255,1) 100%)',
                    boxShadow: '0 0 15px 7px rgba(0, 162, 255, 0.4)',
                    // filter: 'blur(2px)',

                    position: 'relative',
                }}
            >
                <div className={"animate-pulse "}
                     style={{
                         position: 'absolute',
                         right: '8px', // Adjust this value to position the shadow correctly
                         top: '50%',
                         transform: 'translateY(-50%)',
                         width: '1px',
                         height: '1px',
                         borderRadius: '50%',
                         background: '', // Make the element itself transparent
                         boxShadow: '0 0 150px 70px rgba(0, 162, 255, 0.4)',
                         filter: 'blur(2px)',

                     }}
                ></div>
            </div>
        </div>
    );
}

export default Loader;
