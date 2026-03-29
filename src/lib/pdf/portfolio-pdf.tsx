import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Profile, PortfolioWithImages } from "@/types/database";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    padding: 0,
  },
  contentArea: {
    flex: 1,
    flexDirection: "row",
    padding: "30 40",
  },
  leftColumn: {
    width: "25%",
    paddingRight: 20,
  },
  rightColumn: {
    width: "65%",
    paddingRight: 10,
  },
  projectLabel: {
    width: "10%",
    textAlign: "right",
  },
  fieldLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 9,
    marginBottom: 16,
    color: "#333333",
    lineHeight: 1.4,
  },
  fieldValueItalic: {
    fontSize: 8,
    fontStyle: "italic",
    marginBottom: 16,
    color: "#666666",
    lineHeight: 1.4,
  },
  descriptionLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },
  description: {
    fontSize: 9,
    color: "#333333",
    lineHeight: 1.5,
  },
  projectNumber: {
    fontSize: 9,
    color: "#666666",
    textAlign: "right",
  },
  imageContainer: {
    backgroundColor: "#E5E5E5",
    marginTop: 10,
    height: 280,
    justifyContent: "center",
    alignItems: "center",
  },
  coverImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },
  imagePlaceholderTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    textAlign: "center",
  },
  imagePlaceholderText: {
    fontSize: 8,
    fontStyle: "italic",
    textAlign: "center",
    color: "#666666",
    maxWidth: 300,
    lineHeight: 1.4,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#333333",
    borderTopStyle: "solid",
    flexDirection: "row",
    padding: "12 40",
  },
  footerColumn: {
    width: "25%",
    paddingRight: 10,
  },
  footerLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
  },
  footerValue: {
    fontSize: 7,
    color: "#666666",
    lineHeight: 1.3,
  },
  footerValueItalic: {
    fontSize: 7,
    fontStyle: "italic",
    color: "#999999",
    lineHeight: 1.3,
  },
  footerBold: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
});

function ProjectPage({
  portfolio,
  profile,
  index,
  total,
  imageData,
}: {
  portfolio: PortfolioWithImages;
  profile: Profile;
  index: number;
  total: number;
  imageData?: string;
}) {
  return (
    <Page size="A4" orientation="landscape" style={styles.page}>
      {/* Main Content */}
      <View style={styles.contentArea}>
        {/* Left Column */}
        <View style={styles.leftColumn}>
          <Text style={styles.fieldLabel}>Artwork/Project Title</Text>
          <Text style={styles.fieldValue}>{portfolio.title}</Text>

          <Text style={styles.fieldLabel}>Year Accomplished</Text>
          <Text style={styles.fieldValue}>
            {portfolio.year_accomplished}
          </Text>

          <Text style={styles.fieldLabel}>Role/Position</Text>
          <Text style={styles.fieldValue}>{portfolio.role_position}</Text>

          <Text style={styles.fieldLabel}>Publication Link</Text>
          <Text style={styles.fieldValueItalic}>
            {portfolio.publication_link || "N/A"}
          </Text>
        </View>

        {/* Right Column */}
        <View style={styles.rightColumn}>
          <Text style={styles.descriptionLabel}>
            Artwork/Project Description
          </Text>
          <Text style={styles.description}>{portfolio.description}</Text>

          {/* Image Area */}
          <View style={styles.imageContainer}>
            {imageData ? (
              <Image src={imageData} style={styles.coverImage} />
            ) : (
              <View>
                <Text style={styles.imagePlaceholderTitle}>
                  Artwork/project photo/picture
                </Text>
                <Text style={styles.imagePlaceholderText}>
                  Photo or picture that shows craftsmanship and command of
                  techniques, whether digital or handmade, with careful
                  attention to detail while understanding materials and/or
                  media to enhance the design concept.
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Project Number */}
        <View style={styles.projectLabel}>
          <Text style={styles.projectNumber}>
            Project {index + 1} of {total}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerColumn}>
          <Text style={styles.footerLabel}>Your name</Text>
          <Text style={styles.footerValue}>{profile.full_name}</Text>
        </View>
        <View style={styles.footerColumn}>
          <Text style={styles.footerLabel}>{profile.student_status}</Text>
          {profile.current_semester && (
            <Text style={styles.footerValueItalic}>
              {profile.current_semester}
            </Text>
          )}
        </View>
        <View style={styles.footerColumn}>
          <Text style={styles.footerLabel}>Your contact information</Text>
          <Text style={styles.footerValue}>
            {[profile.phone, profile.email, profile.professional_link]
              .filter(Boolean)
              .join("\n")}
          </Text>
        </View>
        <View style={styles.footerColumn}>
          <Text style={styles.footerLabel}>{profile.submission_title}</Text>
          <Text style={styles.footerBold}>{profile.submission_cohort}</Text>
        </View>
      </View>
    </Page>
  );
}

export function PortfolioPDF({
  profile,
  portfolios,
  imageDataMap,
}: {
  profile: Profile;
  portfolios: PortfolioWithImages[];
  imageDataMap: Record<string, string>;
}) {
  const total = portfolios.length;

  return (
    <Document>
      {portfolios.map((portfolio, index) => {
        const coverImage = portfolio.portfolio_images?.find(
          (img) => img.is_cover
        );
        const firstImage = coverImage ?? portfolio.portfolio_images?.[0];
        const imageData = firstImage
          ? imageDataMap[firstImage.id]
          : undefined;

        return (
          <ProjectPage
            key={portfolio.id}
            portfolio={portfolio}
            profile={profile}
            index={index}
            total={total}
            imageData={imageData}
          />
        );
      })}
    </Document>
  );
}
