import { memo, useCallback, useEffect, useState, useTransition } from 'react';
import {
	ReactFlow,
	Node,
	Edge,
	useNodesState,
	useEdgesState,
	Position,
	ConnectionMode,
	Background,
	BackgroundVariant,
	Controls,
	ReactFlowProvider,
	useReactFlow,
	getNodesBounds,
	getViewportForBounds,
	ControlButton
} from '@xyflow/react';
import dagre from 'dagre';
import { toPng } from 'html-to-image';
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

interface NodeData {
	label: string;
	displayType: NodeDisplayType;
	[key: string]: string;
}

interface NodeStyleProps {
	displayType: NodeDisplayType;
	label: string;
	isSelected?: boolean;
	isChild?: boolean;
	hasSelection?: boolean;
}

// 计算文本宽度的辅助函数
const calculateTextWidth = (text: string): number => {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	if (!context) return 80;

	context.font = '14px Monaco, monospace';
	const metrics = context.measureText(text);
	// 添加内边距和一些缓冲空间
	return Math.max(80, Math.ceil(metrics.width + 20));
};

// 自定义节点样式
const getNodeStyle = ({
	displayType,
	label,
	isSelected = false,
	isChild = false,
	hasSelection = false
}: NodeStyleProps) => {
	const width = calculateTextWidth(label);

	return {
		padding: '8px 0px',
		borderRadius: '8px',
		backgroundColor:
			displayType === NodeDisplayType.TerminalNode
				? 'rgba(22, 163, 74, 0.8)'
				: displayType === NodeDisplayType.ErrorNode
					? 'rgba(220, 38, 38, 0.8)'
					: 'rgba(27, 126, 191, 0.8)',
		color: '#ffffff',
		fontSize: '12px',
		width: width,
		textAlign: 'center' as const,
		transition: 'all 0.2s ease',
		opacity: hasSelection && !isSelected && !isChild ? 0.3 : 1
	};
};

const edgeStyle = {
	stroke: 'rgb(14, 99, 156)',
	strokeWidth: 2
};

// 设置布局方向为从上到下
const getLayoutedElements = <T extends Record<string, any>>(
	nodes: Node<T>[],
	edges: Edge[],
	direction = 'TB'
) => {
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

const downloadImage = (dataUrl: string) => {
	const a = document.createElement('a');
	a.setAttribute('download', `parse-tree-${new Date().toLocaleString()}.png`);
	a.setAttribute('href', dataUrl);
	a.click();
};

const DownloadButton = () => {
	const { getNodes } = useReactFlow();

	const onClick = () => {
		const nodes = getNodes();
		if (nodes.length === 0) return;

		const nodesBounds = getNodesBounds(nodes);

		const padding = 30;
		const imageWidth = nodesBounds.width + padding;
		const imageHeight = nodesBounds.height + padding;

		// 计算用于导出的视口变换
		const viewport = getViewportForBounds(nodesBounds, imageWidth, imageHeight, 0.1, 2, 0.1);

		const viewportElement = document.querySelector('.react-flow__viewport') as HTMLElement;
		if (!viewportElement) return;

		toPng(viewportElement, {
			backgroundColor: '#ffffff',
			width: imageWidth,
			height: imageHeight,
			style: {
				width: `${imageWidth}px`,
				height: `${imageHeight}px`,
				transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`
			}
		})
			.then((dataUrl: string) => {
				downloadImage(dataUrl);
			})
			.catch((error: Error) => {
				console.error('Download image failed:', error);
			});
	};

	return (
		<ControlButton onClick={onClick} title="Download Image">
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
				<polyline points="7,10 12,15 17,10" />
				<line x1="12" y1="15" x2="12" y2="3" />
			</svg>
		</ControlButton>
	);
};

const TreeVisualizerContent = ({ parseTree }: TreeVisualizerPanelProps) => {
	const [nodes, setNodes, onNodesChange] = useNodesState<Node<NodeData>>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
	const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
	const [_, startTransition] = useTransition();

	// 获取节点的所有子节点ID
	const getChildNodeIds = (nodeId: string | null): string[] => {
		if (!nodeId) return [];
		const childIds: string[] = [];
		const queue = [nodeId];

		while (queue.length > 0) {
			const currentId = queue.shift()!;
			edges.forEach((edge) => {
				if (edge.source === currentId) {
					childIds.push(edge.target);
					queue.push(edge.target);
				}
			});
		}

		return childIds;
	};

	const handleNodeClick = (_event: React.MouseEvent, node: Node) => {
		setSelectedNodeId(node.id);
	};

	const handlePaneClick = () => {
		setSelectedNodeId(null);
	};

	const convertTreeToElements = useCallback((tree: SerializedTreeNode) => {
		const newNodes: Node<NodeData>[] = [];
		const newEdges: Edge[] = [];
		let nodeId = 0;
		let rootNodeId: string | null = null;

		const processNode = (node: SerializedTreeNode, parentId?: string): string => {
			const currentId = `node-${nodeId++}`;

			if (rootNodeId === null) {
				rootNodeId = currentId;
			}

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
					displayType: nodeDisplayType as NodeDisplayType
				},
				position: { x: 0, y: 0 },
				style: getNodeStyle({
					displayType: nodeDisplayType as NodeDisplayType,
					label,
					isSelected: false,
					isChild: false,
					hasSelection: false
				}),
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
		return { nodes: newNodes, edges: newEdges, rootNodeId };
	}, []);

	useEffect(() => {
		if (!parseTree) {
			setEdges([]);
			setNodes([]);
			return;
		}

		const elements = convertTreeToElements(parseTree);
		const layoutedElements = getLayoutedElements(elements.nodes, elements.edges);

		startTransition(() => {
			setNodes(layoutedElements.nodes);
			setEdges(layoutedElements.edges);
			setSelectedNodeId(null);
		});
	}, [parseTree]);

	useEffect(() => {
		const childIds = getChildNodeIds(selectedNodeId);

		setNodes((nodes) =>
			nodes.map((node) => ({
				...node,
				style: getNodeStyle({
					displayType: node.data.displayType,
					label: node.data.label,
					isSelected: node.id === selectedNodeId,
					isChild: childIds.includes(node.id),
					hasSelection: selectedNodeId !== null // 只有当有选中节点时才降低其他节点亮度
				})
			}))
		);
	}, [selectedNodeId]);

	return (
		<div style={{ height: '100%', width: '100%' }}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				colorMode="dark"
				fitView
				fitViewOptions={{ padding: 0.2 }}
				minZoom={0.1}
				maxZoom={2}
				onNodeClick={handleNodeClick}
				onPaneClick={handlePaneClick}
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
					style={{ opacity: 0.7 }}
				/>
				<Controls
					showInteractive={false}
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px'
					}}
				>
					<DownloadButton />
				</Controls>
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
