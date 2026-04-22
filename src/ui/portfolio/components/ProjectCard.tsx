"use client";

import type { Portfolio } from "@/core/portfolio";
import { Link } from "@/i18n/routing";
import { Badge } from "@/ui/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/components/ui/card";
import { scaleOnHover } from "@/ui/lib/motion";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

type ProjectCardProps = {
  project: Portfolio.Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const t = useTranslations("portfolio");

  return (
    <motion.div variants={scaleOnHover} initial="rest" whileHover="hover" className="h-full">
      <Link href={`/portfolio/${project.slug}`} className="block h-full">
        <Card className="group relative flex h-full flex-col overflow-hidden">
          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-3 right-3 z-10">
              <Badge variant="default" className="bg-primary text-primary-foreground shadow-md">
                {t("featured")}
              </Badge>
            </div>
          )}

          {/* Thumbnail */}
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            {project.thumbnail ? (
              <Image
                src={project.thumbnail.url}
                alt={project.thumbnail.alt ?? project.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="h-full w-full" />
            )}
          </div>

          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{project.title}</CardTitle>
          </CardHeader>

          <CardContent className="flex-1 space-y-4">
            <p className="line-clamp-3 text-sm text-muted-foreground">{project.description}</p>

            <div className="flex flex-wrap gap-1.5">
              {project.techs.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-1 text-sm font-medium text-primary">
              {t("viewProject")}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
