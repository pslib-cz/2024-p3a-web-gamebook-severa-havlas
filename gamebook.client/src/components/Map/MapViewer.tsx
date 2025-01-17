import React, { useEffect, useState } from "react";
import { Graph } from "react-d3-graph";
import { useNavigate, useParams } from "react-router-dom";
import { useGameContext } from '../../GameProvider';

interface Room {
  roomId: number;
  name: string;
  text: string;
  imgUrl: string;
}

interface Connection {
  connectionId: number;
  fromRoomId: number;
  toRoomId: number;
}

interface GraphNode {
  id: string;
  name: string;
  x: number;
  y: number;
}

interface GraphLink {
  source: string;
  target: string;
}

const MolekuleMapViewer: React.FC = () => {
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; links: GraphLink[] }>({
    nodes: [],
    links: [],
  });

  const { nodeId } = useParams();
  const { roomId, setRoomId } = useGameContext();
  const navigate = useNavigate(); 

  useEffect(() => {
    setRoomId(nodeId ?? null);
  }, [nodeId, setRoomId]);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const roomsResponse = await fetch("https://localhost:7058/api/Rooms");
        const connectionsResponse = await fetch("https://localhost:7058/api/Connections");

        if (!roomsResponse.ok || !connectionsResponse.ok) {
          throw new Error(
            `API error: Rooms ${roomsResponse.status}, Connections ${connectionsResponse.status}`
          );
        }

        const rooms: Room[] = await roomsResponse.json();
        const connections: Connection[] = await connectionsResponse.json();

        const nodes: GraphNode[] = rooms.map((room) => ({
          id: room.roomId.toString(),
          name: room.name,
          x: Math.random() * 500, // Random initial position
          y: Math.random() * 500, // Random initial position
        }));

        const links: GraphLink[] = connections.map((connection) => ({
          source: connection.fromRoomId.toString(),
          target: connection.toRoomId.toString(),
        }));

        // Adjust positions using the force-based algorithm
        const positionedNodes = applyForceBasedLayout(nodes, links);
        setGraphData({ nodes: positionedNodes, links });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchGraphData();
  }, []);

  const applyForceBasedLayout = (nodes: GraphNode[], links: GraphLink[]): GraphNode[] => {
    const iterations = 100;
    const repulsionForce = 5000; // Strength of repulsion between nodes
    const springLength = 100; // Ideal length of connections

    for (let i = 0; i < iterations; i++) {
      const forces = nodes.map(() => ({ x: 0, y: 0 }));

      // Calculate repulsive forces
      for (let a = 0; a < nodes.length; a++) {
        for (let b = 0; b < nodes.length; b++) {
          if (a === b) continue;

          const dx = nodes[a].x - nodes[b].x;
          const dy = nodes[a].y - nodes[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1; // Avoid division by zero
          const force = repulsionForce / (distance * distance);

          forces[a].x += (dx / distance) * force;
          forces[a].y += (dy / distance) * force;
        }
      }

      // Calculate attractive forces from links
      links.forEach((link) => {
        const sourceIndex = nodes.findIndex((node) => node.id === link.source);
        const targetIndex = nodes.findIndex((node) => node.id === link.target);

        if (sourceIndex === -1 || targetIndex === -1) return;

        const dx = nodes[targetIndex].x - nodes[sourceIndex].x;
        const dy = nodes[targetIndex].y - nodes[sourceIndex].y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1; // Avoid division by zero
        const force = (distance - springLength) * 0.1; // Spring constant

        forces[sourceIndex].x += (dx / distance) * force;
        forces[sourceIndex].y += (dy / distance) * force;

        forces[targetIndex].x -= (dx / distance) * force;
        forces[targetIndex].y -= (dy / distance) * force;
      });

      // Apply forces to nodes
      nodes.forEach((node, index) => {
        node.x += forces[index].x * 0.1; // Damping factor
        node.y += forces[index].y * 0.1;
      });
    }

    return nodes;
  };

  const onClickNode = (nodeId: string) => {
    navigate(`/Page/${nodeId}`);
  };

  const graphConfig = {
    nodeHighlightBehavior: true,
    node: {
      color: "lightblue",
      size: 300,
      highlightStrokeColor: "blue",
      labelProperty: (node: GraphNode) => node.name,
    },
    link: {
      highlightColor: "lightblue",
    },
    staticGraph: true, // Enable static positioning
  };

  return (
    <div>
      <h2>Room Connections</h2>
      <Graph id="graph-id" data={graphData} config={graphConfig} onClickNode={onClickNode} />
    </div>
  );
};

export default MolekuleMapViewer;
