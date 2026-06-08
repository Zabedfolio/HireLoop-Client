


const baseurl = process.env.NEXT_PUBLIC_BASE_URL;



export const serverMutation = async (path, data) => {
    const res = await fetch(`${baseurl}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });


    // handle 401,404,

    return res.json();
};