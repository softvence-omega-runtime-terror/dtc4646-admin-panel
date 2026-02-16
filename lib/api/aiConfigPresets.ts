  "use server";

  import { cookies } from "next/headers";

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

  if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_URL_DEV is not defined");

  type AIConfigPresetsResponse = {
    success: boolean;
    message: string;
    data: any;
  };

  type SetPresetPayload = {
    prompt_name: string;
  };

  type SetPresetResponse = {
    success: boolean;
    message: string;
    data: {
      data: {
        message: string;
        active_prompt_name: string;
        active_prompt: string;
      };
    };
  };

  type CreatePromptPayload = {
    name: string;
    content: string;
    activate: boolean;
  };

  type UpdatePromptPayload = {
    name: string;
    content: string;
    activate: boolean;
  };

  type UpdateGlobalAIConfigPayload = {
    provider_id: string;
    model: string;
    prompt_id: string;
  };

  type UpdateGlobalAIConfigResponse = {
    success: boolean;
    message: string;
    data: any;
  };

  export async function getAIConfigPresets(): Promise<any> {
    const cookieStore = await cookies();
    
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
      throw new Error("No authentication token found");
    }

    const res = await fetch(`${BASE_URL}/admin/prompts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch AI config presets: ${res.statusText}`);
    }

    const response: AIConfigPresetsResponse = await res.json();
    
    return response.data;
  }

  // SET AI Config Preset
  export async function setAIConfigPreset(payload: SetPresetPayload): Promise<any> {
    const cookieStore = await cookies();
    
    const authToken = cookieStore.get("auth_token")?.value;
    

    if (!authToken) {
      throw new Error("No authentication token found");
    }

    const res = await fetch(`${BASE_URL}/admin/ai-config-set-preset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });


    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to set AI config preset: ${res.statusText}`);
    }

    const response: SetPresetResponse = await res.json();
    
    return response.data;
  }


  export async function createPrompt(payload: CreatePromptPayload): Promise<any> {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) throw new Error("No authentication token found");

    // ✅ Your backend earlier used FormData in HTML, but your other endpoints accept JSON.
    // If your backend accepts JSON (most likely), keep JSON.
    // If you again see 400, switch to FormData like providers.
    const res = await fetch(`${BASE_URL}/admin/prompts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        name: payload.name.trim(),
        content: payload.content.trim(),
        activate: payload.activate,
      }),
      cache: "no-store",
    });

    const text = await res.text();
    let data: any;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!res.ok) {
      throw new Error(
        `Failed to create prompt: ${res.status} ${res.statusText} - ${text}`
      );
    }

    // return whatever backend returns
    return data;
  }

  export async function deletePrompt(id: string): Promise<any> {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) throw new Error("No authentication token found");
    if (!id) throw new Error("Prompt id is required");

    const res = await fetch(`${BASE_URL}/admin/prompts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      cache: "no-store",
    });

    const text = await res.text();
    let data: any;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!res.ok) {
      throw new Error(
        `Failed to delete prompt: ${res.status} ${res.statusText} - ${text}`
      );
    }

    return data;
  }


  export async function updatePrompt(
    id: string,
    payload: UpdatePromptPayload
  ): Promise<any> {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) throw new Error("No authentication token found");
    if (!id) throw new Error("Prompt id is required");

    const res = await fetch(`${BASE_URL}/admin/prompts/${id}`, {
      method: "PUT", // or PATCH depending on backend
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        name: payload.name.trim(),
        content: payload.content.trim(),
        activate: payload.activate,
      }),
      cache: "no-store",
    });

    const text = await res.text();
    let data: any;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!res.ok) {
      throw new Error(
        `Failed to update prompt: ${res.status} ${res.statusText} - ${text}`
      );
    }

    return data;
  }


  export async function updateGlobalAIConfig(
    payload: UpdateGlobalAIConfigPayload
  ): Promise<UpdateGlobalAIConfigResponse> {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
      throw new Error("No authentication token found");
    }

    console.log("----payload----",payload)

    const res = await fetch(`${BASE_URL}/admin/config`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        provider_id: payload.provider_id,
        model: payload.model,
        prompt_id: payload.prompt_id,
      }),
      cache: "no-store",
    });

    const text = await res.text();

    let data: any;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!res.ok) {
      console.log("--",res)
      throw new Error(
        `Failed to update global AI config: ${res.status} ${res.statusText} - ${text}`
      );
    }

    return data;
  }