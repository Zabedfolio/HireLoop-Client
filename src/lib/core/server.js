


const baseurl = process.env.NEXT_PUBLIC_BASE_URL;

export const serverFetch = async (path) => {
    const res = await fetch(`${baseurl}${path}`);
    const text = await res.text();

    if (!res.ok) {
        if (!text) {
            return null;
        }
        try {
            return JSON.parse(text);
        } catch {
            return null;
        }
    }

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch (error) {
        console.error('serverFetch JSON parse error:', error, text);
        return null;
    }
};

export const serverMutation = async (path, data, method = 'POST') => {
    const res = await fetch(`${baseurl}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    const text = await res.text();

    if (!res.ok) {
        console.error('serverMutation error:', res.status, text);
        throw new Error(text || `Request failed with status ${res.status}`);
    }

    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch (error) {
        console.error('serverMutation JSON parse error:', error, text);
        return null;
    }
};