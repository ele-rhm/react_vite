import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { SimulationNodeDatum } from 'd3';

interface IntroductionSceneProps {
  isPlaying: boolean;
  playbackSpeed: number;
}

interface Node extends SimulationNodeDatum {
  id: number;
  group: number;
  x?: number;
  y?: number;
  demographics: {
    name: string;
    gender: string;
    age: number;
    education: string;
    occupation: string;
    politicalBelief: string;
    religion: string;
    location: string;
    background: string;
    family: string;
  };
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: Node | number;
  target: Node | number;
  value: number;
}

export default function IntroductionScene({ isPlaying, playbackSpeed }: IntroductionSceneProps) {
  console.log('IntroductionScene rendering', { isPlaying, playbackSpeed });

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null);

  // Update dimensions when container size changes
  useEffect(() => {
    console.log('IntroductionScene mounted');
    if (!containerRef.current) {
      console.log('No container ref');
      return;
    }

    const updateDimensions = () => {
      const { width, height } = containerRef.current!.getBoundingClientRect();
      console.log('Updating dimensions:', { width, height });
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Sample demographics data
  const demographicsData = [
    { 
      name: "Dr. Sarah Chen",
      gender: "Female",
      age: 35,
      education: "Medical Degree",
      occupation: "Healthcare Worker",
      politicalBelief: "Moderate",
      religion: "Buddhist",
      location: "Urban",
      background: "Former COVID-19 frontline worker",
      family: "Married, 2 children"
    },
    { 
      name: "Michael Rodriguez",
      gender: "Male",
      age: 28,
      education: "Master's",
      occupation: "Teacher",
      politicalBelief: "Liberal",
      religion: "Catholic",
      location: "Suburban",
      background: "Works with diverse student population",
      family: "Single, lives with parents"
    },
    { 
      name: "Emma Thompson",
      gender: "Female",
      age: 45,
      education: "Bachelor's",
      occupation: "Small Business Owner",
      politicalBelief: "Conservative",
      religion: "Protestant",
      location: "Rural",
      background: "Owns local grocery store",
      family: "Married, 3 children"
    },
    { 
      name: "James Wilson",
      gender: "Male",
      age: 32,
      education: "Bachelor's",
      occupation: "Software Engineer",
      politicalBelief: "Liberal",
      religion: "Atheist",
      location: "Urban",
      background: "Tech industry professional",
      family: "Married, no children"
    },
    { 
      name: "Maria Garcia",
      gender: "Female",
      age: 50,
      education: "High School",
      occupation: "Retired",
      politicalBelief: "Moderate",
      religion: "Catholic",
      location: "Suburban",
      background: "Former retail manager",
      family: "Widowed, 4 grandchildren"
    },
    { 
      name: "Alex Kim",
      gender: "Non-binary",
      age: 25,
      education: "Bachelor's in Progress",
      occupation: "Student",
      politicalBelief: "Liberal",
      religion: "Agnostic",
      location: "Urban",
      background: "Part-time barista",
      family: "Single, lives with roommates"
    },
    { 
      name: "Rev. David Johnson",
      gender: "Male",
      age: 40,
      education: "Doctorate",
      occupation: "Religious Leader",
      politicalBelief: "Conservative",
      religion: "Protestant",
      location: "Rural",
      background: "Community church pastor",
      family: "Married, 2 children"
    },
    { 
      name: "Lisa Patel",
      gender: "Female",
      age: 55,
      education: "Bachelor's",
      occupation: "Government Employee",
      politicalBelief: "Moderate",
      religion: "Hindu",
      location: "Urban",
      background: "Public health department",
      family: "Married, 1 child"
    },
    { 
      name: "Carlos Martinez",
      gender: "Male",
      age: 30,
      education: "Master's",
      occupation: "Social Worker",
      politicalBelief: "Liberal",
      religion: "Catholic",
      location: "Suburban",
      background: "Works with at-risk youth",
      family: "Single, lives alone"
    },
    { 
      name: "Aisha Okafor",
      gender: "Female",
      age: 42,
      education: "Master's",
      occupation: "Community Leader",
      politicalBelief: "Moderate",
      religion: "Muslim",
      location: "Rural",
      background: "Local activist",
      family: "Married, 3 children"
    }
  ];

  useEffect(() => {
    console.log('D3 visualization effect running', { isPlaying, svgRef: !!svgRef.current });
    if (!svgRef.current || !isPlaying) {
      console.log('Skipping D3 visualization', { hasRef: !!svgRef.current, isPlaying });
      return;
    }

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    // Create nodes and links
    const nodes: Node[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      group: Math.floor(Math.random() * 3),
      demographics: demographicsData[Math.floor(Math.random() * demographicsData.length)]
    }));

    const links: Link[] = [];
    // Create connections ensuring each node has at least one connection
    nodes.forEach((node) => {
      const numConnections = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numConnections; i++) {
        let target;
        do {
          target = Math.floor(Math.random() * nodes.length);
        } while (target === node.id);
        links.push({
          source: node.id,
          target,
          value: Math.random()
        });
      }
    });

    // Set up SVG
    const svg = d3.select(svgRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .attr('viewBox', [0, 0, dimensions.width, dimensions.height]);

    // Create the force simulation
    const simulation = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Link>(links)
        .id(d => d.id)
        .distance(50)
        .strength(0.1))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force('collision', d3.forceCollide().radius(20));

    simulationRef.current = simulation;

    // Create the links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.value));

    // Create the nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 8)
      .attr('fill', d => ['#4299e1', '#48bb78', '#ed8936'][d.group])
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(selectedNode?.id === d.id ? null : d);
      });

    // Add hover effects
    node.on('mouseover', function() {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 12);
    }).on('mouseout', function() {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 8);
    });

    // Add titles for nodes
    node.append('title')
      .text(d => d.demographics.name);

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as Node).x!)
        .attr('y1', d => (d.source as Node).y!)
        .attr('x2', d => (d.target as Node).x!)
        .attr('y2', d => (d.target as Node).y!);

      node
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!);
    });

    // Adjust simulation speed based on playbackSpeed
    simulation.velocityDecay(1 - playbackSpeed * 0.1);

    // Pause/resume simulation based on isPlaying
    if (!isPlaying) {
      simulation.stop();
    } else {
      simulation.restart();
    }

    return () => {
      simulation.stop();
    };
  }, [dimensions, isPlaying, playbackSpeed]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center relative bg-gray-900">
      <svg
        ref={svgRef}
        className="w-full h-full"
      />
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bg-white p-4 rounded-lg shadow-lg max-w-sm"
            style={{
              top: selectedNode.y,
              left: selectedNode.x,
              transform: 'translate(-50%, -120%)',
              zIndex: 1000
            }}
          >
            <h3 className="font-semibold text-gray-900">{selectedNode.demographics.name}</h3>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Age:</span> {selectedNode.demographics.age}</p>
              <p><span className="font-medium">Occupation:</span> {selectedNode.demographics.occupation}</p>
              <p><span className="font-medium">Location:</span> {selectedNode.demographics.location}</p>
              <p><span className="font-medium">Background:</span> {selectedNode.demographics.background}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}