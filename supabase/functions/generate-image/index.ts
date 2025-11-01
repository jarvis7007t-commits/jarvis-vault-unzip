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
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      throw new Error('Lovable API key not configured');
    }

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    console.log('Generating image with prompt:', prompt, 'aspectRatio:', aspectRatio);

    // Using Lovable AI Gateway with Nano Banana (Gemini 2.5 Flash Image)
    const response = await fetch(
      'https://ai.gateway.lovable.dev/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [{
            role: "user",
            content: `Generate an image: ${prompt}. Aspect ratio: ${aspectRatio}`
          }],
          modalities: ["image", "text"]
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Lovable AI error:', response.status, error);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a few moments.');
      }
      if (response.status === 402) {
        throw new Error('Credits exhausted. Please add credits to your Lovable workspace.');
      }
      
      throw new Error(`Failed to generate image: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API response received');
    
    // Extract the base64 image from Lovable AI response
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.error('No image data in response');
      throw new Error('No image data received from API');
    }

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
