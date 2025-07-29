"use client";

import React, { useCallback, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  Background,
} from "reactflow";
import "reactflow/dist/style.css";
import { useSelector, useDispatch } from "react-redux";
import {
  addNode,
  addEdge as addEdgeToState,
  setSelectedNode,
} from "../features/flowSlice";
import {
  setNodes as setReduxNodes,
  setEdges as setReduxEdges,
} from "../features/flowSlice";
import FlowNode from "./FlowNode";
import { nanoid } from "nanoid";

const nodeTypes = {
  send_message: FlowNode,
};

const Canvas = () => {
  const dispatch = useDispatch();
  const nodesFromStore = useSelector((state) => state.flow.nodes);
  const edgesFromStore = useSelector((state) => state.flow.edges);

  const [nodes, setNodes, onNodesChange] = useNodesState(nodesFromStore);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesFromStore);

  useEffect(() => {
    const fetchFlowIfExists = async () => {
      const flowId = localStorage.getItem("flowId");
      if (!flowId) return;

      try {
        const res = await fetch(`/api/v1/flows/${flowId}`);
        if (!res.ok) throw new Error("Failed to fetch saved flow");
        const data = await res.json();

        const formattedNodes = data.nodes.map((node) => ({
          id: node.id,
          type: node.type.type,
          position: { x: node.positionX, y: node.positionY },
          data: { text: node.data || "" },
          typeId: node.typeId,
        }));

        const formattedEdges = data.edges.map((edge) => ({
          id: edge.id,
          source: edge.sourceId,
          target: edge.targetId,
          type: "default",
        }));

        setNodes(formattedNodes);
        setEdges(formattedEdges);
        dispatch(setReduxNodes(formattedNodes));
        dispatch(setReduxEdges(formattedEdges));
      } catch (err) {
        throw new Error(`Failed to restore flow: ${err}`);
      }
    };
    fetchFlowIfExists();
  }, [dispatch]);

  const onConnect = useCallback(
    (params) => {
      const newEdge = { ...params, id: nanoid() };
      setEdges((eds) => addEdge(newEdge, eds));
      dispatch(addEdgeToState(newEdge));
    },
    [dispatch, setEdges]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const nodeTypeDataRaw = event.dataTransfer.getData(
        "application/reactflow"
      );
      const nodeTypeData = JSON.parse(nodeTypeDataRaw);
      if (!nodeTypeData) return;

      const bounds = event.target.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };

      const newNode = {
        id: nanoid(),
        type: nodeTypeData.type,
        nodeTypeData,
        position,
        data: { text: "New Node" },
      };
      setNodes((nds) => [...nds, newNode]);
      dispatch(addNode(newNode));
    },
    [dispatch, setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => dispatch(setSelectedNode(node))}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default Canvas;
