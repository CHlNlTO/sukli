import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/shared/lib/supabase/server";
import { env } from "../../../lib/env";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY || "");

// Helper function to extract JSON from markdown code blocks
function extractJsonFromResponse(text: string): string {
  // Remove markdown code blocks if present
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }

  // If no code blocks, return the text as-is (might already be clean JSON)
  return text.trim();
}

// Helper function to validate parsed data structure
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateParsedData(data: any): boolean {
  return (
    data &&
    typeof data === "object" &&
    typeof data.amount === "number" &&
    typeof data.currency === "string" &&
    data.currency.length === 3 &&
    typeof data.confidence_score === "number" &&
    data.confidence_score >= 0 &&
    data.confidence_score <= 1
  );
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload an image." },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Please upload an image under 10MB." },
        { status: 400 }
      );
    }

    console.log(
      `Processing file: ${file.name}, size: ${file.size}, type: ${file.type}`
    );

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get user's custom prompt if authenticated
    let customPrompt = "";
    let useCustomApiKey = false;
    let customGenAI: GoogleGenerativeAI | null = null;

    const { userId } = await auth();

    if (userId) {
      try {
        const supabase = await createClient();
        const { data: userProfile } = await supabase
          .from("user_profiles")
          .select("id, custom_gemini_api_key")
          .eq("clerk_user_id", userId)
          .single();

        if (userProfile) {
          // Check for active custom prompt
          const { data: activePrompt } = await supabase
            .from("user_prompts")
            .select("prompt_content")
            .eq("user_id", userProfile.id)
            .eq("is_active", true)
            .single();

          if (activePrompt) {
            customPrompt = `\n\nAdditionally, follow these user-specific instructions:\n${activePrompt.prompt_content}`;
          }

          // Use custom API key if available
          if (userProfile.custom_gemini_api_key) {
            customGenAI = new GoogleGenerativeAI(
              userProfile.custom_gemini_api_key
            );
            useCustomApiKey = true;
            console.log("Using user's custom Gemini API key");
          }
        }
      } catch (error) {
        console.warn(
          "Could not fetch user preferences, using defaults:",
          error
        );
      }
    }

    // System prompt for consistent parsing
    const systemPrompt = `
You are an expert at extracting transaction data from receipt images.
Analyze the image and return ONLY a valid JSON object with the following exact structure:

{
  "amount": 0.00,
  "currency": "PHP",
  "merchant_name": "Store Name",
  "category": "Category",
  "transaction_date": "2025-01-19",
  "description": "Brief description",
  "confidence_score": 0.95
}

CRITICAL RULES:
- Return ONLY valid JSON, absolutely no other text, explanations, or markdown formatting
- Do not wrap the JSON in code blocks or backticks
- Extract the TOTAL amount paid, not individual items
- Use Philippine Peso (PHP) as default currency unless clearly stated otherwise
- Date format must be YYYY-MM-DD
- Confidence score: 0.0 to 1.0 based on image clarity and data extraction certainty
- Categories: Food, Transportation, Shopping, Utilities, Entertainment, Healthcare, etc.
- If any field is unclear, make a reasonable guess but lower the confidence score
- If the image is completely unreadable, set confidence_score to 0.1
${customPrompt}`;

    const activeGenAI = useCustomApiKey && customGenAI ? customGenAI : genAI;
    const model = activeGenAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("Sending request to Gemini API...");

    const result = await model.generateContent([
      systemPrompt,
      {
        inlineData: {
          mimeType: file.type,
          data: buffer.toString("base64"),
        },
      },
    ]);

    const responseText = result.response.text();
    console.log("Raw Gemini response:", responseText);

    // Extract JSON from potential markdown formatting
    const cleanJsonText = extractJsonFromResponse(responseText);
    console.log("Cleaned JSON text:", cleanJsonText);

    // Parse the JSON response
    let parsedData;
    try {
      parsedData = JSON.parse(cleanJsonText);
    } catch (parseError) {
      console.error("JSON parsing failed:", parseError);
      console.error("Attempted to parse:", cleanJsonText);

      // Return a fallback response
      return NextResponse.json({
        amount: 0,
        currency: "PHP",
        merchant_name: "Unknown",
        category: "Other",
        transaction_date: new Date().toISOString().split("T")[0],
        description: "Could not parse receipt clearly",
        confidence_score: 0.1,
      });
    }

    // Validate the response structure
    if (!validateParsedData(parsedData)) {
      console.error("Invalid parsed data structure:", parsedData);

      // Try to fix common issues
      const fixedData = {
        amount: typeof parsedData.amount === "number" ? parsedData.amount : 0,
        currency:
          typeof parsedData.currency === "string" ? parsedData.currency : "PHP",
        merchant_name:
          typeof parsedData.merchant_name === "string"
            ? parsedData.merchant_name
            : "Unknown",
        category:
          typeof parsedData.category === "string"
            ? parsedData.category
            : "Other",
        transaction_date:
          typeof parsedData.transaction_date === "string"
            ? parsedData.transaction_date
            : new Date().toISOString().split("T")[0],
        description:
          typeof parsedData.description === "string"
            ? parsedData.description
            : "Parsed with errors",
        confidence_score:
          typeof parsedData.confidence_score === "number"
            ? Math.max(0, Math.min(1, parsedData.confidence_score))
            : 0.3,
      };

      return NextResponse.json(fixedData);
    }

    console.log("Successfully parsed receipt data:", parsedData);
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("Parse receipt error:", error);

    // Return a more specific error message
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "Invalid API key configuration" },
          { status: 500 }
        );
      }
      if (error.message.includes("quota")) {
        return NextResponse.json(
          { error: "API quota exceeded. Please try again later." },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to parse receipt. Please try again." },
      { status: 500 }
    );
  }
}
