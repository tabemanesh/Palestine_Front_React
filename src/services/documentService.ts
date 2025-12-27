import apiClient from "../utilz/apiClient";




export const uploadFile = async ( file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('Img', file);

  const response = await apiClient.post("General/upload-document", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data; 
};


export const getDailyHadith = async (): Promise<Hadith> => {
  try {
    const response = await apiClient.get<Hadith>("General/daily-hadith", {
      headers: {
        "Cache-Control": "no-cache", // برای جلوگیری از 304
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching hadith:", error);
    throw error;
  }
};


export interface HadithResult {
  person: string;
  text: string;
  source: string;
}

export interface Hadith {
  ok: boolean;
  result: HadithResult;
}