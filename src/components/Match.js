import React from 'react';
import { useDrop } from 'react-dnd';
import Team from './Team';

function Match({ match, teams, onDrop }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TEAM',
    drop: (item) => onDrop(item.id, match.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const winnerTeam = teams.find((t) => t.id === match.winner);

  return (
    <div className="match">
      <div className="teams">
        {match.teamIds.map((teamId, index) => {
          const team = teams.find((t) => t.id === teamId);
          return team ? <Team key={team.id} team={team} index={index} /> : null;
        })}
      </div>
      <div ref={drop} className="winner" style={{ backgroundColor: isOver ? 'lightgreen' : 'white' }}>
        {winnerTeam ? winnerTeam.name : 'Drop Winner Here'}
      </div>
    </div>
  );
}

export default Match;
