import { XMLParser } from 'fast-xml-parser';

// získání kanálu RSS - a pak převod na JSON
export async function fetchRSSChannel(url) {
    try {
        console.log("Fetching RSS channel from: ", url);
        
        // kontrola URL
        if (!url.startsWith('http')) {
            throw new Error(`Invalid URL: ${url}`);
        }
        
        
        const response = await fetch(url);
        
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        console.log("RSS response length:", text.length);
        
        if (!text || text.trim().length === 0) {
            throw new Error("Empty RSS response");
        }
        
        const parser = new XMLParser();
        const json = parser.parse(text);
        
        if (!json.rss || !json.rss.channel) {
            console.log("Invalid RSS format:", json);
            throw new Error("Invalid RSS format");
        }
        
        console.log("RSS channel title:", json.rss.channel.title);
        console.log("RSS items count:", json.rss.channel.item?.length || 0);
        
        return json;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error("RSS request timeout for:", url);
            throw new Error("Request timeout");
        }
        console.error("Error fetching RSS from:", url, error);
        throw error;
    }
}

export async function updateFeed() {
    return ("pass")
}