
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the clan tag from the request
    const { clanTag } = await req.json();
    
    if (!clanTag) {
      return new Response(
        JSON.stringify({ error: 'Clan tag is required' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      );
    }

    // Encode the clan tag for the URL
    const encodedClanTag = encodeURIComponent(clanTag);
    
    // Get the API key from environment variables
    const apiKey = Deno.env.get('CLASH_OF_CLANS_API_TOKEN');
    
    if (!apiKey) {
      console.error('CLASH_OF_CLANS_API_TOKEN is not set');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      );
    }

    console.log(`Fetching clan data for tag: ${clanTag}`);
    
    // Make the request to the Clash of Clans API through the proxy
    const response = await fetch(
      `https://cocproxy.royaleapi.dev/v1/clans/${encodedClanTag}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error from CoC API:', errorData);
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch clan data', 
          details: errorData,
          status: response.status 
        }),
        { 
          status: response.status, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      );
    }

    const data = await response.json();
    console.log('Successfully fetched clan data');
    
    // Return the clan data
    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error('Error in getclashclandata function:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  }
});
