"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import {
    IconCode,
    IconApi,
    IconBrain,
    IconCloud,
    IconDeviceMobile,
    IconServer,
} from "@tabler/icons-react";

function ServiceContent({
    icon: Icon,
    color,
    highlights,
    description,
}: {
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
    color: string;
    highlights: string[];
    description: string;
}) {
    return (
        <div className="space-y-6">
            <div className="rounded-3xl bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14">
                <div className="flex items-center gap-4 mb-6">
                    <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl"
                        style={{ backgroundColor: color + "22" }}
                    >
                        <Icon className="h-6 w-6" style={{ color }} />
                    </div>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-xl leading-relaxed max-w-3xl">
                    {description}
                </p>
            </div>
            <div className="rounded-3xl bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14">
                <p className="text-sm uppercase tracking-widest text-neutral-400 mb-4">
                    What you get
                </p>
                <ul className="space-y-3">
                    {highlights.map((item, i) => (
                        <li
                            key={i}
                            className="flex items-start gap-3 text-neutral-600 dark:text-neutral-300 text-sm md:text-base"
                        >
                            <span
                                className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                                style={{ backgroundColor: color }}
                            />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

const data = [
    {
        category: "Full-Stack Development",
        title: "End-to-end web applications built to scale.",
        src: "#8B7355",
        content: (
            <ServiceContent
                icon={IconCode}
                color="#8B7355"
                description="From concept to deployment — I build modern, performant web applications using Next.js, React, and TypeScript. Clean architecture, responsive design, and production-ready code that your team can maintain."
                highlights={[
                    "Next.js / React front-end with TypeScript",
                    "Responsive, accessible UI with modern design systems",
                    "Server-side rendering & static generation for SEO",
                    "Authentication, authorization, and role-based access",
                    "CI/CD pipelines and automated deployment workflows",
                ]}
            />
        ),
    },
    {
        category: "Backend & API Engineering",
        title: "Scalable APIs that power your business.",
        src: "#6B8E7B",
        content: (
            <ServiceContent
                icon={IconApi}
                color="#6B8E7B"
                description="I design and build robust REST APIs and microservices using Go and Node.js. Whether you need a new backend from scratch or need to optimize existing systems for scale, I deliver clean, well-documented APIs."
                highlights={[
                    "RESTful API design with Go / Node.js / Express",
                    "Microservices architecture with event-driven patterns",
                    "Database design with PostgreSQL, Prisma ORM",
                    "API documentation (OpenAPI / Swagger)",
                    "Performance optimization and load testing",
                ]}
            />
        ),
    },
    {
        category: "AI & Machine Learning",
        title: "Intelligent solutions that add real value.",
        src: "#7B6B8E",
        content: (
            <ServiceContent
                icon={IconBrain}
                color="#7B6B8E"
                description="I integrate AI capabilities into production applications — from LLM-powered features to custom ML models. Not just prototypes, but production-ready AI that delivers measurable business impact."
                highlights={[
                    "LLM integration (OpenAI, custom models)",
                    "TensorFlow / Python ML pipeline development",
                    "AI-powered search, recommendations, and analytics",
                    "NLP solutions for text analysis and automation",
                    "Model deployment and monitoring in production",
                ]}
            />
        ),
    },
    {
        category: "Cloud & DevOps",
        title: "Infrastructure that runs itself.",
        src: "#8E7B6B",
        content: (
            <ServiceContent
                icon={IconCloud}
                color="#8E7B6B"
                description="I set up and maintain cloud infrastructure on AWS, GCP, or Vercel so your applications are always available, secure, and cost-effective. Docker, Kafka, and CI/CD — all configured and battle-tested."
                highlights={[
                    "Docker containerization and orchestration",
                    "Kafka / event-driven messaging systems",
                    "CI/CD with GitHub Actions, Vercel, or custom pipelines",
                    "Cloud deployment (AWS, GCP, Vercel)",
                    "Monitoring, logging, and alerting setup",
                ]}
            />
        ),
    },
    {
        category: "Mobile Development",
        title: "Apps your users will love.",
        src: "#6B7B8E",
        content: (
            <ServiceContent
                icon={IconDeviceMobile}
                color="#6B7B8E"
                description="Cross-platform mobile applications built with modern frameworks. I focus on smooth user experiences, fast load times, and native-feeling interactions that keep users engaged."
                highlights={[
                    "React Native / cross-platform development",
                    "Native-feeling UI with smooth animations",
                    "Offline-first and real-time sync capabilities",
                    "Push notifications and deep linking",
                    "App Store / Play Store submission and compliance",
                ]}
            />
        ),
    },
    {
        category: "Technical Consulting",
        title: "Strategic guidance for your tech stack.",
        src: "#7B8E6B",
        content: (
            <ServiceContent
                icon={IconServer}
                color="#7B8E6B"
                description="Not sure which tech stack to use? Need a code audit or architecture review? I provide hands-on consulting to help you make informed decisions and avoid costly mistakes."
                highlights={[
                    "Architecture review and system design",
                    "Code quality audits and refactoring plans",
                    "Tech stack evaluation and recommendations",
                    "Team mentoring and best practices workshops",
                    "Performance profiling and optimization strategy",
                ]}
            />
        ),
    },
];

export function ServicesCarousel() {
    const cards = data.map((card, index) => (
        <Card key={card.src + index} card={card} index={index} />
    ));

    return (
        <section className="w-full py-16 md:py-24">
            <div className="max-w-7xl pl-4 mx-auto mb-2">
                <p className="text-sm uppercase tracking-widest text-foreground/40 mb-2">
                    Services
                </p>
                <h2 className="text-2xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-200">
                    What I can do for you.
                </h2>
            </div>
            <Carousel items={cards} />
        </section>
    );
}
