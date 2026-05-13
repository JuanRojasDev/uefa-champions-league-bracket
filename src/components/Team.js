import React from 'react';

function Team({ team, tone = 'light', onPointerStart }) {
  const handleDragStart = (event) => {
    event.dataTransfer.setData('text/plain', team.id);
    event.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      className={`team-card ${tone}`}
      draggable
      onDragStart={handleDragStart}
      onPointerDown={(event) => onPointerStart?.(event, team.id)}
    >
      <img crossOrigin="anonymous" src={team.logo} alt="" />
      <span>{team.name}</span>
    </div>
  );
}

export default Team;
