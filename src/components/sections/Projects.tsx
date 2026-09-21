import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Images, Eye, Sparkles } from 'lucide-react';
import { config, type Project } from '@/portfolio.config';
import { fadeUpVariants } from '@/lib/animation';
import { ProjectGalleryModal } from '@/components/ProjectGalleryModal';

const fadeUp = fadeUpVariants(44, 0.75, 0.12);

export function Projects() {
  const featured = config.projects.filter((p) => p.featured);
  const others = config.projects.filter((p) => !p.featured);

  const [activeGalleryProject, setActiveGalleryProject] =
    useState<Project | null>(null);

  return (
    <section id="projects" className="bg-secondary/20 px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.p
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-primary mb-4 font-mono text-xs font-medium tracking-widest uppercase"
        >
          Work & Case Studies
        </motion.p>
        <motion.h2
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="section-heading text-foreground mb-14 text-4xl md:text-5xl"
        >
          Featured Projects
        </motion.h2>

        {/* Featured — large cards */}
        <div className="mb-14 grid gap-8 md:grid-cols-2">
          {featured.map((project, i) => {
            const hasGallery =
              Boolean(project.gallery && project.gallery.length > 0);
            const coverImg =
              project.coverImage || project.gallery?.[0]?.image;

            return (
              <motion.div
                key={project.name}
                variants={fadeUp}
                custom={i + 2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                className="group border-border bg-card card-hover relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 sm:p-7"
                data-testid={`project-featured-${i}`}
              >
                {/* Optional Cover Banner for projects with gallery */}
                {coverImg && (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => hasGallery && setActiveGalleryProject(project)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        hasGallery && setActiveGalleryProject(project);
                      }
                    }}
                    className={`border-border/60 relative -mx-6 -mt-6 mb-6 aspect-video overflow-hidden border-b sm:-mx-7 sm:-mt-7 ${
                      hasGallery
                        ? 'cursor-pointer'
                        : ''
                    }`}
                  >
                    <img
                      src={coverImg}
                      alt={project.name}
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Gallery indicator tag */}
                    {hasGallery && (
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                        <Images size={13} className="text-primary" />
                        <span className="font-mono">
                          {project.gallery?.length} Screenshots
                        </span>
                      </div>
                    )}

                    {/* Hover Prompt */}
                    {hasGallery && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="bg-primary text-primary-foreground flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow-lg">
                          <Eye size={14} />
                          <span>Buka Galeri Foto</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-foreground group-hover:text-primary font-serif text-2xl font-light transition-colors">
                      {project.name}
                    </h3>
                    <div className="flex shrink-0 gap-2">
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg p-2 transition-all"
                          aria-label="GitHub repo"
                          data-testid={`link-repo-${project.name.toLowerCase()}`}
                        >
                          <Github size={16} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg p-2 transition-all"
                          aria-label="Live project"
                          data-testid={`link-live-${project.name.toLowerCase()}`}
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed font-light">
                    {project.description}
                  </p>

                  {/* Button to open gallery if available */}
                  {hasGallery && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setActiveGalleryProject(project)}
                        className="border-primary/30 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-medium transition-all shadow-xs"
                      >
                        <Images size={14} />
                        <span>
                          Lihat Dokumentasi & Galeri ({project.gallery?.length} Foto)
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-border/40 pt-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-secondary text-secondary-foreground border-border rounded-md border px-2.5 py-1 font-mono text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Other projects */}
        {others.length > 0 && (
          <>
            <motion.h3
              variants={fadeUp}
              custom={featured.length + 2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="text-muted-foreground mb-6 font-mono text-xs font-medium tracking-widest uppercase"
            >
              Other Projects
            </motion.h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((project, i) => (
                <motion.div
                  key={project.name}
                  variants={fadeUp}
                  custom={i + featured.length + 3}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  className="group border-border bg-card card-hover flex flex-col gap-3 rounded-xl border p-5"
                  data-testid={`project-other-${i}`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-foreground group-hover:text-primary font-serif text-lg font-light transition-colors">
                      {project.name}
                    </h4>
                    <div className="flex gap-1">
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground rounded-md p-1.5 transition-colors"
                          aria-label="GitHub"
                        >
                          <Github size={14} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground rounded-md p-1.5 transition-colors"
                          aria-label="Live"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground flex-1 text-xs leading-relaxed font-light">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="bg-secondary text-secondary-foreground rounded px-2 py-0.5 font-mono text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Interactive Gallery Modal */}
      {activeGalleryProject && (
        <ProjectGalleryModal
          isOpen={Boolean(activeGalleryProject)}
          onClose={() => setActiveGalleryProject(null)}
          project={activeGalleryProject}
        />
      )}
    </section>
  );
}
