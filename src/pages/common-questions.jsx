// pages/mydoc.js
import React from "react";
import Head from "next/head";
import Button from "@/components/pickles/Button";
import { useRouter } from "next/router";
import SEO from "@/components/SEO";

export default function MyDoc() {
  const router = useRouter();

  const seoProps = {
    title: "Common Questions | DDSFAQ",
    description: "Comprehensive frequently asked questions and answers for Drug Dealer Simulator 2. Get quick solutions to common gameplay problems, mechanics, strategies, and troubleshooting. Your complete resource for DDS2 help.",
    keywords: "common questions, Drug Dealer Simulator 2, DDS2, FAQ, gameplay help, troubleshooting, game mechanics, walkthrough, strategy",
    breadcrumbs: [
      {
        name: "Home",
        url: "https://dds.yonga.dev"
      },
      {
        name: "Common Questions",
        url: "https://dds.yonga.dev/common-questions"
      }
    ]
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
        flexDirection: "column",
      }}
    >
      <SEO {...seoProps} />
      <header
        style={{
          textAlign: "center",
          padding: "10px 0",
          background: "#222",
          color: "#fff",
          width: "100%",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.5rem" }}>
          Drug Dealer Simulator 2 | Common Questions
        </h1>
      </header>{" "}
      <Button
        key={"back"}
        label={"Back"}
        trigger={() => {
          router.push("/");
        }}
      />
      <div
        style={{
          width: "794px", // approx A4 width at 96 DPI
          height: "1123px", // approx A4 height at 96 DPI
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          overflow: "hidden",
        }}
      >
        <iframe
          src="https://docs.google.com/document/d/e/2PACX-1vTk2OIctGT2Si3YTXHF9tj4avv1RmXcLnzA_6E28QnMsxHLIKCNQp9AHi9RhtEsM0DYdbY-XJPnCrpK/pub?embedded=true"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
          title="Google Doc"
        ></iframe>
      </div>
    </div>
  );
}
