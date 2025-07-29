"use client";

import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNodeTypes } from "../features/nodeTypeSlice";
import SelectableNode from "./SelectableNode";
import {
  updateNode,
  fetchNodeInputs,
  setSelectedNode,
} from "../features/flowSlice";

const SelectableNodeList = () => {
  const dispatch = useDispatch();

  const selectedNode = useSelector((state) => state.flow.selectedNode);

  const inputRef = useRef();

  const handleBlur = (field) => {
    const updated = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        [field]: inputRef.current.value,
      },
    };
    dispatch(updateNode(updated));
  };

  const handleInputChange = (field, value) => {
    const updated = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        [field]: value,
      },
    };
    dispatch(updateNode(updated));
  };

  const handleCloseSelectedNode = () => {
    dispatch(setSelectedNode(null));
  };

  const {
    data: nodeTypes,
    loading: nodeTypesLoading,
    error: nodeTypesError,
  } = useSelector((state) => state.nodeType);

  const {
    inputs,
    loading: inputsLoading,
    error: inputsError,
  } = useSelector((state) => state.flow);

  useEffect(() => {
    dispatch(fetchNodeTypes());
  }, [dispatch]);

  useEffect(() => {
    if (selectedNode?.type) {
      dispatch(fetchNodeInputs(selectedNode.type));
    }
  }, [dispatch, selectedNode]);

  return (
    <div className="h-full w-full">
      {selectedNode ? (
        <>
          <div className="w-full flex items-center justify-between border-b px-3 py-2 relative">
            <button
              onClick={handleCloseSelectedNode}
              className="text-xl text-gray-700 absolute left-3 top-1/2 -translate-y-1/2"
            >
              ←
            </button>
            <h2 className="text-center w-full text-md text-gray-800 font-semibold">
              Message
            </h2>
          </div>

          {inputsLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-[#656ba3] rounded-full" />
            </div>
          ) : inputsError ? (
            <div className="text-red-600 bg-red-100 px-4 py-2 rounded-md mt-4">
              {inputsError}
            </div>
          ) : (
            <div className="w-full px-3 pt-4 space-y-4">
              {inputs.map((inputType, index) => {
                const value = selectedNode.data?.[inputType] || "";

                return (
                  <div key={index} className="w-full">
                    <label className="text-xs text-gray-500 block mb-1 capitalize">
                      {inputType}
                    </label>

                    {inputType === "text" ? (
                      <textarea
                        ref={inputRef}
                        defaultValue={value}
                        onBlur={(e) => handleBlur(inputType)}
                        rows={3}
                        className="w-full border rounded-md p-3 text-sm text-gray-800 resize-none"
                      />
                    ) : inputType === "date" ? (
                      <input
                        type="date"
                        className="w-full border rounded-md p-3 text-sm text-gray-800"
                        value={value}
                        onChange={(e) =>
                          handleInputChange(inputType, e.target.value)
                        }
                      />
                    ) : (
                      <input
                        type="text"
                        className="w-full border rounded-md p-3 text-sm text-gray-800"
                        value={value}
                        onChange={(e) =>
                          handleInputChange(inputType, e.target.value)
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : nodeTypesLoading ? (
        <div className="flex items-center justify-center h-full w-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#656ba3]"></div>
        </div>
      ) : nodeTypesError ? (
        <div className="text-red-600 font-semibold bg-red-100 px-4 py-2 rounded-md">
          {nodeTypesError}
        </div>
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-start pt-4">
          {nodeTypes.map((node) => (
            <div key={node.id} className="mb-3">
              <SelectableNode id={node.id} label={node.name} type={node.type} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectableNodeList;
