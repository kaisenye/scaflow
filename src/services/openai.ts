import OpenAI from 'openai';

// Initialize the OpenAI client
// In a production environment, this key should be securely stored in environment variables
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Only for client-side usage in this demo
});

export interface ColumnConfig {
  index: number;
  name: string;
  prompt: string;
  type: string;
  categories?: { name: string; color: string }[];
}

export interface RowAnalysisParams {
  imageFile: File;
  columns: ColumnConfig[];
}

export interface ColumnResult {
  index: number;
  content: string;
  error?: string;
}

export interface RowAnalysisResult {
  results: ColumnResult[];
  error?: string;
}

/**
 * Analyzes an image using OpenAI's Vision model and extracts information
 * for multiple columns in a single API call
 */
export async function analyzeImageRow(params: RowAnalysisParams): Promise<RowAnalysisResult> {
  const { imageFile, columns } = params;
  
  try {
    // Convert the file to base64
    const base64Image = await fileToBase64(imageFile);
    
    // Build a structured prompt that includes instructions for each column
    const promptText = buildJSONPrompt(columns);
    
    // Make the API call
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: promptText },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              }
            }
          ]
        }
      ],
      max_tokens: 1500
    });
    
    const content = response.choices[0]?.message.content || "{}";
    
    // Parse the JSON response
    return parseJSONResponse(content, columns);
  } catch (error) {
    console.error("Error analyzing image:", error);
    return {
      results: [],
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

/**
 * Build a structured prompt that requests JSON output
 */
function buildJSONPrompt(columns: ColumnConfig[]): string {
  let prompt = "Analyze this image and extract the following information. You must respond with a valid JSON object containing each analyzed field:\n\n";
  
  columns.forEach((column, index) => {
    let columnPrompt = `Field ${index + 1}: "${column.name}" - ${column.prompt}`;
    
    // Add type-specific instructions
    switch (column.type) {
      case 'number':
        columnPrompt += " Return ONLY the number without any additional text.";
        break;
      case 'timestamp':
        columnPrompt += " If you find a date or time, format it as YYYY-MM-DD HH:MM:SS. If only a date is visible, format as YYYY-MM-DD.";
        break;
      case 'singleSelect':
        if (column.categories && column.categories.length > 0) {
          const categoryNames = column.categories.map(cat => cat.name).join(', ');
          columnPrompt += ` IMPORTANT: Only use these categories: ${categoryNames}. Do not create new categories.`;
        } else {
          columnPrompt += " Provide a single category or label, preferably a single word or short phrase.";
        }
        break;
      case 'multiSelect':
        if (column.categories && column.categories.length > 0) {
          const categoryNames = column.categories.map(cat => cat.name).join(', ');
          columnPrompt += ` IMPORTANT: Only use these categories: ${categoryNames}. Do not create new categories. You may select multiple comma-separated values.`;
        } else {
          columnPrompt += " Provide multiple categories or labels, separated by commas.";
        }
        break;
    }
    
    prompt += columnPrompt + "\n";
  });
  
  prompt += "\nFormat your response as a JSON object with the following structure:";
  prompt += "\n{\n";
  
  columns.forEach(column => {
    prompt += `  "${column.name}": "The extracted value",\n`;
  });
  
  prompt += "}\n";
  prompt += "\nDo not include any explanation or anything other than the JSON object.";
  
  return prompt;
}

/**
 * Parse the JSON response and map it to column results
 */
function parseJSONResponse(content: string, columns: ColumnConfig[]): RowAnalysisResult {
  const results: ColumnResult[] = [];
  
  try {
    // Parse the JSON response
    const parsedData = JSON.parse(content);
    
    // Map the JSON fields to column results
    columns.forEach(column => {
      const fieldValue = parsedData[column.name];
      results.push({
        index: column.index,
        content: fieldValue !== undefined ? String(fieldValue) : ""
      });
    });
    
    return { results };
  } catch (error) {
    console.error("Error parsing JSON response:", error, content);
    
    // If JSON parsing fails, return empty results for all columns
    columns.forEach(column => {
      results.push({
        index: column.index,
        content: "",
        error: "Failed to parse response"
      });
    });
    
    return { 
      results,
      error: "Failed to parse JSON response from OpenAI API"
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

// Keep for compatibility with existing code
export interface ImageAnalysisParams {
  imageFile: File;
  prompt: string;
  type: string;
}

export interface ImageAnalysisResult {
  content: string;
  error?: string;
}

export async function analyzeImage(params: ImageAnalysisParams): Promise<ImageAnalysisResult> {
  const { imageFile, prompt, type } = params;
  const columns: ColumnConfig[] = [
    { index: 0, name: "Result", prompt, type }
  ];
  
  const result = await analyzeImageRow({ imageFile, columns });
  
  if (result.error) {
    return { content: "", error: result.error };
  }
  
  if (result.results.length > 0) {
    return { content: result.results[0].content };
  }
  
  return { content: "" };
}

export default {
  analyzeImage,
  analyzeImageRow
}; 