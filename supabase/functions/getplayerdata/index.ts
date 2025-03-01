
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CLASH_API_URL = "https://cocproxy.royaleapi.dev/v1";
const API_KEY = Deno.env.get("CLASH_OF_CLANS_API_TOKEN") || "";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  playerTag: string;
}

serve(async (req) => {
  console.log("Edge function getplayerdata called");
  
  try {
    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
        status: 204,
      });
    }

    // Parse request body
    const { playerTag } = await req.json() as RequestBody;
    
    if (!playerTag) {
      console.error("Missing player tag");
      return new Response(
        JSON.stringify({ error: "Player tag is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log(`Fetching player data for tag: ${playerTag}`);

    // Format player tag correctly (replace # if present)
    const formattedTag = playerTag.startsWith("#") 
      ? playerTag.substring(1) 
      : playerTag;

    // Fetch player data from Clash of Clans API
    const playerResponse = await fetch(
      `${CLASH_API_URL}/players/%23${formattedTag}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!playerResponse.ok) {
      const responseText = await playerResponse.text();
      console.error(`CoC API Error: ${playerResponse.status}, ${responseText}`);
      return new Response(
        JSON.stringify({ 
          error: "Unable to fetch player data",
          details: responseText,
          status: playerResponse.status
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: playerResponse.status,
        }
      );
    }

    const playerData = await playerResponse.json();
    
    // Extract relevant data
    const responseData = {
      name: playerData.name,
      playerTag: `#${formattedTag}`,
      townHallLevel: playerData.townHallLevel,
      trophies: playerData.trophies,
      clanTag: playerData.clan?.tag || null,
      clanName: playerData.clan?.name || null,
      clanRole: playerData.role || null,
    };

    console.log(`Successfully fetched data for player: ${responseData.name}`);

    return new Response(
      JSON.stringify(responseData),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(error) }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
