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

// 6. Team Directory Hook
export const useTeamDirectory = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase.from('team_members').select('*').order('name');
        if (error) throw error;
        
        if (data && data.length > 0) {
          setMembers(data);
        } else {
          // Fallback demo data
          setMembers([
            { name: 'Rahul Rajput', role: 'Founder & CEO', status: 'online', avatar: 'RR' },
            { name: 'Priya Sharma', role: 'Head of SEO', status: 'online', avatar: 'PS' },
            { name: 'Amit Kumar', role: 'Sales Lead', status: 'away', avatar: 'AK' },
            { name: 'Neha Gupta', role: 'Content Strategist', status: 'offline', avatar: 'NG' }
          ]);
        }
      } catch (err) {
        Sentry.captureException(err);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMembers();
    
    const sub = supabase.channel('team_members_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, () => fetchMembers())
      .subscribe();
      
    return () => supabase.removeChannel(sub);
  }, []);

  return { members, loading };
};

// 7. Wiki Pages Hook
export const useWikiPages = () => {
  const [pages, setPages] = useState([]);
  
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const { data, error } = await supabase.from('wiki_pages').select('*').order('updated_at', { ascending: false });
        if (error) throw error;
        
        if (data && data.length > 0) {
          setPages(data);
        } else {
          // Fallback demo data
          setPages([
            { id: 1, title: 'Client Onboarding SOP', updated_at: new Date().toISOString(), author: 'Rahul Rajput' },
            { id: 2, title: 'SEO Pricing Guidelines 2026', updated_at: new Date().toISOString(), author: 'Rahul Rajput' }
          ]);
        }
      } catch (err) {
        Sentry.captureException(err);
      }
    };
    
    fetchPages();
    
    const sub = supabase.channel('wiki_pages_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wiki_pages' }, () => fetchPages())
      .subscribe();
      
    return () => supabase.removeChannel(sub);
  }, []);

  return { pages };
};

// 8. Client Portal Data Hook
export const useClientPortalData = (clientId) => {
  const [data, setData] = useState({
    project: null,
    invoices: [],
    documents: [],
    tickets: [],
    milestones: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;

    const fetchPortalData = async () => {
      try {
        const [
          { data: projectData },
          { data: invoicesData },
          { data: docsData },
          { data: ticketsData },
          { data: milestonesData }
        ] = await Promise.all([
          supabase.from('client_projects').select('*').eq('client_id', clientId).single(),
          supabase.from('client_invoices').select('*').eq('client_id', clientId).order('created_at', { ascending: false }),
          supabase.from('client_documents').select('*').eq('client_id', clientId).order('created_at', { ascending: false }),
          supabase.from('client_tickets').select('*').eq('client_id', clientId).order('created_at', { ascending: false }),
          supabase.from('project_milestones').select('*').eq('client_id', clientId).order('due_date', { ascending: true })
        ]);

        setData({
          project: projectData || { name: 'Acme Corp - Q2 Retainer', status: 'Active', progress: 65, next_meeting: 'Tommorrow, 2:00 PM EST' },
          invoices: invoicesData || [
            { id: 'INV-2026-042', amount: '₹25,000', status: 'paid', date: 'May 01, 2026' },
            { id: 'INV-2026-056', amount: '₹25,000', status: 'pending', date: 'Jun 01, 2026' }
          ],
          documents: docsData || [
            { id: 1, name: 'Brand_Guidelines_v2.pdf', size: '2.4 MB', date: '2 days ago' },
            { id: 2, name: 'Q1_Performance_Report.pdf', size: '4.1 MB', date: '1 week ago' }
          ],
          tickets: ticketsData || [
            { id: 'TKT-892', title: 'Update homepage banner', status: 'open', updated: '2 hours ago' },
            { id: 'TKT-845', title: 'Analytics access issue', status: 'resolved', updated: '4 days ago' }
          ],
          milestones: milestonesData || [
            { id: 1, title: 'Technical SEO Audit', status: 'completed', date: 'May 10' },
            { id: 2, title: 'Content Strategy Approval', status: 'pending', date: 'May 18' },
            { id: 3, title: 'Link Building Outreach', status: 'pending', date: 'May 25' }
          ]
        });
      } catch (err) {
        Sentry.captureException(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortalData();

    // Subscribe to multiple relevant tables
    const sub = supabase.channel(`portal_${clientId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'client_invoices', filter: `client_id=eq.${clientId}` }, () => fetchPortalData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'client_documents', filter: `client_id=eq.${clientId}` }, () => fetchPortalData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'client_tickets', filter: `client_id=eq.${clientId}` }, () => fetchPortalData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_milestones', filter: `client_id=eq.${clientId}` }, () => fetchPortalData())
      .subscribe();

    return () => supabase.removeChannel(sub);
  }, [clientId]);

  return { ...data, loading };
};
