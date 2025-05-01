import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';

interface InformationFlowSceneProps {
  isPlaying: boolean;
  playbackSpeed: number;
}

interface NewsItem {
  id: number;
  content: string;
  type: 'pro' | 'anti' | 'neutral';
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  sourceNode: number;
  spreadPath: { x: number; y: number }[];
  timestamp: number;
  engagement: number;
  platform: 'twitter' | 'news';
  isVerified: boolean;
  sentiment: 'positive' | 'negative' | 'neutral';
  isFake: boolean;
}

interface Node {
  id: number;
  x: number;
  y: number;
  name: string;
  influence: number;
}

export default function InformationFlowScene({ isPlaying, playbackSpeed }: InformationFlowSceneProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [dimensions, setDimensions] = useState({ width: 400, height: 300 });

  const sampleNews = [
    { content: "New study: 95% effective!", type: 'pro', platform: 'news', isVerified: true, sentiment: 'positive', isFake: false },
    { content: "Booster shot done!", type: 'pro', platform: 'twitter', isVerified: true, sentiment: 'positive', isFake: false },
    { content: "Hidden vaccine side effects?", type: 'anti', platform: 'news', isVerified: false, sentiment: 'negative', isFake: true },
    { content: "Friend had bad reaction...", type: 'anti', platform: 'twitter', isVerified: false, sentiment: 'negative', isFake: true }
  ] as const;

  // Update dimensions on resize
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(300, width),
          height: Math.max(200, height)
        });
      }
    };
    
    updateDimensions();
    
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!svgRef.current || !isPlaying || !dimensions) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    const { width, height } = dimensions;

    // Create nodes
    const newNodes: Node[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      name: `User ${i + 1}`,
      influence: Math.random() * 0.3 + 0.1
    }));
    setNodes(newNodes);

    // Create links
    const links: { source: number | Node, target: number | Node }[] = Array.from({ length: 25 }, () => ({
      source: Math.floor(Math.random() * 20),
      target: Math.floor(Math.random() * 20)
    }));

    // Set up SVG
    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Add links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link-line')
      .attr('stroke', '#4a5568')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1);

    // Add nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(newNodes)
      .enter()
      .append('circle')
      .attr('class', 'node-circle')
      .attr('r', 4)
      .attr('fill', '#4299e1');

    // Set up force simulation
    const simulation = d3.forceSimulation<Node, { source: Node, target: Node }>(newNodes)
      .force('link', d3.forceLink<Node, { source: Node, target: Node }>(links).id((d) => d.id).distance(50).strength(0.1))
      .force('charge', d3.forceManyBody().strength(-15))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as Node).x)
        .attr('y1', (d) => (d.source as Node).y)
        .attr('x2', (d) => (d.target as Node).x)
        .attr('y2', (d) => (d.target as Node).y);

      node
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y);
    });

    // Add news items periodically
    let currentIndex = 0;
    const addNextNews = () => {
      if (currentIndex >= sampleNews.length) return;
      const news = sampleNews[currentIndex];
      const sourceNodeIndex = Math.floor(Math.random() * newNodes.length);
      const sourceNodeData = newNodes[sourceNodeIndex];
      
      const newItem: NewsItem = {
        id: currentIndex,
        content: news.content,
        type: news.type,
        position: { x: sourceNodeData.x, y: sourceNodeData.y },
        velocity: { x: (Math.random() - 0.5) * 0.5, y: (Math.random() - 0.5) * 0.5 },
        sourceNode: sourceNodeIndex,
        spreadPath: [{ x: sourceNodeData.x, y: sourceNodeData.y }],
        timestamp: Date.now(),
        engagement: Math.floor(Math.random() * 100),
        platform: news.platform,
        isVerified: news.isVerified,
        sentiment: news.sentiment,
        isFake: news.isFake
      };
      
      setNewsItems(prev => [...prev, newItem]);
      currentIndex++;
      if (currentIndex < sampleNews.length) {
        setTimeout(addNextNews, 2500 / playbackSpeed);
      }
    };
    
    if (isPlaying) {
      addNextNews();
    }

    return () => {
      simulation.stop();
    };
  }, [isPlaying, playbackSpeed, dimensions]);

  // Update news item positions
  useEffect(() => {
    if (!isPlaying || !newsItems.length) return;

    const intervalId = setInterval(() => {
      setNewsItems(prev => prev.map(item => {
        const newX = item.position.x + item.velocity.x * playbackSpeed;
        const newY = item.position.y + item.velocity.y * playbackSpeed;
        
        // Keep within bounds
        const newPosition = { 
          x: Math.max(5, Math.min(dimensions.width - 5, newX)), 
          y: Math.max(5, Math.min(dimensions.height - 5, newY)) 
        };
        
        // Bounce off walls
        const newVelocity = { ...item.velocity };
        if (newX <= 5 || newX >= dimensions.width - 5) newVelocity.x *= -1;
        if (newY <= 5 || newY >= dimensions.height - 5) newVelocity.y *= -1;
        
        return { ...item, position: newPosition, velocity: newVelocity };
      }));
    }, 1000 / 30); // 30 FPS update

    return () => clearInterval(intervalId);
  }, [isPlaying, playbackSpeed, newsItems.length, dimensions]);

  const getNewsIcon = (platform: 'twitter' | 'news') => {
    return platform === 'twitter' ? 
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DA1F2"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg> :
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"></path></svg>;
  };

  return (
    <div className="w-full h-full flex flex-col p-4">
      <h2 className="text-sm font-bold text-white mb-2 text-center">Information Flow Network</h2>
      
      <div 
        ref={containerRef}
        className="w-full flex-grow bg-gray-900 rounded p-3 shadow-lg overflow-hidden relative" 
      >
        <svg 
          ref={svgRef} 
          className="w-full h-full"
          style={{ minHeight: '100%' }}
        />
        
        {newsItems.map(item => (
          <motion.div
            key={item.id}
            className="absolute cursor-pointer p-1 rounded bg-opacity-80"
            style={{
              left: `${(item.position.x / dimensions.width) * 100}%`,
              top: `${(item.position.y / dimensions.height) * 100}%`,
              transform: 'translate(-50%, -50%)',
              backgroundColor: item.type === 'pro' ? 'rgba(72, 187, 120, 0.7)' : 'rgba(237, 137, 54, 0.7)'
            }}
            onClick={() => setSelectedNews(item)}
            title={item.content}
          >
            {getNewsIcon(item.platform)}
          </motion.div>
        ))}
      </div>
      
      <p className="text-gray-300 mt-2 text-center text-xs max-w-full">
        Watch how news and social media posts spread through the network.
        Click on any news item to see details.
      </p>

      <AnimatePresence>
        {selectedNews && (
          <motion.div 
            className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-800 p-3 rounded shadow-lg z-30 w-11/12 max-w-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <button 
              onClick={() => setSelectedNews(null)} 
              className="absolute top-1 right-1 text-gray-400 hover:text-white"
              aria-label="Close"
            >
              &times;
            </button>
            <h4 className="text-sm font-bold mb-1">{selectedNews.content}</h4>
            <div className="text-xs opacity-80 flex gap-2">
              <span>{selectedNews.platform === 'twitter' ? 'Tweet' : 'News'}</span>
              <span>•</span>
              <span>{selectedNews.isVerified ? 'Verified' : 'Unverified'}</span>
              <span>•</span>
              <span>{selectedNews.sentiment}</span>
              {selectedNews.isFake && <span className="text-red-400 ml-1">(Fake)</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}