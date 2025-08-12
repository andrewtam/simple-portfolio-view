"use client";

import { useMemo, useState, useCallback } from "react";

export default function BalanceChart() {
  // Dimensions tuned for the mock graph
  const width = 750;
  const height = 300;
  // Tighten chart paddings so the plotted area reaches closer to the card edges
  const leftPad = 58;   
  const rightPad = 8;  
  const topPad = 8;    
  const bottomPad = 32; 
  const innerWidth = width - leftPad - rightPad;
  const innerHeight = height - topPad - bottomPad;

  // Hard-coded points
  const points = [
    [0, 200],
    [60, 150],
    [120, 160],
    [180, 150],
    [240, 180],
    [300, 180],
    [360, 90],
    [420, 130],
    [480, 40],
    [540, 150],
    [600, 90],
    [660, 120],
    [720, 170], 
  ];

  // Pre-scale points to SVG coordinates
  const scaledPoints = useMemo(
    () =>
      points.map(([x, y]) => [
        leftPad + (x / 720) * innerWidth,
        topPad + (y / 256) * innerHeight,
      ] as const),
    [innerWidth, innerHeight]
  );

  type Hover = { x: number; y: number } | null;
  const [hover, setHover] = useState<Hover>(null);

  const handleMouseMove = useCallback(
    (evt: React.MouseEvent<SVGSVGElement>) => {
      const bounds = evt.currentTarget.getBoundingClientRect();
      // Account for preserveAspectRatio (default xMidYMid meet): uniform scale + letterboxing
      const scale = Math.min(bounds.width / width, bounds.height / height);
      const offsetX = (bounds.width - width * scale) / 2;
      const offsetY = (bounds.height - height * scale) / 2;
      const x = (evt.clientX - bounds.left - offsetX) / scale; // viewBox coords
      const y = (evt.clientY - bounds.top - offsetY) / scale; // viewBox coords
      // Only consider inside plot area
      if (x < leftPad || x > leftPad + innerWidth) {
        setHover(null);
        return;
      }
      // Smooth scrubbing: interpolate y between the two surrounding points
      const clampedX = Math.max(leftPad, Math.min(leftPad + innerWidth, x));
      // Find segment index
      let seg = scaledPoints.length - 2;
      for (let i = 0; i < scaledPoints.length - 1; i += 1) {
        if (clampedX >= scaledPoints[i][0] && clampedX <= scaledPoints[i + 1][0]) {
          seg = i;
          break;
        }
      }
      const [x1, y1] = scaledPoints[seg];
      const [x2, y2] = scaledPoints[seg + 1];
      const t = x2 === x1 ? 0 : (clampedX - x1) / (x2 - x1);
      const yInterp = y1 + t * (y2 - y1);
      setHover({ x: clampedX, y: Math.max(topPad, Math.min(topPad + innerHeight, yInterp)) });
    },
    [scaledPoints, innerWidth]
  );

  const handleLeave = useCallback(() => setHover(null), []);

  const areaPath = (() => {
    const [fx, fy] = scaledPoints[0];
    const [lx] = scaledPoints[scaledPoints.length - 1];
    const baseline = topPad + innerHeight;
    const through = scaledPoints.map(([sx, sy]) => `L ${sx} ${sy}`).join(" ");
    // Start at first point to avoid vertical jump, then close down to baseline at right, back to left
    return `M ${fx} ${fy} ${through} L ${lx} ${baseline} L ${fx} ${baseline} Z`;
  })();

  const linePath = (() => {
    const [fx, fy] = scaledPoints[0];
    const rest = scaledPoints.slice(1).map(([sx, sy]) => `L ${sx} ${sy}`).join(" ");
    return `M ${fx} ${fy} ${rest}`;
  })();

  return (
    <div className="bg-white rounded-2xl border-[1.5px] border-gray-200 pt-2 pb-4 mb-8">
      <div className="relative min-h-[300px] rounded-2xl bg-white">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="absolute inset-0 w-full h-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleLeave}
        >
          <defs>
            <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Grid lines and labels */}
          {[
            { y: topPad + innerHeight * 0.12, label: "$6000" },
            { y: topPad + innerHeight * 0.32, label: "$5000" },
            { y: topPad + innerHeight * 0.55, label: "$4000" },
            { y: topPad + innerHeight * 0.78, label: "$3000" },
            { y: topPad + innerHeight, label: "$2000" },
          ].map((g, idx) => (
              <g key={idx}>
                <line x1={leftPad} x2={leftPad + innerWidth} y1={g.y} y2={g.y} stroke="#e5e7eb" />
                <text x={leftPad-64} y={g.y + 4} fill="#B300000" fontWeight="medium" fontSize="14">{g.label}</text>
            </g>
          ))}

          {/* Area and line */}
          <path d={areaPath} fill="url(#chart-fill)" />
          <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

          {/* X axis */}
          <line x1={leftPad} x2={leftPad + innerWidth} y1={topPad + innerHeight} y2={topPad + innerHeight} stroke="#e5e7eb" />
          <text x={leftPad + innerWidth * 0.05} y={height - 10} fill="#B300000" fontSize="14" fontWeight="medium" >July 9</text>
          <text x={leftPad + innerWidth * 0.32} y={height - 10} fill="#B300000" fontSize="14" fontWeight="medium" >July 16</text>
          <text x={leftPad + innerWidth * 0.58} y={height - 10} fill="#B300000" fontSize="14" fontWeight="medium" >July 23</text>
          <text x={leftPad + innerWidth * 0.85} y={height - 10} fill="#B300000" fontSize="14" fontWeight="medium" >July 30</text>

          {/* Hover crosshair + marker + tooltip */}
          {hover && (
            <g>
              {/* Vertical guide within plot */}
              <line x1={hover.x} x2={hover.x} y1={topPad} y2={topPad + innerHeight} stroke="#93c5fd" strokeDasharray="3 3" />
              {/* Horizontal guide */}
              <line x1={leftPad} x2={leftPad + innerWidth} y1={hover.y} y2={hover.y} stroke="#93c5fd" strokeDasharray="3 3" />
              {/* Marker */}
              <circle cx={hover.x} cy={hover.y} r={5} fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              {/* Tooltip */}
              {(() => {
                const cx = hover.x;
                const cy = hover.y;
                const value = Math.round(6000 - ((cy - topPad) / innerHeight) * 4000);
                const boxX = Math.min(Math.max(cx + 8, leftPad + 8), leftPad + innerWidth - 120);
                const boxY = Math.max(cy - 36, 8);
                return (
                  <g>
                    <rect x={boxX} y={boxY} width={93} height={30} rx={6} fill="#111827" opacity="1" />
                    <text x={boxX + 8} y={boxY + 19} fill="#fff" fontSize="12">Price: </text>
                    <text x={boxX + 45} y={boxY + 19} fill="#fff" fontSize="12">${value.toLocaleString()}</text>
                  </g>
                );
              })()}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}


