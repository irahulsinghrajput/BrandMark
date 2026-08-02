import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import * as Sentry from '@sentry/react';
import toast from 'react-hot-toast';

// 1. Live Team Chat Hook
export const useRealtimeChat = (channelId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!channelId) return;

    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('team_messages')
          .select('*')
          .eq('channel_id', channelId)
          .order('created_at', { ascending: true })
          .limit(50);

        if (fetchError) throw fetchError;
        setMessages(data || []);
      } catch (err) {
        setError(err);
        Sentry.captureException(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`chat_${channelId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'team_messages', filter: `channel_id=eq.${channelId}` }, 
        (payload) => {
          setMessages(prev => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [channelId]);

  const sendMessage = async (content, senderId) => {
    // Optimistic UI update could be added here
    try {
      const { error } = await supabase.from('team_messages').insert([{
        channel_id: channelId,
        content,
        sender_id: senderId
      }]);
      if (error) throw error;
    } catch (err) {
      toast.error('Failed to send message');
      Sentry.captureException(err);
    }
  };

  return { messages, loading, error, sendMessage };
};


// 2. Notifications Hook
export const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchNotifs = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);
      if (data) setNotifications(data);
    };

    fetchNotifs();

    const subscription = supabase
      .channel(`notifs_${userId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
          toast('New Notification: ' + payload.new.message, { icon: '🔔' });
        }
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, [userId]);

  return { notifications };
};


// 3. Activity Feed Hook
export const useActivityFeed = () => {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const fetchFeed = async () => {
      const { data } = await supabase
        .from('activity_feed')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (data) setFeed(data);
    };

    fetchFeed();

    const subscription = supabase
      .channel('public_activity_feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_feed' },
        (payload) => {
          setFeed(prev => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  return { feed };
};


// 4. Presence Hook (Typing/Online Status)
export const usePresence = (channelId, userId, userInfo) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  useEffect(() => {
    if (!channelId || !userId) return;

    const channel = supabase.channel(`presence_${channelId}`, {
      config: { presence: { key: userId } }
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users = Object.keys(state).map(key => state[key][0]);
        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user: userId, online_at: new Date().toISOString(), ...userInfo });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId, userId]);

  return { onlineUsers };
};


// 5. Realtime Dashboard Hook (KPIs)
export const useRealtimeDashboard = (viewName) => {
  const [kpis, setKpis] = useState(null);

  useEffect(() => {
    const fetchKpis = async () => {
      const { data } = await supabase.from(viewName).select('*').single();
      if (data) setKpis(data);
    };
    
    fetchKpis();

    // Dashboards usually rely on table changes, so we subscribe to the underlying tables, 
    // or use a cron that pushes updates. For this demo, we refetch on any system_events insert.
    const subscription = supabase
      .channel(`dash_${viewName}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'system_events' },
        () => {
          fetchKpis();
        }
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, [viewName]);

  return { kpis };
};
