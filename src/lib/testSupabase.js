
import { supabase } from './supabase.js';

export async function testSupabaseConnection() {
  const { data, error } = await supabase
    .from('nms_records')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error al conectar con Supabase:', error.message);
    return { success: false, message: error.message };
  }

  console.log('Supabase responde correctamente.', data);
  return { success: true, message: 'Conexión con la tabla correcta.' };
}
