import React, { useState, useEffect } from "react";

const PomodoroTimer = () => {
  const [time, setTime] = useState(1 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("work");

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            if (mode === "work") {
              setMode("break");
              setTime(5 * 60);
            } else {
              setMode("work");
              setTime(1 * 60);
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, mode]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="pomodoro-container">
      <p>{mode === "work" ? "Работа" : "Отдых"}</p>
      <h2>{formatTime(time)}</h2>
      <div className="button-group">
        <button onClick={() => setIsRunning(!isRunning)}>{isRunning ? "Пауза" : "Старт"}</button>
        <button onClick={() => setTime(mode === "work" ? 1 * 60 : 5 * 60)}>Сброс</button>
      </div>
    </div>
  );
};

export default PomodoroTimer;


