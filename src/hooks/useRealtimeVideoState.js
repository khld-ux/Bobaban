import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export const useRealtimeVideoState = (roomId) => {
  const [videoState, setVideoState] = useState({
    videoId: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackRate: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomId) return;

    const fetchVideoState = async () => {
      const { data, error } = await supabase
        .from('video_state')
        .select('*')
        .eq('room_id', roomId)
        .single();

      if (!error && data) {
        setVideoState(data);
      }
      setLoading(false);
    };

    fetchVideoState();

    const channel = supabase
      .channel(`video_state:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'video_state',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setVideoState(payload.new);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [roomId]);

  const updateVideoState = async (updates) => {
    const { error } = await supabase
      .from('video_state')
      .update(updates)
      .eq('room_id', roomId);

    if (!error) {
      setVideoState((prev) => ({ ...prev, ...updates }));
    }
    return !error;
  };

  return { videoState, loading, updateVideoState };
};
