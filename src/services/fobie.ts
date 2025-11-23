const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

const SYSTEM_PROMPT = `Je bent FrappanteFobieGPT, een maker van compleet absurde, surrealistische en overdreven fobieën.
Elke fobie moet uniek, bizar en humoristisch zijn, maar je mag vrij variëren in stijl en invalshoek.

Regels:
- Bedankt 1 nieuwe fobie die niet lijkt op eerdere.
- Gebruik een Nederlandse naam die eindigt op -fobie (mag verzonnen zijn).
- Geef een beschrijving van 2 tot 5 zinnen; de structuur is vrij, maar de toon moet absurdistisch blijven.
- Je mag spelen met vorm: onverwachte metaforen, bizarre symptomen, overdreven logica, surrealistische anekdotes.
- Elke beschrijving moet een duidelijke 'kernangst' bevatten, maar hoe je het invult is aan jou.
- Humorischtisch en absurdistisch, soms wat grof, maar nooit beledigend.

Formaat:
Antwoord ALTIJD in exact dit JSON-formaat zonder markdown:
{
  "naam": "Naam van de fobie",
  "beschrijving": "De beschrijving van de fobie."
}`;

const USER_PROMPT = `Genereer 1 nieuwe, EXTREEM ABSURDE fobie volgens de regels (mag echt of fictief zijn).
Maak het zo grappig, overdreven en absurd mogelijk!
Antwoord ALLEEN in het opgegeven JSON formaat, zonder `;

interface FobieResponse {
  naam: string;
  beschrijving: string;
}

export const fobieService = {
  validateApiKey: (apiKey: string): boolean => {
    if (!apiKey || typeof apiKey !== 'string') {
      return false;
    }
    const trimmed = apiKey.trim();
    return trimmed.length > 30 && /^AIza[a-zA-Z0-9_-]+$/.test(trimmed);
  },

  generateFobie: async (apiKey: string): Promise<FobieResponse> => {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
    const url = `${GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\n${USER_PROMPT}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 2,
        topK: 40,
        topP: 0.95,
        thinkingConfig: {
          thinkingBudget: 0
        }
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_NONE',
        },
      ],
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Gemini API error:', errorData);

        if (response.status === 401) {
          throw new Error('Ongeldige API key. Check je key en probeer opnieuw.');
        } else if (response.status === 429) {
          throw new Error('Te veel requests. Wacht even en probeer opnieuw.');
        } else {
          throw new Error(
            `API fout: ${response.status} - ${errorData.error?.message || 'Onbekende fout'}`
          );
        }
      }

      const data = await response.json();

      if (data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        if (
          candidate.content &&
          candidate.content.parts &&
          candidate.content.parts.length > 0
        ) {
          let text = candidate.content.parts[0].text.trim();

          // Remove markdown code blocks if present
          text = text.replace(/^```json\n?/i, '').replace(/\n?```$/i, '');

          // Try to parse as JSON
          try {
            const parsed = JSON.parse(text);
            if (parsed.naam && parsed.beschrijving) {
              return parsed;
            }
          } catch (parseError) {
            console.error('Failed to parse JSON, trying fallback:', parseError);
            // Fallback: try to extract naam and beschrijving from text
            const naamMatch = text.match(/(?:naam|Naam)["']?\s*:\s*["']([^"']+)["']/);
            const beschrijvingMatch = text.match(/(?:beschrijving|Beschrijving)["']?\s*:\s*["']([^"']+)["']/);

            if (naamMatch && beschrijvingMatch) {
              return {
                naam: naamMatch[1],
                beschrijving: beschrijvingMatch[1]
              };
            }
          }
        }
      }

      throw new Error('Geen fobie gegenereerd. De AI kreeg zelf angst...');
    } catch (error) {
      console.error('Error generating fobie:', error);
      throw error;
    }
  },
};
