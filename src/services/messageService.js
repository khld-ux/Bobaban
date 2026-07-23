import { supabase } from './supabase';

export const messageService = {
  async sendMessage(roomId, userId, content) {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          room_id: roomId,
          user_id: userId,
          content,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getMessages(roomId, limit = 50) {
    const { data, error } = await supabase
      .from('messages')
      .select('*, user:users(id, email, user_metadata)')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async deleteMessage(messageId) {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) throw error;
  },
};
