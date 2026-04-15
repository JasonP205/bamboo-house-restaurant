const LoadingPage = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-48 h-48 rounded-lg">
        <img
          src="/img/bamboo-house-icon.png"
          alt="Loading..."
          className="w-full h-full object-contain animate-pulse"
        />
      </div>
    </div>
  );
};

export default LoadingPage;
