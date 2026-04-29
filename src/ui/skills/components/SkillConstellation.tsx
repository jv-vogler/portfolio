"use client";

import { TechIcon } from "@/ui/lib/icons";
import {
  CLUSTER_COLORS,
  EDGES,
  NODES,
  type ConstellationNode,
} from "@/ui/skills/constellation-data";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";

export function SkillConstellation() {
  const t = useTranslations("skills");
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const getConnectedNodes = useCallback((nodeId: string) => {
    const connected = new Set<string>();
    for (const [a, b] of EDGES) {
      if (a === nodeId) connected.add(b);
      if (b === nodeId) connected.add(a);
    }
    return connected;
  }, []);

  const connectedNodes = hoveredNode ? getConnectedNodes(hoveredNode) : new Set<string>();

  const getNodeOpacity = (nodeId: string) => {
    if (!hoveredNode) return 1;
    if (nodeId === hoveredNode || connectedNodes.has(nodeId)) return 1;
    return 0.2;
  };

  const getEdgeOpacity = (a: string, b: string) => {
    if (!hoveredNode) return 0.15;
    if (a === hoveredNode || b === hoveredNode) return 0.6;
    return 0.05;
  };

  return (
    <section ref={containerRef} className="dot-grid-dense relative min-h-screen py-32">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">
          <span
            aria-hidden="true"
            className="mr-3 font-mono text-xl font-normal text-muted-foreground sm:text-2xl"
          >
            § 02
          </span>
          {t("heading")}
        </h2>
        <p className="mb-16 max-w-xl text-lg text-muted-foreground">{t("description")}</p>

        {/* Constellation — desktop */}
        <div className="relative hidden lg:block" style={{ height: "60vh", minHeight: 400 }}>
          {/* SVG edges */}
          <svg className="absolute inset-0 size-full" aria-hidden="true">
            {EDGES.map(([a, b]) => {
              const nodeA = NODES.find((n) => n.id === a)!;
              const nodeB = NODES.find((n) => n.id === b)!;
              return (
                <motion.line
                  key={`${a}-${b}`}
                  x1={`${nodeA.x}%`}
                  y1={`${nodeA.y}%`}
                  x2={`${nodeB.x}%`}
                  y2={`${nodeB.y}%`}
                  stroke="currentColor"
                  className="text-foreground"
                  strokeWidth={1}
                  initial={prefersReducedMotion ? { opacity: 0.15 } : { pathLength: 0, opacity: 0 }}
                  animate={
                    isInView
                      ? {
                          pathLength: 1,
                          opacity: getEdgeOpacity(a, b),
                        }
                      : undefined
                  }
                  transition={{
                    pathLength: { duration: 1.2, delay: 0.5 },
                    opacity: { duration: 0.3 },
                  }}
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {NODES.map((node, i) => (
            <ConstellationNodeEl
              key={node.id}
              node={node}
              index={i}
              isInView={isInView}
              opacity={getNodeOpacity(node.id)}
              isHovered={hoveredNode === node.id}
              isConnected={connectedNodes.has(node.id)}
              reducedMotion={!!prefersReducedMotion}
              onActivate={() => setHoveredNode(node.id)}
              onDeactivate={() => setHoveredNode(null)}
            />
          ))}
        </div>

        {/* Mobile fallback — responsive grid */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:hidden">
          {NODES.map((node, i) => (
            <motion.div
              key={node.id}
              className="flex w-[calc(33.333%-1rem)] flex-col items-center gap-2 rounded-xl p-3 sm:w-[calc(25%-1.5rem)] sm:p-4"
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.4, delay: prefersReducedMotion ? 0 : i * 0.05 }}
            >
              <div
                className="flex size-11 items-center justify-center rounded-full sm:size-12"
                style={{
                  backgroundColor: `color-mix(in oklch, ${CLUSTER_COLORS[node.cluster]} 25%, transparent)`,
                }}
              >
                <span style={{ color: CLUSTER_COLORS[node.cluster] }}>
                  <TechIcon slug={node.slug} size={22} />
                </span>
              </div>
              <span className="text-center text-[11px] font-medium text-foreground sm:text-xs">
                {node.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConstellationNodeEl({
  node,
  index,
  isInView,
  opacity,
  isHovered,
  isConnected,
  reducedMotion,
  onActivate,
  onDeactivate,
}: {
  node: ConstellationNode;
  index: number;
  isInView: boolean;
  opacity: number;
  isHovered: boolean;
  isConnected: boolean;
  reducedMotion: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const color = CLUSTER_COLORS[node.cluster];

  return (
    <motion.button
      type="button"
      aria-label={node.label}
      className="absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center gap-1.5 rounded-full bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
      }}
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.5 }}
      animate={
        isInView
          ? {
              opacity,
              scale: isHovered ? 1.15 : isConnected ? 1.05 : 1,
            }
          : undefined
      }
      transition={{
        opacity: { duration: 0.3 },
        scale: { duration: 0.2, type: "spring", stiffness: 300 },
        // Stagger entrance from center
        ...(reducedMotion
          ? {}
          : {
              delay: index * 0.08,
            }),
      }}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
      onClick={() => {
        // Toggle on click for touch / keyboard activation parity.
        if (isHovered) {
          onDeactivate();
        } else {
          onActivate();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onDeactivate();
          (e.currentTarget as HTMLButtonElement).blur();
        }
      }}
    >
      <div
        className="flex size-14 items-center justify-center rounded-full border transition-shadow"
        style={{
          borderColor: `color-mix(in oklch, ${color} 60%, transparent)`,
          boxShadow: isHovered ? `0 0 20px color-mix(in oklch, ${color} 30%, transparent)` : "none",
          backgroundColor: `color-mix(in oklch, ${color} 20%, var(--background))`,
        }}
      >
        <span style={{ color }} aria-hidden="true">
          <TechIcon slug={node.slug} size={28} />
        </span>
      </div>
      <span className="whitespace-nowrap text-xs font-medium text-foreground/80" aria-hidden="true">
        {node.label}
      </span>
    </motion.button>
  );
}
