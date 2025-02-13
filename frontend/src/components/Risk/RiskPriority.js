import React, { useState } from "react";
import { api } from "../../services/api.js";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const RiskPriority = () => {
  const [risks, setRisks] = useState([]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updatedRisks = [...risks];
    const [movedItem] = updatedRisks.splice(result.source.index, 1);
    updatedRisks.splice(result.destination.index, 0, movedItem);

    setRisks(updatedRisks);
  };

  const handleSave = async () => {
    try {
      await api.post("/risks/prioritize", { risks });
      alert("Priority list saved!");
    } catch (error) {
      console.error("Error saving priority list", error);
    }
  };

  return (
    <div>
      <h2>Prioritize Risks</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="risks">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {risks.map((risk, index) => (
                <Draggable key={risk.id} draggableId={risk.id.toString()} index={index}>
                  {(provided) => (
                    <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      {risk.description}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <button onClick={handleSave}>Save Priorities</button>
    </div>
  );
};

export default RiskPriority;
