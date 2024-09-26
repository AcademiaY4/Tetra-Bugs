const whiteList = [
    "https://www.yoursite.com",
    "http://localhost:3000",
  ];
  
  const CorsConfig = {
    origin: (origin, callback) => {
      if (whiteList.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not Allowed By CORS"));
      }
    },
    optionalSuccessStatus: 200,
  };
  
  module.exports= CorsConfig;