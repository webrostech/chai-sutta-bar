import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Get the authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create admin client for database operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Create user client to get current user
    const supabaseUser = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get current user
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { qr_code, user_latitude, user_longitude } = await req.json();

    console.log(`[QR Verify] User ${user.id} scanning QR: ${qr_code}`);
    console.log(`[QR Verify] User location: ${user_latitude}, ${user_longitude}`);

    // Validate required fields
    if (!qr_code) {
      return new Response(
        JSON.stringify({ success: false, error: "QR code is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Find outlet by QR code
    const { data: outlet, error: outletError } = await supabaseAdmin
      .from("outlets")
      .select("*")
      .eq("qr_code", qr_code)
      .maybeSingle();

    if (outletError || !outlet) {
      console.log(`[QR Verify] Outlet not found for QR: ${qr_code}`);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid QR code" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!outlet.is_open) {
      return new Response(
        JSON.stringify({ success: false, error: "This outlet is currently closed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check location if provided (within 500m of outlet)
    let verified_location = false;
    const MAX_DISTANCE_KM = 0.5; // 500 meters

    if (user_latitude && user_longitude) {
      const distance = calculateDistance(
        user_latitude,
        user_longitude,
        outlet.latitude,
        outlet.longitude
      );
      console.log(`[QR Verify] Distance from outlet: ${distance.toFixed(3)} km`);
      verified_location = distance <= MAX_DISTANCE_KM;
    }

    // Check for recent visits (anti-abuse: minimum 6 hours between visits)
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
    const { data: recentVisits, error: visitError } = await supabaseAdmin
      .from("visits")
      .select("id, created_at")
      .eq("user_id", user.id)
      .gte("created_at", sixHoursAgo)
      .limit(1);

    if (visitError) {
      console.error(`[QR Verify] Error checking recent visits: ${visitError.message}`);
    }

    if (recentVisits && recentVisits.length > 0) {
      const lastVisit = new Date(recentVisits[0].created_at);
      const nextAllowed = new Date(lastVisit.getTime() + 6 * 60 * 60 * 1000);
      console.log(`[QR Verify] User has recent visit, next allowed: ${nextAllowed.toISOString()}`);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "You can only check in once every 6 hours",
          next_allowed_at: nextAllowed.toISOString()
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate credits (base 10, bonus for location verification)
    const baseCredits = 10;
    const locationBonus = verified_location ? 5 : 0;
    const totalCredits = baseCredits + locationBonus;

    // Record the visit
    const { data: visit, error: insertError } = await supabaseAdmin
      .from("visits")
      .insert({
        user_id: user.id,
        outlet_id: outlet.id,
        credits_earned: totalCredits,
        verified_location,
        user_latitude,
        user_longitude
      })
      .select()
      .single();

    if (insertError) {
      console.error(`[QR Verify] Error inserting visit: ${insertError.message}`);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to record visit" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get updated profile
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    console.log(`[QR Verify] Success! Visit recorded, ${totalCredits} credits earned`);

    return new Response(
      JSON.stringify({
        success: true,
        visit,
        outlet: {
          id: outlet.id,
          name: outlet.name,
          address: outlet.address,
          city: outlet.city
        },
        credits_earned: totalCredits,
        location_verified: verified_location,
        location_bonus: locationBonus,
        profile
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[QR Verify] Error: ${errorMessage}`);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
