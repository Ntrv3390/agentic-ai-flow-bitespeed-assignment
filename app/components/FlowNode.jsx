import { Handle, Position } from "reactflow";
import { useSelector } from "react-redux";

const FlowNode = ({ id, data, selected }) => {
  const nodes = useSelector((state) => state.flow.nodes);
  const currentNode = nodes.find((node) => node.id === id);

  const text = currentNode?.data?.text || "Write a message";

  return (
    <div
      className={`rounded-md bg-white shadow-lg text-sm w-60 border ${
        selected ? "border-[#656ba3]" : "border-transparent"
      }`}
    >
      <div className="flex items-center justify-between bg-[#d2f4f0] px-3 py-2 rounded-t-md">
        <div className="flex items-center gap-2 font-semibold text-gray-800">
          <span>💬</span>
          <span>Send Message</span>
        </div>
      </div>

      <div className="p-3 text-gray-700">{text}</div>

      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 bg-gray-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 bg-gray-500"
      />
    </div>
  );
};

export default FlowNode;
