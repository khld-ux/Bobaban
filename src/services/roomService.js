import { supabase } from './supabase';

export const roomService = {
  async createRoom(roomData) {
    const { data, error } = await supabase
      .from('rooms')
      .insert([roomData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getRoom(roomId) {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateRoom(roomId, updates) {
    const { data, error } = await supabase
      .from('rooms')
      .update(updates)
      .eq('id', roomId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteRoom(roomId) {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', roomId);

    if (error) throw error;
  },

  async joinRoom(roomId, userId) {
    const { data, error } = await supabase
      .from('members')
      .insert([{ room_id: roomId, user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async leaveRoom(roomId, userId) {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('room_id', roomId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  async getRoomMembers(roomId) {
    const { data, error } = await supabase
      .from('members')
      .select('*, user:users(id, email, user_metadata)')
      .eq('room_id', roomId);

    if (error) throw error;
    return data;
  },

  async generateInviteLink(roomId) {
    return `${window.location.origin}/room/${roomId}`;
  },
};
