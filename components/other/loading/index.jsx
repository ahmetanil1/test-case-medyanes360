import HashLoader from "react-spinners/HashLoader";
import React from "react"; 

const LoadingScreen = ({ isLoading }) => {
  return (
    <>
      {isLoading && (
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