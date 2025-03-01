
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CLASH_API_URL = "https://cocproxy.royaleapi.dev/v1";
const API_KEY = Deno.env.get("CLASH_OF_CLANS_API_TOKEN") || "";

interface RequestBody {
  playerTag: string;
}

serve(async (req) => {
  try {
    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
        status: 204,
      });
    }

    // Parse request body
    const { playerTag } = await req.json() as RequestBody;
    
    if (!playerTag) {
      return new Response(
        JSON.stringify({ error: "Player tag is required" }),
        {
          headers: { "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

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
      console.error(`CoC API Error: ${playerResponse.status}`);
      return new Response(
        JSON.stringify({ 
          error: "Unable to fetch player data",
          details: await playerResponse.text()
        }),
        {
          headers: { "Content-Type": "application/json" },
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

    return new Response(
      JSON.stringify(responseData),
      {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
