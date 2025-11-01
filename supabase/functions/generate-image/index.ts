import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { prompt, aspectRatio = "1:1" } = await req.json();
    const apiKey = Deno.env.get('GOOGLE_TTS_API_KEY');

    if (!apiKey) {
      throw new Error('Google API key not configured');
    }

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    // Using Google's Imagen AI API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [{
            prompt: prompt,
          }],
          parameters: {
            sampleCount: 1,
            aspectRatio: aspectRatio,
            negativePrompt: "low quality, blurry, distorted",
            safetyFilterLevel: "block_some",
          }
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Imagen API error:', error);
      throw new Error(`Failed to generate image: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract the base64 image from the response
    const imageBase64 = data.predictions?.[0]?.bytesBase64Encoded;
    
    if (!imageBase64) {
      throw new Error('No image data received from API');
    }

    // Convert base64 to data URL
    const imageUrl = `data:image/png;base64,${imageBase64}`;

    return new Response(
      JSON.stringify({ imageUrl }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in generate-image function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate image';
    return new Response(
      JSON.stringify({ 
        error: errorMessage
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
