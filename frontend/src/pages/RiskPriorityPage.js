import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function RiskPriorityPage() {
  const [risks, setRisks] = useState([
    { id: '1', title: 'Data Breach' },
    { id: '2', title: 'Service Downtime' },
    { id: '3', title: 'Malware Attack' },
  ]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(risks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setRisks(items);
  };

  return (
    <div className="risk-priority-page">
      <h1>Risk Prioritization</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="risks">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {risks.map((risk, index) => (
                <Draggable key={risk.id} draggableId={risk.id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {risk.title}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default RiskPriorityPage;
