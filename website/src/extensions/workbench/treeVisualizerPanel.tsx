import { memo, useCallback, useEffect } from 'react';
import {
	ReactFlow,
	Node,
	Edge,
	useNodesState,
	useEdgesState,
	Position,
	useReactFlow,
	ConnectionMode,
	Background,
	BackgroundVariant,
	Controls,
	ReactFlowProvider
} from '@xyflow/react';
import dagre from 'dagre';
import { SerializedTreeNode } from 'monaco-sql-languages/esm/languageService';

import '@xyflow/react/dist/style.css';

interface TreeVisualizerPanelProps {
	parseTree: SerializedTreeNode;
}

enum NodeDisplayType {
	TerminalNode = 'TerminalNode',
	ErrorNode = 'ErrorNode',
	RuleNode = 'RuleNode'
}

// 计算文本宽度的辅助函数
const calculateTextWidth = (text: string): number => {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	if (!context) return 120;

	context.font = '13px Monaco, monospace';
	const metrics = context.measureText(text);
	// 添加内边距和一些缓冲空间
	return Math.max(120, Math.ceil(metrics.width + 40));
};

// 自定义节点样式
const getNodeStyle = (displayType: string, label: string) => {
	const width = calculateTextWidth(label);

	return {
		padding: '8px 12px',
		border: '2px solid #4a90e2',
		borderRadius: '6px',
		backgroundColor:
			displayType === NodeDisplayType.TerminalNode
				? 'rgb(136 205 255)'
				: displayType === NodeDisplayType.ErrorNode
					? 'rgb(255 205 210)'
					: '#fff',
		color: '#2c3e50',
		fontSize: '13px',
		width: width,
		textAlign: 'center' as const,
		boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
		transition: 'all 0.2s ease'
	};
};

// 边的样式
const edgeStyle = {
	stroke: '#4a90e2',
	strokeWidth: 2
};

// 设置布局方向为从上到下
const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
	// 每次都创建新的 dagre 图实例
	const dagreGraph = new dagre.graphlib.Graph();
	dagreGraph.setDefaultEdgeLabel(() => ({}));

	// 设置布局参数
	dagreGraph.setGraph({
		rankdir: direction,
		nodesep: 50, // 同一行节点之间的间距
		ranksep: 50, // 不同行之间的间距
		edgesep: 10, // 边之间的间距
		marginx: 20, // 水平边距
		marginy: 20, // 垂直边距
		acyclicer: 'greedy', // 处理循环的算法
		ranker: 'network-simplex' // 布局算法
	});

	nodes.forEach((node) => {
		const label = node.data.label as string;
		const width = calculateTextWidth(label);
		dagreGraph.setNode(node.id, { width, height: 40 });
	});

	edges.forEach((edge) => {
		dagreGraph.setEdge(edge.source, edge.target);
	});

	// 计算布局
	dagre.layout(dagreGraph);

	// 应用计算后的位置
	const layoutedNodes = nodes.map((node) => {
		const nodeWithPosition = dagreGraph.node(node.id);
		return {
			...node,
			position: {
				x: nodeWithPosition.x - nodeWithPosition.width / 2,
				y: nodeWithPosition.y - nodeWithPosition.height / 2
			}
		};
	});

	return { nodes: layoutedNodes, edges };
};

const TreeVisualizerContent = ({ parseTree }: TreeVisualizerPanelProps) => {
	const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
	const { fitView } = useReactFlow();

	const convertTreeToElements = useCallback((tree: SerializedTreeNode) => {
		const newNodes: Node[] = [];
		const newEdges: Edge[] = [];
		let nodeId = 0;

		const processNode = (node: SerializedTreeNode, parentId?: string): string => {
			const currentId = `node-${nodeId++}`;
			const nodeDisplayType = [
				NodeDisplayType.TerminalNode,
				NodeDisplayType.ErrorNode
			]?.includes(node.ruleName as any)
				? node.ruleName
				: NodeDisplayType.RuleNode;

			const label = node.text ? node.text : node.ruleName;

			newNodes.push({
				id: currentId,
				type: 'default',
				data: {
					label,
					displayType: nodeDisplayType
				},
				position: { x: 0, y: 0 },
				style: getNodeStyle(nodeDisplayType, label),
				sourcePosition: Position.Bottom,
				targetPosition: Position.Top,
				draggable: false
			});

			if (parentId) {
				newEdges.push({
					id: `edge-${parentId}-${currentId}`,
					source: parentId,
					target: currentId,
					type: 'smoothstep',
					animated: true,
					style: edgeStyle
				});
			}

			node.children?.forEach((child) => {
				processNode(child, currentId);
			});

			return currentId;
		};

		processNode(tree);
		return { nodes: newNodes, edges: newEdges };
	}, []);

	useEffect(() => {
		if (!parseTree) return;

		const elements = convertTreeToElements(parseTree);
		const layoutedElements = getLayoutedElements(elements.nodes, elements.edges);

		setNodes(layoutedElements.nodes);
		setEdges(layoutedElements.edges);

		// 等待节点渲染完成后自动适应视图
		setTimeout(() => {
			fitView({ padding: 0.2, includeHiddenNodes: false });
		}, 100);
	}, [parseTree]);

	return (
		<div style={{ height: '100%', width: '100%' }}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				fitView
				fitViewOptions={{ padding: 0.2 }}
				minZoom={0.1}
				maxZoom={2}
				defaultEdgeOptions={{
					type: 'smoothstep',
					animated: true,
					style: edgeStyle
				}}
				connectionMode={ConnectionMode.Strict}
				deleteKeyCode={null}
				multiSelectionKeyCode={null}
				selectionKeyCode={null}
				nodesDraggable={false}
				nodesConnectable={false}
				elementsSelectable={true}
				panOnDrag={true}
				zoomOnScroll={true}
				preventScrolling={true}
			>
				<Background
					variant={BackgroundVariant.Dots}
					gap={12}
					size={1}
					color="#91919a"
					style={{ opacity: 0.6 }}
				/>
				<Controls
					showInteractive={false}
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px'
					}}
				/>
			</ReactFlow>
		</div>
	);
};

const TreeVisualizerPanel = memo((props: TreeVisualizerPanelProps) => {
	return (
		<ReactFlowProvider>
			<TreeVisualizerContent {...props} />
		</ReactFlowProvider>
	);
});

export default TreeVisualizerPanel;
