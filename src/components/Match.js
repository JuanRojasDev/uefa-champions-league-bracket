import React from 'react';

function Match({ slot, team, teams, canDropTeam, onDrop, size = 100 }) {
  const selectedTeam = team ? teams[team] : null;

  const handleDragOver = (event) => {
    const teamId = event.dataTransfer.types.includes('text/plain') ? event.dataTransfer.getData('text/plain') : '';
    event.preventDefault();
    event.dataTransfer.dropEffect = teamId && !canDropTeam(slot.id, teamId) ? 'none' : 'copy';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const teamId = event.dataTransfer.getData('text/plain');
    if (canDropTeam(slot.id, teamId)) {
      onDrop(slot.id, teamId);
    }
  };

  return (
    <div
      className={`winner-slot ${slot.side} ${slot.round} ${slot.round === 'champion' ? 'champion' : ''} ${selectedTeam ? 'filled' : ''}`}
      style={{ left: slot.x, top: slot.y, width: size, height: size }}
      data-slot-id={slot.id}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {selectedTeam ? (
        <div className="winner-team">
          <img crossOrigin="anonymous" src={selectedTeam.logo} alt={selectedTeam.name} className="slot-team-logo" />
        </div>
      ) : (
        <span className="empty-slot">Arrastra aqui</span>
      )}
    </div>
  );
}

export default Match;
