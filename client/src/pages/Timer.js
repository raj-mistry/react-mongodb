import React, { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(120);
  const [tick, setTick] = useState(true);

  useEffect(() => {
        
        const intervalId = setInterval(() => {
            if (tick){
                setSeconds(seconds => seconds - 1);
            }
        }, 1000);

        if (seconds <=0){
            setSeconds(0)
            setTick(false)

        
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [seconds]);

  return (
    <div>
      <h1>Timer: {Math.floor(seconds/3600)}:{Math.floor(seconds%3600 /60)}:{Math.floor(seconds% 3600 %60)}</h1>
    </div>
  );
}

export default Timer;