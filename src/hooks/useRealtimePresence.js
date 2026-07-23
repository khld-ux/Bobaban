import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export const useRealtimePresence = (roomId) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomId) return;

    const channel = supabase.channel(`presence:${roomId}`);

    const subscription = channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const userList = Object.values(state)
          .flat()
          .map((presence) => presence.user);
        setMembers(userList);
        setLoading(false);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        setMembers((prev) => [
          ...prev,
          ...newPresences.map((p) => p.user),
        ]);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        setMembers((prev) =>
          prev.filter(
            (member) =>
              !leftPresences.some((p) => p.user.id === member.id)
          )
        );
      })
      .subscribe();

    return () => {
      subscription?.unsubscribe();
    };
  }, [roomId]);

  return { members, loading };
};
