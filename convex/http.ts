import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

const http = httpRouter();

// Health check endpoint
http.route({
  path: "/health",
  method: "GET",
  handler: httpAction(async () => {
    return new Response(JSON.stringify({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      service: "web-agency-workflow"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// API endpoints for external integrations
http.route({
  path: "/api/webhook",
  method: "POST", 
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    
    // Handle webhook events (payments, client updates, etc.)
    console.log("Webhook received:", body);
    
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// Client portal API endpoint
http.route({
  path: "/api/client-portal/:clientId",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const clientIdString = url.pathname.split("/").pop();
    
    if (!clientIdString) {
      return new Response(JSON.stringify({ error: "Client ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    try {
      // Fetch client data - clientIdString is guaranteed to be string here
      const client = await ctx.runQuery(api.clients.getClient, { 
        id: clientIdString as Id<"clients"> 
      });
      
      if (!client) {
        return new Response(JSON.stringify({ error: "Client not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify(client), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Invalid client ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

// Analytics API endpoint
http.route({
  path: "/api/analytics",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    
    // Define valid analytics types
    const validTypes = ["project_completed", "client_acquired", "lead_converted", "revenue_generated"] as const;
    type ValidAnalyticsType = typeof validTypes[number];
    
    let data;
    if (type && validTypes.includes(type as ValidAnalyticsType)) {
      data = await ctx.runQuery(api.analytics.getAnalyticsByType, { 
        type: type as ValidAnalyticsType
      });
    } else {
      data = await ctx.runQuery(api.analytics.getAnalytics, {});
    }
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }),
});

export default http;