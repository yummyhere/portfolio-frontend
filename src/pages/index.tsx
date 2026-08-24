import Head from "next/head";
import type { GetServerSideProps } from "next";

import { NextSeo } from "next-seo";

import LandingHero from "@/components/landing-hero";
import SkillsShowcase from "@/components/skills/skills-showcase";
import ProjectShowcase from "@/components/projects/project-showcase";
import { SKILL_ICONS } from "@/data/skills";
import { siteMetadata } from "@/data/siteMetaData.mjs";
import { getPortfolioData, type PortfolioData } from "@/lib/portfolio";

export default function Home({
  portfolio,
}: {
  portfolio: PortfolioData;
}) {
  const skills = portfolio.skills.map((section) => ({
    sectionName: section.sectionName,
    skills: section.skills.flatMap((skill) => {
      const icon = SKILL_ICONS[skill.icon as keyof typeof SKILL_ICONS];
      return icon ? [{ name: skill.name, icon }] : [];
    }),
  }));

  return (
    <>
      <NextSeo
        title="Yamna Fatima | Software Developer"
        description="Explore the professional portfolio of Yamna Fatima, a skilled Software Developer with 2 years of hands-on experience. Discover innovative projects, expertise in modern web technologies, and a passion for creating seamless user experiences."
        canonical={siteMetadata.siteUrl}
        openGraph={{
          url: siteMetadata.siteUrl,
          title: "Yamna Fatima - Software Developer",
          description:
            "Dive into the world of web development with Yamna Fatima. Discover a Software Developer with 2 years of expertise, showcasing cutting-edge projects and a commitment to crafting exceptional user interfaces.",
          images: [
            {
              url: `${siteMetadata.siteUrl}${siteMetadata.twitterImage}`,
              alt: "Yamna Fatima - Portfolio Image",
            },
          ],
          siteName: siteMetadata.siteName,
          type: "website",
        }}
        twitter={{
          cardType: "summary_large_image",
        }}
        additionalMetaTags={[
          {
            property: "keywords",
            content:
              "React Developer, Software Developer, Frontend Developer, Web Developer, JavaScript, HTML, CSS, Portfolio, UI/UX, React.js, Frontend Development, Web Development, JavaScript Developer, Responsive Design",
          },
        ]}
      />
      <Head>
        {siteMetadata.googleSiteVerification && (
          <meta
            name="google-site-verification"
            content={siteMetadata.googleSiteVerification}
          />
        )}
      </Head>
      <LandingHero />
      <SkillsShowcase skills={skills} />
      <ProjectShowcase projects={portfolio.showcase} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => ({
  props: { portfolio: await getPortfolioData() },
});

