import OpenAI from 'openai';

// Initialize the OpenAI client
// In a production environment, this key should be securely stored in environment variables
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Only for client-side usage in this demo
});

export interface ImageAnalysisParams {
  imageFile: File;
  prompt: string;
  type: string;
}

export interface ImageAnalysisResult {
  content: string;
  error?: string;
}

/**
 * Analyzes an image using OpenAI's Vision model and extracts information
 * based on the provided prompt and expected data type
 */
export async function analyzeImage(params: ImageAnalysisParams): Promise<ImageAnalysisResult> {
  const { imageFile, prompt, type } = params;
  
  try {
    // Convert the file to base64
    const base64Image = await fileToBase64(imageFile);
    
    // Build the system message based on the column type
    const promptText = getPromptForType(type, prompt);
    
    // Make the API call
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: promptText },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    });
    
    return {
      content: response.choices[0]?.message.content || "No response generated"
    };
  } catch (error) {
    console.error("Error analyzing image:", error);
    return {
      content: "",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

/**
 * Helper function to convert a File to base64
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Extract the base64 part from the data URL
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Helper function to generate a prompt based on the column type
 */
function getPromptForType(type: string, prompt: string): string {
  const fixedPrompt = `Only extract the value as prompted, do not include any additional text or formatting.` +
    `If you cannot find the value, return 'NOT FOUND'.`;

  const promptText = `${prompt} ${fixedPrompt}`;

  // Add type-specific instructions
  switch (type) {
    case 'text':
      return `$ User's Request: ${promptText} Format: Please provide your answer as plain text.`;
    
    case 'number':
      return `$ User's Request: ${promptText} Format: Extract or calculate a numerical value from the image. Return ONLY the number without any additional text.`;
    
    case 'timestamp':
      return `$ User's Request: ${promptText} Format: If you find a date or time, format it as YYYY-MM-DD HH:MM:SS. If only a date is visible, format as YYYY-MM-DD. Return ONLY the formatted date/time without any additional text.`;
    
    case 'singleSelect':
      return `$ User's Request: ${promptText} Format: Provide a single category or label that best represents what's in the image. Keep it concise, preferably a single word or short phrase.`;
    
    case 'multiSelect':
      return `$ User's Request: ${promptText} Format: Provide multiple categories or labels that describe what's in the image, separated by commas.`;
    
    default:
      return `$ User's Request: ${promptText} Format: Please provide your answer as plain text.`;
  }
}

export default {
  analyzeImage
}; 