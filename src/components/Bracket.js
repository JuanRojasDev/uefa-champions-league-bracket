import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Match from './Match';

const initialTeams = Array.from({ length: 32 }, (v, k) => ({
  id: `team-${k + 1}`,
  name: `Team ${k + 1}`,
}));

const initialMatches = Array.from({ length: 16 }, (v, k) => ({
  id: `match-${k + 1}`,
  teamIds: [`team-${k * 2 + 1}`, `team-${k * 2 + 2}`],
  winner: null,
}));

function Bracket() {
  const [teams, setTeams] = useState(initialTeams);
  const [matches, setMatches] = useState(initialMatches);

  const handleDrop = (teamId, matchId) => {
    const newMatches = matches.map((match) => {
      if (match.id === matchId) {
        return { ...match, winner: teamId };
      }
      return match;
    });

    // Create new matchups for the next round
    const nextRoundMatches = [];
    for (let i = 0; i < newMatches.length; i += 2) {
      const match1 = newMatches[i];
      const match2 = newMatches[i + 1];
      if (match1.winner && match2.winner) {
        nextRoundMatches.push({
          id: `match-${newMatches.length + nextRoundMatches.length + 1}`,
          teamIds: [match1.winner, match2.winner],
          winner: null,
        });
      }
    }

    setMatches([...newMatches, ...nextRoundMatches]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bracket">
        <div className="column">
          {matches.slice(0, 8).map((match) => (
            <Match key={match.id} match={match} teams={teams} onDrop={handleDrop} />
          ))}
        </div>
        <div className="column">
          {matches.slice(8, 16).map((match) => (
            <Match key={match.id} match={match} teams={teams} onDrop={handleDrop} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}

export default Bracket;
