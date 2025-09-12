// pages/mydoc.js
import React from "react";
import Head from "next/head";
import Button from "@/components/pickles/Button";
import { useRouter } from "next/router";

export default function MyDoc() {
  const router = useRouter();
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
      <Head>
        <title>Common Bugs & Fixes | DDSFAQ</title>
        <meta
          name="description"
          content="Common bugs and fixes for Drug Dealer Simulator 2. Find solutions to known issues and troubleshooting tips."
        />

        {/* OpenGraph Meta Tags */}
        <meta
          property="og:title"
          content="Common Bugs & Fixes | Drug Dealer Simulator 2 FAQ"
        />
        <meta
          property="og:description"
          content="Common bugs and fixes for Drug Dealer Simulator 2. Find solutions to known issues and troubleshooting tips."
        />
        <meta property="og:url" content="https://dds.yonga.dev/common-bugs" />

        {/* Twitter Card Meta Tags */}
        <meta
          name="twitter:title"
          content="Common Bugs & Fixes | Drug Dealer Simulator 2 FAQ"
        />
        <meta
          name="twitter:description"
          content="Common bugs and fixes for Drug Dealer Simulator 2. Find solutions to known issues and troubleshooting tips."
        />

        <link rel="canonical" href="https://dds.yonga.dev/common-bugs" />
      </Head>
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
          Drug Dealer Simulator 2 | Common Bugs & Fixes
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
          src="https://docs.google.com/document/d/e/2PACX-1vTofkpPromDhPUcvqob1tgyOufGPM7mjDbjiJ2pGyZiw9xfZ2f_SptP64r-lJ7k5idb8qScF314CkDN/pub?embedded=true"
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
