import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsEvent {
  event_type: string;
  page_path?: string;
  user_agent?: string;
  referrer?: string;
  session_id?: string;
  metadata?: Record<string, any>;
}

export const useAnalytics = () => {
  // Generate or retrieve session ID
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('gospool_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('gospool_session_id', sessionId);
    }
    return sessionId;
  };

  // Check if user is returning visitor
  const isReturningVisitor = () => {
    const hasVisited = localStorage.getItem('gospool_visitor');
    if (!hasVisited) {
      localStorage.setItem('gospool_visitor', 'true');
      return false;
    }
    return true;
  };

  // Track page view with error handling
  const trackPageView = async (pagePath: string) => {
    try {
      const sessionId = getSessionId();
      const isReturning = isReturningVisitor();
      
      const { error } = await supabase.from('analytics_events').insert({
        event_type: 'page_view',
        page_path: pagePath,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
        session_id: sessionId,
        metadata: {
          is_returning_visitor: isReturning,
          timestamp: new Date().toISOString(),
          screen_resolution: `${screen.width}x${screen.height}`,
          viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        }
      });
      
      if (error) {
        console.error('Analytics page view error:', error);
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
      // Silently fail - don't block user experience
    }
  };

  // Track custom events with error handling
  const trackEvent = async (eventType: string, metadata?: Record<string, any>) => {
    try {
      const sessionId = getSessionId();
      
      const { error } = await supabase.from('analytics_events').insert({
        event_type: eventType,
        page_path: window.location.pathname,
        user_agent: navigator.userAgent,
        session_id: sessionId,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
        }
      });
      
      if (error) {
        console.error('Analytics event error:', error);
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
      // Silently fail - don't block user experience
    }
  };

  // Track donation funnel steps
  const trackDonationFunnel = async (step: 'initiated' | 'form_filled' | 'payment_started' | 'completed' | 'failed', amount?: number, metadata?: Record<string, any>) => {
    await trackEvent('donation_funnel', {
      step,
      amount,
      ...metadata
    });
  };

  // Track content engagement
  const trackContentEngagement = async (contentType: 'news' | 'project' | 'impact_story', contentId: string, action: 'viewed' | 'clicked' | 'shared', timeSpent?: number) => {
    await trackEvent('content_engagement', {
      content_type: contentType,
      content_id: contentId,
      action,
      time_spent: timeSpent,
    });
  };

  // Track sponsor interest
  const trackSponsorInterest = async (action: 'viewed_form' | 'started_form' | 'submitted_form', sponsorType?: string) => {
    await trackEvent('sponsor_interest', {
      action,
      sponsor_type: sponsorType,
    });
  };

  // Track volunteer interest
  const trackVolunteerInterest = async (action: 'viewed_form' | 'started_form' | 'submitted_form', department?: string) => {
    await trackEvent('volunteer_interest', {
      action,
      department,
    });
  };

  return {
    trackPageView,
    trackEvent,
    trackDonationFunnel,
    trackContentEngagement,
    trackSponsorInterest,
    trackVolunteerInterest,
    getSessionId,
    isReturningVisitor,
  };
};

// Hook for automatic page view tracking
export const usePageTracking = (pageName: string) => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView(pageName);
  }, [pageName, trackPageView]);
};

// Hook for content engagement tracking (time spent on page)
export const useContentEngagement = (contentType: 'news' | 'project' | 'impact_story', contentId: string) => {
  const { trackContentEngagement } = useAnalytics();

  useEffect(() => {
    const startTime = Date.now();
    
    // Track initial view
    trackContentEngagement(contentType, contentId, 'viewed');

    // Track time spent when component unmounts or user leaves
    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000); // in seconds
      trackContentEngagement(contentType, contentId, 'viewed', timeSpent);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        trackContentEngagement(contentType, contentId, 'viewed', timeSpent);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      trackContentEngagement(contentType, contentId, 'viewed', timeSpent);
      
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [contentType, contentId, trackContentEngagement]);
};
