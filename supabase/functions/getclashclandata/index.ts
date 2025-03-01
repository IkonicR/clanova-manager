
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Define CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Clash of Clans API configuration
const apiToken = Deno.env.get("CLASH_OF_CLANS_API_TOKEN");
const apiBaseUrl = "https://api.clashofclans.com/v1";

serve(async (req) => {
  console.log("Function invoked:", req.url);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request for CORS");
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    // Check if API token is available
    if (!apiToken) {
      console.error("Missing CLASH_OF_CLANS_API_TOKEN environment variable");
      return new Response(
        JSON.stringify({ error: "API configuration error" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }

    // Parse request body
    const { clanTag } = await req.json();
    console.log("Request received for clan tag:", clanTag);
    
    if (!clanTag) {
      console.error("Missing clanTag in request body");
      return new Response(
        JSON.stringify({ error: "Clan tag is required" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    // Ensure clan tag is properly URL encoded
    const encodedTag = encodeURIComponent(clanTag);
    const url = `${apiBaseUrl}/clans/${encodedTag}`;
    
    console.log("Fetching clan data from CoC API:", url);
    
    // Call Clash of Clans API
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Accept": "application/json"
      }
    });
    
    console.log("CoC API response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error("CoC API error:", errorData);
      
      return new Response(
        JSON.stringify({ 
          error: "Failed to fetch clan data", 
          details: errorData,
          status: response.status 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: response.status 
        }
      );
    }
    
    // Parse and return clan data
    const clanData = await response.json();
    console.log("Successfully fetched clan data");
    
    return new Response(
      JSON.stringify(clanData),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
