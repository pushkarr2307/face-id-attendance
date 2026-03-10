import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { capturedImageBase64 } = await req.json();

    if (!capturedImageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all registered students with face images
    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("*")
      .not("face_image_url", "is", null)
      .neq("face_image_url", "");

    if (studentsError) {
      throw new Error(`Failed to fetch students: ${studentsError.message}`);
    }

    if (!students || students.length === 0) {
      return new Response(
        JSON.stringify({ matched: false, message: "No registered students with face images found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build a prompt with all registered face URLs for comparison
    const studentDescriptions = students.map(
      (s: any, i: number) => `Student ${i + 1}: Name="${s.name}", ID="${s.id}", Roll="${s.roll_no}", FaceURL="${s.face_image_url}"`
    ).join("\n");

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Use Gemini vision model to compare faces
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a face recognition system. You will be given a captured face image and a list of registered students with their face image URLs. 
Compare the captured face with each registered student's face image.
If you find a match, respond with EXACTLY this JSON format:
{"matched": true, "studentId": "<the student's ID>", "studentName": "<the student's name>", "confidence": <number between 0.85 and 0.99>}

If no match is found, respond with EXACTLY:
{"matched": false, "message": "Face Not Registered"}

IMPORTANT: Only respond with the JSON object, no other text. Be strict - only match if the faces clearly belong to the same person. Consider facial features, face shape, and overall appearance.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Here are the registered students:\n${studentDescriptions}\n\nCompare the captured face image below with each registered student's face image URL above. Determine if the captured face matches any registered student.`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${capturedImageBase64}`
                }
              },
              // Add each student's face image URL
              ...students.filter((s: any) => s.face_image_url).map((s: any) => ({
                type: "image_url" as const,
                image_url: {
                  url: s.face_image_url
                }
              }))
            ]
          }
        ],
        max_tokens: 200,
        temperature: 0.1,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      throw new Error(`AI API error: ${aiResponse.status} ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("No response from AI model");
    }

    // Parse the AI response
    let result;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
    } catch {
      console.error("Failed to parse AI response:", content);
      result = { matched: false, message: "Face verification failed - please try again" };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in verify-face:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
