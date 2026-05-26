import express from 'express';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());

// Initialize Supabase Client (Lazy Load / Soft Guard)
const getSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      return createClient(supabaseUrl, supabaseKey);
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
    }
  }
  return null;
};

const supabaseClient = getSupabaseClient();

interface AutomationRule {
  id: string;
  name: string;
  status: string;
  executions: number;
  lastRun: string;
  trigger: string;
  platform: string;
  keywords: string[];
  scope: string;
  responseTemplates: string[];
  autoLike: boolean;
  publicReply: boolean;
  publicReplyTemplate: string;
  targetedPostIds?: string[];
  [key: string]: any;
}

// High Quality Local/Fallback state matching rules
const fallbackAutomations: AutomationRule[] = [
  { 
    id: 'rule-lead-response', 
    name: 'Lead Response Protocol', 
    status: 'Active', 
    executions: 1242, 
    lastRun: '12 mins ago', 
    trigger: 'Tag Mention', 
    platform: 'Instagram',
    keywords: ['PRICING', 'COST', 'INFO', 'DETAILS'],
    scope: 'All',
    responseTemplates: [
      'Hey there! I have sent the pricing sheet to your DM. Check it out and let me know if you have questions! 🚀',
      'Sent! Please check your message inbox for all the cost structures and modules.'
    ],
    autoLike: true,
    publicReply: true,
    publicReplyTemplate: 'Check your DM, I just sent you the info! 📬',
    targetedPostIds: []
  },
  { 
    id: 'rule-ebook-download', 
    name: 'E-Book Automator', 
    status: 'Active', 
    executions: 450, 
    lastRun: '1 hour ago', 
    trigger: 'Comment', 
    platform: 'Facebook',
    keywords: ['EBOOK', 'DOWNLOAD', 'FREEBIE'],
    scope: 'Posts',
    targetedPostIds: ['p1', 'p2'],
    responseTemplates: [
      'Thanks for the comment! Here is your free E-Book download link. Enjoy reading: https://example.com/ebook 📚',
    ],
    autoLike: false,
    publicReply: false,
    publicReplyTemplate: ''
  }
];

// 1. Fetch all Automations (from Supabase if configured, otherwise fallback)
app.get('/api/automations', async (req, res) => {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('automations')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) {
        return res.json(data);
      }
    } catch (e) {
      console.error('[Supabase Fetch Error] falling back to mock files:', e);
    }
  }
  res.json(fallbackAutomations);
});

// 2. Insert/Save Automation Rule
app.post('/api/automations', async (req, res) => {
  const newRule = req.body;
  if (!newRule.id) {
    newRule.id = 'rule-' + Math.random().toString(36).substr(2, 9);
  }
  newRule.executions = newRule.executions || 0;
  newRule.lastRun = newRule.lastRun || 'Never';

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('automations')
        .insert([newRule])
        .select();

      if (error) throw error;
      return res.status(201).json({ success: true, rule: data[0] });
    } catch (e) {
      console.error('[Supabase Insert Error]:', e);
      return res.status(500).json({ error: 'Failed to write to Supabase.', details: e });
    }
  }

  // Fallback simulator output
  return res.status(201).json({
    success: true,
    message: 'Supabase credentials missing. Managed in temporary local server state.',
    rule: newRule
  });
});

// 3. Simulated Cron Route - updates execution increments 
app.get('/api/cron', async (req, res) => {
  if (supabaseClient) {
    try {
      const { data: activeAutos, error: fetchError } = await supabaseClient
        .from('automations')
        .select('id, executions')
        .eq('status', 'Active');

      if (fetchError) throw fetchError;

      if (activeAutos && activeAutos.length > 0) {
        for (const auto of activeAutos) {
          const nextVal = (auto.executions || 0) + 1;
          const { error: updateError } = await supabaseClient
            .from('automations')
            .update({ executions: nextVal, lastRun: 'Just now' })
            .eq('id', auto.id);
          
          if (updateError) {
            console.error(`Failed to update automation execution count for ID: ${auto.id}`, updateError);
          }
        }
      }
      return res.json({ success: true, provider: 'supabase', updatedCount: activeAutos?.length || 0 });
    } catch (e) {
      console.error('[Supabase Cron Failed] falling back:', e);
    }
  }

  // Mock increment fallback
  fallbackAutomations.forEach(r => {
    if (r.status === 'Active') {
      r.executions++;
      r.lastRun = 'Just now';
    }
  });
  res.json({ success: true, provider: 'mock_state', timestamp: new Date().toISOString() });
});

// 4. Testing Endpoints for Webhook Triggers
// Simulates the external incoming comment webhook from Instagram/Facebook
// Body parameters: { platform: 'Instagram'|'Facebook', postId: string, commentText: string, username: string }
app.post('/api/webhook/comment', async (req, res) => {
  const { platform, postId, commentText, username } = req.body;

  if (!platform || !commentText) {
    return res.status(400).json({
      error: 'Missing required parameters. Include standard webhook fields: platform, commentText, postId, username.'
    });
  }

  const sender = username || 'test_social_user';
  const targetPostId = postId || 'p1';

  // Retrieve eligible rules from Supabase (or fallback local dataset)
  let activeRules: any[] = req.body.clientRules || fallbackAutomations;
  let dataSource = req.body.clientRules ? 'client_submitted_rules' : 'local_fallback_mock_data';

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('automations')
        .select('*')
        .eq('status', 'Active')
        .eq('platform', platform);

      if (!error && data && data.length > 0) {
        activeRules = data;
        dataSource = 'supabase_active_rules';
      }
    } catch (e) {
      console.warn('Could not query active matching rules from Supabase, checking fallback memory.');
    }
  }

  // Audit matches in retrieved rules
  const matchedRule = activeRules.find((rule) => {
    if (rule.status !== 'Active') return false;
    if (rule.platform !== platform) return false;

    // Check post target bounds
    if (rule.scope === 'Posts') {
      const targetedList = rule.targetedPostIds || rule.targeted_post_ids || [];
      if (!targetedList.includes(targetPostId)) return false;
    }

    // Match keywords using case insensitive comparison
    const msgUpper = commentText.toUpperCase();
    const keywordsList = rule.keywords || [];
    return keywordsList.some((kw: string) => {
      const cleanKw = kw.trim().toUpperCase();
      if (!cleanKw) return false;
      return msgUpper.includes(cleanKw);
    });
  });

  if (!matchedRule) {
    return res.json({
      matched: false,
      message: 'Comment was received, but did not match any active automation keywords/scope boundaries.',
      diagnostics: {
        totalRulesScanned: activeRules.length,
        commentEvaluated: commentText,
        postIdTarget: targetPostId,
        platformTarget: platform,
        dataSource
      }
    });
  }

  // Select a response template (randomly or first option)
  const templates = matchedRule.responseTemplates || matchedRule.response_templates || [];
  const selectedDmMessage = templates.length > 0
    ? templates[Math.floor(Math.random() * templates.length)]
    : 'Default Automated Reply! Thank you for contacting us.';

  // Simulated DM dispatch logs and values
  const responsePayload = {
    matched: true,
    message: '🚀 DM Auto-Trigger Dispatched!',
    dataSource,
    diagnostics: {
      ruleId: matchedRule.id,
      ruleName: matchedRule.name,
      matchedKeyword: (matchedRule.keywords || []).find((k: string) => commentText.toUpperCase().includes(k.toUpperCase())) || 'Wildcard',
    },
    actionsExecuted: {
      autoLike: matchedRule.autoLike || false,
      publicReplySent: matchedRule.publicReply || false,
      publicReplyText: matchedRule.publicReply ? (matchedRule.publicReplyTemplate || 'Sent you a DM!') : null,
      directMessageDispatched: {
        toUsername: sender,
        messagePayload: selectedDmMessage,
        apiPath: `/v19.0/me/messages (Simulated Instagram/Messenger Messaging API)`,
        bearerToken: '***CONFIGURED_PAGE_ACCESS_TOKEN***'
      }
    }
  };

  // If Supabase is connected, seamlessly increment execution counters
  if (supabaseClient && dataSource === 'supabase_active_rules') {
    try {
      const nextExec = (matchedRule.executions || 0) + 1;
      await supabaseClient
        .from('automations')
        .update({ executions: nextExec, lastRun: 'Just now' })
        .eq('id', matchedRule.id);
    } catch (err) {
      console.error('Failed to increment live count for rule ID:', matchedRule.id);
    }
  }

  return res.json(responsePayload);
});

// 5. System Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    database: supabaseClient ? 'supabase-connected' : 'local-only',
    databaseUrl: process.env.SUPABASE_URL ? 'Configured' : 'Missing',
    timestamp: new Date().toISOString() 
  });
});

export const api = app;
