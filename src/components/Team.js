import React from 'react';
import { useDrag } from 'react-dnd';

function Team({ team }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TEAM',
    item: { id: team.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="team"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {team.name}
    </div>
  );
}

export default Team;