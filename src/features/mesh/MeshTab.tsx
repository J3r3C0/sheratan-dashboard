import { useState } from "react";
import { Network, Server, Activity, Globe } from "lucide-react";
import { mockNodes } from "../../data/mockData";
import { MeshNode } from "../../types";
import { NodeGrid } from "./NodeGrid";
import { StatCard } from "../../components/common/StatCard";

export function MeshTab() {
  const [selectedNode, setSelectedNode] = useState<MeshNode | null>(null);

  const onlineNodes = mockNodes.filter((n) => n.status === "online").length;
  const avgLatency = Math.round(
    mockNodes.reduce((sum, n) => sum + n.latency, 0) / mockNodes.length
  );
  const avgScore = Math.round(
    mockNodes.reduce((sum, n) => sum + n.score, 0) / mockNodes.length
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl">Mesh & Nodes</h1>
          <p className="text-sm text-slate-400 mt-1">
            Übersicht über aktive Nodes, Mesh-Ports und Latenzen.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Nodes" value={mockNodes.length} icon={Server} />
        <StatCard
          label="Online"
          value={onlineNodes}
          icon={Globe}
          variant="success"
        />
        <StatCard
          label="Avg Latency"
          value={`${avgLatency}ms`}
          icon={Activity}
          variant={avgLatency > 30 ? "warning" : "default"}
        />
        <StatCard label="Avg Score" value={avgScore} icon={Network} />
      </div>

      <NodeGrid nodes={mockNodes} onSelectNode={setSelectedNode} />

      {selectedNode && (
        <div className="bg-sheratan-card border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm">Node Details: {selectedNode.name}</h3>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Close
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-xs text-slate-400">Node ID</span>
              <div className="text-sm text-slate-200 mt-1">{selectedNode.id}</div>
            </div>
            <div>
              <span className="text-xs text-slate-400">Role</span>
              <div className="text-sm text-slate-200 mt-1">{selectedNode.role}</div>
            </div>
            <div>
              <span className="text-xs text-slate-400">IP Address</span>
              <div className="text-sm text-slate-200 mt-1">{selectedNode.ip}</div>
            </div>
            <div>
              <span className="text-xs text-slate-400">Port</span>
              <div className="text-sm text-slate-200 mt-1">{selectedNode.port}</div>
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-400 mb-2 block">Endpoints</span>
            <div className="flex flex-wrap gap-2">
              {selectedNode.endpoints.length > 0 ? (
                selectedNode.endpoints.map((endpoint, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-slate-800 text-sheratan-accent text-xs rounded"
                  >
                    {endpoint}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">No endpoints available</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
