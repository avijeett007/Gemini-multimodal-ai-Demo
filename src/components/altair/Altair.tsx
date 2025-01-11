/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { type FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { useEffect, useRef, useState, memo } from "react";
import vegaEmbed from "vega-embed";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { ToolCall } from "../../multimodal-live-types";

const declaration: FunctionDeclaration = {
  name: "render_altair",
  description: "Displays an altair graph in json format.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      json_graph: {
        type: SchemaType.STRING,
        description:
          "JSON STRING representation of the graph to render. Must be a string, not a json object",
      },
    },
    required: ["json_graph"],
  },
};

const codeModificationDeclaration: FunctionDeclaration = {
  name: "modify_code",
  description: "Modifies code in a specified file based on instructions.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      file_path: {
        type: SchemaType.STRING,
        description: "Absolute path to the file to be modified",
      },
      modifications: {
        type: SchemaType.STRING,
        description: "The code modifications to be made",
      },
    },
    required: ["file_path", "modifications"],
  },
};

const fetchCodeDeclaration: FunctionDeclaration = {
  name: "fetch_code",
  description: "Fetches code from a specified file path.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      file_path: {
        type: SchemaType.STRING,
        description: "Absolute path to the file to fetch",
      },
    },
    required: ["file_path"],
  },
};

const API_BASE_URL = 'http://localhost:3001/api';

async function fetchFileContent(filePath: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/file?path=${encodeURIComponent(filePath)}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.details || data.error || 'Failed to fetch file content');
  }
  
  return data.content;
}

async function updateFileContent(filePath: string, content: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/file`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ filePath, content }),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.details || data.error || 'Failed to update file content');
  }
}

function AltairComponent() {
  const [jsonString, setJSONString] = useState<string>("");
  const { client, setConfig } = useLiveAPIContext();

  useEffect(() => {
    setConfig({
      model: "models/gemini-2.0-flash-exp",
      generationConfig: {
        responseModalities: "audio",
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
        },
      },
      systemInstruction: {
        parts: [
          {
            text: `You are my helpful assistant. You can:
1. Create graphs using the "render_altair" function when asked.
2. Fetch and modify code files:
   - Use "fetch_code" to read a file's content by providing its absolute path
   - Use "modify_code" to update a file's content by providing its path and modifications
When I share my screen and ask you to modify code:
1. Use fetch_code with the file path I provide
2. Analyze the code and make the requested changes
3. Use modify_code to apply the changes
Don't ask for additional information, just make your best judgment. Before modification, always fetch the latest code and then modify.
You don't need to explain your changes and where you are updating. Just make them and inform when you are done. also when you are updating, make sure you are updating the full code file content not just part of it that needed modifcation.
Again you don't need to explain or apologies too much. Talk less, work more and just inform when done.`,
          },
        ],
      },
      tools: [
        // there is a free-tier quota for search
        { googleSearch: {} },
        { functionDeclarations: [declaration, codeModificationDeclaration, fetchCodeDeclaration] },
      ],
    });
  }, [setConfig]);

  useEffect(() => {
    const onToolCall = async (toolCall: ToolCall) => {
      console.log(`got toolcall`, toolCall);
      
      for (const fc of toolCall.functionCalls) {
        try {
          switch (fc.name) {
            case declaration.name:
              const str = (fc.args as any).json_graph;
              setJSONString(str);
              break;
              
            case fetchCodeDeclaration.name:
              const filePath = (fc.args as any).file_path;
              const content = await fetchFileContent(filePath);
              console.log("Fetched code content:", content);
              break;
              
            case codeModificationDeclaration.name:
              const { file_path, modifications } = fc.args as any;
              await updateFileContent(file_path, modifications);
              console.log("Successfully modified code in:", file_path);
              break;
          }
        } catch (error) {
          console.error("Error handling tool call:", error);
        }
      }

      // send data for the response of your tool call
      // in this case Im just saying it was successful
      if (toolCall.functionCalls.length) {
        setTimeout(
          () =>
            client.sendToolResponse({
              functionResponses: toolCall.functionCalls.map((fc) => ({
                response: { output: { success: true } },
                id: fc.id,
              })),
            }),
          200,
        );
      }
    };
    client.on("toolcall", onToolCall);
    return () => {
      client.off("toolcall", onToolCall);
    };
  }, [client]);

  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (embedRef.current && jsonString) {
      vegaEmbed(embedRef.current, JSON.parse(jsonString));
    }
  }, [embedRef, jsonString]);
  return <div className="vega-embed" ref={embedRef} />;
}

export const Altair = memo(AltairComponent);
