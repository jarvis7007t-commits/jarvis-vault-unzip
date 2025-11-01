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

    console.log('Generating image with prompt:', prompt, 'aspectRatio:', aspectRatio);

    // Using Google's Gemini 2.5 Flash Image model
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            responseModalities: ["IMAGE"],
            imageConfig: {
              aspectRatio: aspectRatio
            }
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
    console.log('API response received:', JSON.stringify(data).substring(0, 200));
    
    // Extract the base64 image from Gemini response
    const imagePart = data.candidates?.[0]?.content?.parts?.find((part: any) => part.inlineData);
    
    if (!imagePart?.inlineData?.data) {
      console.error('No image data in response:', JSON.stringify(data));
      throw new Error('No image data received from API');
    }

    const imageBase64 = imagePart.inlineData.data;
    const mimeType = imagePart.inlineData.mimeType || 'image/png';
    
    // Convert base64 to data URL
    const imageUrl = `data:${mimeType};base64,${imageBase64}`;

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
