import { NextResponse } from "next/server"

// DeepInfra API endpoint - using the chat completions format
const DEEPINFRA_API_ENDPOINT = "https://api.deepinfra.com/v1/openai/chat/completions"

export async function POST(req: Request) {
  try {
    console.log("API route called")

    // Check if API key exists
    const apiKey = process.env.DEEPINFRA_API_KEY
    if (!apiKey) {
      console.error("DEEPINFRA_API_KEY not found in environment variables")
      return NextResponse.json({ error: "DeepInfra API key not configured" }, { status: 500 })
    }

    console.log("DeepInfra API key found, length:", apiKey.length)

    const { messages } = await req.json()
    console.log("Received messages:", messages.length)

    // Add system message for fitness focus
    const systemMessage = {
      role: "system",
      content: `You are an AI fitness coach and gym buddy focused on physical well-being. Provide evidence-based fitness and nutrition advice, be motivational and supportive, and suggest appropriate exercises based on user's goals and fitness level. Keep your responses concise and practical.`,
    }

    // Create messages array with system message
    const messagesWithSystem = messages.some((m) => m.role === "system") ? messages : [systemMessage, ...messages]

    console.log("Calling DeepInfra API...")

    // Format the request for DeepInfra's OpenAI-compatible endpoint
    const payload = {
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: messagesWithSystem,
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 0.9,
      stream: false,
    }

    console.log("Payload:", JSON.stringify(payload, null, 2))

    // Call DeepInfra API
    const response = await fetch(DEEPINFRA_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    console.log("DeepInfra API response status:", response.status)
    console.log("Response headers:", Object.fromEntries(response.headers.entries()))

    // Get response text first for debugging
    const responseText = await response.text()
    console.log("Raw response:", responseText)

    // Check if response is OK
    if (!response.ok) {
      console.error("DeepInfra API error details:", {
        status: response.status,
        statusText: response.statusText,
        body: responseText,
      })

      // Handle specific error cases
      if (response.status === 401) {
        return NextResponse.json(
          {
            error: "Invalid DeepInfra API key. Please check your API key configuration.",
            details: responseText,
          },
          { status: 401 },
        )
      }

      if (response.status === 400) {
        return NextResponse.json(
          {
            error: "Bad request to DeepInfra API. Please check the request format.",
            details: responseText,
          },
          { status: 400 },
        )
      }

      return NextResponse.json(
        {
          error: `DeepInfra API error: ${response.status} - ${response.statusText}`,
          details: responseText,
        },
        { status: response.status },
      )
    }

    // Parse response as JSON
    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("JSON parse error:", parseError)
      return NextResponse.json({ error: "Failed to parse DeepInfra response" }, { status: 500 })
    }

    console.log("DeepInfra response received successfully:", data)

    // Extract the response - using OpenAI-compatible format
    let content = ""
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      content = data.choices[0].message.content
    } else {
      console.error("Unexpected DeepInfra response structure:", data)
      return NextResponse.json(
        {
          error: "Unexpected response from DeepInfra",
          response: data,
        },
        { status: 500 },
      )
    }

    // Return the assistant's message
    return NextResponse.json({
      message: content,
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json(
      {
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

// Add a simple GET endpoint to test API key and connection
export async function GET() {
  const apiKey = process.env.DEEPINFRA_API_KEY

  // Test the API key with a simple request
  if (apiKey) {
    try {
      const testResponse = await fetch("https://api.deepinfra.com/v1/openai/models", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })

      const isValid = testResponse.ok
      const responseText = await testResponse.text()

      return NextResponse.json({
        provider: "DeepInfra",
        model: "Mixtral-8x7B-Instruct-v0.1",
        hasApiKey: !!apiKey,
        keyLength: apiKey?.length || 0,
        keyPreview: apiKey ? apiKey.substring(0, 8) + "..." : "Not found",
        keyValid: isValid,
        testResponse: isValid ? "API key is valid" : responseText,
        envVars: Object.keys(process.env).filter((key) => key.includes("DEEPINFRA")),
      })
    } catch (error) {
      return NextResponse.json({
        provider: "DeepInfra",
        model: "Mixtral-8x7B-Instruct-v0.1",
        hasApiKey: !!apiKey,
        keyLength: apiKey?.length || 0,
        keyPreview: apiKey ? apiKey.substring(0, 8) + "..." : "Not found",
        keyValid: false,
        testResponse: `Error testing API key: ${error}`,
        envVars: Object.keys(process.env).filter((key) => key.includes("DEEPINFRA")),
      })
    }
  }

  return NextResponse.json({
    provider: "DeepInfra",
    model: "Mixtral-8x7B-Instruct-v0.1",
    hasApiKey: false,
    keyLength: 0,
    keyPreview: "Not found",
    keyValid: false,
    testResponse: "No API key provided",
    envVars: Object.keys(process.env).filter((key) => key.includes("DEEPINFRA")),
  })
}
