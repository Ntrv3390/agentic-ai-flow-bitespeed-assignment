import React from "react";

const SelectableNode = ({ id, label, type }) => {
  const nodeTypeData = { id, label, type };
  const handleDragStart = (event) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(nodeTypeData)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className="px-16 py-8 font-bold border border-[#656ba3] text-[#656ba3] hover:bg-[#656ba3] hover:text-white transition-colors duration-200 rounded-lg shadow-lg leading-none cursor-move"
      draggable
      onDragStart={handleDragStart}
    >
      {label}
    </div>
  );
};

export default SelectableNode;
