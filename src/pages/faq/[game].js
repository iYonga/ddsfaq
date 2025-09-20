import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Button from "@/components/pickles/Button";
import Input from "@/components/pickles/Input";
import FAQCard from "@/components/pickles/FAQCard";
import AlphabetNav from "@/components/pickles/AlphabetNav";
import SEO from "@/components/SEO";

export default function FAQPage({ game: initialGame, initialFaqData }) {
  const router = useRouter();
  const { game: routerGame } = router.query;
  const game = initialGame || routerGame;
  const [faqData, setFaqData] = useState(initialFaqData || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeLetter, setActiveLetter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to clean citation markers
  const cleanText = (text) => {
    return text.replace(/\[\d+\]/g, '');
  };

  // Clean FAQ data on mount
  useEffect(() => {
    if (initialFaqData && initialFaqData.length > 0) {
      const cleanedData = initialFaqData.map(item => ({
        ...item,
        question: cleanText(item.question),
        answer: cleanText(item.answer)
      }));
      setFaqData(cleanedData);
    }
  }, [initialFaqData]);

  // Group FAQ data by first letter and filter by search
  const { groupedData, availableLetters, filteredData } = useMemo(() => {
    const filtered = faqData.filter(
      (item) =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const grouped = filtered.reduce((acc, item) => {
      const firstLetter = item.question.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(item);
      return acc;
    }, {});

    const letters = Object.keys(grouped).sort();

    return { groupedData: grouped, availableLetters: letters, filteredData: filtered };
  }, [faqData, searchTerm]);

  // Scroll to letter section
  const scrollToLetter = (letter) => {
    setActiveLetter(letter);
    const element = document.getElementById(`faq-section-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Handle search input with debounce
  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value) {
      setActiveLetter(null);
    }
  };

  const gameTitle = initialGame === "dds1" ? "Drug Dealer Simulator 1" : "Drug Dealer Simulator 2";
  const gameSubtitle = initialGame === "dds1" ? "DDS1" : "DDS2";

  // SEO props
  const seoProps = {
    title: `${gameTitle} Interactive FAQ | DDSFAQ`,
    description: `Browse comprehensive ${gameTitle} questions and answers with dynamic search, alphabetical navigation, and card-based interface. Find gameplay help, strategies, troubleshooting, and detailed walkthroughs for ${gameSubtitle}.`,
    keywords: `${gameTitle.toLowerCase()}, ${gameSubtitle.toLowerCase()}, FAQ, interactive guide, game help, walkthrough, troubleshooting, game strategies, drug dealer simulator`,
    breadcrumbs: [
      {
        name: "Home",
        url: "https://dds.yonga.dev"
      },
      {
        name: "FAQ Selection",
        url: "https://dds.yonga.dev/faq"
      },
      {
        name: `${gameTitle} FAQ`,
        url: `https://dds.yonga.dev/faq/${initialGame}`
      }
    ],
    faqData: faqData.slice(0, 10), // First 10 FAQs for structured data
    structuredData: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "name": `${gameTitle} Interactive FAQ`,
      "description": `Comprehensive FAQ and guide for ${gameTitle} with questions and answers`,
      "url": `https://dds.yonga.dev/faq/${initialGame}`,
      "mainEntity": faqData.slice(0, 10).map((faq, index) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        },
        "position": index + 1
      }))
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#111",
          color: "#fff",
        }}
      >
        <div>Loading FAQ data...</div>
      </div>
    );
  }

  if (!initialGame || (initialGame !== "dds1" && initialGame !== "dds2")) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          backgroundColor: "#111",
          color: "#fff",
          padding: "1rem",
        }}
      >
        <h1>Invalid Game Selection</h1>
        <p>Please select a valid game from the FAQ selection page.</p>
        <Button
          label="Back to FAQ Selection"
          trigger={() => router.push("/faq")}
          style={{ marginTop: "1rem" }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#111",
        color: "#fff",
        padding: "1rem",
      }}
    >
      <SEO {...seoProps} />

      {/* Header */}
      <header
        style={{
          textAlign: "center",
          padding: "2rem 0",
          background: "#222",
          margin: "-1rem -1rem 2rem -1rem",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.8rem" }}>
          {gameTitle} | Interactive FAQ
        </h1>
        <p style={{ margin: "0.5rem 0 0 0", opacity: 0.8 }}>
          Browse {filteredData.length} questions and answers
        </p>
      </header>

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Button
            label="← Back to Selection"
            trigger={() => router.push("/faq")}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.9rem",
            }}
          />
          {/* Game Switcher */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.25rem",
              backgroundColor: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "0.5rem",
            }}
          >
            <Button
              label="DDS1"
              trigger={() => router.push("/faq/dds1")}
              variant="outline"
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.8rem",
                backgroundColor: initialGame === "dds1" ? "#FFCC00" : "#2a2a2a",
                color: initialGame === "dds1" ? "#000" : "#fff",
                border: initialGame === "dds1" ? "1px solid #FFCC00" : "1px solid #666",
                minWidth: "60px",
              }}
            />
            <div
              style={{
                color: "#666",
                fontSize: "0.8rem",
                margin: "0 0.25rem",
              }}
            >
              |
            </div>
            <Button
              label="DDS2"
              trigger={() => router.push("/faq/dds2")}
              variant="outline"
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.8rem",
                backgroundColor: initialGame === "dds2" ? "#FFCC00" : "#2a2a2a",
                color: initialGame === "dds2" ? "#000" : "#fff",
                border: initialGame === "dds2" ? "1px solid #FFCC00" : "1px solid #666",
                minWidth: "60px",
              }}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#FFCC00",
              color: "#000",
              borderRadius: "0.375rem",
              fontWeight: "bold",
              fontSize: "0.9rem",
            }}
          >
            {gameSubtitle.toUpperCase()}
          </div>
          <div
            style={{
              color: "#ccc",
              fontSize: "0.9rem",
            }}
          >
            {filteredData.length} items
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto 2rem auto",
        }}
      >
        <Input
          placeholder="Search questions and answers..."
          value={searchTerm}
          setValue={handleSearch}
          style={{
            width: "100%",
          }}
        />
      </div>

      {/* Alphabet Navigation */}
      {availableLetters.length > 0 && (
        <AlphabetNav
          availableLetters={availableLetters}
          activeLetter={activeLetter}
          onLetterClick={scrollToLetter}
        />
      )}

      {/* FAQ Content */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {filteredData.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              backgroundColor: "#1a1a1a",
              borderRadius: "0.75rem",
              border: "1px solid #333",
            }}
          >
            <h3 style={{ color: "#FFCC00", margin: "0 0 1rem 0" }}>
              No results found
            </h3>
            <p style={{ color: "#ccc", margin: 0 }}>
              No questions or answers match your search term &quot;{searchTerm}&quot;.
            </p>
            {searchTerm && (
              <Button
                label="Clear Search"
                trigger={() => setSearchTerm("")}
                style={{ marginTop: "1rem" }}
              />
            )}
          </div>
        ) : (
          Object.entries(groupedData)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([letter, items]) => (
              <div
                key={letter}
                id={`faq-section-${letter}`}
                style={{
                  marginBottom: "3rem",
                }}
              >
                <h2
                  style={{
                    color: "#FFCC00",
                    margin: "0 0 1.5rem 0",
                    fontSize: "2rem",
                    borderBottom: "2px solid #FFCC00",
                    paddingBottom: "0.5rem",
                  }}
                >
                  {letter}
                </h2>
                {items.map((item, index) => (
                  <FAQCard
                    key={`${item.source}-${index}`}
                    question={item.question}
                    answer={item.answer}
                    source={item.source}
                    letter={letter}
                    id={index}
                  />
                ))}
              </div>
            ))
        )}
      </div>

      {/* Back to Top Button */}
      {filteredData.length > 10 && (
        <Button
          label="↑ Back to Top"
          trigger={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            padding: "0.75rem 1rem",
            zIndex: 40,
          }}
        />
      )}
    </div>
  );
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { game: 'dds1' } },
      { params: { game: 'dds2' } }
    ],
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const { game } = params;

  try {
    const faqData = require(`@/resources/${game}.json`);

    return {
      props: {
        game,
        initialFaqData: faqData
      }
    };
  } catch (error) {
    return {
      props: {
        game,
        initialFaqData: []
      }
    };
  }
}