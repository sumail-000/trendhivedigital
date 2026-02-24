export async function onRequestPost({ request, env }) {
    try {
        const formData = await request.formData();
        const data = Object.fromEntries(formData);

        const { name, email, company, service, message } = data;

        // Check if required fields exist
        if (!name || !email || !message) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // These environment variables will be injected by Cloudflare
        const mailgunDomain = env.MAILGUN_DOMAIN;
        const mailgunApiKey = env.MAILGUN_API_KEY;
        const toEmail = "trendhivedigital@outlook.com"; // Your receiving email

        if (!mailgunDomain || !mailgunApiKey) {
            return new Response(JSON.stringify({ error: "Server configuration missing API keys" }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Construct Mailgun request
        const body = new URLSearchParams({
            from: `TrendHive Digital Website <no-reply@${mailgunDomain}>`,
            to: toEmail,
            subject: `New Lead: ${name} from ${company || 'No Company'}`,
            text: `You have a new lead from the TrendHive Digital website.

Name: ${name}
Email: ${email}
Company: ${company || 'N/A'}
Service Interested In: ${service || 'Not Selected'}

Message:
${message}
      `,
            'h:Reply-To': email // This lets you hit "Reply" in Outlook and email the client directly
        });

        const response = await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
            method: "POST",
            headers: {
                "Authorization": "Basic " + btoa(`api:${mailgunApiKey}`),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: body.toString()
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error("Mailgun Error: " + err);
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
