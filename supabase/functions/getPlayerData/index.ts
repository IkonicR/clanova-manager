
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { playerTag } = await req.json();
    
    if (!playerTag) {
      return new Response(
        JSON.stringify({ error: "Player tag is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Format the player tag correctly - ensure it has a # at the beginning
    const formattedTag = playerTag.startsWith("#") ? playerTag : `#${playerTag}`;
    
    // Encode the player tag for the URL
    const encodedTag = encodeURIComponent(formattedTag);
    
    const apiToken = Deno.env.get("CLASH_OF_CLANS_API_TOKEN");
    
    if (!apiToken) {
      return new Response(
        JSON.stringify({ error: "API token not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    console.log(`Fetching player data for tag: ${formattedTag}`);
    
    // Make request to the proxy API
    const apiUrl = `https://cocproxy.royaleapi.dev/v1/players/${encodedTag}`;
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });
    
    console.log(`API response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error: ${errorText}`);
      return new Response(
        JSON.stringify({ error: `Failed to fetch player data: ${response.statusText}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: response.status }
      );
    }
    
    const playerData = await response.json();
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    return new Response(
      JSON.stringify({ 
        player: playerData,
        clanTag: playerData.clan?.tag || null,
        clanName: playerData.clan?.name || null,
        clanRole: playerData.role || null,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
