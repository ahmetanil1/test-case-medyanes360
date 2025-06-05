import HashLoader from "react-spinners/HashLoader";
import React from "react"; // Ensure React is imported

const LoadingScreen = ({ isLoading }) => {
  return (
    <>
      {isLoading && (
        // Use 'fixed' positioning to cover the entire viewport
        // 'top-0', 'left-0' to start from the top-left corner
        // 'w-screen', 'h-screen' to take full viewport width and height
        // 'z-50' to ensure it's on top of other content
        <div className='fixed top-0 left-0 w-screen h-screen z-50 flex justify-center items-center flex-col gap-6'>
          <HashLoader
            color="#3d7bf1"
            aria-label="Loading Spinner"
            cssOverride={{}}
            size={100}
            loading={isLoading}
          />
        </div>
      )}
    </>
  );
}

export default LoadingScreen;