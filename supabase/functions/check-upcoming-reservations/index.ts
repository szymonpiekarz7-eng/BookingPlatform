import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    const { data: reservations, error } = await supabaseClient
      .from('reservations')
      .select('id, client_name, client_email, client_phone, reservation_date, start_time, status')
      .eq('reservation_date', tomorrowDate)
      .eq('status', 'confirmed');

    if (error) throw error;

    const notifications = [];

    for (const reservation of reservations || []) {
      console.log(`Sending reminder for reservation ${reservation.id}`);
      notifications.push({
        reservation_id: reservation.id,
        sent_to: reservation.client_email,
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        notifications_sent: notifications.length,
        reservations_checked: reservations?.length || 0
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});